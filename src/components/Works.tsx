"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, X, Music2, Share2, Disc, Volume2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Works({ onPlayStateChange }: { onPlayStateChange?: (playing: boolean) => void }) {
  const [songs, setSongs] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const mediaRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await fetch("/api/songs", { cache: "no-store" });
        const data = await res.json();
            const mapped = data.map((s: any) => {
              const resovlePath = (val: string) => {
                if (!val) return null;
                if (val.match(/^(http|\/|data:)/)) return val;
                return `/${val}`;
              };
              
              return {
                ...s,
                audioPath: resovlePath(s.file),
                thumbPath: resovlePath(s.thumb) || "https://images.unsplash.com/photo-1514525253361-bee8718a300a?auto=format&fit=crop&q=80&w=400"
              };
            });
            setSongs(mapped);
      } catch (e) { console.error(e); }
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const songId = params.get("song");
    const autoPlay = params.get("play") === "true";

    if (songId && songs.length > 0) {
      const work = songs.find(w => w._id === songId);
      if (work) {
        setSelected(work);
        if (autoPlay && work.audioPath) {
          setTimeout(() => {
            if (mediaRef.current) {
              mediaRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(() => {});
            }
          }, 1000);
        }
      }
    }
  }, [songs]);

  useEffect(() => {
    if (!selected) {
      setIsPlaying(false);
      if (mediaRef.current) mediaRef.current.pause();
    } else {
      setHasAudio(!!selected.audioPath);
    }
  }, [selected]);

  useEffect(() => {
    if (onPlayStateChange) onPlayStateChange(isPlaying);
  }, [isPlaying, onPlayStateChange]);

  const togglePlay = () => {
    if (!mediaRef.current || !hasAudio) return;
    
    if (isPlaying) {
      mediaRef.current.pause();
      setIsPlaying(false);
    } else {
      mediaRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error("Playback Error:", err);
          setIsPlaying(false);
        });
    }
  };

  const handleTimeUpdate = () => {
    if (mediaRef.current) {
      setCurrentTime(mediaRef.current.currentTime);
      setDuration(mediaRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mediaRef.current && duration) {
       const rect = e.currentTarget.getBoundingClientRect();
       const percent = (e.clientX - rect.left) / rect.width;
       mediaRef.current.currentTime = percent * duration;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section id="works" className="py-24 relative overflow-hidden bg-black/50">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 uppercase tracking-tighter text-white">
          <motion.h2 className="text-5xl md:text-7xl font-black mb-4">LATEST <span className="text-cyan-400">SONGS</span></motion.h2>
          <div className="w-24 h-1.5 bg-cyan-400 mx-auto rounded-full mb-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {songs.map((work) => (
            <motion.div key={work._id} className="group cursor-pointer" onClick={() => setSelected(work)}>
              <div className="glass-card overflow-hidden h-full border border-white/5 hover:border-cyan-400/50 transition-all">
                <div className="h-56 relative overflow-hidden">
                  <img src={work.thumbPath} alt={work.title} className="w-full h-full object-cover transition-all group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                     <div className="bg-cyan-500 p-4 rounded-full text-black shadow-lg shadow-cyan-500/20"><Play fill="black" /></div>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{work.title}</h3>
                  <p className="text-gray-500 text-sm mt-2">{work.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setSelected(null)} />
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-12 relative shadow-2xl">
              <button onClick={() => setSelected(null)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors duration-300"><X size={32} /></button>
              <div className="flex flex-col md:flex-row gap-12 text-white">
                <div className="md:w-1/2 space-y-8">
                  <div>
                    <h3 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tighter text-cyan-400">{selected.title}</h3>
                    <p className="text-gray-400 border-l-2 border-cyan-400 pl-4 text-lg italic">{selected.desc}</p>
                  </div>
                  <div className="space-y-4">
                    <h5 className="font-bold text-cyan-400 uppercase text-xs tracking-widest flex items-center gap-2">
                       <Music2 size={14} /> TAMIL LYRICS
                    </h5>
                    <pre className="text-gray-300 whitespace-pre-line leading-relaxed italic bg-white/5 p-6 rounded-2xl max-h-[300px] overflow-y-auto custom-scrollbar text-sm md:text-base">{selected.lyrics}</pre>
                  </div>
                </div>
                <div className="md:w-1/2 space-y-8 flex flex-col justify-center">
                   <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black group shadow-3xl">
                      <video 
                        key={selected._id}
                        ref={mediaRef as any}
                        src={selected.audioPath}
                        poster={selected.thumbPath}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleTimeUpdate}
                        onEnded={() => setIsPlaying(false)}
                        className="w-full h-full object-cover cursor-pointer" 
                        playsInline
                        onClick={togglePlay}
                      />
                      
                      {/* Video specific cover logic for Audio files */}
                      {!selected.audioPath?.match(/\.(mp4|webm|mov|m4v)$/i) && !isPlaying && (
                         <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none transition-opacity duration-500">
                            <motion.div 
                              animate={{ scale: [1, 1.1, 1] }} 
                              transition={{ duration: 2, repeat: Infinity }}
                              className="bg-cyan-500/20 p-6 rounded-full border border-cyan-400/50"
                            >
                               <Play size={48} className="text-cyan-400" />
                            </motion.div>
                         </div>
                      )}

                      {/* Floating Indicator */}
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                         {selected.audioPath?.match(/\.(mp4|webm|mov|m4v)$/i) ? 'Video Mode' : 'Audio Mode'}
                         <Disc className={`w-3 h-3 ${isPlaying ? 'animate-spin' : ''}`} />
                      </div>
                   </div>

                   {selected.audioPath && (
                     <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-2xl flex items-center gap-6 border border-white/10 shadow-xl">
                        <button 
                           onClick={togglePlay} 
                           className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform shadow-lg shadow-cyan-500/30"
                        >
                          {isPlaying ? <Pause fill="black" size={28} /> : <Play fill="black" size={28} className="ml-1" />}
                        </button>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                             <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                                <Volume2 size={12} /> {isPlaying ? 'Playing' : 'Paused'}
                             </span>
                             <span className="text-[10px] font-mono text-gray-400">{formatTime(currentTime)} / {formatTime(duration)}</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full relative cursor-pointer group" onClick={handleSeek}>
                             <motion.div 
                                className="h-full bg-cyan-400 rounded-full relative" 
                                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                             >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform border-2 border-cyan-400" />
                             </motion.div>
                          </div>
                        </div>
                     </div>
                   )}

                   <div className="flex gap-4">
                     {selected.insta && (
                       <a href={selected.insta} target="_blank" className="flex-1 bg-white/5 border border-white/10 p-4 rounded-xl text-center text-xs font-black uppercase text-gray-400 hover:text-white hover:bg-white/10 transition-all tracking-widest flex items-center justify-center gap-2 group">
                          <Share2 size={14} className="group-hover:text-cyan-400 transition-colors" /> Instagram
                       </a>
                     )}
                   </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
