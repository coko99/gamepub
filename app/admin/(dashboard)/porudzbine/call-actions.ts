"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/app/admin/actions";
import { createServiceClient } from "@/lib/supabase/server";

export async function dismissTableCall(callId: string) {
  await requireStaff();
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("table_calls")
    .update({ status: "done" })
    .eq("id", callId);

  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/porudzbine");
  return { ok: true as const };
}
