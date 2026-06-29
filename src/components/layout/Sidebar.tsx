"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlaySquare, Settings, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Home", href: "/", icon: Home },
  { name: "My Profile", href: "/profile", icon: UserIcon },
  { name: "My Playlists", href: "/playlists", icon: PlaySquare },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 left-0 pt-16 border-r bg-background">
      <div className="flex flex-col flex-1 overflow-y-auto py-4 px-3 gap-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent",
                isActive ? "bg-accent font-semibold" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
