import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import {
  GUEST_COOKIE,
  getClientIp,
  guestSessionRemainingMinutes,
  verifyGuestSession,
} from "@/lib/guest-session";
import type { Category, Product, TableRow } from "@/lib/types/menu";
import { GuestMenu } from "@/components/order/GuestMenu";

export const metadata: Metadata = {
  title: "Meni",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ t?: string; error?: string }>;
};

export default async function MeniPage({ searchParams }: Props) {
  const { t: qrToken, error } = await searchParams;

  if (qrToken) {
    redirect(`/meni/session?t=${encodeURIComponent(qrToken)}`);
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <MeniError
        title="Meni nije podešen"
        message="Dodaj Supabase ključeve u .env.local pa pokreni SQL iz supabase/ foldera."
      />
    );
  }

  if (error === "invalid") {
    return (
      <MeniError title="Nepoznat sto" message="QR kod nije važeći. Pitaj osoblje za pomoć." />
    );
  }

  const headerStore = await headers();
  const ip = getClientIp(headerStore);
  const jar = await cookies();
  const session = verifyGuestSession(jar.get(GUEST_COOKIE)?.value, ip);

  if (!session) {
    return (
      <MeniError
        title="Sesija istekla"
        message="Za pristup meniju ponovo skeniraj QR kod sa stola. Sesija traje 2 sata."
      />
    );
  }

  const supabase = createServiceClient();
  const { data: table } = await supabase
    .from("tables")
    .select("id, zone_id, number, token, active, table_zones(name)")
    .eq("token", session.tableToken)
    .eq("active", true)
    .maybeSingle();

  const tableRow = table
    ? ({
        id: table.id,
        zone_id: table.zone_id,
        zone_name: (table as { table_zones?: { name?: string } | null }).table_zones?.name,
        number: table.number,
        token: table.token,
        active: table.active,
      } as TableRow)
    : null;

  if (!tableRow) {
    return (
      <MeniError
        title="Sto nije aktivan"
        message="Skeniraj QR kod sa stola da otvoriš meni."
      />
    );
  }

  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from("categories").select("*").eq("active", true).order("sort_order"),
    supabase.from("products").select("*").eq("available", true).order("sort_order"),
  ]);

  const activeCategoryIds = new Set((categories ?? []).map((c) => c.id as string));
  const visibleProducts = (products ?? []).filter((p) =>
    activeCategoryIds.has(p.category_id as string),
  );

  return (
    <GuestMenu
      table={tableRow}
      categories={(categories ?? []) as Category[]}
      products={
        visibleProducts.map((p) => ({
          ...p,
          price: Number(p.price),
          featured: Boolean(p.featured),
          featured_order: Number(p.featured_order ?? 0),
        })) as Product[]
      }
      sessionMinutesLeft={guestSessionRemainingMinutes(session.exp)}
    />
  );
}

function MeniError({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-black px-6 text-center">
      <div className="max-w-sm">
        <p className="text-xs uppercase tracking-[0.25em] text-gold/70">GAMEPUB</p>
        <h1 className="mt-3 font-serif text-3xl text-soft-white">{title}</h1>
        <p className="mt-3 text-soft-white/65">{message}</p>
      </div>
    </div>
  );
}
