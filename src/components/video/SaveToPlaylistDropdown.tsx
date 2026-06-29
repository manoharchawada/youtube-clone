"use client";

import { useUserPlaylists, useAddVideoToPlaylist } from "@/features/playlist/api/usePlaylists";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusSquare, Loader2 } from "lucide-react";

export function SaveToPlaylistDropdown({ videoId }: { videoId: string }) {
  const { user } = useAuthStore();
  const { data: playlists, status } = useUserPlaylists();
  const { mutate: addToPlaylist, isPending } = useAddVideoToPlaylist();

  if (!user) {
    return (
      <Button variant="secondary" className="rounded-full flex items-center gap-2" disabled>
        <PlusSquare className="h-4 w-4" />
        <span>Save</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="rounded-full flex items-center gap-2" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusSquare className="h-4 w-4" />}
          <span>Save</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Save to playlist</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {status === "pending" ? (
          <DropdownMenuItem disabled>Loading playlists...</DropdownMenuItem>
        ) : playlists && playlists.length > 0 ? (
          playlists.map((playlist) => (
            <DropdownMenuItem
              key={playlist._id}
              onClick={() => addToPlaylist({ playlistId: playlist._id, videoId })}
              className="cursor-pointer"
            >
              {playlist.title}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No playlists found</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
