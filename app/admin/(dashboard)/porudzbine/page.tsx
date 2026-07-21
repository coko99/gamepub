import type { Metadata } from "next";
import { requireStaff } from "@/app/admin/actions";
import { createServiceClient } from "@/lib/supabase/server";
import type { Order, OrderItem } from "@/lib/types/menu";
import { OrdersDashboard } from "@/components/admin/OrdersDashboard";

export const metadata: Metadata = {
  title: "Porudžbine",
};

export default async function PorudzbinePage() {
  await requireStaff();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <p className="text-soft-white/60">
        Podesi Supabase env varijable (.env.local) da bi video porudžbine.
      </p>
    );
  }

  const supabase = createServiceClient();
  const since = new Date();
  since.setHours(since.getHours() - 24);

  const [{ data: orders, error }, { data: zones }] = await Promise.all([
    supabase
      .from("orders")
      .select("*, order_items(*)")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: false }),
    supabase.from("table_zones").select("*").order("sort_order"),
  ]);

  if (error) {
    return <p className="text-red-400">Greška: {error.message}</p>;
  }

  const initial = (orders ?? []).map((o) => ({
    ...o,
    table_zone: o.table_zone ?? "—",
    total: Number(o.total),
    order_items: ((o.order_items as OrderItem[]) ?? []).map((i) => ({
      ...i,
      unit_price: Number(i.unit_price),
    })),
  })) as Order[];

  return <OrdersDashboard initialOrders={initial} zones={zones ?? []} />;
}
