"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  preloaderConfig,
  type PreloaderMode,
} from "@/content/preloader";
import { PixelMascot } from "./PixelMascot";

const BLOCK_X = 45;
const JUMP_INTERVAL_MS = 2200;
const FIRST_JUMP_DELAY_MS = 500;

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return mobile;
}

function isInternalHref(href: string, origin: string) {
  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("javascript:")
  ) {
    return false;
  }
  try {
    return new URL(href, origin).origin === origin;
  } catch {
    return href.startsWith("/");
  }
}

function getDuration(mode: PreloaderMode) {
  return mode === "initial"
    ? preloaderConfig.initialDurationMs
    : preloaderConfig.navigationDurationMs;
}

function getTexts(mode: PreloaderMode) {
  return mode === "initial"
    ? preloaderConfig.loadingTexts
    : preloaderConfig.navigationTexts;
}

function Particles({ count }: { count: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${8 + ((i * 17) % 84)}%`,
        top: `${10 + ((i * 23) % 70)}%`,
        delay: (i * 0.37) % 3,
        size: i % 3 === 0 ? 3 : 2,
        color: i % 3 === 0 ? "cyan" : i % 3 === 1 ? "purple" : "pink",
      })),
    [count],
  );

  return (
    <div className="preloader-particles" aria-hidden>
      {particles.map((p) => (
        <span
          key={p.id}
          className={`preloader-particle preloader-particle-${p.color}`}
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function CokoladniLogoPop({ popKey }: { popKey: number }) {
  if (popKey === 0) return null;

  return (
    <motion.div
      key={`logo-${popKey}`}
      className="preloader-cat-pop preloader-cat-pop-logo-only"
      initial={{ opacity: 0, y: 12, scale: 0.35 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [12, -28, -58, -88],
        scale: [0.35, 1.12, 1, 0.88],
      }}
      transition={{ duration: 1.1, ease: "easeOut" }}
    >
      <div className="preloader-cat-pop-glow" />
      <Image
        src={preloaderConfig.brand.cokoladniLogo}
        alt="Čokoladni Aj Ti"
        width={72}
        height={72}
        className="preloader-cat-pop-logo"
        priority
      />
    </motion.div>
  );
}

function CokoladniTextPop({
  popKey,
  fromRight,
}: {
  popKey: number;
  fromRight: boolean;
}) {
  if (popKey === 0) return null;

  const { powerUpLine1, powerUpLine2 } = preloaderConfig.brand;
  const xStart = fromRight ? 120 : -120;

  return (
    <motion.div
      key={`text-${popKey}`}
      className={`preloader-cat-text-pop ${fromRight ? "preloader-cat-text-pop-right" : "preloader-cat-text-pop-left"}`}
      initial={{ opacity: 0, x: xStart, scale: 0.85 }}
      animate={{
        opacity: [0, 1, 1, 1, 0],
        x: [xStart, 0, 0, 0, fromRight ? 24 : -24],
        scale: [0.85, 1.05, 1, 1, 0.95],
      }}
      transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="preloader-cat-text-pop-bg" />
      <div className="preloader-cat-text-pop-inner">
        <span className="preloader-cat-text-pop-line1 font-gaming">
          {powerUpLine1}
        </span>
        <span className="preloader-cat-text-pop-line2 font-gaming">
          {powerUpLine2}
        </span>
      </div>
    </motion.div>
  );
}

export function GamepubPreloader() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const particleCount = isMobile ? 6 : 14;

  const [active, setActive] = useState(false);
  const [runKey, setRunKey] = useState(0);
  const [mode, setMode] = useState<PreloaderMode>("initial");
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [shake, setShake] = useState(false);
  const [charX, setCharX] = useState(14);
  const [facingRight, setFacingRight] = useState(true);
  const [isJumping, setIsJumping] = useState(false);
  const [blockHit, setBlockHit] = useState(false);
  const [logoPopKey, setLogoPopKey] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const runDirRef = useRef(1);
  const sessionRef = useRef(0);
  const timersRef = useRef<number[]>([]);
  const previousPathnameRef = useRef<string | null>(null);
  const startedByClickRef = useRef(false);
  const jumpingRef = useRef(false);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  const resetPreloader = useCallback(() => {
    clearTimers();
    sessionRef.current += 1;
    jumpingRef.current = false;
    runDirRef.current = 1;
    setProgress(0);
    setTextIndex(0);
    setShake(false);
    setCharX(14);
    setFacingRight(true);
    setIsJumping(false);
    setBlockHit(false);
    setLogoPopKey(0);
    setIsExiting(false);
  }, [clearTimers]);

  const startPreloader = useCallback(
    (nextMode: PreloaderMode) => {
      resetPreloader();
      setMode(nextMode);
      setRunKey((key) => key + 1);
      setActive(true);
    },
    [resetPreloader],
  );

  const triggerJumpHit = useCallback(() => {
    if (jumpingRef.current) return;

    const session = sessionRef.current;
    jumpingRef.current = true;

    setCharX(BLOCK_X);
    setFacingRight(true);
    setIsJumping(true);
    setBlockHit(false);

    schedule(() => {
      if (session !== sessionRef.current) return;
      setBlockHit(true);
      setShake(true);
      setLogoPopKey((key) => key + 1);
      schedule(() => setShake(false), 300);
      schedule(() => setBlockHit(false), 350);
    }, 220);

    schedule(() => {
      if (session !== sessionRef.current) return;
      setIsJumping(false);
      jumpingRef.current = false;
    }, 520);
  }, [schedule]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || !isInternalHref(href, window.location.origin)) return;

      const nextUrl = new URL(href, window.location.href);
      if (
        nextUrl.pathname === pathname &&
        nextUrl.search === window.location.search
      ) {
        return;
      }

      startedByClickRef.current = true;
      startPreloader("navigation");
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname, startPreloader]);

  useEffect(() => {
    const previous = previousPathnameRef.current;
    previousPathnameRef.current = pathname;

    if (previous === null) {
      startPreloader("initial");
      return;
    }

    if (previous === pathname) return;

    if (startedByClickRef.current) {
      startedByClickRef.current = false;
      return;
    }

    startPreloader("navigation");
  }, [pathname, startPreloader]);

  useEffect(() => {
    if (!active) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [active]);

  /* Trčanje levo-desno */
  useEffect(() => {
    if (!active || isJumping) return;

    const interval = window.setInterval(() => {
      if (jumpingRef.current) return;
      setCharX((prev) => {
        const next = prev + runDirRef.current * 2.2;
        if (next >= 70) {
          runDirRef.current = -1;
          setFacingRight(false);
          return 70;
        }
        if (next <= 14) {
          runDirRef.current = 1;
          setFacingRight(true);
          return 14;
        }
        return next;
      });
    }, 40);

    return () => window.clearInterval(interval);
  }, [active, isJumping]);

  /* Skok u blok — prvi posle kratke pauze, zatim u petlji */
  useEffect(() => {
    if (!active) return;

    const session = sessionRef.current;

    schedule(() => {
      if (session !== sessionRef.current) return;
      triggerJumpHit();
    }, FIRST_JUMP_DELAY_MS);

    const interval = window.setInterval(() => {
      if (session !== sessionRef.current) return;
      triggerJumpHit();
    }, JUMP_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [active, runKey, schedule, triggerJumpHit]);

  /* Progress bar */
  useEffect(() => {
    if (!active) return;

    const session = sessionRef.current;
    const duration = getDuration(mode);
    const texts = getTexts(mode);
    const waitForLoad = mode === "initial";
    const start = performance.now();
    let loaded = !waitForLoad || document.readyState === "complete";
    let raf = 0;

    const onLoad = () => {
      loaded = true;
    };
    if (waitForLoad) window.addEventListener("load", onLoad);

    const tick = (now: number) => {
      if (session !== sessionRef.current) return;

      const elapsed = now - start;
      const timePct = Math.min(100, (elapsed / duration) * 100);
      const pct = loaded || !waitForLoad ? timePct : Math.min(timePct, 92);

      setProgress(pct);
      setTextIndex(
        Math.min(texts.length - 1, Math.floor((pct / 100) * texts.length)),
      );

      if (pct >= 100 && loaded) {
        setIsExiting(true);
        schedule(() => {
          if (session !== sessionRef.current) return;
          setActive(false);
        }, 500);
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      if (waitForLoad) window.removeEventListener("load", onLoad);
      cancelAnimationFrame(raf);
    };
  }, [active, mode, runKey, schedule]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  if (!active) return null;

  const loadingText = getTexts(mode)[textIndex];

  return (
    <motion.div
      key={runKey}
      className={`preloader-root ${shake ? "preloader-shake" : ""} ${isExiting ? "preloader-exiting" : ""}`}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
      role="status"
      aria-live="polite"
      aria-label="Učitavanje"
    >
      <div className="preloader-bg">
        <div className="preloader-bg-grid" />
        <div className="preloader-bg-glow preloader-bg-glow-cyan" />
        <div className="preloader-bg-glow preloader-bg-glow-purple" />
        <Particles count={particleCount} />
      </div>

      <div className="preloader-scene preloader-scene-simple">
        <div className="preloader-platform preloader-platform-main">
          <div className="preloader-platform-edge" />
        </div>

        <motion.div
          className="preloader-block preloader-block-cyan preloader-block-main"
          style={{ left: `${BLOCK_X}%`, top: "18%" }}
          animate={
            blockHit
              ? { y: [0, -10, 3, 0], scale: [1, 0.88, 1.04, 1] }
              : { y: [0, -5, 0] }
          }
          transition={
            blockHit
              ? { duration: 0.3, ease: "easeOut" }
              : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <div className="preloader-block-inner">
            <div className="preloader-block-shine" />
            <div className="preloader-block-core" />
          </div>
        </motion.div>

        <CokoladniLogoPop popKey={logoPopKey} />
        <CokoladniTextPop
          popKey={logoPopKey}
          fromRight={logoPopKey % 2 === 1}
        />

        <div
          className="preloader-char-wrap preloader-char-wrap-chibi"
          style={{ left: `${charX}%` }}
        >
          <PixelMascot
            isRunning={!isJumping}
            isJumping={isJumping}
            facingRight={facingRight}
          />
        </div>
      </div>

      <div className="preloader-hud">
        <p className="preloader-loading-text">{loadingText}</p>
        <div className="preloader-bar-frame">
          <div className="preloader-bar-track">
            <div
              className="preloader-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="preloader-bar-pct font-gaming">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}
