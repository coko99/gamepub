const HEADER_OFFSET = 88;
export const MOBILE_NAV_SCROLL_DELAY = 180;

export function scrollToSection(hash: string) {
  const id = hash.replace(/^#/, "");

  if (!id || id === "pocetna") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.replaceState(null, "", "#pocetna");
    return;
  }

  const target = document.getElementById(id);
  if (!target) return;

  const top =
    target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;

  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  window.history.replaceState(null, "", `#${id}`);
}

export function normalizeHash(href: string) {
  if (href.startsWith("/#")) return href.slice(1);
  if (href.startsWith("#")) return href;
  return null;
}

export function isHashLink(href?: string) {
  if (!href) return false;
  return href.startsWith("#") || href.startsWith("/#");
}

export function isRouteLink(href: string) {
  return href.startsWith("/") && !href.startsWith("/#");
}

export function resolveHashHref(href: string) {
  if (href.startsWith("/#")) return href;
  if (href.startsWith("#")) return `/${href}`;
  return href;
}

export function scrollToSectionAfterNav(
  href: string,
  delay = MOBILE_NAV_SCROLL_DELAY,
) {
  const hash = normalizeHash(href);
  if (!hash) return;

  window.setTimeout(() => scrollToSection(hash), delay);
}
