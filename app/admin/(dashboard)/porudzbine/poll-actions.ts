"use server";

import { requireStaff } from "@/app/admin/actions";
import { createServiceClient } from "@/lib/supabase/server";
import type { Order, OrderItem, TableCall } from "@/lib/types/menu";

export async function pollKitchenFeed() {
  await requireStaff();
  const supabase = createServiceClient();
  const since = new Date();
  since.setHours(since.getHours() - 24);

  const [{ data: orders, error: ordersError }, { data: calls, error: callsError }] =
    await Promise.all([
      supabase
        .from("orders")
        .select("*, order_items(*)")
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: false }),
      supabase
        .from("table_calls")
        .select("*")
        .eq("status", "open")
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

  if (ordersError) {
    return { ok: false as const, error: ordersError.message };
  }
  if (callsError) {
    return { ok: false as const, error: callsError.message };
  }

  const mappedOrders = (orders ?? []).map((o) => ({
    ...o,
    table_zone: o.table_zone ?? "—",
    total: Number(o.total),
    order_items: ((o.order_items as OrderItem[]) ?? []).map((i) => ({
      ...i,
      unit_price: Number(i.unit_price),
    })),
  })) as Order[];

  return {
    ok: true as const,
    orders: mappedOrders,
    calls: (calls ?? []) as TableCall[],
  };
}
