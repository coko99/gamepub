"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Scroll na vrh pri promeni stranice */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [pathname]);

  return null;
}
