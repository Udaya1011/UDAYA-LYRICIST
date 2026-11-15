import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "Udaya Lyricist",
    time: new Date().toISOString(),
  });
}
