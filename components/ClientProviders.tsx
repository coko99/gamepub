"use client";

import { HashScrollHandler } from "@/components/HashScrollHandler";
import { GamepubPreloader } from "@/components/preloader/GamepubPreloader";
import { ScrollToTop } from "@/components/ScrollToTop";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GamepubPreloader />
      <ScrollToTop />
      <HashScrollHandler />
      {children}
    </>
  );
}
