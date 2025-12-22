import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json({ message: "prisma works", videos });
  } catch (err) {
    return NextResponse.json({ error: "error fetching videos", err }, { status: 500 });
  }
}
