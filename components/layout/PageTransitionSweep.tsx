"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/** Neon sweep pri promeni stranice — u root layoutu, reaguje na svaku rutu */
export function PageTransitionSweep() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(false);
  const previousPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const previous = previousPathRef.current;
    previousPathRef.current = pathname;

    if (previous === null) return;

    if (previous === pathname) return;

    setActive(true);
    const timer = window.setTimeout(() => setActive(false), 520);
    return () => window.clearTimeout(timer);
  }, [pathname, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <AnimatePresence mode="wait">
      {active && (
        <motion.div
          key={pathname}
          className="page-transition-sweep pointer-events-none fixed inset-0 z-[300]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          aria-hidden
        >
          <motion.div
            className="page-transition-bar absolute top-0 left-0 h-full w-full origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.38, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="page-transition-flash absolute inset-0"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
