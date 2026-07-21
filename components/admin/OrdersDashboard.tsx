"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { updateOrderStatus } from "@/app/admin/(dashboard)/porudzbine/actions";
import { dismissTableCall } from "@/app/admin/(dashboard)/porudzbine/call-actions";
import { pollKitchenFeed } from "@/app/admin/(dashboard)/porudzbine/poll-actions";
import { NewOrderAlert } from "@/components/admin/NewOrderAlert";
import { TableCallAlert } from "@/components/admin/TableCallAlert";
import {
  ORDER_STATUSES,
  formatPrice,
  statusLabel,
  tableLabel,
  type Order,
  type OrderStatus,
  type TableCall,
  type TableZoneRow,
} from "@/lib/types/menu";

type Props = {
  initialOrders: Order[];
  zones: TableZoneRow[];
};

function playBellStrike(ctx: AudioContext, when: number) {
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, when);
  master.gain.exponentialRampToValueAtTime(0.55, when + 0.01);
  master.gain.exponentialRampToValueAtTime(0.0001, when + 0.85);
  master.connect(ctx.destination);

  const partials: [number, number, OscillatorType][] = [
    [784, 0.45, "sine"],
    [1175, 0.28, "sine"],
    [1568, 0.18, "triangle"],
    [2093, 0.1, "sine"],
  ];

  for (const [freq, level, type] of partials) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, when);
    g.gain.setValueAtTime(level, when);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.8);
    osc.connect(g);
    g.connect(master);
    osc.start(when);
    osc.stop(when + 0.9);
  }
}

function playNewOrderSound() {
  try {
    const ctx = new AudioContext();
    const strikes = 3;
    const gap = 0.55;
    for (let i = 0; i < strikes; i++) {
      playBellStrike(ctx, ctx.currentTime + i * gap);
    }
    setTimeout(() => ctx.close(), strikes * gap * 1000 + 1200);
  } catch {
    /* autoplay / unsupported */
  }
}

export function OrdersDashboard({ initialOrders, zones }: Props) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filter, setFilter] = useState<"aktivne" | "sve">("aktivne");
  const [zoneFilter, setZoneFilter] = useState<string | "all">("all");
  const [alertOrder, setAlertOrder] = useState<Order | null>(null);
  const [alertCall, setAlertCall] = useState<TableCall | null>(null);
  const knownIds = useRef(new Set(initialOrders.map((o) => o.id)));
  const dismissedCallIds = useRef(new Set<string>());
  const alertCallRef = useRef<TableCall | null>(null);

  useEffect(() => {
    alertCallRef.current = alertCall;
  }, [alertCall]);

  function showCallAlert(call: TableCall) {
    if (call.status !== "open") return;
    if (dismissedCallIds.current.has(call.id)) return;
    if (alertCallRef.current?.id === call.id) return;
    playNewOrderSound();
    setAlertCall({
      ...call,
      table_zone: call.table_zone ?? "—",
    });
  }

  useEffect(() => {
    let cancelled = false;

    async function tick() {
      const result = await pollKitchenFeed();
      if (cancelled || !result.ok) return;

      setOrders(result.orders);

      for (const order of result.orders) {
        if (order.status === "nova" && !knownIds.current.has(order.id)) {
          knownIds.current.add(order.id);
          playNewOrderSound();
          setAlertOrder(order);
          break;
        }
        knownIds.current.add(order.id);
      }

      if (!alertCallRef.current) {
        const next = result.calls.find((c) => !dismissedCallIds.current.has(c.id));
        if (next) showCallAlert(next);
      }
    }

    void tick();
    const poll = window.setInterval(() => {
      void tick();
    }, 2500);

    return () => {
      cancelled = true;
      window.clearInterval(poll);
    };
  }, []);

  const visible = orders.filter((o) => {
    if (filter === "aktivne" && (o.status === "placeno" || o.status === "otkazano")) {
      return false;
    }
    if (zoneFilter !== "all" && o.table_zone !== zoneFilter) return false;
    return true;
  });

  return (
    <div>
      <NewOrderAlert order={alertOrder} onDismiss={() => setAlertOrder(null)} />
      <TableCallAlert
        call={alertCall}
        onDismiss={() => {
          const id = alertCall?.id;
          if (id) {
            dismissedCallIds.current.add(id);
            void dismissTableCall(id);
          }
          setAlertCall(null);
        }}
      />

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-soft-white">Porudžbine</h1>
          <p className="mt-1 text-sm text-soft-white/55">
            Live prikaz · osvežava se na ~2.5s
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterBtn active={filter === "aktivne"} onClick={() => setFilter("aktivne")}>
            Aktivne
          </FilterBtn>
          <FilterBtn active={filter === "sve"} onClick={() => setFilter("sve")}>
            Sve (24h)
          </FilterBtn>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <FilterBtn active={zoneFilter === "all"} onClick={() => setZoneFilter("all")}>
          Sve zone
        </FilterBtn>
        {zones.map((zone) => (
          <FilterBtn
            key={zone.id}
            active={zoneFilter === zone.name}
            onClick={() => setZoneFilter(zone.name)}
          >
            {zone.name}
          </FilterBtn>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gold/25 px-6 py-16 text-center text-soft-white/50">
          Nema porudžbina. Čekam nove…
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [pending, startTransition] = useTransition();
  const time = new Date(order.created_at).toLocaleTimeString("sr-RS", {
    hour: "2-digit",
    minute: "2-digit",
  });

  function setStatus(status: OrderStatus) {
    startTransition(async () => {
      await updateOrderStatus(order.id, status);
    });
  }

  return (
    <article
      className={`rounded-2xl border p-4 ${
        order.status === "nova"
          ? "border-gold bg-gold/10 shadow-lg shadow-gold/10"
          : "border-gold/20 bg-forest-deep/50"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-serif text-2xl text-gold">
            {tableLabel(order.table_zone, order.table_number)}
          </p>
          <p className="text-xs text-soft-white/50">{time}</p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusBadge(order.status)}`}
        >
          {statusLabel(order.status)}
        </span>
      </div>

      <ul className="mt-4 space-y-1.5 border-t border-gold/15 pt-3 text-sm">
        {(order.order_items ?? []).map((item) => (
          <li key={item.id} className="flex justify-between gap-2">
            <span>
              <span className="text-gold">{item.quantity}×</span> {item.product_name}
            </span>
            <span className="shrink-0 text-soft-white/55">
              {formatPrice(item.unit_price * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      {order.note ? (
        <p className="mt-3 rounded-lg bg-black/30 px-3 py-2 text-sm text-soft-white/80">
          <span className="text-gold/80">Napomena:</span> {order.note}
        </p>
      ) : null}

      <div className="mt-4 flex items-center justify-between border-t border-gold/15 pt-3">
        <span className="text-sm text-soft-white/55">Ukupno</span>
        <span className="text-lg font-semibold text-gold">{formatPrice(order.total)}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {ORDER_STATUSES.map((s) => (
          <button
            key={s.value}
            type="button"
            disabled={pending || order.status === s.value}
            onClick={() => setStatus(s.value)}
            className={`rounded-lg px-2.5 py-1 text-[11px] transition disabled:opacity-40 ${
              order.status === s.value
                ? "bg-gold text-black"
                : "border border-gold/25 text-soft-white/70 hover:border-gold/50 hover:text-gold"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </article>
  );
}

function statusBadge(status: OrderStatus) {
  switch (status) {
    case "nova":
      return "bg-gold text-black";
    case "prihvacena":
      return "bg-blue-500/20 text-blue-300";
    case "u_pripremi":
      return "bg-orange-500/20 text-orange-300";
    case "posluzeno":
      return "bg-emerald-500/20 text-emerald-300";
    case "placeno":
      return "bg-soft-white/10 text-soft-white/60";
    case "otkazano":
      return "bg-red-500/20 text-red-300";
    default:
      return "bg-soft-white/10";
  }
}

function FilterBtn({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-sm ${
        active ? "bg-gold text-black" : "border border-gold/25 text-soft-white/70"
      }`}
    >
      {children}
    </button>
  );
}
