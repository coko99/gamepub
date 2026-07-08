"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { gameNightContent, siteMedia } from "@/content/site";
import { useMounted } from "@/hooks/useMounted";
import { NeonButton } from "./ui/NeonButton";
import { ScrollReveal } from "./ui/ScrollReveal";

export function GameNight() {
  const mounted = useMounted();
  const prefersReducedMotion = useReducedMotion();
  const animate = mounted && !prefersReducedMotion;

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 bg-[#050510]">
        <Image
          src={siteMedia.gameNightBackground}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center blur-[8px] brightness-[0.25] saturate-[1.2]"
        />
        <div className="absolute inset-0 bg-[#050510]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(108,45,255,0.2)_0%,transparent_70%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <span className="font-gaming mb-4 inline-block text-xs tracking-[0.2em] text-[#00E5FF] uppercase">
            Game Night
          </span>
          <h2 className="font-heading text-3xl leading-tight font-bold text-white md:text-4xl lg:text-5xl">
            {gameNightContent.title}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-[#B8B8C8] md:text-lg">
            {gameNightContent.description}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2} className="mt-16 text-center">
          <div className="relative inline-block">
            {animate && (
              <motion.div
                className="absolute -inset-8 rounded-full bg-[#6C2DFF]/20 blur-3xl"
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            )}
            <h3 className="font-gaming neon-text relative text-4xl tracking-wider md:text-6xl lg:text-7xl">
              {gameNightContent.neonText}
            </h3>
          </div>
          <p className="mt-6 text-lg text-[#B8B8C8] md:text-xl">
            {gameNightContent.subtext}
          </p>
          <div className="mt-10">
            <NeonButton href="/kontakt">{gameNightContent.cta}</NeonButton>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
