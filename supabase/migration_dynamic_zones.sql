-- Dinamične zone stolova (pokreni na postojećoj Gamepub bazi)
-- Idempotentno — bezbedno ponovo pokrenuti ako je ranije puklo na pola.

create table if not exists public.table_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_table_zones_sort on public.table_zones (sort_order);

alter table public.table_zones enable row level security;

drop policy if exists "authenticated_all_table_zones" on public.table_zones;
create policy "authenticated_all_table_zones"
  on public.table_zones for all to authenticated
  using (true) with check (true);

insert into public.table_zones (name, sort_order, active)
select v.name, v.sort_order, true
from (values
  ('Glavna sala', 1),
  ('PlayStation zona', 2),
  ('Bilijar', 3),
  ('Bar', 4)
) as v(name, sort_order)
where not exists (select 1 from public.table_zones limit 1);

alter table public.tables add column if not exists zone_id uuid references public.table_zones(id);

-- Mapiraj stari enum zone -> zone_id (ako kolona zone još postoji)
do $$
declare
  has_enum boolean;
begin
  select exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'tables'
      and column_name = 'zone'
  ) into has_enum;

  if has_enum then
    update public.tables t
    set zone_id = z.id
    from public.table_zones z
    where t.zone_id is null
      and (
        (t.zone::text = 'glavna-sala' and z.sort_order = 1)
        or (t.zone::text = 'ps-zona' and z.sort_order = 2)
        or (t.zone::text = 'bilijar' and z.sort_order = 3)
        or (t.zone::text = 'bar' and z.sort_order = 4)
        or (t.zone::text = 'sprat-1' and z.sort_order = 1)
        or (t.zone::text = 'sprat-2' and z.sort_order = 2)
        or (t.zone::text = 'sprat-3' and z.sort_order = 3)
        or (t.zone::text = 'dvoriste' and z.sort_order = 4)
      );

    alter table public.tables drop constraint if exists tables_zone_number_key;
    alter table public.tables drop column zone;
  end if;
end $$;

-- Prvo enum -> text (slug ostaje: glavna-sala, ps-zona...)
alter table public.orders
  alter column table_zone type text using table_zone::text;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'table_calls'
      and column_name = 'table_zone'
  ) then
    execute $sql$
      alter table public.table_calls
        alter column table_zone type text using table_zone::text
    $sql$;
  end if;
end $$;

-- Zatim slug -> čitljivo ime zone
update public.orders o
set table_zone = z.name
from public.table_zones z
where o.table_zone ~ '^[a-z0-9-]+$'
  and (
    (o.table_zone = 'glavna-sala' and z.sort_order = 1)
    or (o.table_zone = 'ps-zona' and z.sort_order = 2)
    or (o.table_zone = 'bilijar' and z.sort_order = 3)
    or (o.table_zone = 'bar' and z.sort_order = 4)
    or (o.table_zone = 'sprat-1' and z.sort_order = 1)
    or (o.table_zone = 'sprat-2' and z.sort_order = 2)
    or (o.table_zone = 'sprat-3' and z.sort_order = 3)
    or (o.table_zone = 'dvoriste' and z.sort_order = 4)
  );

do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public'
      and table_name = 'table_calls'
  ) then
    execute $sql$
      update public.table_calls c
      set table_zone = z.name
      from public.table_zones z
      where c.table_zone ~ '^[a-z0-9-]+$'
        and (
          (c.table_zone = 'glavna-sala' and z.sort_order = 1)
          or (c.table_zone = 'ps-zona' and z.sort_order = 2)
          or (c.table_zone = 'bilijar' and z.sort_order = 3)
          or (c.table_zone = 'bar' and z.sort_order = 4)
          or (c.table_zone = 'sprat-1' and z.sort_order = 1)
          or (c.table_zone = 'sprat-2' and z.sort_order = 2)
          or (c.table_zone = 'sprat-3' and z.sort_order = 3)
          or (c.table_zone = 'dvoriste' and z.sort_order = 4)
        )
    $sql$;
  end if;
end $$;

update public.tables t
set zone_id = (select id from public.table_zones order by sort_order limit 1)
where zone_id is null;

alter table public.tables drop constraint if exists tables_zone_id_number_key;
alter table public.tables add constraint tables_zone_id_number_key unique (zone_id, number);

alter table public.tables drop constraint if exists tables_zone_id_fkey;
alter table public.tables
  add constraint tables_zone_id_fkey
  foreign key (zone_id) references public.table_zones(id) on delete restrict;
