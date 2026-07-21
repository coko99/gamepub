"use server";

import { cookies, headers } from "next/headers";
import { createServiceClient } from "@/lib/supabase/server";
import { GUEST_COOKIE, getClientIp, verifyGuestSession } from "@/lib/guest-session";
import { rateLimit } from "@/lib/rate-limit";
import type { CartItem, TableCallType } from "@/lib/types/menu";

const MAX_ITEMS = 40;
const MAX_QTY = 30;
const MAX_NOTE = 300;
const CALL_TYPES: TableCallType[] = ["waiter", "bill"];

async function requireGuestTable(tableToken: string) {
  const headerStore = await headers();
  const ip = getClientIp(headerStore);
  const jar = await cookies();
  const session = verifyGuestSession(jar.get(GUEST_COOKIE)?.value, ip, tableToken);

  if (!session) {
    return { ok: false as const, error: "Sesija je istekla. Ponovo skeniraj QR kod sa stola." };
  }

  // Lookup stolova/tokena ide preko service role (anon više ne sme SELECT na tables)
  const supabase = createServiceClient();
  const { data: table, error } = await supabase
    .from("tables")
    .select("id, zone_id, number, active, table_zones(name)")
    .eq("token", tableToken)
    .eq("active", true)
    .maybeSingle();

  if (error || !table) {
    return { ok: false as const, error: "Sto nije pronađen. Proveri QR kod." };
  }

  const zoneName =
    (table as { table_zones?: { name?: string } | null }).table_zones?.name ?? "—";

  return {
    ok: true as const,
    supabase,
    table: { ...table, zone_name: zoneName },
    ip,
  };
}

export async function submitOrder(input: {
  tableToken: string;
  note: string;
  items: CartItem[];
}) {
  if (!input.items.length) {
    return { ok: false as const, error: "Korpa je prazna." };
  }
  if (input.items.length > MAX_ITEMS) {
    return { ok: false as const, error: "Previše stavki u korpi." };
  }

  const gate = await requireGuestTable(input.tableToken);
  if (!gate.ok) return gate;

  const { supabase, table, ip } = gate;

  const rl = rateLimit(`order:${table.id}:${ip}`, 8, 10 * 60 * 1000);
  if (!rl.ok) {
    return {
      ok: false as const,
      error: `Previše porudžbina. Sačekaj ${rl.retryAfterSec}s pa pokušaj ponovo.`,
    };
  }

  const note = input.note.trim().slice(0, MAX_NOTE);

  // Server-authoritative cene — ignoriši klijentske price/name
  const productIds = [...new Set(input.items.map((i) => i.productId))];
  const [{ data: products, error: productsError }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, price, available, category_id")
      .in("id", productIds)
      .eq("available", true),
    supabase.from("categories").select("id").eq("active", true),
  ]);

  if (productsError || !products?.length) {
    return { ok: false as const, error: "Proizvodi nisu dostupni. Osveži meni." };
  }

  const activeCategoryIds = new Set((categories ?? []).map((c) => c.id as string));
  const byId = new Map(
    products
      .filter((p) => activeCategoryIds.has(p.category_id as string))
      .map((p) => [p.id as string, p]),
  );
  const rows: {
    product_id: string;
    product_name: string;
    unit_price: number;
    quantity: number;
  }[] = [];

  for (const item of input.items) {
    const qty = Math.floor(Number(item.quantity));
    if (!Number.isFinite(qty) || qty < 1 || qty > MAX_QTY) {
      return { ok: false as const, error: "Nevažeća količina." };
    }
    const product = byId.get(item.productId);
    if (!product) {
      return { ok: false as const, error: "Neki proizvodi više nisu dostupni. Osveži meni." };
    }
    rows.push({
      product_id: product.id as string,
      product_name: product.name as string,
      unit_price: Number(product.price),
      quantity: qty,
    });
  }

  const total = rows.reduce((sum, r) => sum + r.unit_price * r.quantity, 0);

  const zoneName = (table as { zone_name?: string }).zone_name ?? "—";

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      table_id: table.id,
      table_zone: zoneName,
      table_number: table.number,
      note: note || null,
      total,
      status: "nova",
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { ok: false as const, error: "Porudžbina nije poslata. Pokušaj ponovo." };
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    rows.map((r) => ({ ...r, order_id: order.id })),
  );

  if (itemsError) {
    await supabase.from("orders").delete().eq("id", order.id);
    return { ok: false as const, error: "Stavke nisu sačuvane. Pozovi konobara." };
  }

  return {
    ok: true as const,
    orderId: order.id,
    tableNumber: table.number as number,
    tableZone: zoneName,
  };
}

export async function createTableCall(input: {
  tableToken: string;
  callType: TableCallType;
}) {
  if (!CALL_TYPES.includes(input.callType)) {
    return { ok: false as const, error: "Nepoznat tip poziva." };
  }

  const gate = await requireGuestTable(input.tableToken);
  if (!gate.ok) return gate;

  const { supabase, table, ip } = gate;

  const rl = rateLimit(`call:${table.id}:${ip}:${input.callType}`, 6, 10 * 60 * 1000);
  if (!rl.ok) {
    return {
      ok: false as const,
      error: `Sačekaj ${rl.retryAfterSec}s pre sledećeg poziva.`,
    };
  }

  // Zatvori stari otvoreni poziv istog tipa pa ubaci novi
  await supabase
    .from("table_calls")
    .update({ status: "done" })
    .eq("table_id", table.id)
    .eq("call_type", input.callType)
    .eq("status", "open");

  const zoneName = (table as { zone_name?: string }).zone_name ?? "—";

  const { data, error } = await supabase
    .from("table_calls")
    .insert({
      table_id: table.id,
      table_zone: zoneName,
      table_number: table.number,
      call_type: input.callType,
      status: "open",
    })
    .select("id, table_id, table_zone, table_number, call_type, status, created_at")
    .single();

  if (error || !data) {
    return {
      ok: false as const,
      error: error?.message?.includes("table_calls")
        ? "Pokreni supabase/migration_table_calls.sql u Supabase."
        : error?.message || "Poziv nije poslat. Pokušaj ponovo.",
    };
  }

  return { ok: true as const, callId: data.id as string, alreadyOpen: false };
}
