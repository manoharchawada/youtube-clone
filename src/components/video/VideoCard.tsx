import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Video } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDuration, formatViews } from "@/utils/format";

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={`/videos/${video._id}`} className="group flex flex-col gap-3">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
        <Image
          src={video?.thumbnail}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
          {formatDuration(video.duration)}
        </div>
      </div>
      <div className="flex gap-3 pr-2">
        <Avatar className="h-9 w-9 mt-0.5">
          <AvatarImage src={video.owner?.avatar} alt={video.owner?.username} />
          <AvatarFallback>
            {video.owner?.username?.charAt(0)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col overflow-hidden">
          <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
            {video.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            {video.owner?.fullName || video.owner?.username}
          </p>
          {/* <Image
            src={video?.owner.avatar}
            alt="Avatar"
            fill
            className="object-cover"
          /> */}

          <div className="flex items-center text-xs text-muted-foreground gap-1">
            <span>{formatViews(video.views)} views</span>
            <span>•</span>
            <span>
              {formatDistanceToNow(new Date(video.createdAt), {
                addSuffix: true
              })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function VideoCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-video w-full rounded-xl bg-muted animate-pulse" />
      <div className="flex gap-3 pr-2">
        <div className="h-9 w-9 rounded-full bg-muted animate-pulse shrink-0" />
        <div className="flex flex-col gap-2 w-full pt-1">
          <div className="h-4 w-[90%] bg-muted rounded animate-pulse" />
          <div className="h-4 w-[60%] bg-muted rounded animate-pulse" />
          <div className="h-3 w-[40%] bg-muted rounded animate-pulse mt-1" />
        </div>
      </div>
    </div>
  );
}
