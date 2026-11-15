"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, X, Share2, Disc, Volume2, VolumeX, Search, 
  Copy, Check, ExternalLink, Heart, MessageCircle, Bookmark, 
  ChevronLeft, ChevronRight, MoreHorizontal, Download
} from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { INITIAL_SONGS, SongItem } from "@/lib/initialSongs";
import { cn } from "@/lib/utils";

interface WorksProps {
  onPlayStateChange?: (playing: boolean) => void;
}

export default function Works({ onPlayStateChange }: WorksProps) {
  const [songs, setSongs] = useState<any[]>(() => {
    return INITIAL_SONGS.map((s) => {
      const resolvePath = (val: string) => {
        if (!val) return null;
        if (val.match(/^(http|\/|data:)/)) return val;
        return `/${val}`;
      };
      return {
        ...s,
        audioPath: resolvePath(s.file),
        thumbPath: resolvePath(s.thumb || "") || "https://images.unsplash.com/photo-1514525253361-bee8718a300a?auto=format&fit=crop&q=80&w=600",
      };
    });
  });

  // Modal / Fullscreen Viewer State
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedTag, setSelectedTag] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedLyrics, setCopiedLyrics] = useState(false);
  const [likedSongs, setLikedSongs] = useState<Record<string, boolean>>({});
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [showHeartAnim, setShowHeartAnim] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch updated songs from DB
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await fetch("/api/songs");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const resolvePath = (val: string) => {
            if (!val) return null;
            if (val.match(/^(http|\/|data:)/)) return val;
            return `/${val}`;
          };

          const mapped = data.map((s: any) => ({
            ...s,
            audioPath: resolvePath(s.file),
            thumbPath: resolvePath(s.thumb || "") || "https://images.unsplash.com/photo-1514525253361-bee8718a300a?auto=format&fit=crop&q=80&w=600",
          }));
          setSongs(mapped);
        }
      } catch (e) {
        console.error("Using fallback song data", e);
      }
    };
    fetchSongs();
  }, []);

  // Sync play state with parent
  useEffect(() => {
    if (onPlayStateChange) onPlayStateChange(isPlaying);
  }, [isPlaying, onPlayStateChange]);

  const filteredSongs = useMemo(() => {
    return songs.filter((s) => {
      const matchesSearch =
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.desc && s.desc.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.lyrics && s.lyrics.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (selectedTag === "ALL") return true;
      if (selectedTag === "HITS") {
        return ["Iruttu", "Dhoorame", "Adiyae", "Pesadhaa"].some((t) =>
          s.title.toLowerCase().includes(t.toLowerCase())
        );
      }
      if (selectedTag === "SOULFUL") {
        return (
          s.title.toLowerCase().includes("thunaiyae") ||
          s.title.toLowerCase().includes("dhoorame") ||
          s.title.toLowerCase().includes("iruttu")
        );
      }
      if (selectedTag === "HEARTBREAK") {
        return (
          s.title.toLowerCase().includes("pesadhaa") ||
          s.title.toLowerCase().includes("thanimaiyeee") ||
          s.title.toLowerCase().includes("poo") ||
          s.title.toLowerCase().includes("kangale")
        );
      }
      return true;
    });
  }, [songs, selectedTag, searchQuery]);

  const selectedSong = selectedIndex !== null ? filteredSongs[selectedIndex] : null;

  // Open Instagram-style full page viewer
  const handleOpenSong = (index: number) => {
    setSelectedIndex(index);
    const song = filteredSongs[index];

    if (audioRef.current && song?.audioPath) {
      audioRef.current.src = song.audioPath;
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handleClose = () => {
    if (audioRef.current) audioRef.current.pause();
    setIsPlaying(false);
    setSelectedIndex(null);
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    const nextIdx = (selectedIndex + 1) % filteredSongs.length;
    handleOpenSong(nextIdx);
  };

  const handlePrev = () => {
    if (selectedIndex === null) return;
    const prevIdx = (selectedIndex - 1 + filteredSongs.length) % filteredSongs.length;
    handleOpenSong(prevIdx);
  };

  // Keyboard navigation like Instagram
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, isPlaying, filteredSongs]);

  // Audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      // Auto-advance to next song like Instagram Reels!
      handleNext();
    };

    audio.addEventListener("timeupdate", handleTime);
    audio.addEventListener("loadedmetadata", handleTime);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTime);
      audio.removeEventListener("loadedmetadata", handleTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [selectedIndex, filteredSongs]);

  const togglePlay = () => {
    if (!audioRef.current || !selectedSong?.audioPath) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = percent * duration;
    }
  };

  const handleDoubleTapMedia = () => {
    if (!selectedSong) return;
    setLikedSongs((prev) => ({ ...prev, [selectedSong._id]: true }));
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 900);
  };

  const toggleLike = () => {
    if (!selectedSong) return;
    setLikedSongs((prev) => ({
      ...prev,
      [selectedSong._id]: !prev[selectedSong._id],
    }));
  };

  const toggleSongLike = (songId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikedSongs((prev) => ({
      ...prev,
      [songId]: !prev[songId],
    }));
  };

  const handleDownload = async (song: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!song?.audioPath) return;

    setDownloadingId(song._id);

    try {
      const response = await fetch(song.audioPath);
      if (!response.ok) throw new Error("Fetch failed");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      const cleanTitle = (song.title || "Track").replace(/[^\w\s-]/gi, "").trim().replace(/\s+/g, "_");
      link.download = `${cleanTitle}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      // Direct link fallback
      const link = document.createElement("a");
      link.href = song.audioPath;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.download = `${song.title || "Track"}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setTimeout(() => setDownloadingId(null), 1200);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCopyLyrics = () => {
    if (selectedSong?.lyrics) {
      navigator.clipboard.writeText(selectedSong.lyrics);
      setCopiedLyrics(true);
      setTimeout(() => setCopiedLyrics(false), 2000);
    }
  };

  return (
    <section id="works" className="py-20 bg-black relative">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Disc size={13} className={cn(isPlaying ? "animate-spin-slow" : "")} />
            <span>Discography</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
            ORIGINAL <span className="text-cyan-400">SONGS</span>
          </h2>

          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
            Click any song to open the full Instagram-style player and view lyrics.
          </p>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          
          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: "ALL", label: `All Tracks (${songs.length})` },
              { id: "HITS", label: "Featured Hits" },
              { id: "SOULFUL", label: "Soulful" },
              { id: "HEARTBREAK", label: "Heartbreak" },
            ].map((tag) => (
              <button
                key={tag.id}
                onClick={() => setSelectedTag(tag.id)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer",
                  selectedTag === tag.id
                    ? "bg-cyan-400 text-black shadow-md shadow-cyan-400/25"
                    : "bg-zinc-900 text-gray-400 hover:text-white border border-zinc-800"
                )}
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search songs or lyrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 pl-9 pr-8 py-1.5 rounded-full text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Songs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredSongs.map((work, idx) => (
            <motion.div
              key={work._id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: (idx % 4) * 0.05 }}
              onClick={() => handleOpenSong(idx)}
              className="glass-card bg-zinc-950 border border-zinc-850 hover:border-cyan-400/50 rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
            >
              {/* Thumbnail with Instagram Post Hover */}
              <div className="relative aspect-square w-full overflow-hidden bg-zinc-900">
                <img
                  src={work.thumbPath}
                  alt={work.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Instagram Style Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold text-xs sm:text-sm">
                  <div
                    onClick={(e) => toggleSongLike(work._id, e)}
                    className="flex items-center gap-1.5 hover:text-red-400 transition-colors"
                  >
                    <Heart
                      size={18}
                      className={cn(
                        likedSongs[work._id]
                          ? "fill-red-500 text-red-500"
                          : "fill-white text-white"
                      )}
                    />
                    <span>{likedSongs[work._id] ? "Liked" : "Like"}</span>
                  </div>

                  {/* Download right next to like */}
                  <div
                    onClick={(e) => handleDownload(work, e)}
                    className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
                    title="Download Track"
                  >
                    {downloadingId === work._id ? (
                      <span className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin inline-block" />
                    ) : (
                      <Download size={18} />
                    )}
                    <span>Download</span>
                  </div>

                  <div className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
                    <Play size={18} fill="white" />
                    <span>Play</span>
                  </div>
                </div>

                <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-[10px] font-bold text-cyan-300 border border-white/10">
                  Track #{idx + 1}
                </div>
              </div>

              {/* Details */}
              <div className="p-4 space-y-1.5">
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                  {work.title}
                </h3>
                {work.desc ? (
                  <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                    {work.desc}
                  </p>
                ) : work.lyrics ? (
                  <p className="text-gray-400 text-xs italic line-clamp-2 leading-relaxed">
                    "{work.lyrics.split("\n")[0]}"
                  </p>
                ) : null}

                <div className="pt-2 flex items-center justify-between text-[11px] font-semibold text-cyan-400">
                  <span>Open Track & Lyrics ↗</span>
                  <div className="flex items-center gap-3">
                    {/* Like button */}
                    <button
                      onClick={(e) => toggleSongLike(work._id, e)}
                      className="text-zinc-400 hover:text-red-400 transition-colors"
                      title={likedSongs[work._id] ? "Liked" : "Like"}
                    >
                      <Heart
                        size={14}
                        className={cn(
                          likedSongs[work._id] ? "fill-red-500 text-red-500" : ""
                        )}
                      />
                    </button>

                    {/* Download button next to like */}
                    <button
                      onClick={(e) => handleDownload(work, e)}
                      className="text-zinc-400 hover:text-cyan-400 transition-colors"
                      title="Download MP3"
                    >
                      {downloadingId === work._id ? (
                        <span className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin inline-block" />
                      ) : (
                        <Download size={14} />
                      )}
                    </button>

                    {work.insta && (
                      <a
                        href={work.insta}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-zinc-400 hover:text-pink-400 transition-colors"
                        title="Instagram Post"
                      >
                        <Share2 size={13} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* INSTAGRAM-STYLE FULL PAGE / MODAL VIEWER */}
      <AnimatePresence>
        {selectedSong && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-0 sm:p-6 bg-black/95 backdrop-blur-2xl"
          >
            {/* Top Close Button (Desktop & Mobile) */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-2.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-white border border-zinc-700 transition-colors shadow-2xl cursor-pointer"
              title="Close viewer (Esc)"
            >
              <X size={20} />
            </button>

            {/* Previous Track Arrow (Desktop) */}
            <button
              onClick={handlePrev}
              className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white border border-zinc-700 transition-transform hover:scale-110 cursor-pointer shadow-2xl"
              title="Previous song (Left arrow)"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Next Track Arrow (Desktop) */}
            <button
              onClick={handleNext}
              className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white border border-zinc-700 transition-transform hover:scale-110 cursor-pointer shadow-2xl"
              title="Next song (Right arrow)"
            >
              <ChevronRight size={24} />
            </button>

            {/* Instagram Main Dialog Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full sm:max-w-5xl h-full sm:h-[88vh] max-h-[850px] bg-black sm:border sm:border-zinc-800 sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* LEFT HALF: Media Stage (Image/Video with Play/Pause on Tap) */}
              <div 
                className="relative w-full md:w-[58%] h-[45vh] md:h-full bg-black flex items-center justify-center select-none overflow-hidden group cursor-pointer"
                onDoubleClick={handleDoubleTapMedia}
                onClick={togglePlay}
              >
                {/* Media Image */}
                <img
                  src={selectedSong.thumbPath}
                  alt={selectedSong.title}
                  className="w-full h-full object-cover object-center"
                />

                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                {/* Double Tap Heart Animation (Instagram style ❤️) */}
                <AnimatePresence>
                  {showHeartAnim && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1.3, opacity: 1 }}
                      exit={{ scale: 1.8, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                    >
                      <Heart size={100} className="fill-red-500 text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Center Play/Pause Indicator (fades out when playing) */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl">
                      <Play size={28} fill="white" className="ml-1" />
                    </div>
                  </div>
                )}

                {/* Top-Left Audio Type badge */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-semibold text-white pointer-events-none">
                  <Disc size={13} className={cn("text-cyan-400", isPlaying ? "animate-spin-slow" : "")} />
                  <span>Original Track • Udaya</span>
                </div>

                {/* Bottom-Right Mute Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                  className="absolute bottom-4 right-4 z-20 p-2.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-white hover:text-cyan-400 transition-colors shadow-lg"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              </div>

              {/* RIGHT HALF: Instagram Profile Header, Lyrics & Controls */}
              <div className="w-full md:w-[42%] flex-1 flex flex-col justify-between bg-zinc-950 border-t md:border-t-0 md:border-l border-zinc-850 h-full overflow-hidden">
                
                {/* 1. Header (Instagram Profile Info) */}
                <div className="p-4 sm:p-5 border-b border-zinc-850 flex items-center justify-between bg-zinc-950 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex-shrink-0">
                      <div className="w-full h-full rounded-full overflow-hidden bg-black p-0.5">
                        <img
                          src="/profile.png"
                          alt="Udaya"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-white hover:underline cursor-pointer">
                          udaya____10
                        </span>
                        <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 flex items-center justify-center text-[9px] text-black font-black" title="Verified Creator">
                          ✓
                        </span>
                        <span className="text-zinc-500 text-xs">•</span>
                        <a
                          href="https://www.instagram.com/udaya____10/"
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-cyan-400 hover:text-cyan-300"
                        >
                          Follow
                        </a>
                      </div>
                      <span className="text-[11px] text-zinc-400 block">
                        Tamil Lyricist & AI Music Creator
                      </span>
                    </div>
                  </div>

                  <a
                    href={selectedSong.insta || "https://www.instagram.com/udaya____10/"}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-zinc-400 hover:text-white"
                    title="Open on Instagram"
                  >
                    <MoreHorizontal size={18} />
                  </a>
                </div>

                {/* 2. Middle Content (Caption, Song Title & Lyrics - Scrollable) */}
                <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4 text-xs leading-relaxed">
                  
                  {/* Song Title & Caption */}
                  <div className="space-y-1 pb-3 border-b border-zinc-900">
                    <h3 className="text-base font-black text-white tracking-tight">
                      {selectedSong.title}
                    </h3>
                    {selectedSong.desc && (
                      <p className="text-zinc-400 text-xs italic">
                        {selectedSong.desc}
                      </p>
                    )}
                  </div>

                  {/* Lyrics Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold uppercase tracking-wider text-cyan-400 text-[11px] flex items-center gap-1">
                        Song Lyrics
                      </span>

                      {selectedSong.lyrics && (
                        <button
                          onClick={handleCopyLyrics}
                          className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-[11px] text-zinc-300 hover:text-white border border-zinc-850 flex items-center gap-1 cursor-pointer"
                        >
                          {copiedLyrics ? (
                            <>
                              <Check size={11} className="text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={11} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <div className="p-4 rounded-xl bg-black border border-zinc-900 text-zinc-200">
                      {selectedSong.lyrics ? (
                        <pre className="text-xs sm:text-sm whitespace-pre-line font-sans leading-relaxed selection:bg-cyan-400 selection:text-black">
                          {selectedSong.lyrics}
                        </pre>
                      ) : (
                        <p className="text-zinc-500 italic py-4 text-center">
                          Lyrics for this track will be available soon.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest pt-2">
                    Original Release by Udaya
                  </div>
                </div>

                {/* 3. Footer Bar (Instagram Actions & Scrubber) */}
                <div className="p-4 sm:p-5 border-t border-zinc-850 bg-zinc-950 space-y-3 flex-shrink-0">
                  
                  {/* Action Icons Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Like button */}
                      <button
                        onClick={toggleLike}
                        className="text-white hover:text-red-500 transition-colors cursor-pointer"
                        title="Like this track"
                      >
                        <Heart
                          size={22}
                          className={cn(
                            likedSongs[selectedSong._id]
                              ? "fill-red-500 text-red-500"
                              : "text-white hover:text-red-500"
                          )}
                        />
                      </button>

                      {/* Download button next to like */}
                      <button
                        onClick={(e) => handleDownload(selectedSong, e)}
                        className="text-white hover:text-cyan-400 transition-colors cursor-pointer"
                        title="Download track (MP3)"
                      >
                        {downloadingId === selectedSong._id ? (
                          <span className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin inline-block" />
                        ) : (
                          <Download size={22} />
                        )}
                      </button>

                      {/* Comment/Lyrics icon */}
                      <button
                        onClick={handleCopyLyrics}
                        className="text-white hover:text-cyan-400 transition-colors cursor-pointer"
                        title="Copy lyrics"
                      >
                        <MessageCircle size={22} />
                      </button>

                      {/* Share on Instagram */}
                      {selectedSong.insta && (
                        <a
                          href={selectedSong.insta}
                          target="_blank"
                          rel="noreferrer"
                          className="text-white hover:text-pink-400 transition-colors cursor-pointer"
                          title="Open Instagram Post"
                        >
                          <Share2 size={20} />
                        </a>
                      )}
                    </div>

                    {/* Play/Pause Button */}
                    <button
                      onClick={togglePlay}
                      className="w-10 h-10 rounded-full bg-cyan-400 text-black flex items-center justify-center hover:bg-cyan-300 transition-colors cursor-pointer shadow-lg shadow-cyan-400/20"
                    >
                      {isPlaying ? <Pause size={16} fill="black" /> : <Play size={16} fill="black" className="ml-0.5" />}
                    </button>
                  </div>

                  {/* Scrubber & Timestamps */}
                  <div className="space-y-1">
                    <div
                      onClick={handleSeek}
                      className="h-1.5 w-full bg-zinc-800 rounded-full cursor-pointer relative"
                    >
                      <div
                        className="h-full bg-cyan-400 rounded-full relative"
                        style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow" />
                      </div>
                    </div>

                    <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                      <span className="text-cyan-400 font-bold">{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Instagram Direct Link */}
                  {selectedSong.insta && (
                    <a
                      href={selectedSong.insta}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-[11px] font-bold text-white flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>View Official Instagram Reel</span>
                      <ExternalLink size={12} className="text-zinc-400" />
                    </a>
                  )}

                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Audio Element for Player */}
      <audio ref={audioRef} preload="none" />
    </section>
  );
}
