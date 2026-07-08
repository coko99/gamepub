"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { birthdaysContent } from "@/content/site";
import { NeonButton } from "./ui/NeonButton";
import { ScrollReveal } from "./ui/ScrollReveal";

export function Birthdays({ compactIntro = false }: { compactIntro?: boolean }) {
  return (
    <section id="rodjendani" className="relative overflow-hidden py-16 md:py-24">
      <div className="absolute inset-0 bg-[#050510]" />
      <div className="absolute top-1/2 right-0 h-[500px] w-[500px] translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF2BD6]/10 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <ScrollReveal direction="left">
            {!compactIntro && (
              <>
                <span className="font-gaming mb-4 inline-block text-xs tracking-[0.2em] text-[#FF2BD6] uppercase">
                  Rođendani
                </span>
                <h2 className="font-heading text-3xl leading-tight font-bold text-white md:text-4xl lg:text-5xl">
                  {birthdaysContent.title}
                </h2>
                <p className="mt-6 text-base leading-relaxed text-[#B8B8C8] md:text-lg">
                  {birthdaysContent.description}
                </p>
              </>
            )}

            <ul className={`space-y-3 ${compactIntro ? "" : "mt-8"}`}>
              {birthdaysContent.highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6C2DFF]/20">
                    <Check className="h-3 w-3 text-[#00E5FF]" />
                  </span>
                  <span className="text-sm text-[#B8B8C8] md:text-base">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <NeonButton href="/kontakt" variant="secondary">
                {birthdaysContent.cta}
              </NeonButton>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.2}>
            <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#6C2DFF]/30 shadow-[0_0_40px_rgba(108,45,255,0.15)]">
              <Image
                src={birthdaysContent.image}
                alt={birthdaysContent.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050510]/80 via-transparent to-transparent" />
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#FF2BD6] via-[#6C2DFF] to-[#00E5FF]" />
              <div className="absolute bottom-4 left-4">
                <span className="font-gaming text-xs tracking-[0.25em] text-[#00E5FF] uppercase">
                  Birthday Arena
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
