"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { preloaderConfig } from "@/content/preloader";

function unlockBody() {
  document.body.style.overflow = "";
}

function hasSeenPreloader() {
  try {
    return sessionStorage.getItem(preloaderConfig.sessionKey) === "1";
  } catch {
    return false;
  }
}

export function GamepubPreloader() {
  const pathname = usePathname();
  const skipPreloader = pathname.startsWith("/admin") || pathname.startsWith("/meni");
  const [visible, setVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    unlockBody();

    if (skipPreloader || hasSeenPreloader()) return;

    setVisible(true);
    document.body.style.overflow = "hidden";

    let pct = 0;
    const stepMs = 40;
    const steps = preloaderConfig.fillMs / stepMs;
    const increment = 100 / steps;

    const progressTimer = window.setInterval(() => {
      pct = Math.min(100, pct + increment);
      setProgress(Math.round(pct));
    }, stepMs);

    const textTimer = window.setInterval(() => {
      setTextIndex((i) => (i + 1) % preloaderConfig.loadingTexts.length);
    }, preloaderConfig.loadingTextIntervalMs);

    const hideTimer = window.setTimeout(() => {
      setProgress(100);
      try {
        sessionStorage.setItem(preloaderConfig.sessionKey, "1");
      } catch {
        /* ignore */
      }
      setIsExiting(true);
      unlockBody();
      window.setTimeout(() => setVisible(false), preloaderConfig.exitFadeMs);
    }, preloaderConfig.fillMs + preloaderConfig.minDisplayMs);

    return () => {
      window.clearInterval(progressTimer);
      window.clearInterval(textTimer);
      window.clearTimeout(hideTimer);
      unlockBody();
    };
  }, [skipPreloader]);

  if (!visible) return null;

  const loadingText = preloaderConfig.loadingTexts[textIndex];

  return (
    <div
      className={`preloader-root ${isExiting ? "preloader-exiting" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={`Učitavanje ${progress}%`}
    >
      <div className="preloader-main">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={preloaderConfig.gamepubLogo}
          alt="Gamepub"
          className="preloader-gamepub-logo"
          draggable={false}
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={preloaderConfig.cokoladniLogo}
          alt="Čokoladni Aj Ti"
          className="preloader-cokoladni-logo"
          draggable={false}
        />
      </div>
    </div>
  );
}
