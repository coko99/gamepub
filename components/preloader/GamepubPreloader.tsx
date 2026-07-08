"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { preloaderConfig } from "@/content/preloader";

export function GamepubPreloader() {
  const [active, setActive] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pageLoaded, setPageLoaded] = useState(
    () => typeof document !== "undefined" && document.readyState === "complete",
  );
  const [textIndex, setTextIndex] = useState(0);
  const progressRef = useRef(0);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    if (pageLoaded) return;
    const onLoad = () => setPageLoaded(true);
    window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, [pageLoaded]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      let next = progressRef.current;

      if (pageLoaded) {
        next = Math.min(100, next + 6);
      } else if (document.readyState === "interactive") {
        next = Math.min(88, next + Math.random() * 4 + 1);
      } else {
        next = Math.min(72, next + Math.random() * 3 + 0.5);
      }

      progressRef.current = next;
      setProgress(Math.round(next));
    }, 80);

    return () => window.clearInterval(interval);
  }, [pageLoaded]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTextIndex(
        (i) => (i + 1) % preloaderConfig.loadingTexts.length,
      );
    }, preloaderConfig.loadingTextIntervalMs);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 100 || !pageLoaded) return;

    const exitTimer = window.setTimeout(() => {
      setIsExiting(true);
      window.setTimeout(
        () => setActive(false),
        preloaderConfig.exitFadeMs,
      );
    }, preloaderConfig.minDisplayMs);

    return () => window.clearTimeout(exitTimer);
  }, [progress, pageLoaded]);

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
          className="preloader-cokoladni-logo"
          priority
        />
      </div>
    </div>
  );
}
