"use client";

import { motion } from "framer-motion";
import { Sparkles, Languages, Cpu, Disc3 } from "lucide-react";

const pillars = [
  {
    title: "Poetic Meter & Rhyme",
    category: "Lyric Craft",
    desc: "Mastery over poetic rhythm, structure, and emotional storytelling. Writing verses that roll effortlessly on melodies.",
    icon: <Languages className="w-5 h-5 text-cyan-400" />,
  },
  {
    title: "AI Neural Sound Synthesis",
    category: "AI Synthesis",
    desc: "Architecting generative audio models with customized prompts, vocal arrangements, and instrumental dynamics.",
    icon: <Cpu className="w-5 h-5 text-purple-400" />,
  },
  {
    title: "Cinema & Independent Music",
    category: "Production",
    desc: "Creating radio-ready tracks for short films, YouTube music videos, independent singles, and viral social reels.",
    icon: <Disc3 className="w-5 h-5 text-emerald-400" />,
  },
];

export default function About() {
  return (
    <section id="about" className="py-20 bg-black">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={13} />
            <span>Artist Profile</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
            WHO IS <span className="text-cyan-400">UDAYA?</span>
          </h2>

          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Passionate lyricist creating soulful songs and transforming them into modern musical releases with AI technology.
          </p>
        </div>

        {/* Narrative & Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass-card p-6 bg-zinc-950/80 border border-zinc-800 rounded-2xl flex flex-col justify-between space-y-4 hover:border-cyan-400/40"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  {pillar.icon}
                </div>
                <div>
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                    {pillar.category}
                  </span>
                  <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Philosophy Quote */}
        <div className="mt-10 p-6 rounded-2xl bg-zinc-950 border border-zinc-800 text-center max-w-2xl mx-auto">
          <p className="text-gray-300 text-sm italic font-medium">
            “Lyrics are the soul, AI is the wings. I provide both to make music alive.”
          </p>
        </div>

      </div>
    </section>
  );
}
