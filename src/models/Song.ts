import mongoose from "mongoose";

const SongSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: String,
  lyrics: String,
  insta: String,
  file: String,
  thumb: String,
}, { timestamps: true });

export default mongoose.models.Song || mongoose.model("Song", SongSchema);
