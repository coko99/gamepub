"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Beer, Coffee, Gamepad2, Target } from "lucide-react";
import { heroContent } from "@/content/site";
import { useMounted } from "@/hooks/useMounted";

type Drift = {
  x: number[];
  y: number[];
  rotate?: number[];
};

type FloatingItem = {
  id: string;
  className: string;
  delay: number;
  duration: number;
  drift: Drift;
  glow: string;
  border: string;
  content: ReactNode;
};

function BilliardBall({ size = "md" }: { size?: "sm" | "md" }) {
  const dim = size === "sm" ? "h-9 w-9 text-xs" : "h-11 w-11 text-sm md:h-12 md:w-12 md:text-base";

  return (
    <div
      className={`flex ${dim} items-center justify-center rounded-full border-2 border-white/25 bg-[radial-gradient(circle_at_30%_25%,#4a4a4a,#0a0a0a)] shadow-[inset_-2px_-3px_6px_rgba(0,0,0,0.8)]`}
    >
      <span className="font-gaming font-bold text-white">8</span>
    </div>
  );
}

function FloatingIcon({
  item,
  animate,
}: {
  item: FloatingItem;
  animate: boolean;
}) {
  const { drift, delay, duration, className, glow, border, content } = item;
  const wrapperClass = `pointer-events-none absolute z-[5] ${className}`;

  const shell = (
    <div
      className="flex items-center justify-center rounded-2xl border backdrop-blur-sm transition-shadow duration-500"
      style={{
        borderColor: border,
        boxShadow: `0 0 28px ${glow}, inset 0 0 12px ${glow}`,
      }}
    >
      {content}
    </div>
  );

  if (!animate) {
    return <div className={wrapperClass}>{shell}</div>;
  }

  return (
    <motion.div
      className={wrapperClass}
      animate={{
        x: drift.x,
        y: drift.y,
        rotate: drift.rotate ?? [0, 6, -4, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {shell}
    </motion.div>
  );
}

const iconItems: FloatingItem[] = [
  {
    id: "sony",
    className: "top-[18%] left-[4%] sm:left-[6%] md:top-[22%] md:left-[8%]",
    delay: 0,
    duration: 7,
    drift: { x: [0, 24, 8, -12, 0], y: [0, -18, -28, -10, 0], rotate: [0, 8, -5, 3, 0] },
    glow: "rgba(0, 229, 255, 0.55)",
    border: "rgba(0, 229, 255, 0.45)",
    content: (
      <div className="flex h-10 w-10 items-center justify-center bg-[#00E5FF]/15 md:h-14 md:w-14">
        <Gamepad2 className="h-5 w-5 text-[#00E5FF] md:h-7 md:w-7" />
      </div>
    ),
  },
  {
    id: "pikado",
    className: "top-[12%] right-[4%] sm:right-[6%] md:top-[16%] md:right-[10%]",
    delay: 0.6,
    duration: 6.5,
    drift: { x: [0, -20, -8, 14, 0], y: [0, 14, -16, -8, 0], rotate: [0, -10, 6, -4, 0] },
    glow: "rgba(255, 43, 214, 0.5)",
    border: "rgba(255, 43, 214, 0.4)",
    content: (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF2BD6]/15 md:h-12 md:w-12">
        <Target className="h-5 w-5 text-[#FF2BD6] md:h-6 md:w-6" />
      </div>
    ),
  },
  {
    id: "bilijar",
    className: "bottom-[34%] left-[3%] sm:left-[5%] md:bottom-[38%] md:left-[11%]",
    delay: 1.1,
    duration: 8,
    drift: { x: [0, 16, 28, 6, 0], y: [0, -12, 8, -20, 0], rotate: [0, 12, -8, 5, 0] },
    glow: "rgba(108, 45, 255, 0.5)",
    border: "rgba(108, 45, 255, 0.4)",
    content: (
      <div className="p-1.5 md:p-2">
        <BilliardBall />
      </div>
    ),
  },
  {
    id: "kafa",
    className: "top-[42%] right-[3%] sm:right-[5%] md:top-[44%] md:right-[7%]",
    delay: 0.3,
    duration: 6,
    drift: { x: [0, -14, 10, -6, 0], y: [0, -22, -8, -26, 0], rotate: [0, -6, 8, -3, 0] },
    glow: "rgba(255, 159, 67, 0.55)",
    border: "rgba(255, 159, 67, 0.45)",
    content: (
      <div className="flex h-10 w-10 items-center justify-center bg-[#FF9F43]/15 md:h-12 md:w-12">
        <Coffee className="h-5 w-5 text-[#FF9F43] md:h-6 md:w-6" />
      </div>
    ),
  },
  {
    id: "pivo",
    className: "bottom-[22%] right-[4%] sm:right-[6%] md:bottom-[26%] md:right-[9%]",
    delay: 1.8,
    duration: 7.5,
    drift: { x: [0, -18, 6, 20, 0], y: [0, 10, -14, 6, 0], rotate: [0, 5, -9, 4, 0] },
    glow: "rgba(255, 179, 71, 0.55)",
    border: "rgba(255, 179, 71, 0.45)",
    content: (
      <div className="flex h-10 w-10 items-center justify-center bg-[#FFB347]/15 md:h-12 md:w-12">
        <Beer className="h-5 w-5 text-[#FFB347] md:h-6 md:w-6" />
      </div>
    ),
  },
];

const cardItems: FloatingItem[] = [
  {
    id: "card-game-night",
    className: "top-[58%] left-[6%] hidden sm:block md:top-[52%] md:left-[14%]",
    delay: 2,
    duration: 9,
    drift: { x: [0, 12, -6, 0], y: [0, -10, -18, 0] },
    glow: "rgba(0, 229, 255, 0.35)",
    border: "rgba(0, 229, 255, 0.4)",
    content: (
      <div className="bg-[#080816]/85 px-3 py-1.5 md:px-4 md:py-2">
        <span className="font-gaming text-[10px] tracking-widest text-[#00E5FF] md:text-xs">
          {heroContent.floatingCards[0]}
        </span>
      </div>
    ),
  },
  {
    id: "card-birthday",
    className: "bottom-[14%] right-[6%] hidden sm:block md:bottom-[16%] md:right-[14%]",
    delay: 2.4,
    duration: 8.5,
    drift: { x: [0, -10, 8, 0], y: [0, 8, -12, 0] },
    glow: "rgba(255, 43, 214, 0.35)",
    border: "rgba(255, 43, 214, 0.4)",
    content: (
      <div className="bg-[#080816]/85 px-3 py-1.5 md:px-4 md:py-2">
        <span className="font-gaming text-[10px] tracking-widest text-[#FF2BD6] md:text-xs">
          {heroContent.floatingCards[1]}
        </span>
      </div>
    ),
  },
];

export function HeroFloatingIcons() {
  const mounted = useMounted();
  const prefersReducedMotion = useReducedMotion();
  const animate = mounted && !prefersReducedMotion;

  return (
    <>
      {[...iconItems, ...cardItems].map((item) => (
        <FloatingIcon key={item.id} item={item} animate={animate} />
      ))}
    </>
  );
}
