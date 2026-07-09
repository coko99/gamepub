"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { getContactLinks, navLinks, siteConfig } from "@/content/site";
import { useMounted } from "@/hooks/useMounted";
import { NeonButton } from "./ui/NeonButton";
import { AnchorLink } from "./ui/AnchorLink";
import { NeonMenuToggle } from "./ui/NeonMenuToggle";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mounted = useMounted();
  const pathname = usePathname();
  const scrolledRef = useRef(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const closeMobileMenu = () => {
    setMobileOpen(false);
    document.body.style.overflow = "";
  };

  useEffect(() => {
    const onScroll = () => {
      const nextScrolled = window.scrollY > 50;
      if (nextScrolled !== scrolledRef.current) {
        scrolledRef.current = nextScrolled;
        setScrolled(nextScrolled);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-[background-color,border-color] duration-300 ${
        scrolled
          ? "border-b border-white/5 bg-[#050510]/95 md:bg-[#050510]/80 md:backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6 lg:px-8">
        <AnchorLink
          href="/"
          onNavigate={closeMobileMenu}
          className="relative z-50 flex items-center gap-2.5"
        >
          <Image
            src="/logo-transparent.png"
            alt="Gamepub Kruševac"
            width={120}
            height={120}
            className="h-12 w-12 object-contain md:h-14 md:w-14"
            priority
          />
          <span className="font-gaming bg-gradient-to-r from-white via-[#00E5FF] to-[#6C2DFF] bg-clip-text text-lg font-bold tracking-[0.18em] text-transparent lg:hidden">
            GAMEPUB
          </span>
        </AnchorLink>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <AnchorLink
              key={link.href}
              href={link.href}
              className={`group relative text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "text-[#00E5FF]"
                  : "text-[#B8B8C8] hover:text-[#00E5FF]"
              }`}
            >
              {link.label}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-gradient-to-r from-[#6C2DFF] to-[#00E5FF] transition-all duration-300 ${
                  isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </AnchorLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <NeonButton href="/kontakt">Rezerviši termin</NeonButton>
        </div>

        <NeonMenuToggle
          open={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
        />
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {mobileOpen && (
              <>
                <motion.button
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={closeMobileMenu}
                  className="fixed inset-0 z-[200] bg-[#020208]/92 lg:hidden md:backdrop-blur-md"
                  aria-label="Zatvori navigaciju"
                />

                <motion.aside
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 30, stiffness: 320 }}
                  className="fixed top-0 right-0 z-[210] flex h-full w-[min(100vw,20rem)] flex-col border-l border-[#00E5FF]/20 bg-[#050510] shadow-[-12px_0_60px_rgba(0,0,0,0.55)] sm:w-[22rem] lg:hidden"
                >
                <div className="pointer-events-none absolute top-24 -left-16 hidden h-48 w-48 rounded-full bg-[#6C2DFF]/20 blur-[80px] md:block" />
                <div className="pointer-events-none absolute bottom-32 right-0 hidden h-40 w-40 rounded-full bg-[#00E5FF]/15 blur-[70px] md:block" />

                <div className="relative flex h-full flex-col overflow-y-auto px-5 pb-10 pt-24">
                  <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 }}
                    className="mb-8 border-b border-white/10 pb-6"
                  >
                    <p className="font-gaming text-xs tracking-[0.3em] text-[#00E5FF] uppercase">
                      Navigacija
                    </p>
                    <p className="font-heading mt-1 text-lg font-bold text-white">
                      Gamepub Kruševac
                    </p>
                  </motion.div>

                  <nav className="flex flex-1 flex-col">
                    <ul className="space-y-2.5">
                      {navLinks.map((link, i) => (
                        <motion.li
                          key={link.href}
                          initial={{ opacity: 0, x: 28 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 16 }}
                          transition={{ delay: 0.06 + i * 0.04, duration: 0.3 }}
                        >
                          <AnchorLink
                            href={link.href}
                            onNavigate={closeMobileMenu}
                            className={`group flex items-center gap-3 rounded-2xl border px-4 py-3.5 transition-all duration-300 active:scale-[0.98] ${
                              isActive(link.href)
                                ? "border-[#00E5FF]/50 bg-[#00E5FF]/10 shadow-[0_0_24px_rgba(0,229,255,0.15)]"
                                : "border-white/10 bg-[#101024]/90 hover:border-[#00E5FF]/40 hover:bg-[#00E5FF]/5 hover:shadow-[0_0_24px_rgba(0,229,255,0.15)]"
                            }`}
                          >
                            <span className="font-gaming flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#6C2DFF]/30 to-[#00E5FF]/20 text-[10px] text-[#00E5FF]">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="font-heading text-base font-semibold text-white transition-colors group-hover:text-[#00E5FF]">
                              {link.label}
                            </span>
                            <span className="ml-auto text-[#00E5FF]/0 transition-all group-hover:text-[#00E5FF]">
                              →
                            </span>
                          </AnchorLink>
                        </motion.li>
                      ))}
                    </ul>
                  </nav>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.32 }}
                    className="mt-8 space-y-3 border-t border-white/10 pt-6"
                  >
                    <NeonButton
                      href="/kontakt"
                      onClick={closeMobileMenu}
                      className="w-full"
                    >
                      Rezerviši termin
                    </NeonButton>
                    <a
                      href={getContactLinks().tel}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#00E5FF]/30 bg-[#00E5FF]/10 py-3 text-sm font-semibold text-[#00E5FF] transition-colors hover:border-[#00E5FF]/50 hover:bg-[#00E5FF]/15"
                    >
                      {siteConfig.phone}
                    </a>
                    <a
                      href={siteConfig.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#FF2BD6]/30 bg-[#FF2BD6]/10 py-3 text-sm font-semibold text-[#FF2BD6] transition-colors hover:border-[#FF2BD6]/50 hover:bg-[#FF2BD6]/15"
                    >
                      {siteConfig.instagram}
                    </a>
                  </motion.div>
                </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </header>
  );
}
