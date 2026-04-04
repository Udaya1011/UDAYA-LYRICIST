"use client";

import { useEffect, useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Music, Menu, X, Disc, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Home", to: "home" },
  { name: "About", to: "about" },
  { name: "Works", to: "works" },
  { name: "Behind The Song", to: "behind-the-song" },
  { name: "Contact", to: "contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-[100] transition-all duration-300 py-4",
        scrolled ? "bg-black/60 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        <ScrollLink
          to="home"
          smooth={true}
          duration={500}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="relative">
            <Disc className="text-cyan-400 w-8 h-8 group-hover:rotate-180 transition-transform duration-700" />
            <div className="absolute inset-0 bg-cyan-400/20 blur-lg rounded-full" />
          </div>
          <span className="font-bold text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-400">
            UDAYA
          </span>
        </ScrollLink>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 items-center">
          {navItems.map((item) => (
            <ScrollLink
              key={item.to}
              to={item.to}
              smooth={true}
              duration={500}
              spy={true}
              activeClass="text-cyan-400"
              className="text-gray-300 hover:text-white font-medium cursor-pointer transition-colors relative group py-2"
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full" />
            </ScrollLink>
          ))}
          <Link href="/hire-me" className="bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-2 rounded-full font-bold text-sm tracking-widest hover:scale-105 transition-transform shadow-lg shadow-cyan-500/20 mr-4">
            HIRE ME
          </Link>
          
          <a href="/admin" className="text-gray-300 hover:text-cyan-400 transition-colors p-2 rounded-full hover:bg-white/5 border border-white/10">
            <User size={24} />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-2xl border-b border-white/10 py-10 md:hidden flex flex-col items-center gap-6"
          >
            {navItems.map((item) => (
              <ScrollLink
                key={item.to}
                to={item.to}
                smooth={true}
                duration={500}
                onClick={() => setIsOpen(false)}
                className="text-2xl font-bold tracking-tight text-gray-300 hover:text-cyan-400"
              >
                {item.name}
              </ScrollLink>
            ))}
            
            <div className="flex items-center gap-6 mt-4">
              <Link 
                href="/hire-me"
                onClick={() => setIsOpen(false)}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-3 rounded-full font-bold tracking-widest shadow-lg shadow-cyan-500/20 flex items-center justify-center"
              >
                HIRE ME
              </Link>
              <a 
                href="/admin" 
                onClick={() => setIsOpen(false)} 
                className="text-gray-300 hover:text-cyan-400 transition-colors p-3 rounded-full border border-white/10 bg-white/5"
              >
                <User size={24} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
