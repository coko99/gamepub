"use client";

import { Gamepad2, Circle, Target, Monitor, Wind, Maximize2 } from "lucide-react";
import { facilityStats, facilityStatsContent } from "@/content/site";
import { useMounted } from "@/hooks/useMounted";
import { ScrollReveal } from "./ui/ScrollReveal";

const iconMap = {
  gamepad: Gamepad2,
  sony: Monitor,
  billiard: Circle,
  dart: Target,
  space: Maximize2,
  wind: Wind,
};

export function FacilityStats() {
  const mounted = useMounted();

  return (
    <section id="ponuda-brojke" className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 bg-[#050510]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(108,45,255,0.12)_0%,transparent_65%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00E5FF]/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#FF2BD6]/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <ScrollReveal className="mb-12 text-center md:mb-16">
          <span className="font-gaming mb-4 inline-block rounded-full border border-[#00E5FF]/40 bg-[#00E5FF]/10 px-4 py-1.5 text-xs tracking-[0.25em] text-[#00E5FF] uppercase">
            Gamepub u brojkama
          </span>
          <h2 className="font-heading text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            {facilityStatsContent.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#B8B8C8] md:text-lg">
            {facilityStatsContent.subtitle}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-5">
          {facilityStats.map((stat, i) => {
            const Icon = iconMap[stat.icon];

            return (
              <ScrollReveal key={stat.label} delay={i * 0.07}>
                <div
                  className="neon-stat-card group relative overflow-hidden rounded-2xl border border-white/10 bg-[#080816]/80 p-5 text-center backdrop-blur-sm md:p-6"
                  style={
                    {
                      "--stat-glow": stat.glow,
                    } as React.CSSProperties
                  }
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(circle at 50% 30%, ${stat.glow}22 0%, transparent 70%)`,
                    }}
                  />

                  <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center md:h-[4.5rem] md:w-[4.5rem]">
                    <div
                      className={`neon-icon-ring absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.gradient} opacity-20`}
                      style={{ animationDelay: `${i * 0.35}s` }}
                    />
                    <div
                      className="neon-icon-pulse absolute inset-1 rounded-xl border"
                      style={{
                        borderColor: `${stat.glow}55`,
                        animationDelay: `${i * 0.35}s`,
                      }}
                    />
                    <div
                      className={`relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-[0_0_25px_var(--stat-glow)] md:h-14 md:w-14`}
                    >
                      <Icon
                        className={`h-6 w-6 text-white md:h-7 md:w-7 ${mounted ? "neon-icon-glow" : ""}`}
                        style={
                          {
                            "--icon-glow": stat.glow,
                            animationDelay: `${i * 0.35}s`,
                          } as React.CSSProperties
                        }
                      />
                    </div>
                  </div>

                  <p
                    className={`neon-stat-value font-gaming text-3xl leading-none font-bold md:text-4xl lg:text-[2.75rem] bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                    style={{ filter: mounted ? `drop-shadow(0 0 12px ${stat.glow}88)` : undefined }}
                  >
                    {stat.value}
                    {stat.suffix && (
                      <span className="ml-0.5 text-xl md:text-2xl">{stat.suffix}</span>
                    )}
                  </p>
                  <p className="mt-2 text-[11px] leading-snug font-medium tracking-wide text-[#B8B8C8] uppercase md:text-xs">
                    {stat.label}
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
