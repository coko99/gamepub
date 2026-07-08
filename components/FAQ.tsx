"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqItems } from "@/content/site";
import { SectionHeading } from "./ui/SectionHeading";
import { ScrollReveal } from "./ui/ScrollReveal";

export function FAQ({ compactIntro = false }: { compactIntro?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-16 md:py-24">
      <div className="absolute inset-0 bg-[#050510]" />
      <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-[#FF2BD6]/10 blur-[100px]" />

      <div className="relative mx-auto max-w-3xl px-4 md:px-6 lg:px-8">
        {!compactIntro && <SectionHeading title="Česta pitanja" tag="FAQ" />}

        <div className="space-y-3">
          {faqItems.map((item, i) => {
            const isOpen = openIndex === i;

            return (
              <ScrollReveal key={item.question} delay={i * 0.05}>
                <div className="glass-card overflow-hidden rounded-xl">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left md:p-6"
                    aria-expanded={isOpen}
                  >
                    <span className="font-heading text-sm font-semibold text-white md:text-base">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-[#00E5FF] transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="border-t border-white/5 px-5 pt-0 pb-5 text-sm leading-relaxed text-[#B8B8C8] md:px-6 md:pb-6 md:text-base">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
