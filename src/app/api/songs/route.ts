import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Song from "@/models/Song";

export async function GET() {
  try {
    await connectToDatabase();
    const songs = await Song.find({}).sort({ createdAt: -1 });
    return NextResponse.json(songs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    console.log("POST Request started...");
    await connectToDatabase();
    const body = await request.json();
    console.log("Saving Song to Atlas:", body);
    const song = await Song.create(body);
    console.log("Song Saved Successfully:", song._id);
    return NextResponse.json(song);
  } catch (error: any) {
    console.error("MONGODB POST ERROR FULL:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ 
      error: errorMessage,
      details: error.name || "Unknown Database Error"
    }, { status: 500 });
  }
}
