"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Works from "@/components/Works";
import BehindSong from "@/components/BehindSong";
import Contact from "@/components/Contact";
import { useEffect, useState, useRef } from "react";
import { Volume2, VolumeX, MusicIcon } from "lucide-react";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [isMuted, setIsMuted] = useState(true);
  const [isBgMusicPausedByOther, setIsBgMusicPausedByOther] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Hidden Background Music (Optional, needs user interaction to start)
    if (audioRef.current) {
      audioRef.current.volume = 1.0;
      if (!isMuted && !isBgMusicPausedByOther) {
        audioRef.current.play().catch(() => setIsMuted(true));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMuted, isBgMusicPausedByOther]);

  return (
    <main className="relative min-h-screen bg-[#05050a] text-white selection:bg-cyan-400 selection:text-black">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-600 z-[1000] origin-left"
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

      {/* Music Toggle */}
      <div className="fixed bottom-10 right-10 z-[100] group">
        <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
        <button 
           onClick={() => setIsMuted(!isMuted)}
           className="relative w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:border-cyan-400 transition-all hover:scale-110 active:scale-95 group"
        >
          {isMuted ? <VolumeX className="group-hover:text-red-400 transition-colors" /> : <Volume2 className="text-cyan-400 animate-pulse" />}
        </button>
      </div>

      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef} 
        loop 
        src="/songs/iruttu-vazhlkaiye.mp3" 
      />
    </main>
  );
}
