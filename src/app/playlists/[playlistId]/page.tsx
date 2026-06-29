"use client";

import { usePlaylistDetail } from "@/features/playlist/api/usePlaylists";
import { useParams } from "next/navigation";
import { VideoCard } from "@/components/video/VideoCard";
import { Skeleton } from "@/components/ui/skeleton";
import { PlaySquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function PlaylistDetailPage() {
  const { playlistId } = useParams() as { playlistId: string };
  const { data: playlist, status } = usePlaylistDetail(playlistId);

  if (status === "pending") {
    return (
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <Skeleton className="w-full aspect-square md:aspect-[3/4] rounded-xl" />
        </div>
        <div className="w-full md:w-2/3 flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (status === "error" || !playlist) {
    return <div className="text-center py-10 text-destructive">Failed to load playlist.</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 lg:gap-8 max-w-7xl mx-auto w-full">
      <div className="w-full md:w-[350px] shrink-0">
        <div className="bg-muted/30 p-6 rounded-2xl flex flex-col gap-4 sticky top-24">
          <div className="aspect-square w-full bg-secondary/20 rounded-xl flex items-center justify-center">
            <PlaySquare className="h-20 w-20 text-primary/50" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{playlist.title}</h1>
            <div className="text-sm font-semibold mt-2">{playlist.owner?.fullName || playlist.owner?.username}</div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
              <span>{(playlist.video?.length || 0)} videos</span>
              <span>•</span>
              <span>Updated {formatDistanceToNow(new Date(playlist.updatedAt), { addSuffix: true })}</span>
            </div>
            {playlist.description && (
              <p className="text-sm mt-4 text-muted-foreground">{playlist.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {(playlist.video?.length || 0) === 0 ? (
          <div className="text-center py-20 text-muted-foreground">This playlist is empty.</div>
        ) : (
          (playlist.video || []).map((video, index) => (
            <div key={video._id} className="flex gap-4 group">
              <span className="text-sm text-muted-foreground font-medium self-center w-6 text-center">{index + 1}</span>
              <div className="w-full max-w-md">
                 <VideoCard video={video} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
