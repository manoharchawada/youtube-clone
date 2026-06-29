"use client";

import { useUserProfile } from "@/features/profile/api/useUserProfile";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { VideoCard } from "@/components/video/VideoCard";

export default function PublicProfilePage() {
  const { username } = useParams() as { username: string };
  const { data, status } = useUserProfile(username);

  if (status === "pending") {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (status === "error" || !data?.profile) {
    return <div className="text-center py-10 text-destructive">User not found.</div>;
  }

  const { profile, videos } = data;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="relative w-full h-48 md:h-64 bg-muted rounded-xl overflow-hidden">
        {profile.coverImage ? (
          <Image src={profile.coverImage} alt="Cover" fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/20 to-secondary/20" />
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6 px-4 md:px-8 -mt-12 md:-mt-16 relative z-10 items-start">
        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shrink-0 bg-muted">
          <AvatarImage src={profile.avatar} />
          <AvatarFallback className="text-3xl">{profile.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col flex-1 mt-2 md:mt-16">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold">{profile.fullName}</h1>
            <Button>Subscribe</Button>
          </div>
          <p className="text-muted-foreground">@{profile.username}</p>
          <div className="flex gap-4 text-sm mt-2 text-muted-foreground">
            <span>{profile.subscribersCount || 0} subscribers</span>
            <span>{videos.length} videos</span>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 mt-8 border-t pt-8">
        <h3 className="text-xl font-bold mb-4">Videos</h3>
        {videos.length === 0 ? (
          <p className="text-sm text-muted-foreground">This user has no videos.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
