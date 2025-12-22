/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";
import { auth } from "@clerk/nextjs/server";

dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  public_id: string;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = (formData.get("file") as File) || null;
    if (!file) {
      return NextResponse.json({ message: "File not found" }, { status: 400 });
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const cloudinaryResult = await new Promise<CloudinaryUploadResult>((res, rej) => {
      const uploadStream = cloudinary.uploader.upload_stream({ folder: "pixelforge-images" }, (error, result) => {
        if (error) rej(error);
        else res(result as CloudinaryUploadResult);
      });
      uploadStream.end(buffer);
    });
    return NextResponse.json({ publicId: cloudinaryResult.public_id }, { status: 200 });
  } catch (error) {
    console.log("uploading image failed", error);
    return NextResponse.json({ message: "failed to upload image" }, { status: 500 });
  }
}
