import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Mail, Smartphone, MapPin, X } from "lucide-react";

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
  { id: "IG", icon: <InstagramIcon />, label: "Instagram", color: "#E1306C", link: "https://www.instagram.com/udaya____10/" },
  { id: "YT", icon: <YoutubeIcon />, label: "YouTube", color: "#FF0000", link: "https://www.youtube.com/@UdayakumarD-s2v" },
  { id: "LI", icon: <LinkedinIcon />, label: "LinkedIn", color: "#0077B5", link: "https://www.linkedin.com/in/udayakumar-d-8471b430b" },
  { id: "MAP", icon: <MapPin size={24} />, label: "Location", color: "#4285F4", isMap: true },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", mobile: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [activeModal, setActiveModal] = useState<"map" | "privacy" | "terms" | null>(null);

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
                  <p className="text-xl md:text-2xl font-bold text-white tracking-tight">alyricbyuk@gmail.com</p>
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

              <a 
                href="https://www.google.com/maps?q=11.102784,77.329628" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-6 group hover:translate-x-2 transition-transform"
              >
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-cyan-400/40 text-pink-400">
                  <MapPin size={28} />
                </div>
                <div>
                  <h4 className="text-gray-400 uppercase tracking-widest text-xs font-black">Location</h4>
                  <p className="text-xl md:text-2xl font-bold text-white">Tamil Nadu, India</p>
                </div>
              </a>
            </div>

            <div className="flex gap-4 pt-4">
              {socialItems.map((social) => (
                <motion.div 
                  key={social.id}
                  onClick={() => social.isMap ? setActiveModal("map") : window.open(social.link, '_blank')}
                  whileHover={{ y: -5, backgroundColor: social.color, borderColor: "transparent" }}
                  className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white transition-all overflow-hidden shadow-md cursor-pointer"
                  title={social.label}
                >
                  {social.icon}
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-1 relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

            <div className="relative glass-card p-8 md:p-14 bg-black/60 backdrop-blur-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] h-full flex flex-col justify-center">
              <h3 className="text-4xl md:text-5xl font-black text-white mb-10 tracking-tighter">
                HIRE <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">ME</span>
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 relative">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                  <input 
                    type="text" required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all placeholder:text-gray-600 font-bold" 
                    placeholder="ENTER YOUR NAME"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 relative">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Mobile Number</label>
                    <input 
                      type="tel" required 
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all placeholder:text-gray-600 font-bold" 
                      placeholder="+91..."
                    />
                  </div>

                  <div className="space-y-2 relative">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
                    <input 
                      type="email" required 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all placeholder:text-gray-600 font-bold" 
                      placeholder="ENTER YOUR EMAIL"
                    />
                  </div>
                </div>

                <div className="space-y-2 relative">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Message</label>
                  <textarea 
                    rows={4} required 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all placeholder:text-gray-600 font-bold resize-none" 
                    placeholder="WRITE YOUR PROJECT DETAILS..."
                  />
                </div>

                <button 
                   disabled={status === "sending"}
                   className="w-full mt-6 relative group/btn overflow-hidden bg-white/5 p-6 rounded-2xl font-black text-white hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-lg border border-white/10 shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 opacity-90 group-hover/btn:opacity-100 transition-opacity"></div>
                  <span className="relative z-10 flex items-center gap-3 tracking-widest">
                    {status === "sending" ? "OPENING WHATSAPP..." : status === "success" ? "REDIRECTED!" : (
                      <>
                        <Send size={24} />
                        HIRE ME NOW
                      </>
                    )}
                  </span>
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
          <p>&copy; 2026 UDAYA. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
             <button onClick={() => setActiveModal("privacy")} className="hover:text-cyan-400 transition-colors uppercase">PRIVACY POLICY</button>
             <button onClick={() => setActiveModal("terms")} className="hover:text-cyan-400 transition-colors uppercase">TERMS OF SERVICE</button>
          </div>
        </motion.div>
      </div>

      {/* Shared Content Modal */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
            onClick={() => setActiveModal(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-black border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-6 right-6 z-10 p-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-white hover:text-cyan-400 transition-colors"
              >
                <X size={24} />
              </button>

              {activeModal === "map" ? (
                <>
                  <div className="h-[60vh] w-full">
                    <iframe
                      src="https://maps.google.com/maps?q=11.102784,77.329628&t=&z=15&ie=UTF8&iwloc=&output=embed"
                      width="100%"
                      height="100%"
                      className="w-full h-full grayscale contrast-125 opacity-90 transition-all duration-500"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                  <div className="p-8 bg-gradient-to-br from-white/5 to-transparent border-t border-white/10 flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-black text-2xl tracking-tighter">MY LOCATION</h4>
                      <p className="text-gray-400">Tamil Nadu, India</p>
                    </div>
                    <a 
                      href="https://www.google.com/maps?q=11.102784,77.329628" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-cyan-600 rounded-xl font-bold text-sm tracking-widest hover:bg-cyan-500 transition-colors flex items-center gap-2"
                    >
                      OPEN IN GOOGLE MAPS
                    </a>
                  </div>
                </>
              ) : (
                <div className="p-10 md:p-14 max-h-[80vh] overflow-y-auto custom-scrollbar">
                  <h2 className="text-4xl font-black text-white mb-8 tracking-tighter uppercase">
                    {activeModal === "privacy" ? "Privacy Policy" : "Terms of Service"}
                  </h2>
                  <div className="space-y-6 text-gray-400 text-lg leading-relaxed font-light">
                    <p>
                      Welcome to UDAYA's official portfolio. Your {activeModal === "privacy" ? "privacy is extremely important" : "compliance with our rules matters"} to us.
                    </p>
                    <section className="space-y-4">
                      <h4 className="text-white font-bold uppercase tracking-widest text-sm">1. Introduction</h4>
                      <p>
                        This documentation outlines how we handle {activeModal === "privacy" ? "your personal information and data connectivity" : "usage of our intellectual property and media content"}.
                      </p>
                    </section>
                    <section className="space-y-4">
                      <h4 className="text-white font-bold uppercase tracking-widest text-sm">2. Usage</h4>
                      <p>
                        All media files, including audio tracks and lyrics showcased here, are protected under copyright law. {activeModal === "privacy" ? "We do not store your personal data longer than necessary to facilitate project communication." : "Unauthorized distribution of these materials is strictly prohibited."}
                      </p>
                    </section>
                    <section className="space-y-4">
                      <h4 className="text-white font-bold uppercase tracking-widest text-sm">3. Updates</h4>
                      <p>
                        We reserve the right to update these {activeModal === "privacy" ? "policy" : "terms"} at any time. Continued use of the site implies acceptance of the latest version.
                      </p>
                    </section>
                    <p className="pt-6 font-bold text-cyan-400">
                      Contact: alyricbyuk@gmail.com for any further inquiries.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
