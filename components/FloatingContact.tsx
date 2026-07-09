"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Bot, MessageCircle, Phone, X } from "lucide-react";
import { floatingContact, getContactLinks } from "@/content/site";
import { useMounted } from "@/hooks/useMounted";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ViberIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12.04 2c-5.03.03-9.08 4.1-9.1 9.12-.02 1.61-.05 4.62 2.94 5.48l-.03 1.73s-.03.79.49.95c.63.2 1-.41 1.6-1.05.33-.36.79-.88 1.14-1.27 3.14 1.31 5.55 1 5.55 1 2.05-.6 3.74-2.49 3.99-5.29.03-.28 1.02-6.89-3.05-8.15 0 0-1.08-.42-2.92-.43h-.01zm.05 1.8c1.6.01 2.62.37 2.62.37 2.48.97 2.48 6.66 2.45 6.87-.2 2.26-1.45 3.77-3.11 4.25-.04.01-1.99.35-4.62-.8 0 0-1.99 2.34-2.55 2.75-.35.29-.83.31-.83.31l-.01-2.92c-3.47-1.15-3.41-3.73-3.35-5.08.05-1.53.48-3.36 1.67-4.53 1.55-1.51 4.66-1.02 6.24-1.02h.49zm-1.2 3.6a1.05 1.05 0 00-1.05 1.05c0 .58.47 1.05 1.05 1.05s1.05-.47 1.05-1.05a1.05 1.05 0 00-1.05-1.05zm3.6 0a1.05 1.05 0 00-1.05 1.05c0 .58.47 1.05 1.05 1.05s1.05-.47 1.05-1.05a1.05 1.05 0 00-1.05-1.05zm-1.8 2.1a3.15 3.15 0 00-3.15 3.15 3.15 3.15 0 003.15 3.15 3.15 3.15 0 003.15-3.15 3.15 3.15 0 00-3.15-3.15z" />
    </svg>
  );
}

function OrbitDots({
  radius,
  count,
  duration,
  dotSize,
  colors,
}: {
  radius: number;
  count: number;
  duration: number;
  dotSize: number;
  colors: string[];
}) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      animate={{ rotate: 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
      aria-hidden
    >
      {Array.from({ length: count }).map((_, i) => {
        const angle = (360 / count) * i;
        return (
          <span
            key={i}
            className="absolute top-1/2 left-1/2 rounded-full"
            style={{
              width: dotSize,
              height: dotSize,
              backgroundColor: colors[i % colors.length],
              boxShadow: `0 0 8px ${colors[i % colors.length]}`,
              transform: `rotate(${angle}deg) translateY(-${radius}px) translate(-50%, -50%)`,
            }}
          />
        );
      })}
    </motion.div>
  );
}

type HubAction =
  | {
      id: "bot";
      label: string;
      type: "bot";
      icon: typeof Bot;
      gradient: string;
      glow: string;
      ring: string;
    }
  | {
      id: "call" | "viber" | "whatsapp";
      label: string;
      type: "link";
      href: () => string;
      icon: typeof Phone | typeof ViberIcon | typeof WhatsAppIcon;
      gradient: string;
      glow: string;
      ring: string;
    };

const hubActions: HubAction[] = [
  {
    id: "bot",
    label: floatingContact.bot,
    type: "bot",
    icon: Bot,
    gradient: "from-[#FF2BD6] via-[#6C2DFF] to-[#00E5FF]",
    glow: "shadow-[0_0_25px_rgba(255,43,214,0.45)]",
    ring: "#FF2BD6",
  },
  {
    id: "whatsapp",
    label: floatingContact.whatsapp,
    type: "link",
    href: () => getContactLinks().whatsapp,
    icon: WhatsAppIcon,
    gradient: "from-[#25D366] to-[#00E5FF]",
    glow: "shadow-[0_0_25px_rgba(37,211,102,0.45)]",
    ring: "#25D366",
  },
  {
    id: "viber",
    label: floatingContact.viber,
    type: "link",
    href: () => getContactLinks().viber,
    icon: ViberIcon,
    gradient: "from-[#7360F2] to-[#6C2DFF]",
    glow: "shadow-[0_0_25px_rgba(115,96,242,0.5)]",
    ring: "#7360F2",
  },
  {
    id: "call",
    label: floatingContact.call,
    type: "link",
    href: () => getContactLinks().tel,
    icon: Phone,
    gradient: "from-[#6C2DFF] to-[#2F6BFF]",
    glow: "shadow-[0_0_25px_rgba(47,107,255,0.5)]",
    ring: "#2F6BFF",
  },
];

interface FloatingContactProps {
  stacked?: boolean;
  onOpenBot?: () => void;
}

export function FloatingContact({ stacked = false, onOpenBot }: FloatingContactProps) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mounted = useMounted();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const rootClass = stacked
    ? "relative z-50"
    : "fixed right-5 bottom-5 z-50 md:right-8 md:bottom-8";

  const closeHub = () => setOpen(false);

  const handleOpenBot = () => {
    closeHub();
    onOpenBot?.();
  };

  return (
    <div className={rootClass}>
      {mounted && (
        <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute right-0 bottom-full mb-6 flex flex-col-reverse items-end gap-6 sm:gap-7"
          >
            {hubActions.map((action, i) => {
              const Icon = action.icon;

              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: 16, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.85 }}
                  transition={{ delay: i * 0.06, duration: 0.25 }}
                  className="flex items-center gap-3 py-2"
                >
                  <span className="rounded-lg border border-white/10 bg-[#080816]/90 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-white backdrop-blur-md">
                    {action.label}
                  </span>
                  <div className="relative">
                    <div
                      className="pointer-events-none absolute -inset-2 rounded-full opacity-50"
                      style={{ boxShadow: `0 0 16px ${action.ring}` }}
                    />
                    {action.type === "bot" ? (
                      <button
                        type="button"
                        onClick={handleOpenBot}
                        className={`relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${action.gradient} text-white ${action.glow} transition-transform hover:scale-110`}
                        aria-label={action.label}
                      >
                        <Icon className="h-5 w-5" />
                      </button>
                    ) : (
                      <a
                        href={action.href()}
                        onClick={closeHub}
                        target={action.id === "whatsapp" ? "_blank" : undefined}
                        rel={
                          action.id === "whatsapp" ? "noopener noreferrer" : undefined
                        }
                        className={`relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${action.gradient} text-white ${action.glow} transition-transform hover:scale-110`}
                        aria-label={action.label}
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
        </AnimatePresence>
      )}

      <div className="relative h-[4.5rem] w-[4.5rem]">
        {mounted && !isMobile && !prefersReducedMotion && (
          <>
            <OrbitDots
              radius={38}
              count={6}
              duration={10}
              dotSize={4}
              colors={["#00E5FF", "#6C2DFF", "#FF2BD6", "#00E5FF", "#6C2DFF", "#FF2BD6"]}
            />
            <motion.div
              className="pointer-events-none absolute inset-0"
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              aria-hidden
            >
              {Array.from({ length: 4 }).map((_, i) => {
                const angle = (360 / 4) * i + 45;
                return (
                  <span
                    key={i}
                    className="absolute top-1/2 left-1/2 h-1.5 w-1.5 rounded-full bg-[#00E5FF]/80"
                    style={{
                      boxShadow: "0 0 6px #00E5FF",
                      transform: `rotate(${angle}deg) translateY(-30px) translate(-50%, -50%)`,
                    }}
                  />
                );
              })}
            </motion.div>

            <motion.div
              className="pointer-events-none absolute inset-0 rounded-full border border-[#00E5FF]/30"
              animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            />
          </>
        )}

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-gradient-to-br from-[#6C2DFF] via-[#2F6BFF] to-[#00E5FF] text-white shadow-[0_0_22px_rgba(0,229,255,0.35)] transition-transform hover:scale-105 ${
            open ? "shadow-[0_0_50px_rgba(255,43,214,0.5)]" : ""
          }`}
          aria-label={open ? "Zatvori meni" : floatingContact.mainLabel}
          aria-expanded={open}
        >
          {mounted ? (
            <motion.div
              animate={{ rotate: open ? 90 : 0 }}
              transition={{ duration: 0.25 }}
            >
              {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
            </motion.div>
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </button>
      </div>
    </div>
  );
}
