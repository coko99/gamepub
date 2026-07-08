"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const [active, setActive] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const progressRef = useRef(0);
  const finishedRef = useRef(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    markPreloaderSeen();
    setIsExiting(true);
    window.setTimeout(() => setActive(false), preloaderConfig.exitFadeMs);
  }, []);

  useEffect(() => {
    if (hasSeenPreloader()) {
      setActive(false);
      return;
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const progressTimer = window.setInterval(() => {
      const next = Math.min(100, progressRef.current + 8);
      progressRef.current = next;
      setProgress(next);
    }, 100);

    const textTimer = window.setInterval(() => {
      setTextIndex((i) => (i + 1) % preloaderConfig.loadingTexts.length);
    }, preloaderConfig.loadingTextIntervalMs);

    const safetyTimer = window.setTimeout(finish, 4500);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.clearInterval(progressTimer);
      window.clearInterval(textTimer);
      window.clearTimeout(safetyTimer);
    };
  }, [finish]);

  useEffect(() => {
    if (!active || progress < 100) return;
    const exitTimer = window.setTimeout(finish, preloaderConfig.minDisplayMs);
    return () => window.clearTimeout(exitTimer);
  }, [active, progress, finish]);

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
