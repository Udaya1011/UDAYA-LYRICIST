import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

// 1. Configure Cloudinary (it will automatically search for process.env.CLOUDINARY_URL)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // HYBRID SYSTEM: Use Cloudinary if credentials exist, otherwise Use Local FS
    const useCloudinary = !!(process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_URL);

    if (useCloudinary) {
      console.log("UPLOADING TO CLOUDINARY...");
      
      const fileBase64 = `data:${file.type};base64,${buffer.toString("base64")}`;
      
      const result = await cloudinary.uploader.upload(fileBase64, {
        resource_type: "auto",
        folder: "udaya-works",
        public_id: file.name.split('.')[0].replace(/\s+/g, '_'),
      });

      console.log("CLOUDINARY UPLOAD SUCCESS:", result.secure_url);

      return NextResponse.json({ 
          success: true, 
          filename: result.secure_url,
          path: result.secure_url 
      });
    } else {
      console.log("UPLOADING TO LOCAL FS (Development Only)...");
      const safeName = file.name.replace(/\s+/g, '_').toLowerCase();
      const publicDir = join(process.cwd(), "public");
      try { await mkdir(publicDir, { recursive: true }); } catch (e) {}

      const filePath = join(publicDir, safeName);
      await writeFile(filePath, buffer);

      return NextResponse.json({ 
          success: true, 
          filename: safeName,
          path: `/${safeName}` 
      });
    }
  } catch (error: any) {
    console.error("CRITICAL UPLOAD ERROR:", error);
    return NextResponse.json({ error: `Upload Failed: ${error.message}` }, { status: 500 });
  }
}

export const maxDuration = 60; 
export const dynamic = 'force-dynamic';
