"use client";

import Image from "next/image";
import { zoneLabel, type TableCall } from "@/lib/types/menu";

type Props = {
  call: TableCall | null;
  onDismiss: () => void;
};

export function TableCallAlert({ call, onDismiss }: Props) {
  if (!call) return null;

  const isBill = call.call_type === "bill";

  return (
    <button
      type="button"
      className={`table-call-alert ${isBill ? "table-call-alert--bill" : ""}`}
      onClick={onDismiss}
      aria-label="Zatvori poziv"
    >
      <span className="table-call-alert__flash" aria-hidden />
      <span className="table-call-alert__content">
        <Image
          src="/logo-transparent.png"
          alt="Gamepub"
          width={88}
          height={88}
          className="table-call-alert__logo"
          priority
        />
        <span className="table-call-alert__title">
          {isBill ? "ZATRAŽEN RAČUN" : "POZIV KONOBARU"}
        </span>
        <span className="table-call-alert__location">
          <span className="table-call-alert__badge">
            <span className="table-call-alert__badge-label">Lokacija</span>
            <span className="table-call-alert__badge-value">
              {zoneLabel(call.table_zone)}
            </span>
          </span>
          <span className="table-call-alert__badge table-call-alert__badge--sto">
            <span className="table-call-alert__badge-label">Sto</span>
            <span className="table-call-alert__badge-value table-call-alert__badge-value--num">
              {call.table_number}
            </span>
          </span>
        </span>
        <span className="table-call-alert__hint">Klikni bilo gde da potvrdiš</span>
      </span>
    </button>
  );
}
