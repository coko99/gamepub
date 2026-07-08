import { Star } from "lucide-react";
import { locationContent, siteConfig } from "@/content/site";
import { NeonButton } from "./ui/NeonButton";
import { ScrollReveal } from "./ui/ScrollReveal";
import { SectionHeading } from "./ui/SectionHeading";

export function Location() {
  return (
    <section id="lokacija" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-[#050510]" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#00E5FF]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <SectionHeading
          title={locationContent.title}
          description={locationContent.description}
          tag="Lokacija"
        />

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <ScrollReveal>
            <div className="overflow-hidden rounded-2xl border border-[#00E5FF]/20 shadow-[0_0_40px_rgba(0,229,255,0.08)]">
              <iframe
                src={siteConfig.mapEmbed}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "380px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Gamepub Kruševac lokacija"
                className="aspect-video w-full min-h-[380px] bg-[#101024]"
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <NeonButton
                href={siteConfig.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1"
              >
                {locationContent.openMaps}
              </NeonButton>
              <NeonButton
                href={siteConfig.googleReview}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                className="w-full sm:flex-1"
              >
                {locationContent.leaveReview}
              </NeonButton>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="glass-card flex h-full flex-col rounded-2xl p-6 md:p-8">
              <span className="font-gaming text-xs tracking-[0.2em] text-[#00E5FF] uppercase">
                {locationContent.reviewsTitle}
              </span>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(Number(siteConfig.googleRating))
                          ? "fill-[#00E5FF] text-[#00E5FF]"
                          : "text-[#1A1A2E]"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-heading text-2xl font-bold text-white">
                  {siteConfig.googleRating}
                </span>
              </div>

              <p className="mt-2 text-sm text-[#B8B8C8]">
                {siteConfig.googleReviewCount} Google recenzija
              </p>

              <p className="mt-6 text-base leading-relaxed text-[#B8B8C8]">
                {locationContent.reviewsDescription}
              </p>

              <div className="mt-6 space-y-4 border-t border-white/5 pt-6">
                <div>
                  <p className="text-xs tracking-wider text-[#B8B8C8]/70 uppercase">
                    Adresa
                  </p>
                  <a
                    href={siteConfig.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block font-semibold text-white transition-colors hover:text-[#00E5FF]"
                  >
                    {siteConfig.address}
                  </a>
                </div>

                <div>
                  <p className="text-xs tracking-wider text-[#B8B8C8]/70 uppercase">
                    Instagram
                  </p>
                  <a
                    href={siteConfig.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block font-semibold text-white transition-colors hover:text-[#FF2BD6]"
                  >
                    {siteConfig.instagram}
                  </a>
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-3 pt-8">
                <NeonButton
                  href={siteConfig.googleReview}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                >
                  {locationContent.leaveReview}
                </NeonButton>
                <NeonButton
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                >
                  Prati nas na Instagramu
                </NeonButton>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
