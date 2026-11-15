"use client";

import { motion } from "framer-motion";
import { PenTool, Music4, Cpu, Headphones, Sliders } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Lyric Composition",
    tag: "Concept & Rhyme",
    desc: "Crafting original lyrics with emotional storytelling and poetic rhythm.",
    icon: <PenTool className="w-5 h-5 text-cyan-400" />,
  },
  {
    step: "02",
    title: "Mood & Vibe",
    tag: "Sound Architecture",
    desc: "Defining the musical atmosphere, BPM, scale mode, and instrumentation.",
    icon: <Music4 className="w-5 h-5 text-purple-400" />,
  },
  {
    step: "03",
    title: "AI Audio Synthesis",
    tag: "Neural Generation",
    desc: "Generating high-fidelity vocal stems and layered arrangements using AI sound models.",
    icon: <Cpu className="w-5 h-5 text-pink-400" />,
  },
  {
    step: "04",
    title: "Mastering & Polish",
    tag: "Master Release",
    desc: "Equalization and dynamic mastering for crisp playback across all streaming platforms.",
    icon: <Headphones className="w-5 h-5 text-emerald-400" />,
  },
];

export default function BehindSong() {
  return (
    <section id="behind-the-song" className="py-20 bg-black">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Sliders size={13} />
            <span>Creation Process</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
            BEHIND <span className="text-cyan-400">THE SONG</span>
          </h2>

          <p className="text-gray-400 text-sm leading-relaxed">
            The 4-stage technical workflow from handwritten lyrics to a finished master track.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, idx) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              className="glass-card bg-zinc-950 border border-zinc-850 p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-cyan-400/30"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-black text-zinc-700">
                  {s.step}
                </span>
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  {s.icon}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                  {s.tag}
                </span>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {s.title}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed mt-2">
                  {s.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
