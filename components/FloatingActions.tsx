"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { FloatingContact } from "@/components/FloatingContact";

const ReservationBot = dynamic(
  () =>
    import("@/components/ReservationBot").then((mod) => ({
      default: mod.ReservationBot,
    })),
  { ssr: false },
);

/** Desni ugao: ćaskanje otvara bot, WhatsApp, Viber i poziv. */
export function FloatingActions() {
  const [botOpen, setBotOpen] = useState(false);
  const [botMounted, setBotMounted] = useState(false);

  const openBot = () => {
    setBotMounted(true);
    setBotOpen(true);
  };

  return (
    <>
      {botMounted ? (
        <ReservationBot
          open={botOpen}
          onOpenChange={setBotOpen}
          showTrigger={false}
        />
      ) : null}
      <div className="fixed right-5 bottom-5 z-50 md:right-8 md:bottom-8">
        <FloatingContact stacked onOpenBot={openBot} />
      </div>
    </>
  );
}
