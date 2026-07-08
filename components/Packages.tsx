"use client";

import { Check, Star } from "lucide-react";
import { packagesContent } from "@/content/site";
import { SectionHeading } from "./ui/SectionHeading";
import { NeonButton } from "./ui/NeonButton";
import { ScrollReveal } from "./ui/ScrollReveal";

export function Packages({ compactIntro = false }: { compactIntro?: boolean }) {
  return (
    <section id="ponuda" className="relative py-16 md:py-24">
      <div className="absolute inset-0 bg-[#080816]" />
      <div className="absolute top-1/2 left-0 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6C2DFF]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {!compactIntro && (
          <SectionHeading
            title={packagesContent.title}
            description={packagesContent.subtitle}
            tag="Ponuda"
          />
        )}

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {packagesContent.packages.map((pkg, i) => (
            <ScrollReveal key={pkg.name} delay={i * 0.1}>
              <div
                className={`glass-card relative flex h-full flex-col rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 ${
                  pkg.featured
                    ? "border-[#00E5FF]/40 shadow-[0_0_40px_rgba(0,229,255,0.15)]"
                    : "hover:border-[#6C2DFF]/40"
                }`}
              >
                {pkg.featured && (
                  <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-gradient-to-r from-[#6C2DFF] to-[#00E5FF] px-4 py-1 text-xs font-semibold text-white">
                    <Star className="h-3 w-3 fill-white" />
                    Popularno
                  </div>
                )}

                <span className="font-gaming text-xs tracking-[0.2em] text-[#00E5FF] uppercase">
                  {pkg.tagline}
                </span>
                <h3 className="font-heading mt-2 text-2xl font-bold text-white">
                  {pkg.name}
                </h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-[#B8B8C8] md:text-base">
                  {pkg.description}
                </p>

                <ul className="mt-6 space-y-3">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00E5FF]" />
                      <span className="text-sm text-[#B8B8C8]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <NeonButton
                    href="/kontakt"
                    variant={pkg.featured ? "primary" : "outline"}
                    className="w-full"
                  >
                    {pkg.cta}
                  </NeonButton>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
