"use client";

import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { usePathname } from "next/navigation";
import { Home, PlaySquare, Settings, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Home", href: "/", icon: Home },
  { name: "Profile", href: "/profile", icon: UserIcon },
  { name: "Playlists", href: "/playlists", icon: PlaySquare },
  { name: "Settings", href: "/settings", icon: Settings },
];

function MobileNav() {
  const pathname = usePathname();
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t h-16 flex items-center justify-around z-50">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-xs gap-1",
              isActive ? "text-primary font-medium" : "text-muted-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) {
    return <main className="flex-1 flex flex-col">{children}</main>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 pt-16 md:pl-64">
        <Sidebar />
        <main className="flex-1 w-full flex flex-col bg-muted/20 pb-16 md:pb-0">
          <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
