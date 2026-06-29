"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

export function VideoUploadDialog() {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post("/media/create-video", formData);
      return data.data;
    },
    onSuccess: () => {
      toast.success("Video uploaded successfully!");
      setIsOpen(false);
      setTitle("");
      setDescription("");
      setVideoFile(null);
      setThumbnail(null);
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
    onError: () => {
      toast.error("Failed to upload video.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile || !thumbnail || !title) {
      toast.error("Please provide a title, video file, and thumbnail.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnail);

    uploadMutation.mutate(formData);
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Upload</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Video</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="videoFile">Video File</Label>
            <Input id="videoFile" type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail</Label>
            <Input id="thumbnail" type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} required />
          </div>
          <Button type="submit" className="w-full" disabled={uploadMutation.isPending}>
            {uploadMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Upload
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
