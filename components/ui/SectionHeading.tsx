"use client";

import { ScrollReveal } from "./ScrollReveal";

interface SectionHeadingProps {
  title: string;
  description?: string;
  align?: "left" | "center";
  tag?: string;
}

export function SectionHeading({
  title,
  description,
  align = "center",
  tag,
}: SectionHeadingProps) {
  return (
    <ScrollReveal
      className={`mb-12 md:mb-16 ${align === "center" ? "text-center" : "text-left"}`}
    >
      {tag && (
        <span className="font-gaming mb-4 inline-block rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-4 py-1.5 text-xs tracking-[0.2em] text-[#00E5FF] uppercase">
          {tag}
        </span>
      )}
      <h2 className="font-heading text-3xl leading-tight font-bold text-white md:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#B8B8C8] md:mt-6 md:text-lg">
          {description}
        </p>
      )}
    </ScrollReveal>
  );
}
