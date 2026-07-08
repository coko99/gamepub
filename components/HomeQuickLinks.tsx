"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { homeQuickLinksContent } from "@/content/pages";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const accentStyles = {
  pink: {
    border: "hover:border-[#FF2BD6]/50",
    glow: "group-hover:shadow-[0_0_40px_rgba(255,43,214,0.2)]",
    tag: "text-[#FF2BD6] border-[#FF2BD6]/30 bg-[#FF2BD6]/10",
    arrow: "text-[#FF2BD6]",
  },
  cyan: {
    border: "hover:border-[#00E5FF]/50",
    glow: "group-hover:shadow-[0_0_40px_rgba(0,229,255,0.2)]",
    tag: "text-[#00E5FF] border-[#00E5FF]/30 bg-[#00E5FF]/10",
    arrow: "text-[#00E5FF]",
  },
  purple: {
    border: "hover:border-[#6C2DFF]/50",
    glow: "group-hover:shadow-[0_0_40px_rgba(108,45,255,0.2)]",
    tag: "text-[#6C2DFF] border-[#6C2DFF]/30 bg-[#6C2DFF]/10",
    arrow: "text-[#6C2DFF]",
  },
};

export function HomeQuickLinks() {
  const { title, subtitle, links } = homeQuickLinksContent;

  return (
    <section className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-[#080816]" />
      <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#6C2DFF]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <SectionHeading title={title} description={subtitle} tag="Navigacija" />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link, i) => {
            const style = accentStyles[link.accent];

            return (
              <ScrollReveal key={link.href} delay={i * 0.06}>
                <Link
                  href={link.href}
                  className={`group flex h-full flex-col rounded-2xl border border-white/10 bg-[#101024]/80 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${style.border} ${style.glow}`}
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <span
                      className={`font-gaming rounded-full border px-2.5 py-1 text-[10px] tracking-[0.2em] uppercase ${style.tag}`}
                    >
                      {link.tag}
                    </span>
                    <ArrowUpRight
                      className={`h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${style.arrow}`}
                    />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-white transition-colors group-hover:text-[#00E5FF]">
                    {link.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[#B8B8C8]">
                    {link.description}
                  </p>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
