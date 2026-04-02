"use client";

import { motion } from "framer-motion";
import { User, Sparkles, Languages, Music } from "lucide-react";

const skills = [
  { name: "Tamil Lyrics Writing", icon: <Languages />, level: 95 },
  { name: "AI Song Creation", icon: <Sparkles />, level: 85 },
  { name: "Melody Structuring", icon: <Music />, level: 80 },
  { name: "Storytelling", icon: <User />, level: 90 },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-black/40 backdrop-blur-3xl overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex-1 space-y-8"
          >
            <div className="relative inline-block">
              <h2 className="text-4xl md:text-6xl font-black mb-10 tracking-tight">
                WHO IS <span className="text-cyan-400">UDAYA?</span>
              </h2>
              <div className="absolute -bottom-4 left-0 w-32 h-2 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full" />
            </div>

            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light text-justify">
              Passionate Tamil lyricist creating soulful lyrics and transforming 
              them into songs using AI technology. I blend creativity with modern 
              tools to bring music alive. My mission is to give every emotion a voice, 
              using the power of language and the precision of AI to craft melodies 
              that resonate with the soul.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {skills.map((skill, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={skill.name} 
                  className="glass-card p-6 flex flex-col gap-3 group hover:scale-105 transition-transform cursor-default border-cyan-400/10 hover:border-cyan-400/40"
                >
                  <div className="text-cyan-400 w-10 h-10 flex items-center justify-center rounded-lg bg-cyan-400/10 group-hover:bg-cyan-400 group-hover:text-black transition-colors">
                    {skill.icon}
                  </div>
                  <h3 className="font-bold text-gray-200 tracking-tight">{skill.name}</h3>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visualization (Skill Bars) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex-1 w-full max-w-xl"
          >
            <div className="glass-card p-10 space-y-10 border-white/5 bg-gradient-to-br from-white/10 to-transparent">
              <h3 className="text-2xl font-black text-center text-white mb-2 tracking-widest uppercase">Expertise Level</h3>
              
              {skills.map((skill, i) => (
                <div key={skill.name} className="space-y-3">
                  <div className="flex justify-between font-bold text-sm tracking-widest text-gray-400 uppercase">
                    <span>{skill.name}</span>
                    <span className="text-cyan-400">{skill.level}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: i * 0.2 }}
                      className="absolute h-full bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full shadow-[0_0_10px_rgba(0,243,255,0.4)]"
                    />
                  </div>
                </div>
              ))}

              <div className="mt-10 p-6 bg-cyan-400/5 border border-cyan-400/20 rounded-2xl">
                <p className="text-gray-400 text-sm font-medium italic">
                  "Lyrics are the soul, AI is the wings. I provide both."
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
