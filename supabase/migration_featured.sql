-- Istaknuti proizvodi (slajder na /meni)
-- Pokreni u Supabase SQL Editor

alter table public.products
  add column if not exists featured boolean not null default false;

alter table public.products
  add column if not exists featured_order integer not null default 0;

create index if not exists idx_products_featured
  on public.products (featured, featured_order)
  where featured = true;
