-- Statistika porudžbina + arhiva posle smene

create table if not exists public.order_daily_zone_stats (
  stat_date date not null,
  table_zone text not null,
  order_count integer not null default 0 check (order_count >= 0),
  total_revenue numeric(12,2) not null default 0 check (total_revenue >= 0),
  primary key (stat_date, table_zone)
);

create table if not exists public.order_daily_product_stats (
  stat_date date not null,
  product_name text not null,
  product_id uuid,
  quantity_sold integer not null default 0 check (quantity_sold >= 0),
  total_revenue numeric(12,2) not null default 0 check (total_revenue >= 0),
  primary key (stat_date, product_name)
);

create index if not exists idx_zone_stats_date on public.order_daily_zone_stats (stat_date desc);
create index if not exists idx_product_stats_date on public.order_daily_product_stats (stat_date desc);

create table if not exists public.shift_closes (
  id uuid primary key default gen_random_uuid(),
  closed_at timestamptz not null default now(),
  orders_archived integer not null default 0,
  calls_cleared integer not null default 0
);

create or replace function public.increment_daily_zone_stat(
  p_date date,
  p_zone text,
  p_orders integer,
  p_revenue numeric
) returns void
language plpgsql
as $$
begin
  insert into public.order_daily_zone_stats (stat_date, table_zone, order_count, total_revenue)
  values (p_date, p_zone, p_orders, p_revenue)
  on conflict (stat_date, table_zone) do update set
    order_count = public.order_daily_zone_stats.order_count + excluded.order_count,
    total_revenue = public.order_daily_zone_stats.total_revenue + excluded.total_revenue;
end;
$$;

create or replace function public.increment_daily_product_stat(
  p_date date,
  p_name text,
  p_product_id uuid,
  p_qty integer,
  p_revenue numeric
) returns void
language plpgsql
as $$
begin
  insert into public.order_daily_product_stats (stat_date, product_name, product_id, quantity_sold, total_revenue)
  values (p_date, p_name, p_product_id, p_qty, p_revenue)
  on conflict (stat_date, product_name) do update set
    product_id = coalesce(excluded.product_id, public.order_daily_product_stats.product_id),
    quantity_sold = public.order_daily_product_stats.quantity_sold + excluded.quantity_sold,
    total_revenue = public.order_daily_product_stats.total_revenue + excluded.total_revenue;
end;
$$;

alter table public.order_daily_zone_stats enable row level security;
alter table public.order_daily_product_stats enable row level security;
alter table public.shift_closes enable row level security;

drop policy if exists "authenticated_all_order_daily_zone_stats" on public.order_daily_zone_stats;
create policy "authenticated_all_order_daily_zone_stats"
  on public.order_daily_zone_stats for all to authenticated
  using (true) with check (true);

drop policy if exists "authenticated_all_order_daily_product_stats" on public.order_daily_product_stats;
create policy "authenticated_all_order_daily_product_stats"
  on public.order_daily_product_stats for all to authenticated
  using (true) with check (true);

drop policy if exists "authenticated_all_shift_closes" on public.shift_closes;
create policy "authenticated_all_shift_closes"
  on public.shift_closes for all to authenticated
  using (true) with check (true);
