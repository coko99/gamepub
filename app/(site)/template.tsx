"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { useMounted } from "@/hooks/useMounted";

export default function SiteTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const mounted = useMounted();
  const reducedMotion = useReducedMotion();

  if (!mounted || reducedMotion) {
    return <div className="page-template-shell">{children}</div>;
  }

  return (
    <motion.div
      key={pathname}
      className="page-template-shell"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.24,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
