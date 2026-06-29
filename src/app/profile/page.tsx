"use client";

import { useProfile, useUpdateAvatar, useUpdateCoverImage, useUpdateProfile } from "@/features/profile/api/useProfile";
import { useAuthStore } from "@/store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Edit2, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import Image from "next/image";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { data: profile, status } = useProfile();
  
  const { mutate: updateAvatar, isPending: isUpdatingAvatar } = useUpdateAvatar();
  const { mutate: updateCover, isPending: isUpdatingCover } = useUpdateCoverImage();
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.fullName || user?.fullName || "");
  const [email, setEmail] = useState(profile?.email || user?.email || "");

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  if (status === "pending") {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!user || !profile) {
    return <div className="text-center py-10">Please log in to view your profile.</div>;
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateAvatar(e.target.files[0]);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateCover(e.target.files[0]);
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ fullName, email }, {
      onSuccess: () => setIsEditing(false)
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="relative w-full h-48 md:h-64 bg-muted rounded-xl overflow-hidden group">
        {profile.coverImage ? (
          <Image src={profile.coverImage} alt="Cover" fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/20 to-secondary/20" />
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button variant="secondary" onClick={() => coverInputRef.current?.click()} disabled={isUpdatingCover}>
            {isUpdatingCover ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Camera className="h-4 w-4 mr-2" /> Change Cover</>}
          </Button>
          <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={handleCoverChange} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 px-4 md:px-8 -mt-12 md:-mt-16 relative z-10 items-start">
        <div className="relative group rounded-full">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shrink-0 bg-muted">
            <AvatarImage src={profile.avatar} />
            <AvatarFallback className="text-3xl">{profile.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
             {isUpdatingAvatar ? <Loader2 className="h-6 w-6 text-white animate-spin" /> : <Camera className="h-6 w-6 text-white" />}
          </div>
          <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
        </div>

        <div className="flex flex-col flex-1 mt-2 md:mt-16">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold">{profile.fullName}</h1>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
              <Edit2 className="h-4 w-4 mr-2" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
          <p className="text-muted-foreground">@{profile.username}</p>
          <p className="text-sm mt-2 text-muted-foreground">{profile.email}</p>
        </div>
      </div>

      {isEditing && (
        <form onSubmit={handleProfileSubmit} className="mt-8 space-y-4 max-w-xl px-4 md:px-8">
          <h3 className="text-lg font-semibold">Edit Profile Details</h3>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button type="submit" disabled={isUpdatingProfile}>
            {isUpdatingProfile ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      )}

      <div className="px-4 md:px-8 mt-8">
        <h3 className="text-xl font-bold mb-4">My Videos</h3>
        <p className="text-sm text-muted-foreground">Your uploaded videos will appear here.</p>
      </div>
    </div>
  );
}
