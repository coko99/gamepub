"use client";

import { useEffect } from "react";
import { HashScrollHandler } from "@/components/HashScrollHandler";
import { GamepubPreloader } from "@/components/preloader/GamepubPreloader";
import { ScrollToTop } from "@/components/ScrollToTop";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.style.overflow = "";
  }, []);

  return (
    <>
      <GamepubPreloader />
      <ScrollToTop />
      <HashScrollHandler />
      {children}
    </>
  );
}
