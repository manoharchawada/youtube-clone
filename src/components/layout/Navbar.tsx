"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Bell, Menu, PlaySquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { useLogout } from "@/features/auth/api/useLogout";
import { VideoUploadDialog } from "@/components/video/VideoUploadDialog";

export function Navbar() {
  const { user } = useAuthStore();
  const router = useRouter();

  const { mutate: logoutUser } = useLogout();

  const handleLogout = () => {
    logoutUser();
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search");
    if (query) {
      router.push(`/?search=${query}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b z-50 px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <Link href="/" className="flex items-center gap-1 font-bold text-lg tracking-tighter">
          <PlaySquare className="h-8 w-8 text-red-600" />
          <span className="hidden sm:inline-block">YouTube</span>
        </Link>
      </div>

      <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-xl items-center mx-4 gap-2">
        <div className="flex w-full items-center">
          <Input 
            name="search"
            placeholder="Search" 
            className="rounded-r-none focus-visible:ring-0 border-r-0"
          />
          <Button type="submit" variant="outline" className="rounded-l-none bg-muted/50 px-5">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>

      <div className="flex items-center gap-2 sm:gap-4">
        <Button variant="ghost" size="icon" className="sm:hidden">
          <Search className="h-5 w-5" />
        </Button>
        
        {user ? (
          <>
            <VideoUploadDialog />
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || ""} alt={user?.username || "User"} />
                    <AvatarFallback>{user?.username ? user.username.charAt(0).toUpperCase() : "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.fullName || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      @{user?.username || "username"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign up</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
