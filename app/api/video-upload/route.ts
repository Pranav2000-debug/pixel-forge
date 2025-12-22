/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  public_id: string;
  bytes: number;
  duration?: number;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  try {
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json({ error: "cloudinary credentials not found" }, { status: 500 });
    }

    const formData = await request.formData();
    const file = (formData.get("file") as File) || null;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const originalSize = formData.get("originalSize") as string;

    if (!file) {
      return NextResponse.json({ message: "File not found" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const cloudinaryResult = await new Promise<CloudinaryUploadResult>((res, rej) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "pixelforge-videos", resource_type: "video", transformation: [{ quality: "auto", fetch_format: "mp4" }] },
        (error, uploadResult) => {
          if (error) rej(error);
          else res(uploadResult as CloudinaryUploadResult);
        }
      );
      uploadStream.end(buffer);
    });
    const video = await prisma.video.create({
      data: {
        title,
        description,
        publicId: cloudinaryResult.public_id,
        originalSize: originalSize,
        compressedSize: String(cloudinaryResult.bytes),
        duration: cloudinaryResult.duration || 0,
      },
    });
    return NextResponse.json(video, { status: 200 });
  } catch (error) {
    console.log("uploading video failed", error);
    return NextResponse.json({ message: "failed to upload video" }, { status: 500 });
  }
}
