"use client";

import { heroContent } from "@/content/site";

export function HeroNeonTitle() {
  const [lead, location] = heroContent.title.split(" u ");

  return (
    <h1 className="hero-neon-title-wrap mt-6 text-4xl leading-[1.08] font-extrabold md:text-6xl lg:text-7xl">
      <span className="hero-neon-title-glow font-heading block" aria-hidden>
        {heroContent.title}
      </span>
      <span className="hero-neon-title font-heading relative block">
        <span className="hero-neon-line hero-neon-line--cyan">{lead}</span>
        <span className="hero-neon-line hero-neon-line--pink mt-1 block md:mt-2">
          u {location}
        </span>
      </span>
    </h1>
  );
}
