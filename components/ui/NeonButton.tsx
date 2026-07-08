"use client";

import { ReactNode, MouseEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  isHashLink,
  isRouteLink,
  MOBILE_NAV_SCROLL_DELAY,
  normalizeHash,
  resolveHashHref,
  scrollToSection,
} from "@/lib/scroll";

interface NeonButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  type?: "button" | "submit";
  target?: string;
  rel?: string;
}

export function NeonButton({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  target,
  rel,
}: NeonButtonProps) {
  const pathname = usePathname();
  const router = useRouter();

  const variants = {
    primary:
      "bg-gradient-to-r from-[#6C2DFF] to-[#00E5FF] text-white shadow-[0_0_30px_rgba(0,229,255,0.35)] hover:shadow-[0_0_45px_rgba(108,45,255,0.5)]",
    secondary:
      "bg-gradient-to-r from-[#FF2BD6] to-[#6C2DFF] text-white shadow-[0_0_30px_rgba(255,43,214,0.3)] hover:shadow-[0_0_45px_rgba(255,43,214,0.45)]",
    outline:
      "border border-[#00E5FF]/40 bg-white/5 text-white backdrop-blur-sm hover:border-[#00E5FF]/70 hover:bg-[#00E5FF]/10",
  };

  const baseClasses = `inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] md:px-8 md:py-4 md:text-base ${variants[variant]} ${className}`;

  const handleClick = (
    event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => {
    onClick?.();

    const hash = href ? normalizeHash(href) : null;
    if (!hash) return;

    if (pathname === "/") {
      event.preventDefault();
      window.setTimeout(
        () => scrollToSection(hash),
        onClick ? MOBILE_NAV_SCROLL_DELAY : 0,
      );
      return;
    }

    event.preventDefault();
    router.push(resolveHashHref(href!));
  };

  if (href) {
    if (isRouteLink(href)) {
      return (
        <Link
          href={href}
          onClick={onClick}
          target={target}
          rel={rel}
          className={baseClasses}
        >
          {children}
        </Link>
      );
    }

    if (isHashLink(href)) {
      return (
        <Link
          href={resolveHashHref(href)}
          onClick={handleClick}
          target={target}
          rel={rel}
          className={baseClasses}
        >
          {children}
        </Link>
      );
    }

    return (
      <a
        href={href}
        onClick={onClick}
        target={target}
        rel={rel}
        className={baseClasses}
      >
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={handleClick} className={baseClasses}>
      {children}
    </button>
  );
}
