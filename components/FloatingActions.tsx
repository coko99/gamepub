"use client";

import { useState } from "react";
import { FloatingContact } from "@/components/FloatingContact";
import { ReservationBot } from "@/components/ReservationBot";

/** Desni ugao: ćaskanje otvara bot, WhatsApp, Viber i poziv. */
export function FloatingActions() {
  const [botOpen, setBotOpen] = useState(false);

  return (
    <>
      <ReservationBot
        open={botOpen}
        onOpenChange={setBotOpen}
        showTrigger={false}
      />
      <div className="fixed right-5 bottom-5 z-50 md:right-8 md:bottom-8">
        <FloatingContact stacked onOpenBot={() => setBotOpen(true)} />
      </div>
    </>
  );
}
