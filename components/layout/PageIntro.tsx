"use client";

import { motion } from "framer-motion";

interface PageIntroProps {
  tag: string;
  title: string;
  description: string;
}

export function PageIntro({ tag, title, description }: PageIntroProps) {
  return (
    <section className="relative overflow-hidden pt-28 pb-12 md:pt-32 md:pb-16">
      <div className="absolute inset-0 bg-[#050510]" />
      <div className="absolute top-0 left-1/2 h-64 w-[480px] -translate-x-1/2 rounded-full bg-[#6C2DFF]/15 blur-[100px]" />
      <div className="absolute top-20 right-0 h-40 w-40 rounded-full bg-[#00E5FF]/10 blur-[80px]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <span className="font-gaming mb-4 inline-block text-xs tracking-[0.35em] text-[#00E5FF] uppercase">
            {tag}
          </span>
          <h1 className="font-heading text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#B8B8C8] md:text-lg">
            {description}
          </p>
          <div className="mt-6 h-px w-24 bg-gradient-to-r from-[#6C2DFF] to-[#00E5FF]" />
        </motion.div>
      </div>
    </section>
  );
}
