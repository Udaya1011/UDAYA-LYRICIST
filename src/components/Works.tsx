"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, X, Music2, Share2, Disc, Volume2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Works() {
  const [songs, setSongs] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await fetch("/api/songs", { cache: "no-store" });
        const data = await res.json();
            const mapped = data.map((s: any) => {
              const resovlePath = (val: string, prefix: string) => {
                if (!val) return null;
                if (val.match(/^(http|\/|data:)/)) return val;
                return `/${val}`; // Try root first
              };
              
              return {
                ...s,
                audioPath: resovlePath(s.file, 'songs'),
                thumbPath: resovlePath(s.thumb, 'images') || "https://images.unsplash.com/photo-1514525253361-bee8718a300a?auto=format&fit=crop&q=80&w=400"
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
            if (audioRef.current) {
              audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(() => { /* Silently fail on autoPlay errors */ });
            }
          }, 1000);
        }
      }
    }
  }, [songs]);

  useEffect(() => {
    if (!selected) {
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
      const url = new URL(window.location.href);
      url.searchParams.delete("song");
      url.searchParams.delete("play");
      window.history.replaceState({}, "", url.pathname);
    } else {
      setHasAudio(!!selected.audioPath);
      const url = new URL(window.location.href);
      url.searchParams.set("song", selected._id);
      window.history.replaceState({}, "", url.toString());
    }
  }, [selected]);

  const togglePlay = () => {
    if (!audioRef.current || !hasAudio) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Catch playback errors (like unsupported source)
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error("Playback Error:", err);
          alert("Audio file not found or unsupported format. Please check your file name in the Admin panel.");
          setIsPlaying(false);
        });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && duration) {
       const rect = e.currentTarget.getBoundingClientRect();
       const percent = (e.clientX - rect.left) / rect.width;
       audioRef.current.currentTime = percent * duration;
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
      {selected?.audioPath && (
        <audio 
          key={selected._id}
          ref={audioRef}
          src={selected.audioPath}
          preload="none"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 uppercase tracking-tighter">
          <motion.h2 className="text-5xl md:text-7xl font-black mb-4">LATEST <span className="text-cyan-400">SONGS</span></motion.h2>
          <div className="w-24 h-1.5 bg-cyan-400 mx-auto rounded-full mb-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {songs.map((work, i) => (
            <motion.div key={work._id} className="group cursor-pointer" onClick={() => setSelected(work)}>
              <div className="glass-card overflow-hidden h-full border border-white/5 hover:border-cyan-400/50 transition-all">
                <div className="h-56 relative overflow-hidden">
                  <img src={work.thumbPath} alt={work.title} className="w-full h-full object-cover transition-all group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                     <div className="bg-cyan-500 p-4 rounded-full text-black shadow-lg shadow-cyan-500/20"><Play fill="black" /></div>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors">{work.title}</h3>
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
              <button onClick={() => setSelected(null)} className="absolute top-6 right-6 text-gray-500 hover:text-white"><X size={32} /></button>
              <div className="flex flex-col md:flex-row gap-12">
                <div className="md:w-1/2 space-y-8">
                  <div>
                    <h3 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tighter text-white">{selected.title}</h3>
                    <p className="text-gray-400 border-l-2 border-cyan-400 pl-4">{selected.desc}</p>
                  </div>
                  <div className="space-y-4">
                    <h5 className="font-bold text-cyan-400 uppercase text-xs tracking-widest">TAMIL LYRICS</h5>
                    <pre className="text-gray-300 whitespace-pre-line leading-relaxed italic bg-white/5 p-6 rounded-2xl max-h-[300px] overflow-y-auto custom-scrollbar">{selected.lyrics}</pre>
                  </div>
                </div>
                <div className="md:w-1/2 space-y-8 flex flex-col justify-end">
                   <img src={selected.thumbPath} className="w-full h-[250px] object-cover rounded-2xl border border-white/10" />
                   {selected.audioPath && (
                     <div className="bg-white/5 p-6 rounded-2xl flex items-center gap-6 border border-white/10">
                        <button onClick={togglePlay} className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center text-black">
                          {isPlaying ? <Pause fill="black" size={28} /> : <Play fill="black" size={28} className="ml-1" />}
                        </button>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                             <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Listen Now</span>
                             <span className="text-[10px] font-mono text-gray-400">{formatTime(currentTime)} / {formatTime(duration)}</span>
                          </div>
                          <div 
                            className="h-1.5 bg-white/10 rounded-full relative cursor-pointer group"
                            onClick={handleSeek}
                          >
                             <div 
                               className="h-full bg-cyan-400 rounded-full relative transition-all duration-100" 
                               style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                             >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                             </div>
                          </div>
                        </div>
                     </div>
                   )}
                   <a href={selected.insta} target="_blank" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-center text-xs font-black uppercase text-gray-400 hover:text-white transition-all">Open In Instagram</a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
