"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Works from "@/components/Works";
import BehindSong from "@/components/BehindSong";
import Contact from "@/components/Contact";
import { useEffect, useState, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [isMuted, setIsMuted] = useState(true);
  const [isBgMusicPausedByOther, setIsBgMusicPausedByOther] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.8;
      if (!isMuted && !isBgMusicPausedByOther) {
        audioRef.current.play().catch(() => setIsMuted(true));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMuted, isBgMusicPausedByOther]);

  return (
    <main className="relative min-h-screen bg-black text-white selection:bg-cyan-400 selection:text-black">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-cyan-400 z-[1000] origin-left"
        style={{ scaleX }}
      />

      <Navbar />

      <Hero />

      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <About />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <Works onPlayStateChange={(playing) => setIsBgMusicPausedByOther(playing)} />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <BehindSong />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <Contact />
      </motion.div>

      {/* Floating Ambient Music Toggle */}
      <div className="fixed bottom-6 right-6 z-[100]">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="w-12 h-12 rounded-full bg-zinc-900/90 backdrop-blur-md border border-zinc-800 flex items-center justify-center text-white hover:border-cyan-400 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
          title={isMuted ? "Unmute Ambient Music" : "Mute Ambient Music"}
        >
          {isMuted ? (
            <VolumeX size={18} className="text-gray-400 hover:text-white" />
          ) : (
            <Volume2 size={18} className="text-cyan-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* Background Audio Source */}
      <audio
        ref={audioRef}
        loop
        preload="none"
        src="/songs/iruttu-vazhlkaiye.mp3"
      />
    </main>
  );
}
