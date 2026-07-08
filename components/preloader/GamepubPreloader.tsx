"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { preloaderConfig } from "@/content/preloader";
import { PixelMascot } from "./PixelMascot";

const BLOCK_X = 45;
const REQUIRED_BLOCK_HITS = preloaderConfig.requiredBlockHits;
const FIRST_JUMP_DELAY_MS = preloaderConfig.firstJumpDelayMs;
const TEXT_DISPLAY_MS = preloaderConfig.textDisplayMs;
const TEXT_DISPLAY_MS_MOBILE = preloaderConfig.textDisplayMsMobile;
const EXIT_FADE_MS = preloaderConfig.exitFadeMs;

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
      <div key={`hit-${popKey}`} className="preloader-hit-pop preloader-hit-pop-in">
        <Image
          src={preloaderConfig.brand.cokoladniLogo}
          alt="Čokoladni Aj Ti"
          width={logoSize}
          height={logoSize}
          className="preloader-hit-logo"
          priority
        />
        <div className="preloader-hit-text">
          <span className="preloader-hit-line1 font-gaming">
            {message.line1}
          </span>
          <span className="preloader-hit-line2 font-gaming">
            {message.line2}
          </span>
        </div>
      </div>
    </div>
  );
}

export function GamepubPreloader() {
  const isMobile = useIsMobile();

  const [active, setActive] = useState(false);
  const [runKey, setRunKey] = useState(0);
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [shake, setShake] = useState(false);
  const [facingRight, setFacingRight] = useState(true);
  const [isJumping, setIsJumping] = useState(false);
  const [blockHit, setBlockHit] = useState(false);
  const [logoPopKey, setLogoPopKey] = useState(0);
  const [blockHits, setBlockHits] = useState(0);
  const [randomShoutout, setRandomShoutout] = useState<Shoutout | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  const charWrapRef = useRef<HTMLDivElement>(null);
  const charXRef = useRef(14);
  const facingRef = useRef(true);
  const runDirRef = useRef(1);
  const sessionRef = useRef(0);
  const blockHitsRef = useRef(0);
  const exitScheduledRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const initialStartedRef = useRef(false);
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

  const setCharPosition = useCallback((x: number, facing: boolean) => {
    charXRef.current = x;
    facingRef.current = facing;
    const wrap = charWrapRef.current;
    if (wrap) wrap.style.left = `${x}%`;
    setFacingRight(facing);
  }, []);

  const resetPreloader = useCallback(() => {
    clearTimers();
    sessionRef.current += 1;
    jumpingRef.current = false;
    runDirRef.current = 1;
    setProgress(0);
    setTextIndex(0);
    setShake(false);
    setCharPosition(14, true);
    setIsJumping(false);
    setBlockHit(false);
    setLogoPopKey(0);
    setBlockHits(0);
    blockHitsRef.current = 0;
    exitScheduledRef.current = false;
    setRandomShoutout(pickRandomShoutout());
    setIsExiting(false);
  }, [clearTimers, setCharPosition]);

  const startPreloader = useCallback(() => {
    resetPreloader();
    setRunKey((key) => key + 1);
    setActive(true);
  }, [resetPreloader]);

  const triggerJumpHit = useCallback(() => {
    if (jumpingRef.current || blockHitsRef.current >= REQUIRED_BLOCK_HITS) return;

    const session = sessionRef.current;
    jumpingRef.current = true;

    setCharPosition(BLOCK_X, true);
    setIsJumping(true);
    setBlockHit(false);

    schedule(() => {
      if (session !== sessionRef.current) return;
      setBlockHit(true);
      setShake(true);
      blockHitsRef.current += 1;
      setBlockHits(blockHitsRef.current);
      setLogoPopKey((key) => key + 1);
      schedule(() => setShake(false), 280);
      schedule(() => setBlockHit(false), 320);
    }, 200);

    schedule(() => {
      if (session !== sessionRef.current) return;
      setIsJumping(false);
      jumpingRef.current = false;
    }, isMobile ? 420 : 480);
  }, [isMobile, schedule, setCharPosition]);

  useEffect(() => {
    if (initialStartedRef.current) return;
    initialStartedRef.current = true;
    startPreloader();
  }, [startPreloader]);

  useEffect(() => {
    if (!active) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [active]);

  /* Trčanje samo na desktopu — bez React re-rendera */
  useEffect(() => {
    if (!active || isJumping || isMobile) return;

    const step = 2.2;
    const tickMs = 48;

    const interval = window.setInterval(() => {
      if (jumpingRef.current) return;

      let next = charXRef.current + runDirRef.current * step;
      let nextFacing = facingRef.current;

      if (next >= 70) {
        runDirRef.current = -1;
        nextFacing = false;
        next = 70;
      } else if (next <= 14) {
        runDirRef.current = 1;
        nextFacing = true;
        next = 14;
      }

      charXRef.current = next;
      const wrap = charWrapRef.current;
      if (!wrap) return;
      wrap.style.left = `${next}%`;

      if (nextFacing !== facingRef.current) {
        facingRef.current = nextFacing;
        setFacingRight(nextFacing);
      }
    }, tickMs);

    return () => window.clearInterval(interval);
  }, [active, isJumping, isMobile]);

  useEffect(() => {
    if (!active) return;

    const session = sessionRef.current;

    schedule(() => {
      if (session !== sessionRef.current) return;
      triggerJumpHit();
    }, FIRST_JUMP_DELAY_MS);
  }, [active, runKey, schedule, triggerJumpHit]);

  useEffect(() => {
    if (!active) return;

    const session = sessionRef.current;
    const texts = preloaderConfig.loadingTexts;
    const pageLoaded = document.readyState === "complete";

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
      }, EXIT_FADE_MS);
    };

    const scheduleFinish = () => {
      if (exitScheduledRef.current) return;
      exitScheduledRef.current = true;
      schedule(finish, isMobile ? TEXT_DISPLAY_MS_MOBILE : TEXT_DISPLAY_MS);
    };

    if (blockHits >= REQUIRED_BLOCK_HITS && pageLoaded) {
      scheduleFinish();
      return;
    }

    const onLoad = () => {
      if (blockHitsRef.current >= REQUIRED_BLOCK_HITS) scheduleFinish();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, [active, runKey, blockHits, isMobile, schedule]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  if (!active) return null;

  const loadingText = preloaderConfig.loadingTexts[textIndex];

  return (
    <div
      key={runKey}
      className={`preloader-root ${isMobile ? "preloader-root-mobile" : ""} ${shake ? "preloader-shake" : ""} ${isExiting ? "preloader-exiting" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Učitavanje"
    >
      <div className="preloader-bg">
        <div className="preloader-bg-grid" />
        <div className="preloader-bg-glow preloader-bg-glow-cyan" />
        <div className="preloader-bg-glow preloader-bg-glow-purple" />
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
          <div
            className={`preloader-block preloader-block-cyan preloader-block-main ${
              blockHit
                ? "preloader-block-hit-anim"
                : isMobile
                  ? ""
                  : "preloader-block-idle"
            }`}
          >
            <div className="preloader-block-inner">
              <div className="preloader-block-shine" />
              <div className="preloader-block-core" />
            </div>
          </div>
        </div>

        <div
          ref={charWrapRef}
          className="preloader-char-wrap preloader-char-wrap-chibi"
          style={{ left: "14%" }}
        >
          <PixelMascot
            isRunning={!isJumping && !isMobile}
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
    </div>
  );
}
