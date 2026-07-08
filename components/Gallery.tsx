"use client";

import Image from "next/image";
import { galleryImages } from "@/content/site";
import { SectionHeading } from "./ui/SectionHeading";
import { ScrollReveal } from "./ui/ScrollReveal";

export function Gallery() {
  return (
    <section id="galerija" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-[#050510]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <SectionHeading
          title="Galerija"
          description="Pogledaj atmosferu Gamepub-a — gaming, druženje i neon energija."
          tag="Galerija"
        />

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {galleryImages.map((image, i) => (
            <ScrollReveal key={image.src} delay={(i % 4) * 0.05}>
              <div className="group relative aspect-square overflow-hidden rounded-xl border border-white/5">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050510]/90 via-[#050510]/20 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
                <div className="absolute inset-0 border border-transparent transition-all duration-500 group-hover:border-[#00E5FF]/40 group-hover:shadow-[0_0_30px_rgba(0,229,255,0.2)]" />
                <div className="absolute right-0 bottom-0 left-0 p-4">
                  <span className="font-gaming text-xs tracking-[0.15em] text-[#00E5FF] uppercase">
                    {image.category}
                  </span>
                  <p className="mt-1 text-xs text-[#B8B8C8]">{image.alt}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
