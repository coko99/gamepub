export type StaffRole = "admin" | "waiter";

export type TableZoneRow = {
  id: string;
  name: string;
  sort_order: number;
  active: boolean;
};

export type OrderStatus =
  | "nova"
  | "prihvacena"
  | "u_pripremi"
  | "posluzeno"
  | "placeno"
  | "otkazano";

export const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "nova", label: "Nova" },
  { value: "prihvacena", label: "Prihvaćena" },
  { value: "u_pripremi", label: "U pripremi" },
  { value: "posluzeno", label: "Posluženo" },
  { value: "placeno", label: "Plaćeno" },
  { value: "otkazano", label: "Otkazano" },
];

export type TableRow = {
  id: string;
  zone_id: string;
  zone_name?: string;
  number: number;
  token: string;
  active: boolean;
};

export type Category = {
  id: string;
  name: string;
  sort_order: number;
  active: boolean;
};

export type Product = {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  available: boolean;
  featured: boolean;
  featured_order: number;
  sort_order: number;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
};

export type Order = {
  id: string;
  table_id: string;
  table_zone: string;
  table_number: number;
  note: string | null;
  total: number;
  status: OrderStatus;
  created_at: string;
  order_items?: OrderItem[];
};

export type TableCallType = "waiter" | "bill";

export type TableCall = {
  id: string;
  table_id: string;
  table_zone: string;
  table_number: number;
  call_type: TableCallType;
  status: "open" | "done";
  created_at: string;
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type DailyZoneStat = {
  stat_date: string;
  table_zone: string;
  order_count: number;
  total_revenue: number;
};

export type DailyProductStat = {
  stat_date: string;
  product_name: string;
  product_id?: string | null;
  quantity_sold: number;
  total_revenue: number;
};

export type LiveDaySnapshot = {
  stat_date: string;
  order_count: number;
  total_revenue: number;
  zones: { table_zone: string; order_count: number; total_revenue: number }[];
  products: { product_name: string; quantity_sold: number; total_revenue: number }[];
};

export type ShiftCloseRow = {
  id: string;
  closed_at: string;
  orders_archived: number;
  calls_cleared: number;
};

export function zoneLabel(zone: string | null | undefined) {
  return zone?.trim() || "—";
}

export function tableLabel(zone: string | null | undefined, number: number) {
  return `${zoneLabel(zone)} · Sto ${number}`;
}

export function formatPrice(price: number) {
  return `${Number(price).toLocaleString("sr-RS")} RSD`;
}

export function statusLabel(status: OrderStatus) {
  return ORDER_STATUSES.find((s) => s.value === status)?.label ?? status;
}

/** Trajni opaque token za štampu QR — nasumičan, nikad se ne menja posle kreiranja. */
export { makeOpaqueTableToken as makeTableToken } from "@/lib/security";
