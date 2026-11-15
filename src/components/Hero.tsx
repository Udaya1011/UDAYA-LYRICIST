"use client";

import { motion } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { Sparkles, Disc, Feather, ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

const typewriterText = [
  "Tamil Lyricist",
  "AI Music Creator",
  "Cinema & Indie Songs",
  "Soulful Melodies & Stories",
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = typewriterText[index % typewriterText.length];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setDisplayText(current.substring(0, displayText.length + 1));
          if (displayText.length + 1 === current.length) {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          setDisplayText(current.substring(0, displayText.length - 1));
          if (displayText.length === 0) {
            setIsDeleting(false);
            setIndex((prev) => prev + 1);
          }
        }
      },
      isDeleting ? 25 : 55
    );

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, index]);

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-14 bg-black">
      <div className="max-w-6xl mx-auto px-6 w-full relative z-10">
        
        {/* Landscape 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Text, Branding, Bio & Actions */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-7 text-center md:text-left space-y-5"
          >
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Tamil Lyricist & AI Music Creator</span>
            </div>

            {/* Main Title & English Subtitle */}
            <div className="space-y-1.5">
              <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white uppercase leading-none">
                UDAYA<span className="text-cyan-400">.</span>
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-cyan-400">
                "Turning Words Into Soulful Melodies"
              </p>
            </div>

            {/* Dynamic Typewriter text */}
            <div className="flex items-center justify-center md:justify-start gap-2 text-base sm:text-lg font-semibold text-gray-300 min-h-[28px]">
              <Sparkles size={16} className="text-cyan-400 flex-shrink-0 animate-pulse" />
              <span className="text-gray-200">{displayText}</span>
              <span className="w-0.5 h-4 bg-cyan-400 animate-pulse" />
            </div>

            {/* Short Bio */}
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto md:mx-0">
              Crafting soulful Tamil lyrics and transforming them into rich, modern musical 
              soundscapes using the precision of artificial intelligence.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <ScrollLink
                to="works"
                smooth={true}
                duration={500}
                offset={-70}
                className="px-6 py-3 rounded-full text-xs font-bold tracking-wider text-black bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_20px_rgba(0,243,255,0.25)] transition-all cursor-pointer flex items-center gap-2"
              >
                <Disc size={15} />
                <span>EXPLORE SONGS</span>
              </ScrollLink>

              <Link
                href="/hire-me"
                className="px-6 py-3 rounded-full text-xs font-bold tracking-wider text-white border border-zinc-700 hover:border-cyan-400 hover:bg-white/5 transition-all flex items-center gap-2"
              >
                <Feather size={14} className="text-cyan-400" />
                <span>HIRE FOR LYRICS</span>
              </Link>
            </div>

            {/* Clean Stats */}
            <div className="grid grid-cols-3 gap-6 pt-5 border-t border-zinc-900 max-w-md mx-auto md:mx-0">
              <div>
                <span className="block text-2xl font-black text-cyan-400 leading-tight">16+</span>
                <span className="text-xs text-gray-500 font-medium">Tracks</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-white leading-tight">100+</span>
                <span className="text-xs text-gray-500 font-medium">Verses Written</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-cyan-400 leading-tight">AI + Human</span>
                <span className="text-xs text-gray-500 font-medium">Synthesis</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Landscape Artist Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="md:col-span-5 flex flex-col items-center justify-center relative"
          >
            {/* Ambient subtle glow ring */}
            <div className="relative group">
              <div className="w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full p-1.5 bg-gradient-to-tr from-cyan-400 via-transparent to-purple-500 border border-white/10 shadow-[0_0_40px_rgba(0,243,255,0.2)]">
                <div className="w-full h-full rounded-full overflow-hidden bg-white border-2 border-zinc-800">
                  <img
                    src="/profile.png"
                    alt="Udaya Lyricist"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Floating Equalizer Badge at bottom of circle */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black/95 backdrop-blur-md px-4 py-1.5 rounded-full border border-zinc-800 flex items-center gap-2 shadow-xl">
                <div className="flex items-end gap-1 h-3.5">
                  <span className="w-0.5 bg-cyan-400 rounded-full animate-eq-1" />
                  <span className="w-0.5 bg-purple-400 rounded-full animate-eq-2" />
                  <span className="w-0.5 bg-cyan-400 rounded-full animate-eq-3" />
                  <span className="w-0.5 bg-purple-400 rounded-full animate-eq-4" />
                </div>
                <span className="text-[11px] font-semibold text-gray-300">
                  Audio Studio
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Subtle Scroll Down Prompt */}
      <ScrollLink
        to="about"
        smooth={true}
        duration={500}
        offset={-70}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity cursor-pointer"
      >
        <span className="text-[9px] tracking-widest uppercase text-gray-500">Scroll</span>
        <ArrowDown size={12} className="text-cyan-400 animate-bounce" />
      </ScrollLink>
    </section>
  );
}
