import { createServiceClient } from "@/lib/supabase/server";
import type { TableZoneRow } from "@/lib/types/menu";

export async function fetchTableZones(activeOnly = false): Promise<TableZoneRow[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return [];
  }

  try {
    const supabase = createServiceClient();
    let query = supabase.from("table_zones").select("*").order("sort_order");
    if (activeOnly) {
      query = query.eq("active", true);
    }
    const { data, error } = await query;
    if (error) return [];
    return (data ?? []) as TableZoneRow[];
  } catch {
    return [];
  }
}

export function zoneNameById(zones: TableZoneRow[], zoneId: string) {
  return zones.find((zone) => zone.id === zoneId)?.name ?? "—";
}
