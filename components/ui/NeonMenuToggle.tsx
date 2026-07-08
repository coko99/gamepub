"use client";

import { motion } from "framer-motion";

interface NeonMenuToggleProps {
  open: boolean;
  onClick: () => void;
  label?: string;
}

export function NeonMenuToggle({
  open,
  onClick,
  label = "Meni",
}: NeonMenuToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative z-50 flex h-12 w-12 items-center justify-center lg:hidden"
      aria-label={open ? "Zatvori meni" : "Otvori meni"}
      aria-expanded={open}
    >
      <motion.span
        className="pointer-events-none absolute inset-0 rounded-2xl border border-[#00E5FF]/40 bg-[#00E5FF]/5"
        animate={{
          boxShadow: open
            ? [
                "0 0 20px rgba(255,43,214,0.5)",
                "0 0 32px rgba(0,229,255,0.45)",
                "0 0 20px rgba(255,43,214,0.5)",
              ]
            : [
                "0 0 16px rgba(0,229,255,0.35)",
                "0 0 28px rgba(108,45,255,0.45)",
                "0 0 16px rgba(0,229,255,0.35)",
              ],
        }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.span
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#6C2DFF]/20 to-[#00E5FF]/10"
        animate={{ y: open ? 0 : [0, -3, 0, 3, 0] }}
        transition={
          open
            ? { duration: 0.25 }
            : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
        }
      />

      <span className="relative flex flex-col items-center justify-center gap-1.5">
        {open ? (
          <>
            <motion.span
              initial={{ rotate: 0, y: 0 }}
              animate={{ rotate: 45, y: 4 }}
              className="block h-0.5 w-5 rounded-full bg-[#FF2BD6] shadow-[0_0_10px_#FF2BD6]"
            />
            <motion.span
              initial={{ opacity: 1 }}
              animate={{ opacity: 0, scaleX: 0 }}
              className="block h-0.5 w-3 rounded-full bg-[#00E5FF]"
            />
            <motion.span
              initial={{ rotate: 0, y: 0 }}
              animate={{ rotate: -45, y: -4 }}
              className="block h-0.5 w-5 rounded-full bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]"
            />
          </>
        ) : (
          <>
            <motion.span
              className="block h-1.5 w-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_12px_#00E5FF]"
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.span
              className="block h-2 w-2 rounded-full bg-[#6C2DFF] shadow-[0_0_14px_#6C2DFF]"
              animate={{ y: [4, -6, 4] }}
              transition={{
                duration: 1.9,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.15,
              }}
            />
            <motion.span
              className="block h-1.5 w-1.5 rounded-full bg-[#FF2BD6] shadow-[0_0_12px_#FF2BD6]"
              animate={{ y: [-4, 6, -4] }}
              transition={{
                duration: 1.7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3,
              }}
            />
          </>
        )}
      </span>

      <span className="font-gaming pointer-events-none absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.25em] text-[#00E5FF]/80 uppercase">
        {open ? "Zatvori" : label}
      </span>
    </button>
  );
}
