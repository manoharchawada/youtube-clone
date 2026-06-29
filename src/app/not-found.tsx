import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlaySquare } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <PlaySquare className="h-24 w-24 text-muted-foreground mb-6" />
      <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-lg text-muted-foreground mb-8">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Button asChild size="lg">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
