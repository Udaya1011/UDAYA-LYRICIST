import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

// 1. Configure Cloudinary
const configureCloudinary = () => {
  const url = process.env.CLOUDINARY_URL;
  
  if (url && url.startsWith('cloudinary://')) {
    console.log("CONFIGURING CLOUDINARY VIA URL...");
    // Manual parsing as a fallback for the SDK's auto-config
    try {
      const parts = url.replace('cloudinary://', '').split('@');
      const credentials = parts[0].split(':');
      const cloudName = parts[1];
      
      cloudinary.config({
        cloud_name: cloudName,
        api_key: credentials[0],
        api_secret: credentials[1],
        secure: true,
      });
      console.log("CLOUDINARY MANUAL CONFIG SUCCESS. Cloud Name:", cloudName);
    } catch (e) {
      console.error("FAILED TO MANUALLY PARSE CLOUDINARY_URL:", e);
      // Fallback to let SDK handle it
      cloudinary.config({ secure: true });
    }
  } else {
    console.log("CONFIGURING CLOUDINARY VIA INDIVIDUAL ENVS...");
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }
};

configureCloudinary();

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
      // Runtime check for config
      if (!cloudinary.config().api_key) {
        console.log("RECONFIGURING CLOUDINARY AT RUNTIME...");
        configureCloudinary();
      }

      console.log("UPLOADING TO CLOUDINARY...");
      const fileBase64 = `data:${file.type};base64,${buffer.toString("base64")}`;
      const result = await cloudinary.uploader.upload(fileBase64, {
        resource_type: "auto",
        folder: "udaya-works",
        public_id: file.name.split('.')[0].replace(/\s+/g, '_') + '_' + Date.now(),
      });
      console.log("CLOUDINARY UPLOAD SUCCESS:", result.secure_url);
      return NextResponse.json({ success: true, filename: result.secure_url, path: result.secure_url });
    } else {
      // PROHIBIT LOCAL STORAGE ON PRODUCTION (RENDER)
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ 
          success: false, 
          error: "CRITICAL: Cloudinary (CLOUDINARY_URL) not set on Render. Local uploads are NOT allowed in production to prevent data loss." 
        }, { status: 403 });
      }

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
