import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Song from "@/models/Song";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    console.log("PUT Request for ID:", id);
    await connectToDatabase();
    const body = await request.json();
    const updatedSong = await Song.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updatedSong);
  } catch (error: any) {
    console.error("MONGODB PUT ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    console.log("DELETE Request started for ID:", id);
    await connectToDatabase();
    
    if (!id || id.length < 12) {
         return NextResponse.json({ error: "Invalid Song ID format" }, { status: 400 });
    }

    const deletedSong = await Song.findByIdAndDelete(id);
    if (!deletedSong) {
        return NextResponse.json({ error: "Song not found in Atlas" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Song deleted successfully" });
  } catch (error: any) {
    console.error("MONGODB DELETE ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
