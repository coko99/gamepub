"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { preloaderConfig } from "@/content/preloader";

type PixelMascotProps = {
  isRunning: boolean;
  isJumping: boolean;
  facingRight?: boolean;
};

/** Mali pixel čovečuljak — glava, ruke, noge, Gamepub na majici */
export function PixelMascot({
  isRunning,
  isJumping,
  facingRight = true,
}: PixelMascotProps) {
  const runClass =
    isRunning && !isJumping ? "preloader-chibi-run" : "";
  const jumpClass = isJumping ? "preloader-chibi-jump" : "";

  return (
    <motion.div
      className="preloader-chibi-wrap"
      animate={{ y: isJumping ? -72 : 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      style={{ scaleX: facingRight ? 1 : -1 }}
    >
      <div className={`preloader-chibi ${runClass} ${jumpClass}`}>
        {/* Glava */}
        <div className="preloader-chibi-head">
          <span className="preloader-chibi-eye preloader-chibi-eye-l" />
          <span className="preloader-chibi-eye preloader-chibi-eye-r" />
          <span className="preloader-chibi-smile" />
          <span className="preloader-chibi-hair" />
        </div>

        {/* Telo + majica */}
        <div className="preloader-chibi-torso">
          <Image
            src={preloaderConfig.brand.gamepubLogo}
            alt=""
            width={18}
            height={18}
            className="preloader-chibi-shirt-logo"
            aria-hidden
          />
        </div>

        {/* Ruke */}
        <span className="preloader-chibi-arm preloader-chibi-arm-l" />
        <span className="preloader-chibi-arm preloader-chibi-arm-r" />

        {/* Noge + patike */}
        <span className="preloader-chibi-leg preloader-chibi-leg-l" />
        <span className="preloader-chibi-leg preloader-chibi-leg-r" />
        <span className="preloader-chibi-foot preloader-chibi-foot-l" />
        <span className="preloader-chibi-foot preloader-chibi-foot-r" />
      </div>
    </motion.div>
  );
}
