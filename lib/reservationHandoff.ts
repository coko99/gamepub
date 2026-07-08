import { siteConfig } from "@/content/site";

export function hasMessagingNumber() {
  return siteConfig.phoneDigits.replace(/\D/g, "").length > 0;
}

export function getWhatsAppHandoffUrl(text: string) {
  const digits = siteConfig.phoneDigits.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function getViberHandoffUrl() {
  const digits = siteConfig.phoneDigits.replace(/\D/g, "");
  if (!digits) return null;
  return `viber://chat?number=%2B${digits}`;
}

export async function handoffToViber(text: string) {
  const url = getViberHandoffUrl();
  if (!url) return false;

  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Clipboard may fail on some browsers — still open Viber
  }

  window.location.href = url;
  return true;
}

export function handoffToWhatsApp(text: string) {
  const url = getWhatsAppHandoffUrl(text);
  if (!url) return false;

  window.open(url, "_blank", "noopener,noreferrer");
  return true;
}
