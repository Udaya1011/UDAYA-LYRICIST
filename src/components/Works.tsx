"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, X, Share2, Disc, Volume2, VolumeX, Search,
  Copy, Check, ExternalLink, Heart, MessageCircle, Bookmark,
  ChevronLeft, ChevronRight, MoreHorizontal, Download, ChevronDown, ChevronUp
} from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { INITIAL_SONGS, SongItem } from "@/lib/initialSongs";
import { cn } from "@/lib/utils";

interface WorksProps {
  onPlayStateChange?: (playing: boolean) => void;
}

const getVibeTag = (title: string, lyrics?: string) => {
  const t = (title + " " + (lyrics || "")).toLowerCase();
  if (t.includes("iruttu") || t.includes("dark") || t.includes("maranam")) return "Midnight Melancholy";
  if (t.includes("kangale") || t.includes("thanimai") || t.includes("pesadhaa") || t.includes("vidai")) return "Heartbreak Ballad";
  if (t.includes("dhoorame") || t.includes("sambavam") || t.includes("thee")) return "Cinema Indie";
  if (t.includes("thunaiyae") || t.includes("kaadhal") || t.includes("kanmaniyae") || t.includes("adiyae")) return "Soulful Romance";
  return "Soulful Melody";
};

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
  const [shareToast, setShareToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: "" });

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

  // Deep linking: auto-open song if ?song= param exists in URL
  useEffect(() => {
    if (typeof window === "undefined" || songs.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const songParam = params.get("song");
    if (songParam) {
      const clean = decodeURIComponent(songParam).toLowerCase().trim();
      const idx = songs.findIndex(
        (s) =>
          (s._id && s._id.toLowerCase() === clean) ||
          (s.title && s.title.toLowerCase().trim() === clean)
      );
      if (idx !== -1) {
        handleOpenSong(idx);
      }
    }
  }, [songs]);

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

  const [slideDirection, setSlideDirection] = useState<number>(1);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSlideDirection(1);
    const nextIdx = (selectedIndex + 1) % filteredSongs.length;
    handleOpenSong(nextIdx);
  };

  const handlePrev = () => {
    if (selectedIndex === null) return;
    setSlideDirection(-1);
    const prevIdx = (selectedIndex - 1 + filteredSongs.length) % filteredSongs.length;
    handleOpenSong(prevIdx);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now(),
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;
    touchStartRef.current = null;

    const target = e.target as HTMLElement;
    const isLyricsScroll = target && target.closest(".lyrics-scroll-area");
    // If inside lyrics and small swipe, let user scroll lyrics
    if (isLyricsScroll && Math.abs(deltaY) < 80) {
      return;
    }

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (Math.max(absX, absY) > 40 && deltaTime < 800) {
      if (absY > absX) {
        // Vertical swipe (Instagram Reels style!)
        if (deltaY < -40) {
          handleNext();
        } else if (deltaY > 40) {
          handlePrev();
        }
      } else {
        // Horizontal swipe (Stories style)
        if (deltaX < -40) {
          handleNext();
        } else if (deltaX > 40) {
          handlePrev();
        }
      }
    }
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

  const getSongShareUrl = (song: any) => {
    if (typeof window === "undefined" || !song) return "";
    const cleanId = encodeURIComponent(song._id || song.title);
    return `${window.location.origin}/?song=${cleanId}`;
  };

  const handleShareSong = async (song: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!song) return;

    const shareUrl = getSongShareUrl(song);
    const title = `${song.title} - Udaya | AI Music`;
    const text = `🎵 Listen to "${song.title}" - Tamil lyrics & AI Music by Udaya:\n`;

    // Always trigger the native system share sheet (shows all installed apps on user device)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
        return;
      } catch (err: any) {
        if (err.name === "AbortError") return; // User dismissed share sheet
      }
    }

    // Fallback if browser/platform doesn't support Web Share API: direct copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareToast({ show: true, msg: "Song link copied to clipboard! 📋" });
      setTimeout(() => setShareToast({ show: false, msg: "" }), 3000);
    } catch {
      // Fallback
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
              {/* Thumbnail with Transparent Play button */}
              <div className="relative aspect-square w-full overflow-hidden bg-zinc-900">
                <img
                  src={work.thumbPath}
                  alt={work.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Transparent Glass Play Button - Visible ONLY on hover */}
                <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-black/45 backdrop-blur-md border border-white/35 text-white flex items-center justify-center shadow-lg transform scale-95 group-hover:scale-100 group-hover:border-cyan-400 group-hover:text-cyan-400 group-hover:shadow-[0_0_25px_rgba(0,243,255,0.45)] transition-all duration-300">
                    <Play size={22} fill="currentColor" className="ml-0.5 transition-colors" />
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

                <div className="pt-2 flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-3">
                    {/* Like button */}
                    <button
                      onClick={(e) => toggleSongLike(work._id, e)}
                      className="text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                      title={likedSongs[work._id] ? "Liked" : "Like"}
                    >
                      <Heart
                        size={15}
                        className={cn(
                          likedSongs[work._id] ? "fill-red-500 text-red-500" : ""
                        )}
                      />
                    </button>

                    {/* Download button next to like */}
                    <button
                      onClick={(e) => handleDownload(work, e)}
                      className="text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer"
                      title="Download MP3"
                    >
                      {downloadingId === work._id ? (
                        <span className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin inline-block" />
                      ) : (
                        <Download size={15} />
                      )}
                    </button>

                    {/* Share Track button */}
                    <button
                      onClick={(e) => handleShareSong(work, e)}
                      className="text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer"
                      title="Share Track"
                    >
                      <Share2 size={15} />
                    </button>
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
            {/* Top Close Button (Desktop Only) */}
            <button
              onClick={handleClose}
              className="hidden sm:flex absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-2.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-white border border-zinc-700 transition-colors shadow-2xl cursor-pointer"
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
              className="relative w-full sm:max-w-5xl h-full sm:h-[88vh] max-h-[850px] bg-black sm:border sm:border-zinc-800 sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row touch-pan-y"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >

              {/* MOBILE ONLY: Profile ID Header (Placed on TOP of the image) */}
              <div className="md:hidden px-3.5 py-2.5 border-b border-zinc-850 flex items-center justify-between bg-zinc-950 flex-shrink-0 z-30">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex-shrink-0">
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
                      <span className="font-bold text-xs text-white">
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
                        className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300"
                      >
                        Follow
                      </a>
                    </div>
                    <span className="text-[10px] text-zinc-400 block">
                      Tamil Lyricist & AI Music Creator
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <a
                    href={selectedSong.insta || "https://www.instagram.com/udaya____10/"}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-zinc-400 hover:text-white"
                    title="Open on Instagram"
                  >
                    <MoreHorizontal size={18} />
                  </a>
                  <button
                    onClick={handleClose}
                    className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Close"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* LEFT HALF: Media Stage (Image/Video with Play/Pause on Tap) */}
              <div
                className="relative w-full md:w-[52%] lg:w-[56%] h-[22vh] min-h-[160px] max-h-[220px] md:h-full md:max-h-none bg-black flex items-center justify-center select-none overflow-hidden group cursor-pointer shrink-0"
                onDoubleClick={handleDoubleTapMedia}
                onClick={togglePlay}
              >
                {/* Ambient blur glow for mobile */}
                <div
                  className="absolute inset-0 bg-cover bg-center blur-2xl opacity-30 scale-125 md:hidden"
                  style={{ backgroundImage: `url(${selectedSong.thumbPath})` }}
                />

                {/* Media Image: Compact square art on mobile with animated slide for Reels */}
                <div className="relative z-10 h-full w-auto aspect-square flex items-center justify-center overflow-hidden">
                  <AnimatePresence mode="wait" custom={slideDirection}>
                    <motion.img
                      key={selectedSong._id}
                      src={selectedSong.thumbPath}
                      alt={selectedSong.title}
                      initial={{ opacity: 0, y: slideDirection * 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: slideDirection * -50 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="h-full w-full object-cover md:w-full md:h-full md:aspect-auto shadow-2xl rounded-2xl md:rounded-none border border-white/10 md:border-0 my-2 md:my-0"
                    />
                  </AnimatePresence>
                </div>

                {/* Mobile Reels Swipe Indicator */}
                <div className="md:hidden absolute bottom-1.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[9px] font-mono text-zinc-300 pointer-events-none shadow-lg">
                  <span className="text-[10px] text-cyan-400 font-bold">↕</span>
                  <span>Swipe for next</span>
                </div>

                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none hidden md:block" />

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
                      <Heart size={80} className="fill-red-500 text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Center Play/Pause Indicator (fades out when playing) */}
                {!isPlaying && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/25 pointer-events-none">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl">
                      <Play size={20} fill="white" className="ml-0.5 sm:hidden" />
                      <Play size={28} fill="white" className="ml-1 hidden sm:block" />
                    </div>
                  </div>
                )}

                {/* Top-Left Audio Type badge */}
                <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-20 flex items-center gap-1.5 sm:gap-2 bg-black/70 backdrop-blur-md px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/10 text-[10px] sm:text-xs font-semibold text-white pointer-events-none">
                  <Disc size={12} className={cn("text-cyan-400", isPlaying ? "animate-spin-slow" : "")} />
                  <span>Original Track • Udaya</span>
                </div>

                {/* Bottom-Right Mute Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                  className="absolute bottom-2.5 right-2.5 sm:bottom-4 sm:right-4 z-20 p-2 sm:p-2.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-white hover:text-cyan-400 transition-colors shadow-lg"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX size={14} className="sm:w-4 sm:h-4" /> : <Volume2 size={14} className="sm:w-4 sm:h-4" />}
                </button>
              </div>

              {/* RIGHT HALF: Instagram Profile Header, Lyrics & Controls */}
              <div className="w-full md:w-[48%] lg:w-[44%] flex-1 flex flex-col justify-between bg-zinc-950 border-t md:border-t-0 md:border-l border-zinc-850 h-full overflow-hidden min-h-0">

                {/* 1. Header (Instagram Profile Info - Desktop Only) */}
                <div className="hidden md:flex p-4 md:p-5 border-b border-zinc-850 items-center justify-between bg-zinc-950 flex-shrink-0">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex-shrink-0">
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
                        <span className="font-bold text-xs sm:text-sm text-white hover:underline cursor-pointer">
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
                          className="text-[11px] sm:text-xs font-bold text-cyan-400 hover:text-cyan-300"
                        >
                          Follow
                        </a>
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-zinc-400 block">
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
                <div className="p-3 sm:p-4 md:p-5 flex-1 overflow-y-auto space-y-3 sm:space-y-4 text-xs leading-relaxed min-h-0 lyrics-scroll-area">

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
                  <div className="p-3 sm:p-4 md:p-5 border-t border-zinc-850 bg-zinc-950 space-y-2 sm:space-y-3 flex-shrink-0">

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

                        {/* Instagram icon next to like & download */}
                        {selectedSong.insta && (
                          <a
                            href={selectedSong.insta}
                            target="_blank"
                            rel="noreferrer"
                            className="text-white hover:text-pink-400 transition-colors cursor-pointer flex items-center justify-center"
                            title="Open on Instagram"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="21"
                              height="21"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                            </svg>
                          </a>
                        )}

                        {/* Share Track */}
                        <button
                          onClick={() => handleShareSong(selectedSong)}
                          className="text-white hover:text-cyan-400 transition-colors cursor-pointer"
                          title="Share Track"
                        >
                          <Share2 size={21} />
                        </button>
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

                  </div>

                </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {shareToast.show && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-zinc-900/95 backdrop-blur-md border border-cyan-400/50 text-white text-xs font-semibold shadow-2xl flex items-center gap-2"
          >
            <Check size={14} className="text-cyan-400" />
            <span>{shareToast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Audio Element for Player */}
      <audio ref={audioRef} preload="none" />
    </section>
  );
}
