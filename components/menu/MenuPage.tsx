"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import {
  menuCategories,
  menuPageContent,
  type MenuCategory,
  type MenuItem,
} from "@/content/menu";
import {
  highlightMatch,
  menuItemMatchesQuery,
  normalizeMenuSearch,
} from "@/lib/menuSearch";
import { MenuIcon } from "./MenuIcons";

const CATEGORY_OFFSET = 168;

function scrollToCategory(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  const top =
    target.getBoundingClientRect().top + window.scrollY - CATEGORY_OFFSET;

  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  window.history.replaceState(null, "", `#${id}`);
}

function formatPrice(price: number) {
  return `${price.toLocaleString("sr-RS")} ${menuPageContent.priceSuffix}`;
}

function HighlightedName({ name, query }: { name: string; query: string }) {
  const parts = highlightMatch(name, query);

  return (
    <>
      {parts.map((part, index) =>
        part.match ? (
          <mark
            key={`${part.text}-${index}`}
            className="rounded bg-[#00E5FF]/25 px-0.5 text-[#00E5FF]"
          >
            {part.text}
          </mark>
        ) : (
          <span key={`${part.text}-${index}`}>{part.text}</span>
        ),
      )}
    </>
  );
}

function MenuItemRow({
  item,
  category,
  query = "",
}: {
  item: MenuItem;
  category: MenuCategory;
  query?: string;
}) {
  return (
    <li className="group flex items-start justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.03] md:px-7 md:py-4">
      <span className="min-w-0 flex-1 text-sm leading-relaxed text-[#E8E8F0] md:text-base">
        <HighlightedName name={item.name} query={query} />
      </span>
      <span
        className={`shrink-0 bg-gradient-to-r ${category.gradient} bg-clip-text font-gaming text-sm font-semibold whitespace-nowrap text-transparent md:text-base`}
      >
        {formatPrice(item.price)}
      </span>
    </li>
  );
}

function CategorySection({
  category,
  query = "",
}: {
  category: MenuCategory;
  query?: string;
}) {
  return (
    <section
      id={category.id}
      className="scroll-mt-44 md:scroll-mt-48"
      aria-labelledby={`${category.id}-heading`}
    >
      <div
        className="glass-card overflow-hidden rounded-2xl border transition-shadow duration-500 hover:shadow-[0_0_40px_var(--cat-glow)]"
        style={
          {
            "--cat-glow": category.glow,
            borderColor: category.border,
          } as React.CSSProperties
        }
      >
        <div className="relative overflow-hidden border-b border-white/5 px-5 py-5 md:px-7 md:py-6">
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle at top left, ${category.glow}, transparent 60%)`,
            }}
          />
          <div className="relative flex items-center gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${category.gradient} shadow-[0_0_24px_var(--cat-glow)]`}
              style={{ "--cat-glow": category.glow } as React.CSSProperties}
            >
              <MenuIcon icon={category.icon} size={22} className="text-white" />
            </div>
            <div>
              <h2
                id={`${category.id}-heading`}
                className="font-heading text-xl font-bold tracking-wide text-white uppercase md:text-2xl"
              >
                {category.title}
              </h2>
              <p className="mt-0.5 text-sm text-[#B8B8C8]">
                {category.items.length} artikala
              </p>
            </div>
          </div>
        </div>

        <ul className="divide-y divide-white/5">
          {category.items.map((item) => (
            <MenuItemRow
              key={item.name}
              item={item}
              category={category}
              query={query}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

function SearchResults({
  results,
  query,
}: {
  results: { category: MenuCategory; item: MenuItem }[];
  query: string;
}) {
  return (
    <div className="glass-card overflow-hidden rounded-2xl border border-[#00E5FF]/25 shadow-[0_0_30px_rgba(0,229,255,0.12)]">
      <div className="border-b border-white/10 px-5 py-4 md:px-7">
        <p className="font-gaming text-xs tracking-[0.2em] text-[#00E5FF] uppercase">
          Rezultati pretrage
        </p>
        <p className="mt-1 text-sm text-[#B8B8C8]">
          Pronađeno{" "}
          <span className="font-semibold text-white">{results.length}</span>{" "}
          {menuPageContent.resultsLabel}
        </p>
      </div>
      <ul className="divide-y divide-white/5">
        {results.map(({ category, item }) => (
          <li
            key={`${category.id}-${item.name}`}
            className="flex items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-white/[0.03] md:px-7"
          >
            <div className="min-w-0 flex-1">
              <span
                className={`mb-1.5 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-medium tracking-wide uppercase`}
                style={{ borderColor: category.border, color: category.glow }}
              >
                <MenuIcon icon={category.icon} size={12} />
                {category.title}
              </span>
              <p className="text-sm leading-relaxed text-[#E8E8F0] md:text-base">
                <HighlightedName name={item.name} query={query} />
              </p>
            </div>
            <span
              className={`shrink-0 bg-gradient-to-r ${category.gradient} bg-clip-text font-gaming text-sm font-semibold whitespace-nowrap text-transparent md:text-base`}
            >
              {formatPrice(item.price)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MenuPage({
  embedded = false,
  categories = menuCategories,
}: {
  embedded?: boolean;
  categories?: MenuCategory[];
}) {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");

  const normalizedQuery = normalizeMenuSearch(query);
  const isSearching = normalizedQuery.length > 0;

  const filteredCategories = useMemo(() => {
    if (!isSearching) return categories;

    return categories
      .map((category) => ({
        ...category,
        items: category.items.filter((item) =>
          menuItemMatchesQuery(item.name, category.title, query),
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [categories, query, isSearching]);

  const flatResults = useMemo(() => {
    if (!isSearching) return [];

    return filteredCategories.flatMap((category) =>
      category.items.map((item) => ({ category, item })),
    );
  }, [filteredCategories, isSearching]);

  useEffect(() => {
    if (categories[0]?.id) {
      setActiveId(categories[0].id);
    }
  }, [categories]);

  useEffect(() => {
    if (isSearching || filteredCategories.length === 0) return;

    const ids = filteredCategories.map((c) => c.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: [0, 0.15, 0.4],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [filteredCategories, isSearching]);

  const shellClass = embedded
    ? "relative pb-20 md:pb-28"
    : "relative min-h-screen pt-24 pb-20 md:pt-28 md:pb-28";

  return (
    <section className={shellClass}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="hero-gradient absolute inset-0 opacity-40" />
        <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-[#6C2DFF]/20 blur-[100px]" />
        <div className="absolute right-1/4 bottom-40 h-64 w-64 rounded-full bg-[#00E5FF]/15 blur-[90px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 md:px-6 lg:px-8">
        {!embedded && (
          <header className="mb-10 text-center md:mb-12">
            <span className="font-gaming mb-4 inline-block rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-4 py-1.5 text-xs tracking-[0.25em] text-[#00E5FF] uppercase">
              Meni
            </span>
            <h1 className="font-gaming hero-title-gradient text-3xl font-bold tracking-wider md:text-5xl lg:text-6xl">
              {menuPageContent.title}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-[#B8B8C8] md:text-lg">
              {menuPageContent.subtitle}
            </p>
          </header>
        )}

        <div className="sticky top-[4.5rem] z-30 -mx-4 border-b border-white/10 bg-[#050510] px-4 pb-4 pt-2 shadow-[0_16px_32px_rgba(5,5,16,0.92)] md:top-20 md:mx-0 md:px-0">
          <label
            htmlFor="menu-search"
            className="font-gaming mb-2 block text-xs tracking-[0.2em] text-[#00E5FF] uppercase"
          >
            {menuPageContent.searchLabel}
          </label>

          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[#00E5FF]"
            />
            <input
              id="menu-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={menuPageContent.searchPlaceholder}
              autoComplete="off"
              enterKeyHint="search"
              className="w-full rounded-2xl border border-[#00E5FF]/25 bg-[#101024] py-3.5 pr-12 pl-11 text-sm text-white shadow-[0_0_24px_rgba(0,229,255,0.08)] placeholder:text-[#B8B8C8]/60 transition-all focus:border-[#00E5FF]/60 focus:shadow-[0_0_32px_rgba(0,229,255,0.18)] focus:outline-none focus:ring-2 focus:ring-[#00E5FF]/25 md:py-4 md:text-base"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#B8B8C8] transition-colors hover:border-[#00E5FF]/40 hover:text-white"
                aria-label={menuPageContent.clearSearch}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="relative z-10 mt-6 mb-8 space-y-4">
          {!isSearching && (
            <>
              <p className="text-xs text-[#B8B8C8]/80">
                {menuPageContent.searchHint}
              </p>
              <div className="flex flex-wrap gap-2">
                {menuPageContent.quickSearch.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="rounded-full border border-white/10 bg-[#101024]/80 px-3 py-1 text-xs text-[#B8B8C8] transition-colors hover:border-[#00E5FF]/40 hover:text-[#00E5FF]"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </>
          )}

          {isSearching && flatResults.length > 0 && (
            <p className="text-sm text-[#B8B8C8]">
              Pronađeno{" "}
              <span className="font-semibold text-[#00E5FF]">
                {flatResults.length}
              </span>{" "}
              {menuPageContent.resultsLabel} za „{query}“
            </p>
          )}

          {!isSearching && (
            <nav
              aria-label="Kategorije menija"
              className="menu-category-nav -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-visible"
            >
              {categories.map((category) => {
                const isActive = activeId === category.id;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => scrollToCategory(category.id)}
                    className={`flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition-all duration-300 md:text-sm ${
                      isActive
                        ? "border-[#00E5FF]/50 bg-[#00E5FF]/15 text-white shadow-[0_0_20px_rgba(0,229,255,0.25)]"
                        : "border-white/10 bg-[#101024]/80 text-[#B8B8C8] hover:border-white/20 hover:text-white"
                    }`}
                    style={
                      isActive
                        ? ({
                            boxShadow: `0 0 24px ${category.glow}`,
                          } as React.CSSProperties)
                        : undefined
                    }
                  >
                    <MenuIcon
                      icon={category.icon}
                      size={16}
                      className={isActive ? "text-[#00E5FF]" : "text-[#B8B8C8]"}
                    />
                    {category.title}
                  </button>
                );
              })}
            </nav>
          )}
        </div>

        <div className="relative z-10">
        {isSearching ? (
          flatResults.length > 0 ? (
            <SearchResults results={flatResults} query={query} />
          ) : (
            <div className="glass-card rounded-2xl border border-white/10 px-6 py-16 text-center">
              <Search className="mx-auto mb-4 h-10 w-10 text-[#00E5FF]/40" />
              <p className="text-lg text-[#B8B8C8]">
                {menuPageContent.noResults} „{query}“
              </p>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="mt-4 text-sm font-medium text-[#00E5FF] transition-colors hover:text-white"
              >
                {menuPageContent.clearSearch}
              </button>
            </div>
          )
        ) : (
          <div className="space-y-8 md:space-y-10">
            {filteredCategories.map((category) => (
              <CategorySection key={category.id} category={category} />
            ))}
          </div>
        )}
        </div>
      </div>
    </section>
  );
}
