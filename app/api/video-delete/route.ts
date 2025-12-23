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

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { publicId } = await request.json();
    if (!publicId) {
      return NextResponse.json({ error: "publicId is required" }, { status: 400 });
    }

    // delete from cloudinary
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });

    // delete from NeonDB
    await prisma.video.delete({ where: { publicId: publicId } });
    return NextResponse.json({ message: "Video deleted successfully" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "error deleting video from cloud or DB" }, { status: 500 });
  }
}
