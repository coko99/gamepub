"use client";

import { useTransition } from "react";
import { toggleProductFeatured } from "@/app/admin/(dashboard)/meni/actions";

type Props = {
  productId: string;
  featured: boolean;
  labelOn?: string;
  labelOff?: string;
  className?: string;
};

export function FeaturedToggleButton({
  productId,
  featured,
  labelOn = "Ukloni ★",
  labelOff = "Istakni ★",
  className = "rounded-lg border border-gold/25 px-2.5 py-1 text-xs text-gold",
}: Props) {
  const [pending, startTransition] = useTransition();

  function onClick() {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", productId);
      fd.set("featured", featured ? "false" : "true");
      const result = await toggleProductFeatured(fd);
      if (result && !result.ok) {
        window.alert(result.error);
      }
    });
  }

  return (
    <button type="button" disabled={pending} onClick={onClick} className={className}>
      {pending ? "…" : featured ? labelOn : labelOff}
    </button>
  );
}
