"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getProfile } from "@/lib/profile";

export function HeroCTA() {
  const [href, setHref] = useState("/profile");

  useEffect(() => {
    if (getProfile() !== null) {
      setHref("/practice");
    }
  }, []);

  return (
    <Link href={href}>
      <Button size="lg" className="text-base px-8 py-6">
        Start Practicing
      </Button>
    </Link>
  );
}
