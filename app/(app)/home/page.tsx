"use client";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import VideoCard from "@/components/VideoCard";
import { Video } from "@/types";

export default function Home() {
  const [videos, setVidoes] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    try {
      const res = await axios.get("api/videos");
      console.log(res.data.videos);
      if (Array.isArray(res.data.videos)) {
        setVidoes(res.data.videos);
      } else {
        throw new Error("Unexpected response format!");
      }
    } catch (error) {
      console.log(error);
      setError("failed to fetch videos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleDeleteVideo = useCallback(async (publicId: string) => {
    try {
      await axios.post("api/video-delete", { publicId });
      setVidoes((prev) => prev.filter((v) => v.publicId !== publicId));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error(err.response?.data?.message);
      } else {
        console.error(err);
      }
    }
  }, []);

  const handleDownload = useCallback((url: string, title: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title}.mp4`);
    link.setAttribute("target", "_blank");
    link.download = "image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Videos</h1>
      {videos.length === 0 ? (
        <div className="text-center text-lg text-gray-500">No videos available</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} onDownload={handleDownload} onDelete={handleDeleteVideo} />
          ))}
        </div>
      )}
    </div>
  );
}
