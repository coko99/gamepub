-- Gamepub digitalni meni — pokreni u Supabase SQL Editor (sveže instalacije)

create extension if not exists "pgcrypto";

-- Zone stolova (admin može da menja nazive)
create table if not exists public.table_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_table_zones_sort on public.table_zones (sort_order);

insert into public.table_zones (name, sort_order, active)
select v.name, v.sort_order, true
from (values
  ('Glavna sala', 1),
  ('PlayStation zona', 2),
  ('Bilijar', 3),
  ('Bar', 4)
) as v(name, sort_order)
where not exists (select 1 from public.table_zones limit 1);

-- Stolovi (broj kreće od 1 u svakoj zoni)
create table if not exists public.tables (
  id uuid primary key default gen_random_uuid(),
  zone_id uuid not null references public.table_zones(id) on delete restrict,
  number integer not null,
  token text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (zone_id, number)
);

-- Kategorije
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Proizvodi
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  image_url text,
  available boolean not null default true,
  featured boolean not null default false,
  featured_order integer not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_products_featured
  on public.products (featured, featured_order)
  where featured = true;

do $$ begin
  create type public.order_status as enum (
    'nova',
    'prihvacena',
    'u_pripremi',
    'posluzeno',
    'placeno',
    'otkazano'
  );
exception when duplicate_object then null;
end $$;

-- Porudžbine
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  table_id uuid not null references public.tables(id),
  table_zone text not null,
  table_number integer not null,
  note text,
  total numeric(10,2) not null check (total >= 0),
  status public.order_status not null default 'nova',
  created_at timestamptz not null default now()
);

-- Stavke porudžbine
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  unit_price numeric(10,2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0)
);

create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created on public.orders(created_at desc);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_tables_token on public.tables(token);
create index if not exists idx_tables_zone on public.tables(zone_id);

-- Realtime (ignoriši grešku ako već postoji)
do $$ begin
  alter publication supabase_realtime add table public.orders;
exception when duplicate_object then null;
end $$;
do $$ begin
  alter publication supabase_realtime add table public.order_items;
exception when duplicate_object then null;
end $$;

-- RLS
alter table public.table_zones enable row level security;
alter table public.tables enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Policies (drop + create for idempotency)
-- tables.token nije dostupan anonu (sprečava enumeraciju QR-ova)

drop policy if exists "anon_read_active_tables" on public.tables;

drop policy if exists "anon_read_active_categories" on public.categories;
create policy "anon_read_active_categories"
  on public.categories for select to anon
  using (active = true);

drop policy if exists "anon_read_available_products" on public.products;
create policy "anon_read_available_products"
  on public.products for select to anon
  using (
    available = true
    and exists (
      select 1 from public.categories c
      where c.id = products.category_id and c.active = true
    )
  );

-- orders / order_items: NEMAj anon access
-- Gost i osoblje pišu/čitaju preko Next.js service role + session guard

drop policy if exists "anon_insert_orders" on public.orders;
drop policy if exists "anon_insert_order_items" on public.order_items;
drop policy if exists "anon_read_orders" on public.orders;
drop policy if exists "anon_read_order_items" on public.order_items;
drop policy if exists "anon_update_orders" on public.orders;

drop policy if exists "authenticated_all_table_zones" on public.table_zones;
create policy "authenticated_all_table_zones"
  on public.table_zones for all to authenticated
  using (true) with check (true);

drop policy if exists "authenticated_all_tables" on public.tables;
create policy "authenticated_all_tables"
  on public.tables for all to authenticated
  using (true) with check (true);

drop policy if exists "authenticated_all_categories" on public.categories;
create policy "authenticated_all_categories"
  on public.categories for all to authenticated
  using (true) with check (true);

drop policy if exists "authenticated_all_products" on public.products;
create policy "authenticated_all_products"
  on public.products for all to authenticated
  using (true) with check (true);

drop policy if exists "authenticated_all_orders" on public.orders;
create policy "authenticated_all_orders"
  on public.orders for all to authenticated
  using (true) with check (true);

drop policy if exists "authenticated_all_order_items" on public.order_items;
create policy "authenticated_all_order_items"
  on public.order_items for all to authenticated
  using (true) with check (true);
