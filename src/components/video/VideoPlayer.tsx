"use client";

import { useRef } from "react";

interface VideoPlayerProps {
  url: string;
  poster?: string;
}

export function VideoPlayer({ url, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Simple HTML5 video player for now
  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group">
      <video
        ref={videoRef}
        src={url}
        poster={poster}
        className="w-full h-full object-contain"
        controls
        controlsList="nodownload"
        autoPlay
      />
    </div>
  );
}
