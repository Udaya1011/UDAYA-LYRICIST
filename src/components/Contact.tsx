"use client";

import { motion } from "framer-motion";
import { Send, Mail, Smartphone, MapPin, ExternalLink } from "lucide-react";
import { useState } from "react";

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <path d="m10 15 5-3-5-3z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const socialItems = [
  { id: "IG", icon: <InstagramIcon />, label: "Instagram", color: "#f03b5f", link: "#" },
  { id: "YT", icon: <YoutubeIcon />, label: "YouTube", color: "#ff0000", link: "#" },
  { id: "LI", icon: <LinkedinIcon />, label: "LinkedIn", color: "#0077b5", link: "https://www.linkedin.com/in/udayakumar-d-8471b430b" },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // Simulate API delay
    setTimeout(() => setStatus("success"), 1500);
  };

  return (
    <section id="contact" className="py-24 bg-black overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20">
          
          <div className="flex-1 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h2 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter">
                LET'S <span className="text-cyan-400">CONNECT</span>
              </h2>
              <p className="text-xl text-gray-400 font-light max-w-md">
                Have a project in mind? Let's turn your ideas into music.
              </p>
            </motion.div>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group hover:translate-x-2 transition-transform">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-cyan-400/40 text-cyan-400">
                  <Mail size={28} />
                </div>
                <div>
                  <h4 className="text-gray-400 uppercase tracking-widest text-xs font-black">Email</h4>
                  <p className="text-xl md:text-2xl font-bold text-white">udaya@music.com</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group hover:translate-x-2 transition-transform">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-cyan-400/40 text-purple-400">
                  <Smartphone size={28} />
                </div>
                <div>
                  <h4 className="text-gray-400 uppercase tracking-widest text-xs font-black">Phone</h4>
                  <p className="text-xl md:text-2xl font-bold text-white">+91 63826 66150</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group hover:translate-x-2 transition-transform">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-cyan-400/40 text-pink-400">
                  <MapPin size={28} />
                </div>
                <div>
                  <h4 className="text-gray-400 uppercase tracking-widest text-xs font-black">Location</h4>
                  <p className="text-xl md:text-2xl font-bold text-white">Tamil Nadu, India</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              {socialItems.map((social) => (
                <motion.a 
                  key={social.id}
                  whileHover={{ y: -5, backgroundColor: social.color, borderColor: "transparent" }}
                  href={social.link}
                  target="_blank"
                  className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white transition-all overflow-hidden"
                  title={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <div className="glass-card p-10 md:p-14 bg-gradient-to-br from-white/10 to-transparent border-white/5 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    type="text" required 
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white focus:outline-none focus:border-cyan-400 transition-colors placeholder:text-gray-600 font-bold" 
                    placeholder="ENTER YOUR NAME"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    type="email" required 
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white focus:outline-none focus:border-cyan-400 transition-colors placeholder:text-gray-600 font-bold" 
                    placeholder="ENTER YOUR EMAIL"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Message</label>
                  <textarea 
                    rows={4} required 
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white focus:outline-none focus:border-cyan-400 transition-colors placeholder:text-gray-600 font-bold resize-none" 
                    placeholder="WRITE YOUR MESSAGE..."
                  />
                </div>

                <button 
                   disabled={status === "sending"}
                   className="w-full mt-4 bg-gradient-to-r from-cyan-600 to-purple-600 p-6 rounded-2xl font-black text-white hover:shadow-[0_0_30px_rgba(0,243,255,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {status === "sending" ? "TRANSMITTING..." : status === "success" ? "MESSAGE SENT!" : (
                    <>
                      <Send size={24} />
                      SEND SIGNAL
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

        </div>

        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           className="mt-20 pt-10 border-t border-white/5 text-center flex flex-col md:flex-row justify-between items-center text-gray-500 font-bold tracking-widest text-xs gap-4"
        >
          <p>&copy; 2024 UDAYA. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
             <a href="#" className="hover:text-cyan-400">PRIVACY POLICY</a>
             <a href="#" className="hover:text-cyan-400">TERMS OF SERVICE</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
