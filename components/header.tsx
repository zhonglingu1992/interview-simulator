"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProfile } from "@/lib/profile";

export function Header() {
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    setHasProfile(getProfile() !== null);
  }, []);

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-5xl mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="font-bold text-lg tracking-tight">
          InterviewPrep AI
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            href="/profile"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            Profile
            {hasProfile && (
              <span className="w-2 h-2 rounded-full bg-green-500" />
            )}
          </Link>
          <Link
            href="/practice"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Practice
          </Link>
        </nav>
      </div>
    </header>
  );
}
