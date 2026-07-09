import Image from "next/image";
import { MapPin, Phone, Star } from "lucide-react";
import { footerContent, getContactLinks, siteConfig } from "@/content/site";
import { AnchorLink } from "./ui/AnchorLink";

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

const socialLinks = [
  {
    id: "instagram",
    href: siteConfig.instagramUrl,
    label: siteConfig.instagram,
    sublabel: footerContent.social.instagram,
    icon: InstagramIcon,
    gradient: "from-[#FF2BD6] via-[#FF6B9D] to-[#FFB347]",
    glow: "rgba(255, 43, 214, 0.45)",
    ring: "hover:border-[#FF2BD6]/50 hover:shadow-[0_0_28px_rgba(255,43,214,0.35)]",
    iconClass: "text-[#FF2BD6]",
  },
  {
    id: "maps",
    href: siteConfig.mapLink,
    label: footerContent.social.maps,
    sublabel: siteConfig.address,
    icon: MapPin,
    gradient: "from-[#00E5FF] to-[#2F6BFF]",
    glow: "rgba(0, 229, 255, 0.4)",
    ring: "hover:border-[#00E5FF]/50 hover:shadow-[0_0_28px_rgba(0,229,255,0.3)]",
    iconClass: "text-[#00E5FF]",
  },
  {
    id: "review",
    href: siteConfig.googleReview,
    label: footerContent.social.review,
    sublabel: `${siteConfig.googleRating} · ${siteConfig.googleReviewCount} ocena`,
    icon: Star,
    gradient: "from-[#FFD600] to-[#FF9F43]",
    glow: "rgba(255, 214, 0, 0.4)",
    ring: "hover:border-[#FFD600]/50 hover:shadow-[0_0_28px_rgba(255,214,0,0.25)]",
    iconClass: "text-[#FFD600]",
  },
] as const;

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-[#050510]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00E5FF]/60 to-transparent" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[min(100%,36rem)] -translate-x-1/2 rounded-full bg-[#6C2DFF]/15 blur-[80px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20 lg:px-8">
        <div className="glass-card relative overflow-hidden rounded-3xl border border-white/10 p-6 md:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(108,45,255,0.08)_0%,transparent_45%,rgba(0,229,255,0.06)_100%)]" />

          <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-2 rounded-2xl bg-[#00E5FF]/20 blur-xl" />
                  <Image
                    src="/logo-transparent.png"
                    alt="Gamepub Kruševac"
                    width={120}
                    height={120}
                    className="relative h-16 w-16 object-contain md:h-[4.5rem] md:w-[4.5rem]"
                  />
                </div>
                <div>
                  <p className="font-gaming text-xs tracking-[0.25em] text-[#00E5FF] uppercase">
                    Gamepub
                  </p>
                  <p className="font-heading text-lg font-bold text-white md:text-xl">
                    Kruševac
                  </p>
                </div>
              </div>

              <p className="mt-5 max-w-md text-sm leading-relaxed text-[#B8B8C8] md:text-base">
                {footerContent.description}
              </p>

              <p className="font-gaming mt-3 text-xs tracking-wider text-[#00E5FF]/80">
                {footerContent.tagline}
              </p>

              <div className="mt-6 space-y-2 text-sm text-[#B8B8C8]">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-[#6C2DFF]" />
                  <span>{siteConfig.address}</span>
                </div>
                <a
                  href={getContactLinks().tel}
                  className="flex items-center gap-2 transition-colors hover:text-[#00E5FF]"
                >
                  <Phone className="h-4 w-4 shrink-0 text-[#00E5FF]" />
                  <span>{siteConfig.phone}</span>
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex items-center gap-3 rounded-2xl border border-white/10 bg-[#050510]/60 px-3 py-2.5 transition-all duration-300 hover:-translate-y-0.5 ${item.ring}`}
                      aria-label={`${item.label} — ${item.sublabel}`}
                    >
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} shadow-[0_0_20px_var(--social-glow)] transition-transform group-hover:scale-105`}
                        style={{ "--social-glow": item.glow } as React.CSSProperties}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </span>
                      <span className="min-w-0 pr-1">
                        <span className="block text-xs font-semibold text-white">
                          {item.label}
                        </span>
                        <span className="block truncate text-[11px] text-[#B8B8C8]">
                          {item.sublabel}
                        </span>
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:col-span-7 lg:gap-10">
              <div>
                <h4 className="font-gaming mb-5 text-xs tracking-[0.2em] text-[#00E5FF] uppercase">
                  Navigacija
                </h4>
                <nav className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  {footerContent.links.map((link) => (
                    <AnchorLink
                      key={link.href}
                      href={link.href}
                      className="group flex items-center gap-2 text-sm text-[#B8B8C8] transition-colors hover:text-white"
                    >
                      <span className="h-1 w-1 rounded-full bg-[#6C2DFF]/50 transition-all group-hover:w-2 group-hover:bg-[#00E5FF]" />
                      {link.label}
                    </AnchorLink>
                  ))}
                </nav>
              </div>

              <div>
                <h4 className="font-gaming mb-5 text-xs tracking-[0.2em] text-[#FF2BD6] uppercase">
                  Instagram
                </h4>
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 rounded-2xl border border-[#FF2BD6]/20 bg-gradient-to-br from-[#FF2BD6]/10 to-[#6C2DFF]/5 p-4 transition-all duration-300 hover:border-[#FF2BD6]/45 hover:shadow-[0_0_30px_rgba(255,43,214,0.2)]"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#FF2BD6]/30 bg-[#FF2BD6]/15 shadow-[0_0_24px_rgba(255,43,214,0.25)] transition-transform group-hover:scale-105">
                    <InstagramIcon className="h-6 w-6 text-[#FF2BD6]" />
                  </span>
                  <span>
                    <span className="font-heading block text-base font-semibold text-white">
                      {siteConfig.instagram}
                    </span>
                    <span className="mt-1 block text-sm text-[#B8B8C8]">
                      Fotke sa rođendana, game night-a i atmosfere u lokalu.
                    </span>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#FF2BD6] transition-colors group-hover:text-[#FF9FF3]">
                      Otvori profil
                      <span aria-hidden>→</span>
                    </span>
                  </span>
                </a>

                <div className="mt-4 rounded-xl border border-white/5 bg-[#050510]/50 px-4 py-3">
                  <p className="text-xs leading-relaxed text-[#B8B8C8]">
                    Rezervacije i upiti: koristi{" "}
                    <AnchorLink
                      href="/kontakt"
                      className="text-[#00E5FF] transition-colors hover:text-white"
                    >
                      kontakt formu
                    </AnchorLink>{" "}
                    ili G-Pub bota na sajtu.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
          <p className="text-center text-xs text-[#B8B8C8]/70 md:text-left">
            {footerContent.copyright}
          </p>
          <div className="flex items-center gap-3">
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#FF2BD6]/30 bg-[#FF2BD6]/10 text-[#FF2BD6] transition-all hover:scale-110 hover:border-[#FF2BD6]/60 hover:shadow-[0_0_20px_rgba(255,43,214,0.35)]"
              aria-label={`Instagram ${siteConfig.instagram}`}
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/10 text-[#00E5FF] transition-all hover:scale-110 hover:border-[#00E5FF]/60 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)]"
              aria-label="Google Maps"
            >
              <MapPin className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.googleReview}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#FFD600]/30 bg-[#FFD600]/10 text-[#FFD600] transition-all hover:scale-110 hover:border-[#FFD600]/60 hover:shadow-[0_0_20px_rgba(255,214,0,0.25)]"
              aria-label="Google recenzije"
            >
              <Star className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-6 flex justify-center border-t border-white/5 pt-6">
          <a
            href={footerContent.poweredBy.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group powered-by-link flex items-center gap-3 rounded-2xl border border-[#00E5FF]/20 bg-[#00E5FF]/5 px-4 py-2.5 transition-all duration-300 hover:border-[#00E5FF]/45 hover:bg-[#00E5FF]/10 hover:shadow-[0_0_28px_rgba(0,229,255,0.25)]"
          >
            <span className="text-[11px] tracking-wide text-[#B8B8C8]/80 uppercase">
              {footerContent.poweredBy.label}
            </span>
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center">
              <span
                className="absolute inset-0 rounded-full bg-[#00E5FF]/25 blur-md transition-all group-hover:bg-[#00E5FF]/40"
                aria-hidden
              />
              <Image
                src={footerContent.poweredBy.logo}
                alt={footerContent.poweredBy.name}
                width={40}
                height={40}
                className="powered-by-logo relative h-10 w-10 rounded-full object-cover"
              />
            </span>
            <span className="font-heading text-sm font-semibold text-[#00E5FF] transition-colors group-hover:text-white">
              {footerContent.poweredBy.name}
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
