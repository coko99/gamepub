"use client";

import Image from "next/image";
import { Gamepad2, Circle, Target, LucideIcon } from "lucide-react";
import { activitiesContent, sonyRentalContent } from "@/content/site";
import { NeonButton } from "./ui/NeonButton";
import { SectionHeading } from "./ui/SectionHeading";
import { ScrollReveal } from "./ui/ScrollReveal";

const iconMap: Record<string, LucideIcon> = {
  gamepad: Gamepad2,
  circle: Circle,
  target: Target,
};

const accentStyles = {
  cyan: {
    border: "hover:border-[#00E5FF]/50",
    glow: "group-hover:shadow-[0_0_50px_rgba(0,229,255,0.2)]",
    icon: "text-[#00E5FF]",
    gradient: "from-[#00E5FF]/20 to-[#2F6BFF]/20",
    line: "from-[#00E5FF] to-[#2F6BFF]",
  },
  purple: {
    border: "hover:border-[#6C2DFF]/50",
    glow: "group-hover:shadow-[0_0_50px_rgba(108,45,255,0.2)]",
    icon: "text-[#6C2DFF]",
    gradient: "from-[#6C2DFF]/20 to-[#FF2BD6]/20",
    line: "from-[#6C2DFF] to-[#FF2BD6]",
  },
  pink: {
    border: "hover:border-[#FF2BD6]/50",
    glow: "group-hover:shadow-[0_0_50px_rgba(255,43,214,0.2)]",
    icon: "text-[#FF2BD6]",
    gradient: "from-[#FF2BD6]/20 to-[#6C2DFF]/20",
    line: "from-[#FF2BD6] to-[#6C2DFF]",
  },
};

export function Activities({ compactIntro = false }: { compactIntro?: boolean }) {
  return (
    <section id="aktivnosti" className="relative py-16 md:py-24">
      <div className="absolute inset-0 bg-[#080816]" />
      <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-[#00E5FF]/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {!compactIntro && (
          <SectionHeading title={activitiesContent.title} tag="Aktivnosti" />
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {activitiesContent.cards.map((card, i) => {
            const Icon = iconMap[card.icon];
            const style = accentStyles[card.accent];
            return (
              <ScrollReveal key={card.title} delay={i * 0.15}>
                <div
                  className={`glass-card group relative overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-3 ${style.border} ${style.glow}`}
                >
                  <div className="relative h-40 overflow-hidden md:h-44">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101024] via-[#101024]/40 to-transparent" />
                  </div>

                  <div className="relative p-6 md:p-8">
                  {/* Animated scan line */}
                  <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div
                      className={`absolute h-px w-full bg-gradient-to-r ${style.line} animate-scan`}
                    />
                  </div>

                  <div
                    className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${style.gradient}`}
                  >
                    <Icon className={`h-8 w-8 ${style.icon}`} />
                  </div>

                  <span className="font-gaming mb-2 block text-xs tracking-[0.2em] text-[#00E5FF] uppercase">
                    {card.stat}
                  </span>
                  <h3 className="font-heading mb-3 text-xl font-bold text-white md:text-2xl">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#B8B8C8] md:text-base">
                    {card.description}
                  </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={0.2} className="mt-10">
          <div className="glass-card relative overflow-hidden rounded-2xl border border-[#6C2DFF]/25 p-6 md:flex md:items-center md:justify-between md:gap-8 md:p-8">
            <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[#6C2DFF]/15 blur-3xl" />
            <div className="relative max-w-2xl">
              <span className="font-gaming text-xs tracking-[0.2em] text-[#FF2BD6] uppercase">
                Dodatna ponuda
              </span>
              <h3 className="font-heading mt-2 text-xl font-bold text-white md:text-2xl">
                {sonyRentalContent.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#B8B8C8] md:text-base">
                {sonyRentalContent.description}
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {sonyRentalContent.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-[#B8B8C8]">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#00E5FF]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative mt-6 shrink-0 md:mt-0">
              <NeonButton href="/kontakt" variant="secondary" className="w-full md:w-auto">
                {sonyRentalContent.cta}
              </NeonButton>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
