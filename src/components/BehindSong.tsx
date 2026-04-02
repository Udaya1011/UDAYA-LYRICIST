"use client";

import { motion } from "framer-motion";
import { PenTool, Mic2, Cpu, Headphones, ArrowRight, Music4 } from "lucide-react";

const steps = [
  { id: 1, title: "Lyric Composition", icon: <PenTool />, desc: "Drafting the initial Tamil lyrics with soulful emotion and storytelling.", color: "cyan-400" },
  { id: 2, title: "Mood & Style Selection", icon: <Music4 />, desc: "Defining the musical vibe—melody, tempo, and instruments.", color: "purple-400" },
  { id: 3, title: "AI Voice Synthesis", icon: <Cpu />, desc: "Using advanced AI models to generate high-quality vocals and backing tracks.", color: "pink-400" },
  { id: 4, title: "Final Mastering", icon: <Headphones />, desc: "Mixing and polishing the final song for high-fidelity audio output.", color: "white" },
];

export default function BehindSong() {
  return (
    <section id="behind-the-song" className="py-24 bg-black/60 relative overflow-hidden">
      {/* Decorative vertical lines */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white/5 -translate-x-1/2 md:block hidden" />
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1 }}
           className="mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase tracking-widest">
            BEHIND <span className="text-secondary-neon">THE SONG</span>
          </h2>
          <div className="w-48 h-2 mx-auto bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
          {steps.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative group p-4"
            >
              <div className="flex flex-col items-center gap-6">
                <div className={`relative w-28 h-28 flex items-center justify-center rounded-3xl bg-black/50 border-2 border-${step.color}/20 group-hover:border-${step.color}/80 transition-all duration-500 overflow-hidden`}>
                  <div className={`absolute inset-0 bg-${step.color}/5 group-hover:bg-${step.color}/20 transition-colors animate-pulse`} />
                  <div className={`text-${step.color} relative z-10 w-12 h-12 flex items-center justify-center transform group-hover:scale-125 transition-transform`}>
                    {step.icon}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className={`text-2xl font-black tracking-tight text-${step.color} uppercase`}>{step.title}</h3>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-[200px] mx-auto italic">{step.desc}</p>
                </div>
              </div>

              {/* Progress Connector (Arrows) */}
              {i < steps.length - 1 && (
                <div className="absolute top-[56px] -right-[24px] md:block hidden text-white/10 group-hover:text-cyan-400/40 transition-colors animate-bounce-x">
                  <ArrowRight size={48} />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Call to action for the process */}
        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           transition={{ delay: 1 }}
           className="mt-20 p-10 bg-white/5 border border-white/10 rounded-2xl max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-2 justify-center mb-4 text-cyan-400 opacity-60">
             <Mic2 size={24} />
             <div className="h-0.5 w-12 bg-cyan-400/20" />
             <Music4 size={24} />
          </div>
          <p className="text-gray-300 font-light text-xl leading-relaxed">
            "Every song is a unique technical journey. I leverage the latest 
            AI algorithms to turn your artistic vision into high-fidelity 
            musical reality."
          </p>
        </motion.div>
      </div>
    </section>
  );
}
