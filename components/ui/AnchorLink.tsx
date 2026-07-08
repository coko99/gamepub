"use client";

import Link from "next/link";
import { MouseEvent, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  isHashLink,
  isRouteLink,
  MOBILE_NAV_SCROLL_DELAY,
  normalizeHash,
  resolveHashHref,
  scrollToSection,
} from "@/lib/scroll";

interface AnchorLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  onNavigate?: () => void;
}

export function AnchorLink({
  href,
  className,
  children,
  onNavigate,
}: AnchorLinkProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const hash = normalizeHash(href);
    onNavigate?.();

    if (!hash) return;

    if (pathname === "/") {
      event.preventDefault();
      window.setTimeout(
        () => scrollToSection(hash),
        onNavigate ? MOBILE_NAV_SCROLL_DELAY : 0,
      );
      return;
    }

    event.preventDefault();
    const target = resolveHashHref(href);
    window.setTimeout(() => {
      router.push(target);
    }, onNavigate ? 80 : 0);
  };

  if (isRouteLink(href)) {
    return (
      <Link href={href} onClick={() => onNavigate?.()} className={className}>
        {children}
      </Link>
    );
  }

  if (isHashLink(href)) {
    return (
      <Link href={resolveHashHref(href)} onClick={handleClick} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} onClick={() => onNavigate?.()} className={className}>
      {children}
    </a>
  );
}
