import mongoose, { Schema, model, models } from "mongoose";

const SongSchema = new Schema({
  title: { type: String, required: true },
  desc: { type: String },
  lyrics: { type: String },
  insta: { type: String },
  file: { type: String },
  thumb: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Song = models.Song || model("Song", SongSchema);

export default Song;
