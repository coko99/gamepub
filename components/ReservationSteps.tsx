"use client";

import { motion, useReducedMotion } from "framer-motion";
import { reservationSteps } from "@/content/site";
import { useMounted } from "@/hooks/useMounted";
import { SectionHeading } from "./ui/SectionHeading";
import { ScrollReveal } from "./ui/ScrollReveal";

function ProgressLine() {
  const mounted = useMounted();
  const prefersReducedMotion = useReducedMotion();

  if (!mounted) {
    return <div className="h-full w-0 bg-gradient-to-r from-[#6C2DFF] via-[#00E5FF] to-[#FF2BD6]" />;
  }

  return (
    <motion.div
      className="h-full bg-gradient-to-r from-[#6C2DFF] via-[#00E5FF] to-[#FF2BD6]"
      initial={prefersReducedMotion ? { width: "100%" } : { width: "0%" }}
      whileInView={{ width: "100%" }}
      viewport={{ once: true }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    />
  );
}

export function ReservationSteps() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-[#080816]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <SectionHeading
          title={reservationSteps.title}
          tag="Rezervacija"
        />

        <div className="relative">
          <div className="absolute top-8 right-[16.67%] left-[16.67%] hidden h-0.5 bg-[#1A1A2E] md:block">
            <ProgressLine />
          </div>

          <div className="grid gap-8 md:grid-cols-3 md:gap-6">
            {reservationSteps.steps.map((step, i) => (
              <ScrollReveal key={step.number} delay={i * 0.15}>
                <div className="relative text-center">
                  <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#6C2DFF] to-[#00E5FF] opacity-20 blur-md" />
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#00E5FF]/50 bg-[#101024]">
                      <span className="font-gaming text-xl font-bold text-[#00E5FF]">
                        {step.number}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-heading mb-2 text-lg font-bold text-white md:text-xl">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#B8B8C8] md:text-base">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
