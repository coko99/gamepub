"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useTransition } from "react";
import { createTableCall, submitOrder } from "@/app/meni/actions";
import { FeaturedSlider } from "@/components/order/FeaturedSlider";
import { PostOrderHub } from "@/components/order/PostOrderHub";
import { PoweredByBadge } from "@/components/layout/PoweredByBadge";
import type { CartItem, Category, Product, TableRow } from "@/lib/types/menu";
import { formatPrice, tableLabel, zoneLabel } from "@/lib/types/menu";

type Props = {
  table: TableRow;
  categories: Category[];
  products: Product[];
  sessionMinutesLeft?: number;
};

function cartKey(token: string) {
  return `gamepub-cart-${token}`;
}

function orderedKey(token: string) {
  return `gamepub-ordered-${token}`;
}

function hasImage(product: Product) {
  return Boolean(product.image_url?.trim());
}

export function GuestMenu({ table, categories, products, sessionMinutesLeft }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [note, setNote] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [hub, setHub] = useState(false);
  const [hasOrdered, setHasOrdered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [callPending, startCall] = useTransition();
  const [toast, setToast] = useState<string | null>(null);

  const zoneName = table.zone_name;
  const tableTitle = tableLabel(zoneName, table.number);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(cartKey(table.token));
      if (raw) setCart(JSON.parse(raw) as CartItem[]);
      if (localStorage.getItem(orderedKey(table.token)) === "1") setHasOrdered(true);
    } catch {
      /* ignore */
    }
  }, [table.token]);

  useEffect(() => {
    localStorage.setItem(cartKey(table.token), JSON.stringify(cart));
  }, [cart, table.token]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(id);
  }, [toast]);

  const featured = useMemo(
    () =>
      products
        .filter((p) => p.featured && p.available)
        .sort((a, b) => a.featured_order - b.featured_order),
    [products],
  );

  const filtered = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((p) => p.category_id === activeCategory);
  }, [activeCategory, products]);

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = cart.reduce((s, i) => s + i.quantity, 0);

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [
        ...prev,
        { productId: product.id, name: product.name, price: product.price, quantity: 1 },
      ];
    });
  }

  function changeQty(productId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + delta } : i,
        )
        .filter((i) => i.quantity > 0),
    );
  }

  function sendOrder() {
    setError(null);
    startTransition(async () => {
      const result = await submitOrder({
        tableToken: table.token,
        note,
        items: cart,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setCart([]);
      setNote("");
      localStorage.removeItem(cartKey(table.token));
      localStorage.setItem(orderedKey(table.token), "1");
      setHasOrdered(true);
      setCartOpen(false);
      setHub(true);
    });
  }

  function requestCall(type: "waiter" | "bill") {
    startCall(async () => {
      const result = await createTableCall({
        tableToken: table.token,
        callType: type,
      });
      if (!result.ok) {
        setToast(result.error);
        return;
      }
      setToast(type === "bill" ? "Zahtev za račun poslat konobaru" : "Konobar je pozvan");
    });
  }

  if (hub) {
    return <PostOrderHub table={table} onOrderMore={() => setHub(false)} />;
  }

  const cartPanel = (
    <CartPanel
      cart={cart}
      note={note}
      error={error}
      pending={pending}
      total={total}
      title={tableTitle}
      onNoteChange={setNote}
      onChangeQty={changeQty}
      onSubmit={sendOrder}
    />
  );

  return (
    <div className="min-h-dvh bg-black pb-32 md:pb-8">
      <header className="sticky top-0 z-30 border-b border-gold/15 bg-black/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 md:px-8 md:py-4">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.25em] text-gold/70 md:text-xs">
              GAMEPUB meni
            </p>
            <h1 className="font-serif text-2xl text-soft-white md:text-3xl">Sto {table.number}</h1>
            <p className="text-xs text-soft-white/50 md:text-sm">{zoneLabel(zoneName)}</p>
            {typeof sessionMinutesLeft === "number" ? (
              <p className="mt-0.5 text-[10px] text-soft-white/35 md:text-xs">
                Sesija ~{sessionMinutesLeft} min
              </p>
            ) : null}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <CallButton
              disabled={callPending}
              onClick={() => requestCall("waiter")}
              icon="🔔"
              label="Konobar"
              variant="waiter"
            />
            {hasOrdered ? (
              <CallButton
                disabled={callPending}
                onClick={() => requestCall("bill")}
                icon="🧾"
                label="Račun"
                variant="bill"
              />
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative shrink-0 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-black md:hidden"
          >
            Korpa
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-forest text-[11px] text-soft-white">
                {count}
              </span>
            ) : null}
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-none md:hidden">
          <CategoryChip
            active={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
            label="Sve"
          />
          {categories.map((c) => (
            <CategoryChip
              key={c.id}
              active={activeCategory === c.id}
              onClick={() => setActiveCategory(c.id)}
              label={c.name}
            />
          ))}
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] md:flex md:items-start md:gap-6 md:px-8 md:py-6 lg:gap-8">
        <aside className="sticky top-[4.5rem] hidden max-h-[calc(100dvh-5.5rem)] w-48 shrink-0 overflow-y-auto md:block lg:w-56">
          <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-gold/60">Kategorije</p>
          <nav className="space-y-1">
            <CategoryNavItem
              active={activeCategory === "all"}
              onClick={() => setActiveCategory("all")}
              label="Sve"
            />
            {categories.map((c) => (
              <CategoryNavItem
                key={c.id}
                active={activeCategory === c.id}
                onClick={() => setActiveCategory(c.id)}
                label={c.name}
              />
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <FeaturedSlider products={featured} onAdd={addToCart} />

          <div className="divide-y divide-gold/10 px-4 md:px-0 md:py-2">
            {filtered.length === 0 ? (
              <p className="py-12 text-center text-soft-white/50">Nema dostupnih proizvoda.</p>
            ) : (
              filtered.map((product) => (
                <ProductRow key={product.id} product={product} onAdd={addToCart} />
              ))
            )}
          </div>

          <div className="px-4 pb-6 md:px-0 md:pt-4">
            <PoweredByBadge className="rounded-xl" />
          </div>
        </main>

        <aside className="sticky top-20 hidden w-72 shrink-0 md:block lg:w-80">
          <div className="rounded-2xl border border-gold/20 bg-[#0c1410] p-5 shadow-xl shadow-black/40">
            <h2 className="font-serif text-xl text-soft-white">Korpa</h2>
            <p className="mt-0.5 text-sm text-soft-white/50">{tableTitle}</p>
            <div className="mt-4">{cartPanel}</div>
          </div>
        </aside>
      </div>

      <div className="fixed bottom-24 right-3 z-40 md:hidden">
        <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-[#0c1410]/95 p-2 shadow-2xl shadow-black/50 backdrop-blur-md">
          <button
            type="button"
            disabled={callPending}
            onClick={() => requestCall("waiter")}
            className="flex w-[4.75rem] flex-col items-center gap-1 rounded-xl bg-[#1a3a2a] px-2 py-2.5 text-center transition active:scale-95 disabled:opacity-50"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20 text-lg text-emerald-300">
              🔔
            </span>
            <span className="text-[10px] font-semibold leading-tight text-soft-white/90">
              Konobar
            </span>
          </button>
          {hasOrdered ? (
            <button
              type="button"
              disabled={callPending}
              onClick={() => requestCall("bill")}
              className="flex w-[4.75rem] flex-col items-center gap-1 rounded-xl bg-gold/15 px-2 py-2.5 text-center transition active:scale-95 disabled:opacity-50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/25 text-lg text-gold">
                🧾
              </span>
              <span className="text-[10px] font-semibold leading-tight text-gold">Račun</span>
            </button>
          ) : null}
        </div>
      </div>

      {toast ? (
        <div className="fixed bottom-[11.5rem] right-3 z-50 max-w-[11rem] rounded-xl border border-gold/20 bg-forest-deep px-3 py-2 text-center text-xs text-soft-white shadow-lg md:bottom-8 md:right-8 md:max-w-xs md:text-sm">
          {toast}
        </div>
      ) : null}

      {count > 0 && !cartOpen ? (
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="fixed bottom-5 left-1/2 z-40 flex w-[min(100%-2rem,28rem)] -translate-x-1/2 items-center justify-between rounded-2xl bg-gold px-5 py-4 font-semibold text-black shadow-lg shadow-gold/20 md:hidden"
        >
          <span>Pogledaj korpu ({count})</span>
          <span>{formatPrice(total)}</span>
        </button>
      ) : null}

      {cartOpen ? (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm md:hidden">
          <button
            type="button"
            className="flex-1"
            aria-label="Zatvori"
            onClick={() => setCartOpen(false)}
          />
          <div className="max-h-[85dvh] overflow-y-auto rounded-t-3xl border-t border-gold/25 bg-[#0c1410] px-4 pb-8 pt-4">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-soft-white/20" />
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-2xl text-soft-white">Korpa · {tableTitle}</h2>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="text-sm text-soft-white/50"
              >
                Zatvori
              </button>
            </div>
            <CartPanel
              cart={cart}
              note={note}
              error={error}
              pending={pending}
              total={total}
              title={tableTitle}
              onNoteChange={setNote}
              onChangeQty={changeQty}
              onSubmit={sendOrder}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ProductRow({ product, onAdd }: { product: Product; onAdd: (p: Product) => void }) {
  const showImage = hasImage(product);

  if (showImage) {
    return (
      <article className="flex gap-4 py-4 md:py-5">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-black/40 md:h-24 md:w-24">
          <Image
            src={product.image_url!}
            alt={product.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
        <ProductRowBody product={product} onAdd={onAdd} />
      </article>
    );
  }

  return (
    <article className="py-4 md:py-5">
      <ProductRowBody product={product} onAdd={onAdd} />
    </article>
  );
}

function ProductRowBody({ product, onAdd }: { product: Product; onAdd: (p: Product) => void }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="min-w-0 flex-1">
        <h2 className="font-medium leading-snug text-soft-white md:text-lg">{product.name}</h2>
        {product.description ? (
          <p className="mt-1 text-sm text-soft-white/55 md:text-base">{product.description}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center sm:gap-2">
        <p className="text-base font-semibold text-gold md:text-lg">{formatPrice(product.price)}</p>
        <button
          type="button"
          onClick={() => onAdd(product)}
          className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-black transition active:scale-95 md:px-5 md:py-2.5"
        >
          + Dodaj
        </button>
      </div>
    </div>
  );
}

function CartPanel({
  cart,
  note,
  error,
  pending,
  total,
  onNoteChange,
  onChangeQty,
  onSubmit,
}: {
  cart: CartItem[];
  note: string;
  error: string | null;
  pending: boolean;
  total: number;
  title: string;
  onNoteChange: (v: string) => void;
  onChangeQty: (id: string, delta: number) => void;
  onSubmit: () => void;
}) {
  return (
    <>
      {cart.length === 0 ? (
        <p className="py-8 text-center text-soft-white/50">Korpa je prazna.</p>
      ) : (
        <ul className="space-y-3">
          {cart.map((item) => (
            <li
              key={item.productId}
              className="flex items-center justify-between gap-3 border-b border-gold/10 pb-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{item.name}</p>
                <p className="text-sm text-gold">{formatPrice(item.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onChangeQty(item.productId, -1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 text-gold"
                >
                  −
                </button>
                <span className="w-6 text-center">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => onChangeQty(item.productId, 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 text-gold"
                >
                  +
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <label className="mt-5 block">
        <span className="mb-1.5 block text-sm text-soft-white/60">Napomena</span>
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          rows={2}
          placeholder="Npr. sa ledom, bez šećera, Jägermeister umesto pelinkovca…"
          className="w-full resize-none rounded-xl border border-gold/20 bg-black/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gold/30"
        />
      </label>

      {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}

      <div className="mt-5 flex items-center justify-between text-lg">
        <span className="text-soft-white/70">Ukupno</span>
        <span className="font-semibold text-gold">{formatPrice(total)}</span>
      </div>

      <button
        type="button"
        disabled={cart.length === 0 || pending}
        onClick={onSubmit}
        className="mt-4 w-full rounded-2xl bg-gold py-4 font-semibold text-black disabled:opacity-40"
      >
        {pending ? "Šaljem…" : "Pošalji porudžbinu"}
      </button>
    </>
  );
}

function CallButton({
  icon,
  label,
  variant,
  disabled,
  onClick,
}: {
  icon: string;
  label: string;
  variant: "waiter" | "bill";
  disabled: boolean;
  onClick: () => void;
}) {
  const styles =
    variant === "waiter"
      ? "border-emerald-500/25 bg-[#13261c] text-soft-white"
      : "border-gold/30 bg-gold/10 text-gold";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition hover:opacity-90 disabled:opacity-50 ${styles}`}
    >
      <span>{icon}</span>
      {label}
    </button>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm transition ${
        active
          ? "bg-gold text-black"
          : "border border-gold/25 bg-transparent text-soft-white/75"
      }`}
    >
      {label}
    </button>
  );
}

function CategoryNavItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`block w-full rounded-xl px-3 py-2.5 text-left text-sm transition ${
        active
          ? "bg-gold/15 font-semibold text-gold"
          : "text-soft-white/70 hover:bg-white/5 hover:text-soft-white"
      }`}
    >
      {label}
    </button>
  );
}
