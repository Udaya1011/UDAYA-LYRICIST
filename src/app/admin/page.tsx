"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, LogOut, Disc, Music2, Type, AlignLeft, Image as ImageIcon, Link as LinkIcon, Music, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [songs, setSongs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const [editingSongId, setEditingSongId] = useState<string | null>(null);
  const [newSong, setNewSong] = useState({
    title: "",
    desc: "",
    lyrics: "",
    insta: "",
    file: "",
    thumb: ""
  });

  const fetchSongs = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/songs", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data)) setSongs(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchSongs();
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid Credentials. (admin / admin123)");
    }
  };

  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingSongId ? `/api/songs/${editingSongId}` : "/api/songs";
      const method = editingSongId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSong),
      });

      if (res.ok) {
        alert(editingSongId ? "Song updated!" : "Song saved to MongoDB!");
        setNewSong({ title: "", desc: "", lyrics: "", insta: "", file: "", thumb: "" });
        setEditingSongId(null);
        fetchSongs();
      } else {
        const rawText = await res.text();
        alert(`Save Failed: ${rawText || "Check Server Logs"}`);
      }
    } catch (error) {
      alert("Network Error: Could not connect to Atlas.");
    }
  };

  const handleEdit = (song: any) => {
    setEditingSongId(song._id);
    setNewSong({
      title: song.title,
      desc: song.desc,
      lyrics: song.lyrics,
      insta: song.insta,
      file: song.file,
      thumb: song.thumb || ""
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: "file" | "thumb") => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append("file", selectedFile);
            
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });

            const data = await res.json();
            if (data.success) {
                setNewSong({ ...newSong, [field]: data.filename });
                alert(`${field.toUpperCase()} Uploaded Successfully!`);
            } else {
                alert(`Upload failed: ${data.error}`);
            }
        } catch (err) {
            alert("Network error during upload.");
        } finally {
            setIsUploading(false);
        }
    }
  };

  const handleDelete = async (id: string) => {
    if (!id || id === 'undefined') {
       alert("Error: Invalid Song ID. Please refresh the page.");
       return;
    }
    
    if (confirm("Are you sure you want to delete this song from Atlas?")) {
      const previousSongs = [...songs];
      setSongs(songs.filter(s => s._id !== id));

      try {
        const res = await fetch(`/api/songs/${id}`, { method: "DELETE" });
        if (res.ok) {
           fetchSongs();
        } else {
           const rawText = await res.text();
           alert(`Delete failed (Status ${res.status}): ${rawText}`);
           setSongs(previousSongs);
        }
      } catch (err: any) {
        alert(`Network error: ${err.message}`);
        setSongs(previousSongs);
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 relative">
        <a href="/" className="absolute top-8 right-8 text-gray-500 hover:text-white transition-all"><X size={32} /></a>
        <div className="w-full max-w-md glass-card p-8 border border-white/10">
          <h1 className="text-3xl font-black text-center mb-8 tracking-tighter text-white uppercase">UDAYA <span className="text-cyan-400">ADMIN</span></h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-400" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-400" />
            <button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 p-4 rounded-xl font-bold text-white uppercase">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <div className="flex justify-between items-center mb-4">
             <h1 className="text-4xl font-black tracking-tighter">ADMIN <span className="text-cyan-400">DASHBOARD</span></h1>
             <button onClick={() => setIsLoggedIn(false)} className="bg-white/5 px-4 py-2 rounded-xl text-gray-400 hover:text-white">LOGOUT</button>
          </div>
          
          {/* Storage Status Banner */}
          <div className={`p-3 rounded-xl border flex items-center justify-between transition-all ${songs.length > 0 ? (songs[0].file?.startsWith('http') ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-orange-500/10 border-orange-500/30 text-orange-400') : 'bg-white/5 border-white/10 text-gray-400'}`}>
             <div className="flex items-center gap-3">
               <div className={`w-2 h-2 rounded-full animate-pulse ${songs.length > 0 ? (songs[0].file?.startsWith('http') ? 'bg-cyan-400' : 'bg-orange-400') : 'bg-gray-400'}`} />
               <span className="text-xs font-black uppercase tracking-widest">
                 Storage Status: {songs.length > 0 ? (songs[0].file?.startsWith('http') ? 'Cloud (Permanent - Render Ready)' : 'Local (Temporary - WILL BE DELETED ON RENDER)') : 'Connecting...'}
               </span>
             </div>
             {songs.length > 0 && !songs[0].file?.startsWith('http') && (
               <span className="text-[10px] font-bold underline">Add CLOUDINARY_URL to Render and refresh to fix!</span>
             )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="glass-card p-6 border border-white/10 h-fit sticky top-12">
            <h2 className="text-xl font-bold mb-6 uppercase tracking-widest border-b border-white/10 pb-2">{editingSongId ? "Edit Song" : "Add Song"}</h2>
            <form onSubmit={handleAddSong} className="space-y-4">
              <input type="text" value={newSong.title} onChange={(e)=>setNewSong({...newSong, title:e.target.value})} placeholder="Title" className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm" />
              <input type="text" value={newSong.desc} onChange={(e)=>setNewSong({...newSong, desc:e.target.value})} placeholder="Description" className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm" />
              
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-500">Thumbnail (Cloud URL or Upload)</label>
                {newSong.thumb && (
                  <div className="mb-2 relative w-full h-32 rounded-lg overflow-hidden border border-white/10">
                    <img 
                      src={newSong.thumb.match(/^(http|\/|data:)/) ? newSong.thumb : `/${newSong.thumb}`} 
                      className="w-full h-full object-cover" 
                      alt="Preview"
                    />
                    <button 
                      type="button"
                      onClick={() => setNewSong({...newSong, thumb: ""})}
                      className="absolute top-1 right-1 bg-black/60 p-1 rounded-full text-white hover:text-red-400"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                <div className="flex gap-2">
                  <input type="text" value={newSong.thumb} onChange={(e)=>setNewSong({...newSong, thumb:e.target.value})} placeholder="cover.jpg" className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-cyan-400" />
                  <label className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-3 flex items-center rounded-lg cursor-pointer hover:bg-cyan-500/30">
                    <ImageIcon size={14}/>
                    <input type="file" accept="image/*" onChange={(e)=>handleFileChange(e, "thumb")} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-500">Audio (Cloud URL or Upload)</label>
                <div className="flex gap-2">
                  <input type="text" value={newSong.file} onChange={(e)=>setNewSong({...newSong, file:e.target.value})} placeholder="song.mpeg" className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-purple-400" />
                  <label className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 flex items-center rounded-lg cursor-pointer hover:bg-purple-500/30">
                    <Music size={14}/>
                    <input type="file" accept="audio/*" onChange={(e)=>handleFileChange(e, "file")} className="hidden" />
                  </label>
                </div>
              </div>

              <input type="text" value={newSong.insta} onChange={(e)=>setNewSong({...newSong, insta:e.target.value})} placeholder="Instagram link" className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm" />
              <textarea rows={4} value={newSong.lyrics} onChange={(e)=>setNewSong({...newSong, lyrics:e.target.value})} placeholder="Tamil Lyrics" className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm resize-none" />
              <button 
                disabled={isUploading}
                className={`w-full ${editingSongId ? 'bg-purple-500' : 'bg-cyan-500'} text-black font-black py-3 rounded-xl uppercase tracking-widest ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isUploading ? "Uploading..." : (editingSongId ? "Update" : "Save")}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-6 text-purple-400 border-b border-white/10 pb-2">SONG LIST</h2>
            <div className="space-y-4 text-white">
              {isLoading ? <div className="text-center py-20 text-gray-500 uppercase tracking-widest animate-pulse">Connecting to Atlas...</div> : 
                songs.map((song) => (
                  <div key={song._id} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex justify-between items-center hover:bg-white/10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-cyan-500/20 rounded-lg overflow-hidden relative">
                        {song.thumb ? (
                          <img 
                            src={song.thumb.match(/^(http|\/|data:)/) ? song.thumb : `/${song.thumb}`} 
                            className="w-full h-full object-cover"
                          />
                        ) : <Music2 className="text-cyan-400" />}
                        
                        {/* Status Badge on Item */}
                        <div className={`absolute top-0 right-0 w-2 h-2 rounded-full ${song.file?.startsWith('http') ? 'bg-cyan-400' : 'bg-orange-500'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <h4 className="font-bold">{song.title}</h4>
                           <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase ${song.file?.startsWith('http') ? 'bg-cyan-500/20 text-cyan-400' : 'bg-orange-500/20 text-orange-400'}`}>
                             {song.file?.startsWith('http') ? 'Cloud' : 'Local'}
                           </span>
                        </div>
                        <p className="text-xs text-gray-500">{song.desc}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => handleEdit(song)} className="text-xs font-bold text-cyan-400">EDIT</button>
                      <button onClick={() => handleDelete(song._id)} className="text-red-500"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
