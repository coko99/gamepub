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
const FIRST_JUMP_DELAY_MS = 500;
const TEXT_DISPLAY_MS = 2000;
const REQUIRED_BLOCK_HITS = preloaderConfig.requiredBlockHits;

type Shoutout = (typeof preloaderConfig.brand.cokoladniShoutouts)[number];

function pickRandomShoutout() {
  const shoutouts = preloaderConfig.brand.cokoladniShoutouts;
  return shoutouts[Math.floor(Math.random() * shoutouts.length)];
}

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

function BlockHitPop({
  popKey,
  message,
  isMobile,
}: {
  popKey: number;
  message: Shoutout | null;
  isMobile: boolean;
}) {
  if (popKey === 0 || !message) return null;

  const logoSize = isMobile ? 64 : 88;

  return (
    <div
      className={`preloader-hit-overlay ${isMobile ? "preloader-hit-overlay-mobile" : ""}`}
    >
      <motion.div
        key={`hit-${popKey}`}
        className="preloader-block-hit-card"
        initial={{ opacity: 0, y: 16, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: isMobile ? 0.4 : 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="preloader-block-hit-logo-wrap">
          <div className="preloader-block-hit-logo-ring" />
          <Image
            src={preloaderConfig.brand.cokoladniLogo}
            alt="Čokoladni Aj Ti"
            width={logoSize}
            height={logoSize}
            className="preloader-block-hit-logo"
            priority
          />
        </div>
        <div className="preloader-block-hit-text">
          <span className="preloader-block-hit-line1 font-gaming">
            {message.line1}
          </span>
          <span className="preloader-block-hit-line2 font-gaming">
            {message.line2}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export function GamepubPreloader() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const particleCount = isMobile ? 0 : 14;

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
  const [blockHits, setBlockHits] = useState(0);
  const [randomShoutout, setRandomShoutout] = useState<Shoutout | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  const runDirRef = useRef(1);
  const sessionRef = useRef(0);
  const blockHitsRef = useRef(0);
  const exitScheduledRef = useRef(false);
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
    setBlockHits(0);
    blockHitsRef.current = 0;
    exitScheduledRef.current = false;
    setRandomShoutout(pickRandomShoutout());
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
    if (jumpingRef.current || blockHitsRef.current >= REQUIRED_BLOCK_HITS) return;

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
      blockHitsRef.current += 1;
      setBlockHits(blockHitsRef.current);
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

    const step = isMobile ? 1.5 : 2.2;
    const tickMs = isMobile ? 55 : 40;

    const interval = window.setInterval(() => {
      if (jumpingRef.current) return;
      setCharX((prev) => {
        const next = prev + runDirRef.current * step;
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
    }, tickMs);

    return () => window.clearInterval(interval);
  }, [active, isJumping, isMobile]);

  /* Jedan skok u blok */
  useEffect(() => {
    if (!active) return;

    const session = sessionRef.current;

    schedule(() => {
      if (session !== sessionRef.current) return;
      triggerJumpHit();
    }, FIRST_JUMP_DELAY_MS);
  }, [active, runKey, schedule, triggerJumpHit]);

  /* Progress i izlaz — posle jednog udarca + kratkog prikaza teksta */
  useEffect(() => {
    if (!active) return;

    const session = sessionRef.current;
    const texts = getTexts(mode);
    const waitForLoad = mode === "initial";
    const pageLoaded = !waitForLoad || document.readyState === "complete";

    const pct = blockHits >= REQUIRED_BLOCK_HITS ? 100 : blockHits * 40;
    setProgress(pct);
    setTextIndex(
      Math.min(texts.length - 1, Math.floor((pct / 100) * texts.length)),
    );

    const finish = () => {
      if (session !== sessionRef.current) return;
      if (blockHitsRef.current < REQUIRED_BLOCK_HITS) return;
      setProgress(100);
      setTextIndex(texts.length - 1);
      setIsExiting(true);
      schedule(() => {
        if (session !== sessionRef.current) return;
        setActive(false);
      }, 500);
    };

    const scheduleFinish = () => {
      if (exitScheduledRef.current) return;
      exitScheduledRef.current = true;
      schedule(finish, isMobile ? 1500 : TEXT_DISPLAY_MS);
    };

    if (blockHits >= REQUIRED_BLOCK_HITS && pageLoaded) {
      scheduleFinish();
      return;
    }

    if (!waitForLoad) return;

    const onLoad = () => {
      if (blockHitsRef.current >= REQUIRED_BLOCK_HITS) scheduleFinish();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, [active, mode, runKey, blockHits, isMobile, schedule]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  if (!active) return null;

  const loadingText = getTexts(mode)[textIndex];

  return (
    <motion.div
      key={runKey}
      className={`preloader-root ${isMobile ? "preloader-root-mobile" : ""} ${shake ? "preloader-shake" : ""} ${isExiting ? "preloader-exiting" : ""}`}
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

      <BlockHitPop
        popKey={logoPopKey}
        message={randomShoutout}
        isMobile={isMobile}
      />

      <div className="preloader-scene preloader-scene-simple">
        <div className="preloader-platform preloader-platform-main">
          <div className="preloader-platform-edge" />
        </div>

        <div
          className="preloader-block-stack"
          style={{ left: `${BLOCK_X}%` }}
        >
          <motion.div
            className="preloader-block preloader-block-cyan preloader-block-main"
            animate={
              blockHit
                ? { y: [0, -10, 3, 0], scale: [1, 0.88, 1.04, 1] }
                : isMobile
                  ? { y: 0 }
                  : { y: [0, -5, 0] }
            }
            transition={
              blockHit
                ? { duration: 0.3, ease: "easeOut" }
                : isMobile
                  ? { duration: 0 }
                  : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <div className="preloader-block-inner">
              <div className="preloader-block-shine" />
              <div className="preloader-block-core" />
            </div>
          </motion.div>
        </div>

        <div
          className="preloader-char-wrap preloader-char-wrap-chibi"
          style={{ left: `${charX}%` }}
        >
          <PixelMascot
            isRunning={!isJumping}
            isJumping={isJumping}
            facingRight={facingRight}
            isMobile={isMobile}
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
