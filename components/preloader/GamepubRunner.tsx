"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { preloaderConfig } from "@/content/preloader";

type GamepubRunnerProps = {
  isRunning: boolean;
  isJumping: boolean;
  facingRight?: boolean;
};

/** Trkač — Gamepub logo sa bob animacijom */
export function GamepubRunner({
  isRunning,
  isJumping,
  facingRight = true,
}: GamepubRunnerProps) {
  return (
    <motion.div
      className="preloader-runner"
      animate={{
        y: isJumping ? -72 : 0,
      }}
      transition={{
        y: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
      }}
      style={{ scaleX: facingRight ? 1 : -1 }}
    >
      <div
        className={`preloader-runner-inner ${isRunning && !isJumping ? "preloader-runner-bob" : ""} ${isJumping ? "preloader-runner-squash" : ""}`}
      >
        <div className="preloader-runner-glow" />
        <Image
          src={preloaderConfig.brand.gamepubLogo}
          alt="Gamepub"
          width={56}
          height={56}
          className="preloader-runner-logo"
          priority
        />
      </div>
    </motion.div>
  );
}
