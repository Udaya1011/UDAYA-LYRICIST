"use client";

import { useEffect, useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Disc, Menu, X, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Home", to: "home" },
  { name: "About", to: "about" },
  { name: "Songs", to: "works" },
  { name: "Process", to: "behind-the-song" },
  { name: "Contact", to: "contact" },
];

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Update background blur styling
      setScrolled(currentScrollY > 20);

      // Smart hide-on-scroll-down, reveal-on-scroll-up
      if (currentScrollY > 70) {
        if (currentScrollY > lastScrollY) {
          // Scrolling down -> hide navbar
          setIsVisible(false);
          setIsOpen(false);
        } else {
          // Scrolling up -> show navbar
          setIsVisible(true);
        }
      } else {
        // At top of the page -> always show navbar
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 w-full z-[100] transition-transform duration-300 ease-in-out",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      {/* Full Size Edge-to-Edge Navbar */}
      <nav
        className={cn(
          "w-full transition-all duration-300 border-b",
          scrolled
            ? "bg-black/90 backdrop-blur-xl border-zinc-800 shadow-[0_4px_30px_rgba(0,0,0,0.85)]"
            : "bg-black/60 backdrop-blur-md border-white/5"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative">
          
          {/* Left: Brand Logo */}
          <ScrollLink
            to="home"
            smooth={true}
            duration={500}
            className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0 z-10 select-none"
          >
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-cyan-400/40 flex items-center justify-center group-hover:border-cyan-400 transition-colors shadow-[0_0_15px_rgba(0,243,255,0.2)]">
              <Disc className="text-cyan-400 w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
            </div>
            <span className="font-black text-lg tracking-wider text-white">
              UDAYA<span className="text-cyan-400">.</span>
            </span>
          </ScrollLink>

          {/* Center: Mathematically dead-center Nav Items */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <ScrollLink
                key={item.to}
                to={item.to}
                smooth={true}
                duration={500}
                spy={true}
                offset={-70}
                activeClass="!text-cyan-400 !font-semibold !bg-cyan-400/10"
                className="text-gray-400 hover:text-white px-4 py-1.5 rounded-full text-xs font-medium tracking-wide cursor-pointer transition-all hover:bg-white/5"
              >
                {item.name}
              </ScrollLink>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="hidden sm:flex items-center gap-3 z-10">
            <Link
              href="/hire-me"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold tracking-wider text-black bg-cyan-400 hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(0,243,255,0.25)]"
            >
              <Sparkles size={13} />
              <span>HIRE ME</span>
            </Link>

            <Link
              href="/admin"
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-700"
              title="Admin Portal"
            >
              <User size={16} />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-zinc-900 md:hidden z-10 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Full-Width Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden w-full bg-black/95 backdrop-blur-2xl border-t border-zinc-800 px-6 py-4 shadow-2xl overflow-hidden flex flex-col gap-2"
            >
              {navItems.map((item) => (
                <ScrollLink
                  key={item.to}
                  to={item.to}
                  smooth={true}
                  duration={500}
                  offset={-70}
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2.5 text-sm font-semibold text-gray-300 hover:text-cyan-400 transition-colors rounded-lg hover:bg-zinc-900"
                >
                  {item.name}
                </ScrollLink>
              ))}

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-3">
                <Link
                  href="/hire-me"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-full bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider block"
                >
                  Hire Me On WhatsApp
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="p-2.5 rounded-full border border-zinc-800 text-gray-400 hover:text-white"
                  title="Admin"
                >
                  <User size={16} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
