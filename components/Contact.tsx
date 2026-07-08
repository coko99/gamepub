"use client";

import { useState, FormEvent } from "react";
import { Phone, MapPin, Send } from "lucide-react";
import { contactContent, getContactLinks, siteConfig } from "@/content/site";
import { NeonButton } from "./ui/NeonButton";
import { ScrollReveal } from "./ui/ScrollReveal";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="kontakt" className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 bg-[#080816]" />
      <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6C2DFF]/15 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <span className="font-gaming mb-4 inline-block text-xs tracking-[0.2em] text-[#00E5FF] uppercase">
            Kontakt
          </span>
          <h2 className="font-heading text-3xl leading-tight font-bold text-white md:text-4xl lg:text-5xl">
            {contactContent.title}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-[#B8B8C8] md:text-lg">
            {contactContent.description}
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-5 lg:gap-12">
          <ScrollReveal direction="left" className="space-y-4 lg:col-span-2">
            <a
              href={getContactLinks().tel}
              className="glass-card group flex items-center gap-4 rounded-xl p-5 transition-all duration-300 hover:border-[#00E5FF]/40"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00E5FF]/10">
                <Phone className="h-5 w-5 text-[#00E5FF]" />
              </div>
              <div>
                <p className="text-xs text-[#B8B8C8]">{contactContent.cards.phone}</p>
                <p className="font-semibold text-white">{siteConfig.phone}</p>
              </div>
            </a>

            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card group flex items-center gap-4 rounded-xl p-5 transition-all duration-300 hover:border-[#FF2BD6]/40"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF2BD6]/10">
                <InstagramIcon className="h-5 w-5 text-[#FF2BD6]" />
              </div>
              <div>
                <p className="text-xs text-[#B8B8C8]">{contactContent.cards.instagram}</p>
                <p className="font-semibold text-white">{siteConfig.instagram}</p>
              </div>
            </a>

            <a
              href={siteConfig.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card group flex items-center gap-4 rounded-xl p-5 transition-all duration-300 hover:border-[#6C2DFF]/40"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#6C2DFF]/10">
                <MapPin className="h-5 w-5 text-[#6C2DFF]" />
              </div>
              <div>
                <p className="text-xs text-[#B8B8C8]">{contactContent.cards.location}</p>
                <p className="font-semibold text-white">{siteConfig.location}</p>
              </div>
            </a>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row lg:flex-col">
              <NeonButton href="#kontakt-form" className="w-full">
                {contactContent.ctaMessage}
              </NeonButton>
              <NeonButton href={getContactLinks().tel} variant="outline" className="w-full">
                {contactContent.ctaCall}
              </NeonButton>
              <NeonButton
                href={siteConfig.googleReview}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                className="w-full"
              >
                Ostavi recenziju
              </NeonButton>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.2} className="lg:col-span-3">
            <div
              id="kontakt-form"
              className="glass-card relative overflow-hidden rounded-2xl p-6 md:p-8"
            >
              <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-[#00E5FF]/10 blur-3xl" />

              {submitted ? (
                <div className="relative py-12 text-center">
                  <Send className="mx-auto mb-4 h-10 w-10 text-[#00E5FF]" />
                  <h3 className="font-heading text-xl font-bold text-white">
                    Poruka poslata!
                  </h3>
                  <p className="mt-2 text-[#B8B8C8]">
                    Javićemo ti se uskoro sa slobodnim terminima.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="relative space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-2 block text-sm text-[#B8B8C8]">
                        {contactContent.form.name}
                      </label>
                      <input
                        id="name"
                        name="name"
                        required
                        className="w-full rounded-xl border border-white/10 bg-[#050510]/60 px-4 py-3 text-white placeholder-[#B8B8C8]/50 outline-none transition-colors focus:border-[#00E5FF]/50"
                        placeholder="Tvoje ime"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="mb-2 block text-sm text-[#B8B8C8]">
                        {contactContent.form.phone}
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        className="w-full rounded-xl border border-white/10 bg-[#050510]/60 px-4 py-3 text-white placeholder-[#B8B8C8]/50 outline-none transition-colors focus:border-[#00E5FF]/50"
                        placeholder="06X XXX XXXX"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="eventType" className="mb-2 block text-sm text-[#B8B8C8]">
                        {contactContent.form.eventType}
                      </label>
                      <select
                        id="eventType"
                        name="eventType"
                        required
                        className="w-full rounded-xl border border-white/10 bg-[#050510]/60 px-4 py-3 text-white outline-none transition-colors focus:border-[#00E5FF]/50"
                      >
                        <option value="">Izaberi...</option>
                        {contactContent.form.eventTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="date" className="mb-2 block text-sm text-[#B8B8C8]">
                        {contactContent.form.date}
                      </label>
                      <input
                        id="date"
                        name="date"
                        type="date"
                        className="w-full rounded-xl border border-white/10 bg-[#050510]/60 px-4 py-3 text-white outline-none transition-colors focus:border-[#00E5FF]/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm text-[#B8B8C8]">
                      {contactContent.form.message}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      className="w-full resize-none rounded-xl border border-white/10 bg-[#050510]/60 px-4 py-3 text-white placeholder-[#B8B8C8]/50 outline-none transition-colors focus:border-[#00E5FF]/50"
                      placeholder="Koliko vas dolazi, koji termin vas zanima..."
                    />
                  </div>

                  <NeonButton type="submit" className="w-full">
                    {contactContent.form.submit}
                  </NeonButton>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
