"use client";

import { useVideoDetail } from "@/features/video/api/useVideoDetail";
import { useToggleLike } from "@/features/video/api/useToggleLike";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { CommentSection } from "@/components/comment/CommentSection";
import { SaveToPlaylistDropdown } from "@/components/video/SaveToPlaylistDropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatViews } from "@/utils/format";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, PlusSquare } from "lucide-react";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function VideoDetailPage() {
  const { videoId } = useParams() as { videoId: string };
  const { data: video, status } = useVideoDetail(videoId);
  const { mutate: toggleLike, isPending: isLiking } = useToggleLike(videoId);

  if (status === "pending") {
    return (
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          <Skeleton className="w-full aspect-video rounded-xl" />
          <Skeleton className="h-8 w-3/4 mt-2" />
          <div className="flex justify-between mt-4">
            <div className="flex gap-4 items-center">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <Skeleton className="h-6 w-32" />
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (status === "error" || !video) {
    return <div className="text-center py-10 text-destructive">Failed to load video.</div>;
  }

  return (
    <div className="flex flex-col xl:flex-row gap-6 xl:gap-8">
      <div className="w-full xl:w-[70%] flex flex-col gap-4">
        <VideoPlayer url={video.videoFile} poster={video.thumbnail} />
        
        <div className="flex flex-col gap-2">
          <h1 className="text-xl md:text-2xl font-bold">{video.title}</h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 shrink-0">
                <AvatarImage src={video.owner?.avatar} />
                <AvatarFallback>{video.owner?.username?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-lg leading-tight">
                  {video.owner?.fullName || video.owner?.username}
                </span>
                <span className="text-xs text-muted-foreground">
                  {video.owner?.subscribersCount || 0} subscribers
                </span>
              </div>
              <Button variant="secondary" className="ml-2 rounded-full">
                Subscribe
              </Button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              <Button 
                variant={video.isLiked ? "default" : "secondary"} 
                className="rounded-full flex items-center gap-2"
                onClick={() => toggleLike()}
                disabled={isLiking}
              >
                <ThumbsUp className={`h-4 w-4 ${video.isLiked ? "fill-current" : ""}`} />
                <span>{video.totalLikeCount && video.totalLikeCount > 0 ? video.totalLikeCount : "Like"}</span>
              </Button>
              <SaveToPlaylistDropdown videoId={videoId} />
            </div>
          </div>

          <div className="mt-4 p-4 bg-muted/50 rounded-xl">
            <div className="flex items-center gap-2 text-sm font-semibold mb-2">
              <span>{formatViews(video.views)} views</span>
              <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{video.description}</p>
          </div>
        </div>

        <CommentSection videoId={videoId} />
      </div>

      <div className="w-full xl:w-[30%] flex flex-col gap-4">
        <h3 className="font-bold text-lg">Related Videos</h3>
        <p className="text-sm text-muted-foreground">Related videos feed would go here...</p>
        {/* We can reuse VideoCard in a different layout or create a RelatedVideoCard component */}
      </div>
    </div>
  );
}
