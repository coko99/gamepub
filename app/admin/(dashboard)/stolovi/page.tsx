import type { Metadata } from "next";
import { headers } from "next/headers";
import { requireAdmin } from "@/app/admin/actions";
import { createServiceClient } from "@/lib/supabase/server";
import { TablesAdmin } from "@/components/admin/TablesAdmin";
import type { TableRow, TableZoneRow } from "@/lib/types/menu";

export const metadata: Metadata = {
  title: "Stolovi",
};

type TableQueryRow = {
  id: string;
  zone_id: string;
  number: number;
  token: string;
  active: boolean;
  table_zones: { name: string } | { name: string }[] | null;
};

function zoneNameFromJoin(
  tableZones: TableQueryRow["table_zones"],
): string | undefined {
  if (!tableZones) return undefined;
  if (Array.isArray(tableZones)) return tableZones[0]?.name;
  return tableZones.name;
}

export default async function StoloviPage() {
  await requireAdmin();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <p className="text-soft-white/60">
        Podesi Supabase env varijable (.env.local) da bi uređivao stolove.
      </p>
    );
  }

  const supabase = createServiceClient();
  const [{ data: zones, error: zonesError }, { data: tables, error: tablesError }] =
    await Promise.all([
      supabase.from("table_zones").select("*").order("sort_order"),
      supabase
        .from("tables")
        .select("id, zone_id, number, token, active, table_zones(name)")
        .order("number"),
    ]);

  if (zonesError?.message.includes("table_zones")) {
    return (
      <p className="text-red-400">
        Pokreni <code className="text-gold">supabase/migration_dynamic_zones.sql</code> u Supabase
        SQL Editoru.
      </p>
    );
  }

  if (tablesError) {
    return <p className="text-red-400">Greška: {tablesError.message}</p>;
  }

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? `${proto}://${host}`;

  const mappedTables: TableRow[] = ((tables ?? []) as TableQueryRow[]).map((table) => ({
    id: table.id,
    zone_id: table.zone_id,
    zone_name: zoneNameFromJoin(table.table_zones),
    number: table.number,
    token: table.token,
    active: table.active,
  }));

  return (
    <TablesAdmin
      zones={(zones ?? []) as TableZoneRow[]}
      tables={mappedTables}
      siteOrigin={siteOrigin.replace(/\/$/, "")}
    />
  );
}
