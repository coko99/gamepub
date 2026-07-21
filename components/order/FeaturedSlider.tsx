"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types/menu";
import { formatPrice } from "@/lib/types/menu";

type Props = {
  products: Product[];
  onAdd: (product: Product) => void;
};

function hasImage(product: Product) {
  return Boolean(product.image_url?.trim());
}

export function FeaturedSlider({ products, onAdd }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (products.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % products.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [products.length]);

  useEffect(() => {
    if (index >= products.length) setIndex(0);
  }, [index, products.length]);

  if (products.length === 0) return null;

  const current = products[index] ?? products[0];
  const showImage = hasImage(current);

  return (
    <section className="border-b border-gold/10 bg-gradient-to-b from-forest-deep/80 to-black px-4 pb-4 pt-3 md:rounded-2xl md:border md:px-6 md:pb-6 md:pt-5">
      <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-gold/70 md:text-xs">
        Istaknuto
      </p>

      {showImage ? (
        <div className="relative overflow-hidden rounded-2xl border border-gold/25 bg-black/40 md:rounded-3xl">
          <div className="relative aspect-[16/10] w-full md:aspect-[21/9] xl:aspect-[2.2/1]">
            <Image
              src={current.image_url!}
              alt={current.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 900px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </div>

          <FeaturedContent
            product={current}
            onAdd={onAdd}
            overlay
            products={products}
            index={index}
            setIndex={setIndex}
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-gold/25 bg-forest-deep/50 p-4 md:p-6">
          <FeaturedContent
            product={current}
            onAdd={onAdd}
            products={products}
            index={index}
            setIndex={setIndex}
          />
        </div>
      )}

      {products.length > 1 ? (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {products.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setIndex(i)}
              className={`rounded-full px-3 py-1.5 text-xs transition md:text-sm ${
                i === index
                  ? "bg-gold font-semibold text-black"
                  : "border border-gold/25 text-soft-white/70 hover:border-gold/50"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function FeaturedContent({
  product,
  onAdd,
  overlay = false,
  products,
  index,
  setIndex,
}: {
  product: Product;
  onAdd: (product: Product) => void;
  overlay?: boolean;
  products: Product[];
  index: number;
  setIndex: (fn: (i: number) => number) => void;
}) {
  const wrapperClass = overlay
    ? "absolute inset-x-0 bottom-0 p-4 md:p-8"
    : "";

  return (
    <>
      <div className={wrapperClass}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:gap-6">
          <div className="min-w-0 flex-1">
            <h2 className="font-serif text-2xl leading-tight text-soft-white md:text-3xl xl:text-4xl">
              {product.name}
            </h2>
            {product.description ? (
              <p className="mt-1 line-clamp-3 text-sm text-soft-white/65 md:mt-2 md:text-base">
                {product.description}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-2 md:gap-3">
            <p className="text-base font-semibold text-gold md:text-xl">
              {formatPrice(product.price)}
            </p>
            <button
              type="button"
              onClick={() => onAdd(product)}
              className="rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-black transition active:scale-95 md:px-6 md:py-3 md:text-base"
            >
              + Dodaj
            </button>
          </div>
        </div>
      </div>

      {products.length > 1 && overlay ? (
        <>
          <button
            type="button"
            aria-label="Prethodni"
            onClick={() => setIndex((i) => (i - 1 + products.length) % products.length)}
            className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-soft-white/80 backdrop-blur-sm md:left-4 md:h-11 md:w-11 md:text-xl"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Sledeći"
            onClick={() => setIndex((i) => (i + 1) % products.length)}
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-soft-white/80 backdrop-blur-sm md:right-4 md:h-11 md:w-11 md:text-xl"
          >
            ›
          </button>
        </>
      ) : null}
    </>
  );
}
