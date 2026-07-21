"use client";

import { useMemo, useState, useTransition } from "react";
import {
  createTable,
  deleteTable,
  updateTable,
} from "@/app/admin/(dashboard)/stolovi/actions";
import { ZonesAdmin } from "@/components/admin/ZonesAdmin";
import { tableLabel, type TableRow, type TableZoneRow } from "@/lib/types/menu";

type Props = {
  tables: TableRow[];
  zones: TableZoneRow[];
  siteOrigin: string;
};

export function TablesAdmin({ tables, zones, siteOrigin }: Props) {
  const [zoneFilter, setZoneFilter] = useState<string | "all">("all");
  const [addZoneId, setAddZoneId] = useState(zones[0]?.id ?? "");
  const [copied, setCopied] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const activeZones = useMemo(() => zones.filter((zone) => zone.active), [zones]);

  const nextNumber = useMemo(() => {
    const nums = tables.filter((t) => t.zone_id === addZoneId).map((t) => t.number);
    if (nums.length === 0) return 1;
    return Math.max(...nums) + 1;
  }, [tables, addZoneId]);

  const grouped = useMemo(() => {
    const list = zoneFilter === "all" ? zones : zones.filter((z) => z.id === zoneFilter);
    return list.map((zone) => ({
      ...zone,
      tables: tables
        .filter((t) => t.zone_id === zone.id)
        .sort((a, b) => a.number - b.number),
    }));
  }, [tables, zoneFilter, zones]);

  function menuUrl(token: string) {
    return `${siteOrigin}/meni?t=${encodeURIComponent(token)}`;
  }

  function qrUrl(token: string) {
    const data = encodeURIComponent(menuUrl(token));
    return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${data}`;
  }

  async function copyLink(token: string) {
    try {
      await navigator.clipboard.writeText(menuUrl(token));
      setCopied(token);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* ignore */
    }
  }

  function onCreate(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      const result = await createTable(formData);
      if (!result?.ok) {
        setMessage({ type: "err", text: result?.error ?? "Dodavanje nije uspelo." });
        return;
      }
      setMessage({ type: "ok", text: "Sto dodat." });
    });
  }

  function onUpdate(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      const result = await updateTable(formData);
      if (!result?.ok) {
        setMessage({ type: "err", text: result?.error ?? "Izmena nije uspela." });
        return;
      }
      setMessage({ type: "ok", text: "Sto sačuvan." });
    });
  }

  function onDelete(formData: FormData) {
    if (!window.confirm("Obrisati sto?")) return;
    setMessage(null);
    startTransition(async () => {
      const result = await deleteTable(formData);
      if (!result?.ok) {
        setMessage({ type: "err", text: result?.error ?? "Brisanje nije uspelo." });
        return;
      }
      setMessage({ type: "ok", text: "Sto obrisan." });
    });
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-3xl text-soft-white">Stolovi & QR</h1>
        <p className="mt-1 text-sm text-soft-white/55">
          Uredi zone, dodeli stolove i štampaj QR kodove za poručivanje.
        </p>
        <p className="mt-2 rounded-lg border border-gold/20 bg-gold/5 px-3 py-2 text-xs text-gold/90">
          Tokeni su zaključani za štampu QR — jednom kreirani, više se ne menjaju.
        </p>
      </div>

      <ZonesAdmin zones={zones} />

      {message ? (
        <p
          className={`mb-4 rounded-xl px-4 py-3 text-sm ${
            message.type === "ok"
              ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
              : "border border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {message.text}
        </p>
      ) : null}

      <div className="mb-6 flex flex-wrap gap-2">
        <FilterChip active={zoneFilter === "all"} onClick={() => setZoneFilter("all")}>
          Sve zone
        </FilterChip>
        {zones.map((zone) => (
          <FilterChip
            key={zone.id}
            active={zoneFilter === zone.id}
            onClick={() => setZoneFilter(zone.id)}
          >
            {zone.name}
          </FilterChip>
        ))}
      </div>

      {activeZones.length > 0 ? (
        <form
          action={onCreate}
          className="mb-8 max-w-xl space-y-3 rounded-2xl border border-gold/20 bg-forest-deep/40 p-5"
        >
          <h2 className="font-medium text-gold">Dodaj sto</h2>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="mb-1 block text-xs text-soft-white/50">Zona</span>
              <select
                name="zone_id"
                value={addZoneId}
                onChange={(e) => setAddZoneId(e.target.value)}
                className="w-full rounded-xl border border-gold/20 bg-black/40 px-3 py-2"
              >
                {activeZones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs text-soft-white/50">
                Broj stola (sledeći: {nextNumber})
              </span>
              <input
                name="number"
                type="number"
                min={1}
                required
                key={`${addZoneId}-${nextNumber}`}
                defaultValue={nextNumber}
                className="w-full rounded-xl border border-gold/20 bg-black/40 px-3 py-2"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-gold px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
          >
            {pending ? "Čuvam…" : "Dodaj sto"}
          </button>
        </form>
      ) : null}

      <div className="space-y-10">
        {grouped.map((group) => (
          <section key={group.id}>
            <div className="mb-3 flex items-end justify-between gap-3">
              <h2 className="font-serif text-2xl text-gold">{group.name}</h2>
              <span className="text-sm text-soft-white/45">{group.tables.length} stolova</span>
            </div>

            {group.tables.length === 0 ? (
              <p className="rounded-xl border border-dashed border-gold/20 px-4 py-8 text-center text-sm text-soft-white/45">
                Nema stolova u ovoj zoni.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {group.tables.map((t) => (
                  <article
                    key={t.id}
                    className={`rounded-2xl border p-4 ${
                      t.active
                        ? "border-gold/20 bg-forest-deep/40"
                        : "border-red-500/20 bg-red-950/20 opacity-75"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-serif text-xl text-soft-white">Sto {t.number}</p>
                        <p className="text-xs text-soft-white/45">
                          {tableLabel(t.zone_name, t.number)}
                        </p>
                      </div>
                      {!t.active ? (
                        <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] text-red-300">
                          Neaktivan
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-3 flex justify-center rounded-xl bg-white p-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={qrUrl(t.token)}
                        alt={`QR ${tableLabel(t.zone_name, t.number)}`}
                        width={200}
                        height={200}
                        className="h-44 w-44 md:h-48 md:w-48"
                      />
                    </div>

                    <p className="mt-2 break-all font-mono text-[10px] text-soft-white/40">
                      {menuUrl(t.token)}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => copyLink(t.token)}
                        className="rounded-lg border border-gold/25 px-2.5 py-1 text-xs text-gold"
                      >
                        {copied === t.token ? "Kopirano" : "Kopiraj link"}
                      </button>
                      <a
                        href={qrUrl(t.token)}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-gold/25 px-2.5 py-1 text-xs text-soft-white/70"
                      >
                        Otvori QR
                      </a>
                    </div>

                    <form
                      action={onUpdate}
                      className="mt-4 space-y-2 border-t border-gold/10 pt-3"
                    >
                      <input type="hidden" name="id" value={t.id} />
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          name="zone_id"
                          defaultValue={t.zone_id}
                          className="rounded-lg border border-gold/20 bg-black/40 px-2 py-1.5 text-xs"
                        >
                          {zones.filter((z) => z.active).map((zone) => (
                            <option key={zone.id} value={zone.id}>
                              {zone.name}
                            </option>
                          ))}
                        </select>
                        <input
                          name="number"
                          type="number"
                          min={1}
                          defaultValue={t.number}
                          className="rounded-lg border border-gold/20 bg-black/40 px-2 py-1.5 text-xs"
                        />
                      </div>
                      <label className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          name="active"
                          defaultChecked={t.active}
                          className="accent-gold"
                        />
                        Aktivan
                      </label>
                      <button
                        type="submit"
                        disabled={pending}
                        className="rounded-lg bg-gold/20 px-2.5 py-1 text-xs text-gold disabled:opacity-50"
                      >
                        Sačuvaj
                      </button>
                    </form>
                    <form action={onDelete} className="mt-2">
                      <input type="hidden" name="id" value={t.id} />
                      <button
                        type="submit"
                        disabled={pending}
                        className="text-xs text-red-400/80 hover:text-red-400 disabled:opacity-50"
                      >
                        Obriši sto
                      </button>
                    </form>
                  </article>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

function FilterChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm ${
        active ? "bg-gold text-black" : "border border-gold/25 text-soft-white/70"
      }`}
    >
      {children}
    </button>
  );
}
