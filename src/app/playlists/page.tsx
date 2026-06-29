"use client";

import { useUserPlaylists, useCreatePlaylist } from "@/features/playlist/api/usePlaylists";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlaySquare, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function PlaylistsPage() {
  const { user } = useAuthStore();
  const { data: playlists, status } = useUserPlaylists();
  const { mutate: createPlaylist, isPending: isCreating } = useCreatePlaylist();
  
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    createPlaylist({ title, description }, {
      onSuccess: () => {
        setIsOpen(false);
        setTitle("");
        setDescription("");
      }
    });
  };

  if (!user) {
    return <div className="text-center py-10">Please log in to view your playlists.</div>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <PlaySquare className="h-6 w-6" />
          My Playlists
        </h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Playlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Playlist</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My Awesome Playlist" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" />
              </div>
              <Button type="submit" className="w-full" disabled={isCreating || !title.trim()}>
                {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Create
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {status === "pending" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="aspect-video rounded-xl" />
          ))}
        </div>
      ) : playlists?.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed">
          <PlaySquare className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-semibold">No playlists yet</h3>
          <p className="text-muted-foreground mt-1">Create your first playlist to save your favorite videos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlists?.map((playlist) => (
            <Link key={playlist._id} href={`/playlists/${playlist._id}`} className="group flex flex-col gap-2">
              <div className="relative aspect-video rounded-xl bg-muted overflow-hidden flex items-center justify-center">
                {(playlist.video?.length || 0) > 0 ? (
                  // Assuming the first video thumbnail can be used as playlist cover
                  // We might need to handle this based on API response structure
                  <div className="absolute inset-0 bg-secondary/80 flex items-center justify-center font-bold text-lg group-hover:bg-secondary/60 transition-colors">
                    {playlist.video?.length || 0} Videos
                  </div>
                ) : (
                  <PlaySquare className="h-12 w-12 text-muted-foreground opacity-50" />
                )}
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 text-xs font-semibold rounded text-white flex items-center gap-1">
                  <PlaySquare className="h-3 w-3" />
                  {playlist.video?.length || 0}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">{playlist.title}</h3>
                <p className="text-xs text-muted-foreground">
                  Updated {formatDistanceToNow(new Date(playlist.updatedAt), { addSuffix: true })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
