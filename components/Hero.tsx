"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { heroContent, siteMedia } from "@/content/site";
import { useMounted } from "@/hooks/useMounted";
import { NeonButton } from "./ui/NeonButton";
import { HeroStats } from "./HeroStats";
import { HeroNeonTitle } from "./HeroNeonTitle";

export function Hero() {
  const mounted = useMounted();
  const prefersReducedMotion = useReducedMotion();
  const animate = mounted && !prefersReducedMotion;

  const badge = (
    <span className="font-gaming mb-6 inline-flex items-center gap-2 rounded-full border border-[#6C2DFF]/30 bg-[#6C2DFF]/10 px-4 py-2 text-xs tracking-[0.25em] text-[#00E5FF] uppercase">
      <Sparkles className="h-3.5 w-3.5" />
      Kruševac · Gaming Arena
    </span>
  );

  const title = <HeroNeonTitle />;

  const subtitle = (
    <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#B8B8C8] md:mt-8 md:text-xl">
      {heroContent.subtitle}
    </p>
  );

  const ctas = (
    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
      <NeonButton href="/kontakt" className="w-full sm:w-auto">
        {heroContent.ctaPrimary}
      </NeonButton>
      <NeonButton href="/ponuda" variant="outline" className="w-full sm:w-auto">
        {heroContent.ctaSecondary}
      </NeonButton>
    </div>
  );

  const stats = <HeroStats />;

  return (
    <section
      id="pocetna"
      className="relative flex min-h-screen items-center overflow-hidden pt-20"
    >
      <div className="absolute inset-0 bg-[#050510]">
        <Image
          src={siteMedia.heroBackground}
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-105 object-cover object-center blur-[6px] brightness-[0.35] saturate-[1.15]"
        />
        <div className="hero-gradient absolute inset-0 opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#6C2DFF]/20 blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-[#00E5FF]/15 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF2BD6]/10 blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {animate ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {badge}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
              >
                {title}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {subtitle}
                {stats}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.45 }}
              >
                {ctas}
              </motion.div>
            </>
          ) : (
            <>
              {badge}
              {title}
              {subtitle}
              {stats}
              {ctas}
            </>
          )}
        </div>
      </div>

      <div className="absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-[#050510] to-transparent" />
    </section>
  );
}
