"use client";

import { useVideoFeed } from "@/features/video/api/useVideoFeed";
import { VideoCard, VideoCardSkeleton } from "@/components/video/VideoCard";
import { useSearchParams } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { useEffect, Suspense } from "react";

function HomeFeed() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  
  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage, status } =
    useVideoFeed(search);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (status === "pending") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-8">
        {Array.from({ length: 12 }).map((_, i) => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return <div className="text-center py-10 text-destructive">Failed to load videos.</div>;
  }

  const videos = data.pages.flatMap((page) => page);

  if (videos.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">No videos found.</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-8">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
      
      {hasNextPage && (
        <div ref={ref} className="w-full flex justify-center py-8">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      )}
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex h-40 items-center justify-center"><div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>}>
      <HomeFeed />
    </Suspense>
  );
}
