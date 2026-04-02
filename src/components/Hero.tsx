"use client";

import { motion } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { ArrowDown, Music, Disc, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const typewriterText = ["Tamil Lyricist", "AI Music Creator", "Words Into Music", "Soulful Stories"];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);




  useEffect(() => {
    const timeout = setTimeout(() => {
      const current = typewriterText[index % typewriterText.length];
      if (!isDeleting) {
        setDisplayText(current.substring(0, displayText.length + 1));
        if (displayText.length + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayText(current.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setIndex(index + 1);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, index]);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Static Background removed as requested */}

      <div className="container mx-auto px-6 z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative inline-block mb-8 group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 blur-[40px] opacity-30 rounded-full group-hover:scale-110 transition-transform" />
          <div className="relative p-2 rounded-full border-2 border-cyan-400 bg-black shadow-2xl shadow-cyan-500/40">
            <img
              src="https://avatars.githubusercontent.com/u/122508378?s=400&u=12acdc2a0e5462f920e1514455456e9677b5b377&v=4"
              alt="Profile"
              className="w-56 h-56 rounded-full object-cover grayscale-0 hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl font-black mb-4 tracking-tighter"
        >
          UDAY<span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">A</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-2xl md:text-4xl font-bold mb-8 text-gray-300 h-12 flex items-center justify-center gap-2"
        >
          <Sparkles className="text-cyan-400" />
          <span className="text-cyan-400">{displayText}</span>
          <span className="w-1 h-8 bg-cyan-400 animate-pulse" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="max-w-2xl mx-auto text-gray-400 text-lg mb-10 leading-relaxed font-light"
        >
          Turning words into soul-stirring melodies through human creativity
          and advanced AI music synthesis.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col md:flex-row gap-6 justify-center items-center"
        >
          <ScrollLink
            to="works" smooth duration={800} offset={-80}
            className="group relative px-10 py-4 bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-full font-bold text-lg tracking-wide hover:shadow-[0_0_30px_rgba(0,243,255,0.4)] transition-all cursor-pointer"
          >
            VIEW MY WORKS
          </ScrollLink>
          <ScrollLink
            to="contact" smooth duration={800}
            className="px-10 py-4 border-2 border-white/20 rounded-full font-bold text-lg hover:bg-white hover:text-black transition-all cursor-pointer"
          >
            CONTACT ME
          </ScrollLink>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2 relative overflow-hidden">
          <motion.div
            animate={{ y: [0, 16] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1 h-3 bg-cyan-400 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
