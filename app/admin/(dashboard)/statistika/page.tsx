import type { Metadata } from "next";
import { requireAdmin } from "@/app/admin/actions";
import { belgradeStatDate } from "@/lib/shiftStats";
import { createServiceClient } from "@/lib/supabase/server";
import { StatsAdmin } from "@/components/admin/StatsAdmin";
import type {
  DailyProductStat,
  DailyZoneStat,
  LiveDaySnapshot,
  ShiftCloseRow,
} from "@/lib/types/menu";

export const metadata: Metadata = {
  title: "Statistika",
};

type OrderRow = {
  table_zone: string;
  total: number;
  status: string;
  created_at: string;
  order_items: { product_name: string; unit_price: number; quantity: number }[] | null;
};

function aggregateLiveOrders(orders: OrderRow[]): LiveDaySnapshot[] {
  const byDate = new Map<string, LiveDaySnapshot>();

  for (const order of orders) {
    if (order.status === "otkazano") continue;

    const date = belgradeStatDate(order.created_at);
    const snap = byDate.get(date) ?? {
      stat_date: date,
      order_count: 0,
      total_revenue: 0,
      zones: [],
      products: [],
    };

    snap.order_count += 1;
    snap.total_revenue += Number(order.total);

    const zoneName = order.table_zone?.trim() || "—";
    let zone = snap.zones.find((z) => z.table_zone === zoneName);
    if (!zone) {
      zone = { table_zone: zoneName, order_count: 0, total_revenue: 0 };
      snap.zones.push(zone);
    }
    zone.order_count += 1;
    zone.total_revenue += Number(order.total);

    for (const item of order.order_items ?? []) {
      const name = item.product_name?.trim() || "Nepoznato";
      let product = snap.products.find((p) => p.product_name === name);
      if (!product) {
        product = { product_name: name, quantity_sold: 0, total_revenue: 0 };
        snap.products.push(product);
      }
      product.quantity_sold += item.quantity;
      product.total_revenue += Number(item.unit_price) * item.quantity;
    }

    byDate.set(date, snap);
  }

  return [...byDate.values()].sort((a, b) => b.stat_date.localeCompare(a.stat_date));
}

export default async function StatistikaPage() {
  await requireAdmin();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <p className="text-soft-white/60">
        Podesi Supabase env varijable (.env.local) za statistiku.
      </p>
    );
  }

  const supabase = createServiceClient();

  const [
    { data: zoneStats, error: zoneError },
    { data: productStats, error: productError },
    { data: liveOrders },
    { data: shiftCloses },
    { data: topAllTime },
  ] = await Promise.all([
    supabase
      .from("order_daily_zone_stats")
      .select("*")
      .order("stat_date", { ascending: false }),
    supabase
      .from("order_daily_product_stats")
      .select("*")
      .order("stat_date", { ascending: false }),
    supabase
      .from("orders")
      .select(
        "table_zone, total, status, created_at, order_items(product_name, unit_price, quantity)",
      ),
    supabase
      .from("shift_closes")
      .select("*")
      .order("closed_at", { ascending: false })
      .limit(10),
    supabase.from("order_daily_product_stats").select("product_name, quantity_sold, total_revenue"),
  ]);

  const statsMissing =
    zoneError?.message.includes("order_daily") ||
    productError?.message.includes("order_daily");

  const archivedZones = (zoneStats ?? []) as DailyZoneStat[];
  const archivedProducts = (productStats ?? []) as DailyProductStat[];
  const liveSnapshots = aggregateLiveOrders((liveOrders ?? []) as OrderRow[]);

  const allTimeMap = new Map<string, { quantity_sold: number; total_revenue: number }>();
  for (const row of topAllTime ?? []) {
    const name = row.product_name as string;
    const existing = allTimeMap.get(name) ?? { quantity_sold: 0, total_revenue: 0 };
    existing.quantity_sold += Number(row.quantity_sold);
    existing.total_revenue += Number(row.total_revenue);
    allTimeMap.set(name, existing);
  }

  for (const snap of liveSnapshots) {
    for (const product of snap.products) {
      const existing = allTimeMap.get(product.product_name) ?? {
        quantity_sold: 0,
        total_revenue: 0,
      };
      existing.quantity_sold += product.quantity_sold;
      existing.total_revenue += product.total_revenue;
      allTimeMap.set(product.product_name, existing);
    }
  }

  const topProductsAllTime = [...allTimeMap.entries()]
    .map(([product_name, stats]) => ({ product_name, ...stats }))
    .sort((a, b) => b.quantity_sold - a.quantity_sold)
    .slice(0, 15);

  const archivedDates = [...new Set(archivedZones.map((z) => z.stat_date))].sort((a, b) =>
    b.localeCompare(a),
  );

  const liveOrderCount = (liveOrders ?? []).filter((o) => o.status !== "otkazano").length;

  return (
    <StatsAdmin
      statsMissing={Boolean(statsMissing)}
      archivedZones={archivedZones.map((z) => ({
        ...z,
        order_count: Number(z.order_count),
        total_revenue: Number(z.total_revenue),
      }))}
      archivedProducts={archivedProducts.map((p) => ({
        ...p,
        quantity_sold: Number(p.quantity_sold),
        total_revenue: Number(p.total_revenue),
      }))}
      liveSnapshots={liveSnapshots}
      archivedDates={archivedDates}
      topProductsAllTime={topProductsAllTime}
      shiftCloses={(shiftCloses ?? []) as ShiftCloseRow[]}
      liveOrderCount={liveOrderCount}
    />
  );
}
