"use client";

import { motion } from "framer-motion";
import { Send, User, Mail, Smartphone, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function HireMe() {
  const [formData, setFormData] = useState({ name: "", mobile: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    
    // Construct WhatsApp message
    const text = `Hi Udaya, I'm interested in hiring you!\n\n*Name:* ${formData.name}\n*Mobile:* ${formData.mobile}\n*Email:* ${formData.email}\n\n*Message:*\n${formData.message}`;
    const encodedText = encodeURIComponent(text);
    
    // Open WhatsApp
    window.open(`https://wa.me/916382666150?text=${encodedText}`, '_blank');
    
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", mobile: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 3000);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-black relative flex items-center justify-center py-20 px-6">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-[500px] bg-gradient-to-t from-purple-500/10 to-transparent pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl relative z-10"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-8 group font-bold tracking-widest text-sm uppercase">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Portfolio
        </Link>
        
        <div className="glass-card p-8 md:p-14 bg-gradient-to-br from-white/10 to-transparent border-white/5 shadow-2xl rounded-[3rem]">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              LET'S <span className="text-cyan-400">WORK</span> TOGETHER
            </h1>
            <p className="text-lg text-gray-400 font-light max-w-xl mx-auto">
              Fill out the form below to discuss your project. I will receive your details instantly via WhatsApp and get back to you shortly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><User size={14}/> Full Name</label>
              <input 
                type="text" required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-white focus:outline-none focus:border-cyan-400 transition-colors placeholder:text-gray-600 font-bold" 
                placeholder="ENTER YOUR NAME"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Smartphone size={14}/> Mobile Number</label>
                <input 
                  type="tel" required 
                  value={formData.mobile}
                  onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-white focus:outline-none focus:border-purple-400 transition-colors placeholder:text-gray-600 font-bold" 
                  placeholder="+91..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Mail size={14}/> Email Address</label>
                <input 
                  type="email" required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-white focus:outline-none focus:border-cyan-400 transition-colors placeholder:text-gray-600 font-bold" 
                  placeholder="ENTER YOUR EMAIL"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Cover Message</label>
              <textarea 
                rows={6} required 
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-white focus:outline-none focus:border-purple-400 transition-colors placeholder:text-gray-600 font-bold resize-none" 
                placeholder="WRITE YOUR PROJECT DETAILS..."
              />
            </div>

            <motion.button 
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               disabled={status === "sending"}
               className="w-full mt-6 bg-gradient-to-r from-cyan-600 to-purple-600 p-6 rounded-2xl font-black text-white hover:shadow-[0_0_40px_rgba(0,243,255,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-xl tracking-widest border border-white/20"
            >
              {status === "sending" ? "OPENING WHATSAPP..." : status === "success" ? "REDIRECTED!" : (
                <>
                  <Send size={24} />
                  SEND VIA WHATSAPP
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </main>
  );
}
