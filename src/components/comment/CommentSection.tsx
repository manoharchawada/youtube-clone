"use client";

import {
  useComments,
  useCreateComment,
  useDeleteComment
} from "@/features/comment/api/useComments";
import { useAuthStore } from "@/store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export function CommentSection({ videoId }: { videoId: string }) {
  const { user } = useAuthStore();
  const { data, fetchNextPage, hasNextPage, status } = useComments(videoId);
  const { mutate: createComment, isPending: isCreating } =
    useCreateComment(videoId);
  const { mutate: deleteComment } = useDeleteComment(videoId);
  const [content, setContent] = useState("");
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    createComment(content, {
      onSuccess: () => setContent("")
    });
  };

  const comments = data?.pages.flatMap((p) => p) || [];

  return (
    <div className="mt-6 flex flex-col gap-6">
      <h3 className="text-xl font-bold">Comments</h3>

      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-4">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>
              {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2 w-full">
            <Input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Add a comment..."
              className="border-b-2 border-x-0 border-t-0 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary"
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setContent("")}>
                Cancel
              </Button>
              <Button type="submit" disabled={!content.trim() || isCreating}>
                Comment
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="text-sm text-muted-foreground p-4 bg-muted rounded-lg text-center">
          Please log in to add a comment.
        </div>
      )}

      <div className="flex flex-col gap-4">
        {status === "pending" ? (
          <div className="animate-pulse flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="h-10 w-10 bg-muted rounded-full" />
              <div className="h-10 w-full bg-muted rounded" />
            </div>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No comments yet.</p>
        ) : (
          comments.map((comment) => {
            const owner = Array.isArray(comment.owner)
              ? comment.owner[0]
              : comment.owner;
            return (
              <div key={comment._id} className="flex gap-4 group">
                <Avatar className="h-10 w-10 shrink-0 mt-1">
                  <AvatarImage src={owner?.avatar} />
                  <AvatarFallback>
                    {owner?.username?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col w-full">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      @{owner?.username}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true
                      })}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{comment.content}</p>
                </div>
                {user?._id === owner?._id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => deleteComment(comment._id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            );
          })
        )}

        {hasNextPage && (
          <div ref={ref} className="w-full flex justify-center py-4">
            <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
