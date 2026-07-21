"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { closeShiftAndClearOrders } from "@/app/admin/(dashboard)/statistika/actions";
import {
  DailyTrendChart,
  DonutZoneChart,
  HorizontalBarChart,
} from "@/components/admin/StatsCharts";
import type {
  DailyProductStat,
  DailyZoneStat,
  LiveDaySnapshot,
  ShiftCloseRow,
} from "@/lib/types/menu";
import { formatPrice } from "@/lib/types/menu";
import { formatStatDateLabel } from "@/lib/shiftStats";

type TopProduct = {
  product_name: string;
  quantity_sold: number;
  total_revenue: number;
};

type Props = {
  statsMissing: boolean;
  archivedZones: DailyZoneStat[];
  archivedProducts: DailyProductStat[];
  liveSnapshots: LiveDaySnapshot[];
  archivedDates: string[];
  topProductsAllTime: TopProduct[];
  shiftCloses: ShiftCloseRow[];
  liveOrderCount: number;
};

function shortDayLabel(statDate: string) {
  const [y, m, d] = statDate.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("sr-RS", {
    day: "numeric",
    month: "short",
  });
}

export function StatsAdmin({
  statsMissing,
  archivedZones,
  archivedProducts,
  liveSnapshots,
  archivedDates,
  topProductsAllTime,
  shiftCloses,
  liveOrderCount,
}: Props) {
  const allDates = useMemo(() => {
    const set = new Set(archivedDates);
    for (const snap of liveSnapshots) set.add(snap.stat_date);
    return [...set].sort((a, b) => b.localeCompare(a));
  }, [archivedDates, liveSnapshots]);

  const [selectedDate, setSelectedDate] = useState(allDates[0] ?? "");
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const isLiveDay = liveSnapshots.some((s) => s.stat_date === selectedDate);
  const liveSnap = liveSnapshots.find((s) => s.stat_date === selectedDate);

  const dayZones = useMemo(() => {
    const archived = archivedZones.filter((z) => z.stat_date === selectedDate);
    if (!liveSnap) return archived.sort((a, b) => b.order_count - a.order_count);

    const merged = new Map<string, DailyZoneStat>();
    for (const z of archived) merged.set(z.table_zone, { ...z });
    for (const z of liveSnap.zones) {
      const existing = merged.get(z.table_zone);
      if (existing) {
        existing.order_count += z.order_count;
        existing.total_revenue += z.total_revenue;
      } else {
        merged.set(z.table_zone, {
          stat_date: selectedDate,
          table_zone: z.table_zone,
          order_count: z.order_count,
          total_revenue: z.total_revenue,
        });
      }
    }
    return [...merged.values()].sort((a, b) => b.order_count - a.order_count);
  }, [archivedZones, liveSnap, selectedDate]);

  const dayProducts = useMemo(() => {
    const archived = archivedProducts.filter((p) => p.stat_date === selectedDate);
    if (!liveSnap) return archived.sort((a, b) => b.quantity_sold - a.quantity_sold);

    const merged = new Map<string, DailyProductStat>();
    for (const p of archived) merged.set(p.product_name, { ...p });
    for (const p of liveSnap.products) {
      const existing = merged.get(p.product_name);
      if (existing) {
        existing.quantity_sold += p.quantity_sold;
        existing.total_revenue += p.total_revenue;
      } else {
        merged.set(p.product_name, {
          stat_date: selectedDate,
          product_name: p.product_name,
          quantity_sold: p.quantity_sold,
          total_revenue: p.total_revenue,
        });
      }
    }
    return [...merged.values()].sort((a, b) => b.quantity_sold - a.quantity_sold);
  }, [archivedProducts, liveSnap, selectedDate]);

  const dayTotals = useMemo(() => {
    const archivedOrders = archivedZones
      .filter((z) => z.stat_date === selectedDate)
      .reduce((s, z) => s + z.order_count, 0);
    const archivedRevenue = archivedZones
      .filter((z) => z.stat_date === selectedDate)
      .reduce((s, z) => s + z.total_revenue, 0);

    return {
      orders: archivedOrders + (liveSnap?.order_count ?? 0),
      revenue: archivedRevenue + (liveSnap?.total_revenue ?? 0),
    };
  }, [archivedZones, liveSnap, selectedDate]);

  const trendPoints = useMemo(() => {
    const byDate = new Map<string, { orders: number; revenue: number }>();

    for (const z of archivedZones) {
      const row = byDate.get(z.stat_date) ?? { orders: 0, revenue: 0 };
      row.orders += z.order_count;
      row.revenue += z.total_revenue;
      byDate.set(z.stat_date, row);
    }
    for (const snap of liveSnapshots) {
      const row = byDate.get(snap.stat_date) ?? { orders: 0, revenue: 0 };
      row.orders += snap.order_count;
      row.revenue += snap.total_revenue;
      byDate.set(snap.stat_date, row);
    }

    return [...byDate.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-14)
      .map(([date, stats]) => ({
        date,
        label: shortDayLabel(date),
        orders: stats.orders,
        revenue: stats.revenue,
      }));
  }, [archivedZones, liveSnapshots]);

  function onCloseShift() {
    if (
      !window.confirm(
        "Arhivirati sve porudžbine u statistiku i očistiti live listu? Ova akcija se ne može poništiti.",
      )
    ) {
      return;
    }
    setMessage(null);
    startTransition(async () => {
      const result = await closeShiftAndClearOrders();
      if (!result.ok) {
        setMessage({ type: "err", text: result.error });
        return;
      }
      setMessage({
        type: "ok",
        text: `Smene zatvorena — arhivirano ${result.archived} porudžbina, obrisano ${result.callsCleared} poziva.`,
      });
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-soft-white">Statistika</h1>
        <p className="mt-1 text-sm text-soft-white/55">
          Pregled porudžbina po danima, zonama i artiklima.
        </p>
      </div>

      {statsMissing ? (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Pokreni <code className="text-gold">supabase/migration_order_stats.sql</code> u Supabase
          SQL Editoru da bi arhiva radila.
        </p>
      ) : null}

      {message ? (
        <p
          className={`rounded-xl px-4 py-3 text-sm ${
            message.type === "ok"
              ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
              : "border border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {message.text}
        </p>
      ) : null}

      {trendPoints.length > 0 ? (
        <section className="rounded-2xl border border-gold/15 bg-forest-deep/30 p-5">
          <h2 className="font-serif text-xl text-gold">Trend (poslednjih dana)</h2>
          <p className="mt-1 text-xs text-soft-white/45">Broj porudžbina po danu</p>
          <div className="mt-5">
            <DailyTrendChart points={trendPoints} />
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="font-serif text-2xl text-gold">Pregled po danima</h2>
        {allDates.length === 0 ? (
          <p className="mt-4 text-sm text-soft-white/50">
            Još nema podataka. Statistika se puni posle zatvaranja smene ili tokom dana (live).
          </p>
        ) : (
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              {allDates.map((date) => (
                <button
                  key={date}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={`rounded-full px-3 py-1.5 text-sm ${
                    selectedDate === date
                      ? "bg-gold text-black"
                      : "border border-gold/25 text-soft-white/70"
                  }`}
                >
                  {formatStatDateLabel(date)}
                  {liveSnapshots.some((s) => s.stat_date === date) ? " · live" : ""}
                </button>
              ))}
            </div>

            {selectedDate ? (
              <div className="mt-6 space-y-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <StatCard label="Porudžbine" value={String(dayTotals.orders)} />
                  <StatCard label="Promet" value={formatPrice(dayTotals.revenue)} />
                </div>

                {isLiveDay ? (
                  <p className="text-xs text-gold/80">
                    Ovaj dan uključuje i trenutne (nearhivirane) porudžbine u sistemu.
                  </p>
                ) : null}

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-2xl border border-gold/15 bg-black/30 p-5">
                    <h3 className="mb-4 font-medium text-soft-white">Porudžbine po zonama</h3>
                    <DonutZoneChart
                      items={dayZones.map((z) => ({
                        label: z.table_zone,
                        value: z.order_count,
                      }))}
                    />
                    <div className="mt-5 border-t border-gold/10 pt-4">
                      <HorizontalBarChart
                        items={dayZones.map((z) => ({
                          label: z.table_zone,
                          value: z.total_revenue,
                          sublabel: `${z.order_count} porudžbina`,
                        }))}
                        valueLabel={(v) => formatPrice(v)}
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gold/15 bg-black/30 p-5">
                    <h3 className="mb-4 font-medium text-soft-white">Top artikli (dan)</h3>
                    <HorizontalBarChart
                      items={dayProducts.slice(0, 8).map((p) => ({
                        label: p.product_name,
                        value: p.quantity_sold,
                        sublabel: formatPrice(p.total_revenue),
                      }))}
                      valueLabel={(v) => `${v} kom`}
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </>
        )}
      </section>

      <section className="rounded-2xl border border-gold/15 bg-black/30 p-5">
        <h2 className="font-serif text-xl text-gold">Ukupno najtraženiji artikli</h2>
        <p className="mt-1 text-xs text-soft-white/45">Arhiva + trenutne nearhivirane porudžbine.</p>
        <div className="mt-5">
          <HorizontalBarChart
            items={topProductsAllTime.slice(0, 10).map((p) => ({
              label: p.product_name,
              value: p.quantity_sold,
              sublabel: formatPrice(p.total_revenue),
            }))}
            valueLabel={(v) => `${v} kom`}
            emptyText="Još nema podataka."
          />
        </div>
      </section>

      {shiftCloses.length > 0 ? (
        <section className="rounded-2xl border border-gold/10 bg-black/20 p-4">
          <h2 className="text-sm font-medium text-soft-white/70">Poslednja zatvaranja smene</h2>
          <ul className="mt-3 space-y-1 text-xs text-soft-white/45">
            {shiftCloses.map((row) => (
              <li key={row.id}>
                {new Date(row.closed_at).toLocaleString("sr-RS")} — arhivirano{" "}
                {row.orders_archived} porudžbina, obrisano {row.calls_cleared} poziva
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-gold/20 bg-forest-deep/40 p-5">
        <h2 className="font-medium text-gold">Završetak smene</h2>
        <p className="mt-1 text-sm text-soft-white/55">
          Arhiviraj porudžbine u statistiku i očisti live panel. Trenutno aktivno:{" "}
          <span className="font-semibold text-soft-white">{liveOrderCount}</span> porudžbina.
        </p>
        <button
          type="button"
          disabled={pending}
          onClick={onCloseShift}
          className="mt-4 rounded-xl border border-gold/40 bg-gold/10 px-5 py-3 text-sm font-semibold text-gold transition hover:bg-gold/20 disabled:opacity-40"
        >
          {pending ? "Obrađujem…" : "Završi smenu i očisti porudžbine"}
        </button>
        <p className="mt-2 text-xs text-soft-white/40">
          Meni i cenovnik ostaju netaknuti — brišu se samo porudžbine i pozivi konobara.
        </p>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gold/15 bg-forest-deep/50 px-4 py-3">
      <p className="text-xs uppercase tracking-wider text-soft-white/45">{label}</p>
      <p className="mt-1 font-serif text-2xl text-gold">{value}</p>
    </div>
  );
}
