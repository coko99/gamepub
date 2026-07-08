"use client";

import {
  Cake,
  Gamepad2,
  Target,
  Users,
  LucideIcon,
} from "lucide-react";
import { whyContent } from "@/content/site";
import { SectionHeading } from "./ui/SectionHeading";
import { ScrollReveal } from "./ui/ScrollReveal";

const iconMap: Record<string, LucideIcon> = {
  cake: Cake,
  gamepad: Gamepad2,
  target: Target,
  users: Users,
};

export function WhyGamepub() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-[#080816]" />
      <div className="absolute top-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#6C2DFF]/50 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <SectionHeading
          title={whyContent.title}
          description={whyContent.description}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyContent.cards.map((card, i) => {
            const Icon = iconMap[card.icon];
            return (
              <ScrollReveal key={card.title} delay={i * 0.1}>
                <div className="glass-card group h-full rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:border-[#00E5FF]/40 hover:shadow-[0_0_40px_rgba(0,229,255,0.15)] md:p-8">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#6C2DFF]/20 to-[#00E5FF]/20 transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(108,45,255,0.4)]">
                    <Icon className="h-7 w-7 text-[#00E5FF]" />
                  </div>
                  <h3 className="font-heading mb-3 text-lg font-bold text-white md:text-xl">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#B8B8C8] md:text-base">
                    {card.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
