"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/app/admin/actions";
import { createServiceClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/lib/types/menu";

const VALID: OrderStatus[] = [
  "nova",
  "prihvacena",
  "u_pripremi",
  "posluzeno",
  "placeno",
  "otkazano",
];

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await requireStaff();
  if (!VALID.includes(status)) {
    return { ok: false as const, error: "Nepoznat status" };
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);

  if (error) {
    return { ok: false as const, error: error.message };
  }

  revalidatePath("/admin/porudzbine");
  return { ok: true as const };
}
