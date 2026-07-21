"use client";

import Image from "next/image";
import { zoneLabel, type Order } from "@/lib/types/menu";

type Props = {
  order: Order | null;
  onDismiss: () => void;
};

export function NewOrderAlert({ order, onDismiss }: Props) {
  if (!order) return null;

  return (
    <button
      type="button"
      className="new-order-alert"
      onClick={onDismiss}
      aria-label={`Nova porudžbina — ${zoneLabel(order.table_zone)}, sto ${order.table_number}`}
    >
      <span className="new-order-alert__flash" aria-hidden />
      <span className="new-order-alert__content">
        <Image
          src="/logo-transparent.png"
          alt="Gamepub"
          width={100}
          height={100}
          className="new-order-alert__logo"
          priority
        />
        <span className="new-order-alert__title">NOVA PORUDŽBINA</span>

        <span className="new-order-alert__location">
          <span className="new-order-alert__badge">
            <span className="new-order-alert__badge-label">Lokacija</span>
            <span className="new-order-alert__badge-value">
              {zoneLabel(order.table_zone)}
            </span>
          </span>
          <span className="new-order-alert__badge new-order-alert__badge--sto">
            <span className="new-order-alert__badge-label">Sto</span>
            <span className="new-order-alert__badge-value new-order-alert__badge-value--num">
              {order.table_number}
            </span>
          </span>
        </span>

        <span className="new-order-alert__hint">Klikni bilo gde da zatvoriš</span>
      </span>
    </button>
  );
}
