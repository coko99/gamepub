"use client";

import { Gamepad2, Circle, Target, Monitor, Maximize2 } from "lucide-react";
import { facilityStats } from "@/content/site";
import { useMounted } from "@/hooks/useMounted";

const iconMap = {
  gamepad: Gamepad2,
  sony: Monitor,
  billiard: Circle,
  dart: Target,
  space: Maximize2,
};

/** Kompaktna neon traka u hero sekciji — samo glavne brojke */
const heroStats = facilityStats.filter((s) =>
  ["space", "gamepad", "sony", "billiard", "dart"].includes(s.icon),
);

export function HeroStats() {
  const mounted = useMounted();
  const mobilePillClass =
    "rounded-full border border-white/10 bg-[#0b0b18] px-3 py-2";

  if (!mounted) {
    return (
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2 md:gap-3">
        {heroStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[#B8B8C8]"
          >
            <span className="font-gaming font-bold text-white">{stat.value}</span>{" "}
            {stat.suffix ?? ""} {stat.label}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2 md:mt-10 md:gap-3">
      {heroStats.map((stat, i) => {
        const Icon = iconMap[stat.icon as keyof typeof iconMap];

        return (
          <div
            key={stat.label}
            className={`hero-stat-pill group flex items-center gap-2 ${mobilePillClass} md:px-4 md:py-2.5`}
            style={
              {
                borderColor: `${stat.glow}44`,
                boxShadow: mounted ? `0 0 20px ${stat.glow}22` : "none",
                animationDelay: `${i * 0.2}s`,
              } as React.CSSProperties
            }
          >
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${stat.gradient} shadow-[0_0_12px_var(--stat-glow)]`}
              style={{ "--stat-glow": stat.glow } as React.CSSProperties}
            >
              <Icon className="neon-icon-glow h-3.5 w-3.5 text-white" style={{ "--icon-glow": stat.glow } as React.CSSProperties} />
            </span>
            <span className="text-left leading-tight">
              <span
                className={`font-gaming block text-sm font-bold md:text-base bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
              >
                {stat.value}
                {stat.suffix}
              </span>
              <span className="block text-[10px] tracking-wide text-[#B8B8C8] uppercase md:text-[11px]">
                {stat.label}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
