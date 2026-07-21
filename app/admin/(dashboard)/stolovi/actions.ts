"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/app/admin/actions";
import { createServiceClient } from "@/lib/supabase/server";
import { makeOpaqueTableToken } from "@/lib/security";

function revalidate() {
  revalidatePath("/admin/stolovi");
  revalidatePath("/meni");
}

export async function createZone(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    return { ok: false as const, error: "Unesi naziv zone." };
  }

  const supabase = createServiceClient();
  const { data: max } = await supabase
    .from("table_zones")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("table_zones").insert({
    name,
    sort_order: (max?.sort_order ?? 0) + 1,
    active: true,
  });

  if (error) {
    return {
      ok: false as const,
      error: error.message.includes("table_zones")
        ? "Pokreni supabase/migration_dynamic_zones.sql u Supabase."
        : error.message,
    };
  }

  revalidate();
  return { ok: true as const };
}

export async function updateZone(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const active = formData.has("active");
  if (!id || !name) {
    return { ok: false as const, error: "Nevažeći podaci zone." };
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("table_zones").update({ name, active }).eq("id", id);

  if (error) {
    return { ok: false as const, error: error.message };
  }

  revalidate();
  return { ok: true as const };
}

export async function deleteZone(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false as const, error: "Nedostaje ID zone." };

  const supabase = createServiceClient();
  const { count } = await supabase
    .from("tables")
    .select("id", { count: "exact", head: true })
    .eq("zone_id", id);

  if ((count ?? 0) > 0) {
    return {
      ok: false as const,
      error: "Zona ima stolove. Premesti ili obriši stolove pre brisanja zone.",
    };
  }

  const { error } = await supabase.from("table_zones").delete().eq("id", id);
  if (error) {
    return { ok: false as const, error: error.message };
  }

  revalidate();
  return { ok: true as const };
}

export async function createTable(formData: FormData) {
  await requireAdmin();
  const zone_id = String(formData.get("zone_id") ?? "");
  const number = Number(formData.get("number"));

  if (!zone_id) {
    return { ok: false as const, error: "Izaberi zonu." };
  }
  if (!Number.isInteger(number) || number < 1) {
    return { ok: false as const, error: "Broj stola mora biti ceo broj od 1 naviše." };
  }

  const supabase = createServiceClient();
  const token = makeOpaqueTableToken();

  const { error } = await supabase.from("tables").insert({
    zone_id,
    number,
    token,
    active: true,
  });

  if (error) {
    if (error.code === "23505") {
      if (error.message.includes("token") || error.details?.includes("token")) {
        return { ok: false as const, error: "Token konflikt — pokušaj ponovo." };
      }
      return {
        ok: false as const,
        error: `Sto ${number} već postoji u ovoj zoni. Izaberi drugi broj.`,
      };
    }
    return { ok: false as const, error: error.message };
  }

  revalidate();
  return { ok: true as const };
}

export async function updateTable(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const zone_id = String(formData.get("zone_id") ?? "");
  const number = Number(formData.get("number"));
  const active = formData.has("active");
  if (!id || !zone_id || !Number.isInteger(number) || number < 1) {
    return { ok: false as const, error: "Nevažeći podaci." };
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("tables")
    .update({ zone_id, number, active })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { ok: false as const, error: `Sto ${number} već postoji u toj zoni.` };
    }
    return { ok: false as const, error: error.message };
  }

  revalidate();
  return { ok: true as const };
}

export async function deleteTable(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false as const, error: "Nedostaje ID." };

  const supabase = createServiceClient();
  await supabase.from("table_calls").delete().eq("table_id", id);

  const { error } = await supabase.from("tables").delete().eq("id", id);
  if (error) {
    if (error.code === "23503") {
      return {
        ok: false as const,
        error: "Sto ima porudžbine i ne može se obrisati. Deaktiviraj ga umesto brisanja.",
      };
    }
    return { ok: false as const, error: error.message };
  }

  revalidate();
  return { ok: true as const };
}
