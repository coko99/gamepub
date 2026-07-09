"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { galleryImages, galleryShowcaseContent } from "@/content/site";
import { SectionHeading } from "./ui/SectionHeading";

const MARQUEE_IMAGES = [...galleryImages, ...galleryImages];

export function GalleryShowcase({ compactIntro = false }: { compactIntro?: boolean }) {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const node = marqueeRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 bg-[#080816]" />
      <div className="absolute top-1/2 left-1/2 hidden h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6C2DFF]/10 blur-[140px] md:block" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {!compactIntro && (
          <SectionHeading
            title={galleryShowcaseContent.title}
            description={galleryShowcaseContent.description}
            tag="Atmosfera"
          />
        )}

        <div
          ref={marqueeRef}
          className={`gallery-marquee -mx-4 md:mx-0 ${paused ? "gallery-marquee-paused" : ""} ${isMobile ? "gallery-marquee-mobile" : ""}`}
        >
          <div className="gallery-marquee-track flex flex-nowrap gap-4 md:gap-5">
            {(isMobile ? galleryImages : MARQUEE_IMAGES).map((image, index) => (
              <div
                key={`${image.src}-${index}`}
                className="gallery-marquee-item relative shrink-0"
              >
                <div className="relative h-52 w-[min(78vw,18rem)] overflow-hidden rounded-2xl border-2 border-[#00E5FF]/35 shadow-[0_0_35px_rgba(0,229,255,0.25),0_0_70px_rgba(108,45,255,0.15)] md:h-64 md:w-80">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 768px) 78vw, 320px"
                    draggable={false}
                    loading="lazy"
                    className="pointer-events-none object-cover select-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050510]/70 via-transparent to-transparent" />
                  <div className="absolute right-0 bottom-0 left-0 p-4">
                    <span className="font-gaming text-xs tracking-[0.2em] text-[#00E5FF] uppercase">
                      {image.category}
                    </span>
                    <p className="mt-1 text-sm text-white/90">{image.alt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
