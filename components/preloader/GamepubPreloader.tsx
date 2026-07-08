"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { preloaderConfig } from "@/content/preloader";

function hasSeenPreloader() {
  try {
    return sessionStorage.getItem(preloaderConfig.sessionKey) === "1";
  } catch {
    return false;
  }
}

function markPreloaderSeen() {
  try {
    sessionStorage.setItem(preloaderConfig.sessionKey, "1");
  } catch {
    /* ignore */
  }
}

export function GamepubPreloader() {
  const [active, setActive] = useState(() => {
    if (typeof window === "undefined") return true;
    return !hasSeenPreloader();
  });
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pageReady, setPageReady] = useState(
    () =>
      typeof document !== "undefined" &&
      (document.readyState === "interactive" ||
        document.readyState === "complete"),
  );
  const [textIndex, setTextIndex] = useState(0);
  const progressRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [active]);

  useEffect(() => {
    if (!active || pageReady) return;

    const markReady = () => setPageReady(true);

    if (
      document.readyState === "interactive" ||
      document.readyState === "complete"
    ) {
      markReady();
      return;
    }

    document.addEventListener("DOMContentLoaded", markReady, { once: true });
    return () => document.removeEventListener("DOMContentLoaded", markReady);
  }, [active, pageReady]);

  useEffect(() => {
    if (!active) return;

    const interval = window.setInterval(() => {
      let next = progressRef.current;

      if (pageReady) {
        next = Math.min(100, next + 12);
      } else {
        next = Math.min(92, next + Math.random() * 5 + 2);
      }

      progressRef.current = next;
      setProgress(Math.round(next));
    }, 120);

    return () => window.clearInterval(interval);
  }, [active, pageReady]);

  useEffect(() => {
    if (!active) return;

    const interval = window.setInterval(() => {
      setTextIndex((i) => (i + 1) % preloaderConfig.loadingTexts.length);
    }, preloaderConfig.loadingTextIntervalMs);

    return () => window.clearInterval(interval);
  }, [active]);

  useEffect(() => {
    if (!active || progress < 100 || !pageReady) return;

    const exitTimer = window.setTimeout(() => {
      markPreloaderSeen();
      setIsExiting(true);
      window.setTimeout(() => setActive(false), preloaderConfig.exitFadeMs);
    }, preloaderConfig.minDisplayMs);

    return () => window.clearTimeout(exitTimer);
  }, [active, progress, pageReady]);

  if (!active) return null;

  const loadingText = preloaderConfig.loadingTexts[textIndex];

  return (
    <div
      className={`preloader-root ${isExiting ? "preloader-exiting" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={`Učitavanje ${progress}%`}
    >
      <div className="preloader-main">
        <Image
          src={preloaderConfig.gamepubLogo}
          alt="Gamepub"
          width={280}
          height={280}
          quality={80}
          className="preloader-gamepub-logo"
          priority
        />

        <div className="preloader-progress-wrap">
          <div className="preloader-progress-track">
            <div
              className="preloader-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="preloader-progress-pct font-gaming">{progress}%</span>
        </div>
      </div>

      <p key={textIndex} className="preloader-status-text">
        {loadingText}
      </p>

      <div className="preloader-powered">
        <div className="preloader-cokoladni-glow" aria-hidden />
        <Image
          src={preloaderConfig.cokoladniLogo}
          alt="Čokoladni Aj Ti"
          width={72}
          height={72}
          quality={75}
          className="preloader-cokoladni-logo"
        />
      </div>
    </div>
  );
}
