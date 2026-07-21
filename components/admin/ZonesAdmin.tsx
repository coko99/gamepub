"use client";

import { useState, useTransition } from "react";
import {
  createZone,
  deleteZone,
  updateZone,
} from "@/app/admin/(dashboard)/stolovi/actions";
import type { TableZoneRow } from "@/lib/types/menu";

type Props = {
  zones: TableZoneRow[];
};

export function ZonesAdmin({ zones }: Props) {
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function onCreate(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      const result = await createZone(formData);
      if (!result.ok) {
        setMessage({ type: "err", text: result.error });
        return;
      }
      setMessage({ type: "ok", text: "Zona dodata." });
    });
  }

  function onUpdate(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      const result = await updateZone(formData);
      if (!result.ok) {
        setMessage({ type: "err", text: result.error });
        return;
      }
      setMessage({ type: "ok", text: "Zona sačuvana." });
    });
  }

  function onDelete(formData: FormData) {
    if (!window.confirm("Obrisati zonu?")) return;
    setMessage(null);
    startTransition(async () => {
      const result = await deleteZone(formData);
      if (!result.ok) {
        setMessage({ type: "err", text: result.error });
        return;
      }
      setMessage({ type: "ok", text: "Zona obrisana." });
    });
  }

  return (
    <section className="mb-8 rounded-2xl border border-gold/20 bg-forest-deep/40 p-5">
      <h2 className="font-medium text-gold">Zone lokala</h2>
      <p className="mt-1 text-sm text-soft-white/55">
        Promeni nazive zona (npr. Sprat 1, Bašta, VIP). Stolove dodeljuješ zoni ispod.
      </p>

      {message ? (
        <p
          className={`mt-3 rounded-xl px-3 py-2 text-sm ${
            message.type === "ok"
              ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
              : "border border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {message.text}
        </p>
      ) : null}

      <form action={onCreate} className="mt-4 flex flex-wrap items-end gap-3">
        <label className="min-w-[12rem] flex-1 text-sm">
          <span className="mb-1 block text-xs text-soft-white/50">Nova zona</span>
          <input
            name="name"
            required
            placeholder="npr. Sprat 2, Terasa..."
            className="w-full rounded-xl border border-gold/20 bg-black/40 px-3 py-2"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-gold px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
        >
          Dodaj zonu
        </button>
      </form>

      <div className="mt-5 space-y-3">
        {zones.length === 0 ? (
          <p className="text-sm text-soft-white/45">
            Nema zona — pokreni migration_dynamic_zones.sql ili dodaj prvu zonu.
          </p>
        ) : (
          zones.map((zone) => (
            <div
              key={zone.id}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-gold/15 bg-black/30 p-3"
            >
              <form action={onUpdate} className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
                <input type="hidden" name="id" value={zone.id} />
                <input
                  name="name"
                  defaultValue={zone.name}
                  required
                  className="min-w-[10rem] flex-1 rounded-lg border border-gold/20 bg-black/40 px-3 py-2 text-sm"
                />
                <label className="flex items-center gap-2 text-xs text-soft-white/70">
                  <input
                    type="checkbox"
                    name="active"
                    defaultChecked={zone.active}
                    className="accent-gold"
                  />
                  Aktivna
                </label>
                <button
                  type="submit"
                  disabled={pending}
                  className="rounded-lg bg-gold/20 px-3 py-1.5 text-xs text-gold disabled:opacity-50"
                >
                  Sačuvaj
                </button>
              </form>
              <form action={onDelete}>
                <input type="hidden" name="id" value={zone.id} />
                <button
                  type="submit"
                  disabled={pending}
                  className="text-xs text-red-400/80 hover:text-red-400 disabled:opacity-50"
                >
                  Obriši
                </button>
              </form>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
