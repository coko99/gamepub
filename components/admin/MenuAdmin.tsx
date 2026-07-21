"use client";

import { useMemo, useState } from "react";
import {
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  toggleProductAvailable,
  updateCategory,
  updateFeaturedOrder,
  updateProduct,
} from "@/app/admin/(dashboard)/meni/actions";
import { FeaturedToggleButton } from "@/components/admin/FeaturedToggleButton";
import type { Category, Product } from "@/lib/types/menu";
import { formatPrice } from "@/lib/types/menu";

type Props = {
  categories: Category[];
  products: Product[];
};

export function MenuAdmin({ categories, products }: Props) {
  const [tab, setTab] = useState<"proizvodi" | "istaknuto" | "kategorije">("proizvodi");
  const [editing, setEditing] = useState<Product | null>(null);

  const featured = useMemo(
    () =>
      products
        .filter((p) => p.featured)
        .sort((a, b) => a.featured_order - b.featured_order),
    [products],
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-3xl text-soft-white">Meni</h1>
        <p className="mt-1 text-sm text-soft-white/55">
          Kategorije, proizvodi, istaknuti slajder i dostupnost
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <TabBtn active={tab === "proizvodi"} onClick={() => setTab("proizvodi")}>
          Proizvodi
        </TabBtn>
        <TabBtn active={tab === "istaknuto"} onClick={() => setTab("istaknuto")}>
          Istaknuto ({featured.length})
        </TabBtn>
        <TabBtn active={tab === "kategorije"} onClick={() => setTab("kategorije")}>
          Kategorije
        </TabBtn>
      </div>

      {tab === "kategorije" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <form
            action={createCategory}
            className="space-y-3 rounded-2xl border border-gold/20 bg-forest-deep/40 p-5"
          >
            <h2 className="font-medium text-gold">Nova kategorija</h2>
            <input
              name="name"
              required
              placeholder="Naziv"
              className="w-full rounded-xl border border-gold/20 bg-black/40 px-3 py-2 outline-none focus:ring-2 focus:ring-gold/30"
            />
            <button
              type="submit"
              className="rounded-xl bg-gold px-4 py-2 text-sm font-semibold text-black"
            >
              Dodaj
            </button>
          </form>

          <ul className="space-y-3">
            {categories.map((c) => (
              <li
                key={c.id}
                className="rounded-2xl border border-gold/15 bg-forest-deep/30 p-4"
              >
                <form action={updateCategory} className="flex flex-wrap items-end gap-3">
                  <input type="hidden" name="id" value={c.id} />
                  <label className="min-w-[12rem] flex-1">
                    <span className="mb-1 block text-xs text-soft-white/50">Naziv</span>
                    <input
                      name="name"
                      defaultValue={c.name}
                      className="w-full rounded-lg border border-gold/20 bg-black/40 px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="active"
                      defaultChecked={c.active}
                      className="accent-gold"
                    />
                    Aktivna
                  </label>
                  <button
                    type="submit"
                    className="rounded-lg border border-gold/30 px-3 py-2 text-sm text-gold"
                  >
                    Sačuvaj
                  </button>
                </form>
                <form action={deleteCategory} className="mt-2">
                  <input type="hidden" name="id" value={c.id} />
                  <button type="submit" className="text-xs text-red-400/80 hover:text-red-400">
                    Obriši kategoriju
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      ) : tab === "istaknuto" ? (
        <div className="space-y-6">
          <div className="rounded-2xl border border-gold/20 bg-forest-deep/30 p-5">
            <h2 className="font-medium text-gold">Slajder na gost meniju</h2>
            <p className="mt-1 text-sm text-soft-white/55">
              Istaknuti proizvodi se prikazuju gore sa slikama. Dodaj URL slike na proizvodu za
              najbolji efekat. Preporuka: 3–6 stavki.
            </p>
          </div>

          {featured.length === 0 ? (
            <p className="rounded-xl border border-dashed border-gold/20 px-4 py-10 text-center text-sm text-soft-white/45">
              Nema istaknutih. Uključi „Istakni“ na proizvodu ispod ili u listi Proizvodi.
            </p>
          ) : (
            <ul className="space-y-3">
              {featured.map((p, i) => (
                <li
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold/25 bg-gold/5 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium">
                      <span className="mr-2 text-gold">{i + 1}.</span>
                      {p.name}
                    </p>
                    <p className="text-xs text-soft-white/50">
                      {formatPrice(p.price)}
                      {!p.image_url ? " · bez slike" : ""}
                      {!p.available ? " · nedostupno (neće se videti)" : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <form action={updateFeaturedOrder} className="flex items-center gap-1">
                      <input type="hidden" name="id" value={p.id} />
                      <input
                        name="featured_order"
                        type="number"
                        defaultValue={p.featured_order}
                        className="w-16 rounded-lg border border-gold/20 bg-black/40 px-2 py-1 text-xs"
                      />
                      <button
                        type="submit"
                        className="rounded-lg border border-gold/25 px-2 py-1 text-xs text-gold"
                      >
                        Redosled
                      </button>
                    </form>
                    <FeaturedToggleButton
                      productId={p.id}
                      featured
                      labelOn="Ukloni"
                      className="rounded-lg border border-gold/25 px-2.5 py-1 text-xs text-soft-white/70"
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div>
            <h3 className="mb-3 text-sm text-soft-white/60">Dodaj u slajder</h3>
            <div className="space-y-2">
              {products
                .filter((p) => !p.featured)
                .map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold/10 bg-forest-deep/20 px-4 py-2.5"
                  >
                    <p className="text-sm">
                      {p.name}{" "}
                      <span className="text-soft-white/40">· {formatPrice(p.price)}</span>
                    </p>
                    <FeaturedToggleButton
                      productId={p.id}
                      featured={false}
                      labelOff="Istakni"
                      className="rounded-lg bg-gold/20 px-2.5 py-1 text-xs text-gold"
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <form
            key={editing?.id ?? "new"}
            action={editing ? updateProduct : createProduct}
            className="h-fit space-y-3 rounded-2xl border border-gold/20 bg-forest-deep/40 p-5"
          >
            <h2 className="font-medium text-gold">
              {editing ? "Izmeni proizvod" : "Novi proizvod"}
            </h2>
            {editing ? <input type="hidden" name="id" value={editing.id} /> : null}

            <Field label="Kategorija">
              <select
                name="category_id"
                required
                defaultValue={editing?.category_id ?? categories[0]?.id}
                className="w-full rounded-xl border border-gold/20 bg-black/40 px-3 py-2"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Naziv">
              <input
                name="name"
                required
                defaultValue={editing?.name}
                className="w-full rounded-xl border border-gold/20 bg-black/40 px-3 py-2"
              />
            </Field>

            <Field label="Opis">
              <textarea
                name="description"
                rows={2}
                defaultValue={editing?.description ?? ""}
                className="w-full resize-none rounded-xl border border-gold/20 bg-black/40 px-3 py-2"
              />
            </Field>

            <Field label="Cena (RSD)">
              <input
                name="price"
                type="number"
                min={0}
                step={1}
                required
                defaultValue={editing?.price}
                className="w-full rounded-xl border border-gold/20 bg-black/40 px-3 py-2"
              />
            </Field>

            <Field label="URL slike">
              <input
                name="image_url"
                type="url"
                placeholder="https://…"
                defaultValue={editing?.image_url ?? ""}
                className="w-full rounded-xl border border-gold/20 bg-black/40 px-3 py-2"
              />
            </Field>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="available"
                value="true"
                defaultChecked={editing?.available ?? true}
                className="accent-gold"
              />
              Dostupno
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="featured"
                value="true"
                defaultChecked={editing?.featured ?? false}
                className="accent-gold"
              />
              Istakni u slajderu
            </label>

            <Field label="Redosled u slajderu (manji = prvi)">
              <input
                name="featured_order"
                type="number"
                min={0}
                defaultValue={editing?.featured_order ?? 0}
                className="w-full rounded-xl border border-gold/20 bg-black/40 px-3 py-2"
              />
            </Field>

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                className="rounded-xl bg-gold px-4 py-2 text-sm font-semibold text-black"
              >
                {editing ? "Sačuvaj izmene" : "Dodaj proizvod"}
              </button>
              {editing ? (
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-xl border border-gold/30 px-4 py-2 text-sm text-soft-white/70"
                >
                  Otkaži
                </button>
              ) : null}
            </div>
          </form>

          <div className="space-y-2">
            {products.length === 0 ? (
              <p className="text-soft-white/50">Nema proizvoda.</p>
            ) : (
              products.map((p) => {
                const cat = categories.find((c) => c.id === p.category_id)?.name ?? "—";
                return (
                  <div
                    key={p.id}
                    className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
                      p.available
                        ? p.featured
                          ? "border-gold/40 bg-gold/10"
                          : "border-gold/15 bg-forest-deep/30"
                        : "border-red-500/20 bg-red-950/20 opacity-70"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="font-medium">
                        {p.featured ? <span className="mr-1 text-gold">★</span> : null}
                        {p.name}
                      </p>
                      <p className="text-xs text-soft-white/50">
                        {cat} · {formatPrice(p.price)}
                        {!p.available ? " · nedostupno" : ""}
                        {p.featured ? " · istaknuto" : ""}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <FeaturedToggleButton productId={p.id} featured={p.featured} />
                      <form action={toggleProductAvailable}>
                        <input type="hidden" name="id" value={p.id} />
                        <input
                          type="hidden"
                          name="available"
                          value={p.available ? "false" : "true"}
                        />
                        <button
                          type="submit"
                          className="rounded-lg border border-gold/25 px-2.5 py-1 text-xs text-soft-white/70"
                        >
                          {p.available ? "Isključi" : "Uključi"}
                        </button>
                      </form>
                      <button
                        type="button"
                        onClick={() => setEditing(p)}
                        className="rounded-lg border border-gold/25 px-2.5 py-1 text-xs text-soft-white/70"
                      >
                        Izmeni
                      </button>
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={p.id} />
                        <button type="submit" className="rounded-lg px-2.5 py-1 text-xs text-red-400">
                          Obriši
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-soft-white/50">{label}</span>
      {children}
    </label>
  );
}

function TabBtn({
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
      className={`rounded-lg px-3 py-1.5 text-sm ${
        active ? "bg-gold text-black" : "border border-gold/25 text-soft-white/70"
      }`}
    >
      {children}
    </button>
  );
}
