"use client";

import { HashScrollHandler } from "@/components/HashScrollHandler";
import { PageTransitionSweep } from "@/components/layout/PageTransitionSweep";
import { GamepubPreloader } from "@/components/preloader/GamepubPreloader";
import { ScrollToTop } from "@/components/ScrollToTop";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GamepubPreloader />
      <PageTransitionSweep />
      <ScrollToTop />
      <HashScrollHandler />
      {children}
    </>
  );
}
