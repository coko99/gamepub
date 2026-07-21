"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/app/admin/actions";
import { belgradeStatDate } from "@/lib/shiftStats";
import { createServiceClient } from "@/lib/supabase/server";
import type { OrderItem, OrderStatus } from "@/lib/types/menu";

function revalidateStats() {
  revalidatePath("/admin/statistika");
  revalidatePath("/admin/porudzbine");
}

type OrderRow = {
  id: string;
  table_zone: string;
  total: number;
  status: OrderStatus;
  created_at: string;
  order_items: OrderItem[] | null;
};

async function archiveOrdersToStats(supabase: ReturnType<typeof createServiceClient>) {
  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, table_zone, total, status, created_at, order_items(product_id, product_name, unit_price, quantity)");

  if (error) {
    return { ok: false as const, error: error.message };
  }

  const rows = (orders ?? []) as OrderRow[];
  if (rows.length === 0) {
    return { ok: true as const, archived: 0 };
  }

  const zoneBuckets = new Map<
    string,
    Map<string, { orderCount: number; revenue: number }>
  >();
  const productBuckets = new Map<
    string,
    Map<string, { productId: string | null; qty: number; revenue: number }>
  >();

  for (const order of rows) {
    if (order.status === "otkazano") continue;

    const date = belgradeStatDate(order.created_at);
    const zone = order.table_zone?.trim() || "—";

    const byZone = zoneBuckets.get(date) ?? new Map();
    const zoneRow = byZone.get(zone) ?? { orderCount: 0, revenue: 0 };
    zoneRow.orderCount += 1;
    zoneRow.revenue += Number(order.total);
    byZone.set(zone, zoneRow);
    zoneBuckets.set(date, byZone);

    for (const item of order.order_items ?? []) {
      const byProduct = productBuckets.get(date) ?? new Map();
      const name = item.product_name?.trim() || "Nepoznato";
      const productRow = byProduct.get(name) ?? {
        productId: item.product_id,
        qty: 0,
        revenue: 0,
      };
      productRow.qty += item.quantity;
      productRow.revenue += Number(item.unit_price) * item.quantity;
      if (item.product_id) productRow.productId = item.product_id;
      byProduct.set(name, productRow);
      productBuckets.set(date, byProduct);
    }
  }

  for (const [date, zones] of zoneBuckets) {
    for (const [zone, stats] of zones) {
      const { error: rpcError } = await supabase.rpc("increment_daily_zone_stat", {
        p_date: date,
        p_zone: zone,
        p_orders: stats.orderCount,
        p_revenue: stats.revenue,
      });
      if (rpcError) {
        return { ok: false as const, error: rpcError.message };
      }
    }
  }

  for (const [date, products] of productBuckets) {
    for (const [name, stats] of products) {
      const { error: rpcError } = await supabase.rpc("increment_daily_product_stat", {
        p_date: date,
        p_name: name,
        p_product_id: stats.productId,
        p_qty: stats.qty,
        p_revenue: stats.revenue,
      });
      if (rpcError) {
        return { ok: false as const, error: rpcError.message };
      }
    }
  }

  return { ok: true as const, archived: rows.length };
}

/** Arhivira statistiku i briše sve porudžbine i pozive konobara. */
export async function closeShiftAndClearOrders() {
  await requireAdmin();
  const supabase = createServiceClient();

  const archive = await archiveOrdersToStats(supabase);
  if (!archive.ok) {
    if (archive.error.includes("increment_daily")) {
      return {
        ok: false as const,
        error: "Pokreni supabase/migration_order_stats.sql u Supabase SQL Editoru.",
      };
    }
    return archive;
  }

  const { count: callsCount } = await supabase
    .from("table_calls")
    .delete({ count: "exact" })
    .gte("created_at", "1970-01-01T00:00:00Z");

  const { error: ordersError } = await supabase
    .from("orders")
    .delete()
    .gte("created_at", "1970-01-01T00:00:00Z");

  if (ordersError) {
    return { ok: false as const, error: ordersError.message };
  }

  await supabase.from("shift_closes").insert({
    orders_archived: archive.archived,
    calls_cleared: callsCount ?? 0,
  });

  revalidateStats();
  return {
    ok: true as const,
    archived: archive.archived,
    callsCleared: callsCount ?? 0,
  };
}
