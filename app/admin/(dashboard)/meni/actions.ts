"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/app/admin/actions";
import { createServiceClient } from "@/lib/supabase/server";

function revalidate() {
  revalidatePath("/admin/meni");
  revalidatePath("/meni");
  revalidatePath("/cenovnik");
}

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const supabase = createServiceClient();
  const { data: max } = await supabase
    .from("categories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  await supabase.from("categories").insert({
    name,
    sort_order: (max?.sort_order ?? 0) + 1,
    active: true,
  });
  revalidate();
}

export async function updateCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const active = formData.has("active");
  if (!id || !name) return;

  const supabase = createServiceClient();
  await supabase.from("categories").update({ name, active }).eq("id", id);
  revalidate();
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = createServiceClient();
  await supabase.from("categories").delete().eq("id", id);
  revalidate();
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const category_id = String(formData.get("category_id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const price = Number(formData.get("price"));
  const image_url = String(formData.get("image_url") ?? "").trim() || null;
  const available = formData.has("available");
  const featured = formData.has("featured");
  const featured_order = Number(formData.get("featured_order") ?? 0);

  if (!category_id || !name || !Number.isFinite(price) || price < 0) return;

  const supabase = createServiceClient();
  const { data: max } = await supabase
    .from("products")
    .select("sort_order")
    .eq("category_id", category_id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  await supabase.from("products").insert({
    category_id,
    name,
    description,
    price,
    image_url,
    available,
    featured,
    featured_order: Number.isFinite(featured_order) ? featured_order : 0,
    sort_order: (max?.sort_order ?? 0) + 1,
  });
  revalidate();
}

export async function updateProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const category_id = String(formData.get("category_id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const price = Number(formData.get("price"));
  const image_url = String(formData.get("image_url") ?? "").trim() || null;
  const available = formData.has("available");
  const featured = formData.has("featured");
  const featured_order = Number(formData.get("featured_order") ?? 0);

  if (!id || !category_id || !name || !Number.isFinite(price)) return;

  const supabase = createServiceClient();
  await supabase
    .from("products")
    .update({
      category_id,
      name,
      description,
      price,
      image_url,
      available,
      featured,
      featured_order: Number.isFinite(featured_order) ? featured_order : 0,
    })
    .eq("id", id);
  revalidate();
}

export async function toggleProductAvailable(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const available = formData.get("available") === "true";
  if (!id) return;

  const supabase = createServiceClient();
  await supabase.from("products").update({ available }).eq("id", id);
  revalidate();
}

export async function toggleProductFeatured(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const featured = formData.get("featured") === "true";
  if (!id) return { ok: false as const, error: "Nedostaje ID proizvoda." };

  const supabase = createServiceClient();

  if (featured) {
    const { data: max, error: maxError } = await supabase
      .from("products")
      .select("featured_order")
      .eq("featured", true)
      .order("featured_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (maxError) {
      return {
        ok: false as const,
        error:
          maxError.message.includes("featured")
            ? "Pokreni supabase/migration_featured.sql u Supabase SQL Editoru."
            : maxError.message,
      };
    }

    const { error } = await supabase
      .from("products")
      .update({
        featured: true,
        featured_order: (max?.featured_order ?? 0) + 1,
      })
      .eq("id", id);

    if (error) {
      return {
        ok: false as const,
        error:
          error.message.includes("featured")
            ? "Pokreni supabase/migration_featured.sql u Supabase SQL Editoru."
            : error.message,
      };
    }
  } else {
    const { error } = await supabase
      .from("products")
      .update({ featured: false })
      .eq("id", id);

    if (error) {
      return {
        ok: false as const,
        error:
          error.message.includes("featured")
            ? "Pokreni supabase/migration_featured.sql u Supabase SQL Editoru."
            : error.message,
      };
    }
  }

  revalidate();
  return { ok: true as const };
}

export async function updateFeaturedOrder(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const featured_order = Number(formData.get("featured_order") ?? 0);
  if (!id || !Number.isFinite(featured_order)) return;

  const supabase = createServiceClient();
  await supabase.from("products").update({ featured_order }).eq("id", id);
  revalidate();
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = createServiceClient();
  await supabase.from("products").delete().eq("id", id);
  revalidate();
}
