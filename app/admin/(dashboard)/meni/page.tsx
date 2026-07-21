import type { Metadata } from "next";
import { requireAdmin } from "@/app/admin/actions";
import { createServiceClient } from "@/lib/supabase/server";
import type { Category, Product } from "@/lib/types/menu";
import { MenuAdmin } from "@/components/admin/MenuAdmin";

export const metadata: Metadata = {
  title: "Upravljanje menijem",
};

export default async function AdminMeniPage() {
  await requireAdmin();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <p className="text-soft-white/60">
        Podesi Supabase env varijable (.env.local) da bi uređivao meni.
      </p>
    );
  }

  const supabase = createServiceClient();
  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("products").select("*").order("sort_order"),
  ]);

  return (
    <MenuAdmin
      categories={(categories ?? []) as Category[]}
      products={(products ?? []).map((p) => ({
        ...p,
        price: Number(p.price),
        featured: Boolean(p.featured),
        featured_order: Number(p.featured_order ?? 0),
      })) as Product[]}
    />
  );
}
