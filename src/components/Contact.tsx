"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Mail, Smartphone, MapPin, X, MessageSquare, ExternalLink } from "lucide-react";
import { Link as ScrollLink } from "react-scroll";

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <path d="m10 15 5-3-5-3z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", mobile: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [activeModal, setActiveModal] = useState<"map" | "privacy" | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    const text = `Hi Udaya! I'd like to hire you for a project.\n\n*Name:* ${formData.name}\n*Mobile:* ${formData.mobile}\n\n*Message:*\n${formData.message}`;
    const encodedText = encodeURIComponent(text);

    window.open(`https://wa.me/916382666150?text=${encodedText}`, "_blank");

    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", mobile: "", message: "" });
      setTimeout(() => setStatus("idle"), 3000);
    }, 1000);
  };

  return (
    <section id="contact" className="py-20 bg-black">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <MessageSquare size={13} />
            <span>Get in Touch</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
            LET'S <span className="text-cyan-400">CONNECT</span>
          </h2>

          <p className="text-gray-400 text-sm leading-relaxed">
            Have a song project in mind? Reach out directly via WhatsApp or email.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          
          {/* Left Column: Direct info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Contact Information
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Available for Tamil cinema songwriting, indie singles, and AI music creation.
              </p>
            </div>

            <div className="space-y-3">
              {/* WhatsApp / Phone */}
              <a
                href="https://wa.me/916382666150"
                target="_blank"
                rel="noreferrer"
                className="glass-card p-4 rounded-xl flex items-center gap-4 bg-zinc-950 border border-zinc-800 hover:border-emerald-400/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-zinc-900 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <Smartphone size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                    WhatsApp / Call
                  </span>
                  <p className="text-sm font-bold text-white">+91 63826 66150</p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:alyricbyuk@gmail.com"
                className="glass-card p-4 rounded-xl flex items-center gap-4 bg-zinc-950 border border-zinc-800 hover:border-cyan-400/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-zinc-900 text-cyan-400 flex items-center justify-center flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    Email
                  </span>
                  <p className="text-sm font-bold text-white">alyricbyuk@gmail.com</p>
                </div>
              </a>

              {/* Location */}
              <div
                onClick={() => setActiveModal("map")}
                className="glass-card p-4 rounded-xl flex items-center gap-4 bg-zinc-950 border border-zinc-800 hover:border-purple-400/40 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-zinc-900 text-purple-400 flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    Location
                  </span>
                  <p className="text-sm font-bold text-white">Tamil Nadu, India</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-gray-400 block mb-2.5">
                Social Profiles
              </span>
              <div className="flex gap-2.5">
                <a
                  href="https://www.instagram.com/udaya____10/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-pink-400 transition-colors"
                  title="Instagram"
                >
                  <InstagramIcon />
                </a>

                <a
                  href="https://www.youtube.com/@UdayakumarD-s2v"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-red-500 transition-colors"
                  title="YouTube"
                >
                  <YoutubeIcon />
                </a>

                <a
                  href="https://www.linkedin.com/in/udayakumar-d-8471b430b"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-sky-400 transition-colors"
                  title="LinkedIn"
                >
                  <LinkedinIcon />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Neat Form */}
          <div className="glass-card bg-zinc-950 border border-zinc-850 p-6 sm:p-8 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              Send Project Inquiry
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">Your Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black border border-zinc-800 px-3.5 py-2.5 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors placeholder:text-zinc-600"
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">Mobile / WhatsApp Number</label>
                <input
                  type="tel"
                  required
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full bg-black border border-zinc-800 px-3.5 py-2.5 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors placeholder:text-zinc-600"
                  placeholder="+91..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">Project Details</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-black border border-zinc-800 p-3.5 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors placeholder:text-zinc-600 resize-none"
                  placeholder="Describe your song requirements, genre, deadline..."
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full py-3 rounded-xl bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-cyan-300 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {status === "sending" ? "Opening WhatsApp..." : status === "success" ? "Redirected!" : (
                  <>
                    <Send size={14} />
                    <span>Send On WhatsApp</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-16 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <p>© 2026 UDAYA. All Rights Reserved.</p>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveModal("privacy")}
              className="hover:text-cyan-400 transition-colors uppercase"
            >
              Privacy Policy
            </button>
            <ScrollLink
              to="home"
              smooth={true}
              duration={600}
              className="hover:text-white cursor-pointer"
            >
              Back To Top ↑
            </ScrollLink>
          </div>
        </div>

      </div>

      {/* Map / Privacy Modal */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-black border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/60 rounded-full text-white hover:text-cyan-400"
              >
                <X size={18} />
              </button>

              {activeModal === "map" ? (
                <>
                  <div className="h-[45vh] w-full">
                    <iframe
                      src="https://maps.google.com/maps?q=11.102784,77.329628&t=&z=15&ie=UTF8&iwloc=&output=embed"
                      width="100%"
                      height="100%"
                      className="w-full h-full grayscale contrast-125 opacity-90"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 bg-zinc-950 flex justify-between items-center text-xs">
                    <span className="text-white font-semibold">Tamil Nadu, India</span>
                    <a
                      href="https://www.google.com/maps?q=11.102784,77.329628"
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <span>Open Maps</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </>
              ) : (
                <div className="p-6 space-y-3 text-xs text-zinc-400">
                  <h4 className="text-white font-bold text-sm">Privacy Policy</h4>
                  <p>All lyrics and music compositions presented on this portfolio are copyrighted by Udaya.</p>
                  <p>Contact details submitted are strictly used for project communication.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
