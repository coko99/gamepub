"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { scrollToSection } from "@/lib/scroll";
import { useMounted } from "@/hooks/useMounted";

/** Fixes hash scroll after hydration, route changes, and cross-page hash links */
export function HashScrollHandler() {
  const mounted = useMounted();
  const pathname = usePathname();

  useEffect(() => {
    if (!mounted || !window.location.hash) return;

    const hash = window.location.hash;

    window.scrollTo(0, 0);

    const timer = window.setTimeout(() => {
      scrollToSection(hash);
    }, 220);

    return () => window.clearTimeout(timer);
  }, [mounted, pathname]);

  return null;
}
