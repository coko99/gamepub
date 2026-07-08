"use client";

import { useReducedMotion } from "framer-motion";
import { Bot, X } from "lucide-react";
import { reservationBotContent } from "@/content/reservationBot";
import { useMounted } from "@/hooks/useMounted";

interface BotOrbitTriggerProps {
  open: boolean;
  onClick: () => void;
  docked: boolean;
}

export function BotOrbitTrigger({ open, onClick, docked }: BotOrbitTriggerProps) {
  const mounted = useMounted();
  const prefersReducedMotion = useReducedMotion();

  if (!mounted) return null;

  const useOrbit = !docked && !prefersReducedMotion && !open;

  const button = (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#FF2BD6] via-[#6C2DFF] to-[#00E5FF] text-white shadow-[0_0_30px_rgba(255,43,214,0.45)] transition-transform hover:scale-105 md:h-[3.75rem] md:w-[3.75rem] ${
        useOrbit ? "bot-orbit-trigger" : ""
      }`}
      aria-label={
        open ? reservationBotContent.closeLabel : reservationBotContent.openLabel
      }
      aria-expanded={open}
    >
      {open ? <X className="h-6 w-6" /> : <Bot className="h-7 w-7" />}
      {!open && (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#25D366] px-1 text-[10px] font-bold shadow-[0_0_10px_#25D366]">
          ?
        </span>
      )}
    </button>
  );

  if (useOrbit) {
    return (
      <>
        <div
          className="bot-orbit-trail pointer-events-none fixed inset-3 z-[45] rounded-[1.75rem] border border-[#FF2BD6]/15 md:inset-5 md:rounded-[2rem]"
          aria-hidden
        />
        <div className="bot-orbit-track pointer-events-none fixed inset-3 z-[48] md:inset-5">
          <div className="bot-orbit-mover pointer-events-auto">{button}</div>
        </div>
      </>
    );
  }

  return button;
}
