-- Security harden: lock down anon RLS, regenerate predictable table tokens
-- Pokreni u Supabase SQL Editor (posle ostalih migracija)

-- ─── 1) Ukloni opasne anon politike ─────────────────────────────────────────

drop policy if exists "anon_insert_orders" on public.orders;
drop policy if exists "anon_insert_order_items" on public.order_items;
drop policy if exists "anon_read_orders" on public.orders;
drop policy if exists "anon_read_order_items" on public.order_items;
drop policy if exists "anon_update_orders" on public.orders;

drop policy if exists "anon_insert_table_calls" on public.table_calls;
drop policy if exists "anon_read_table_calls" on public.table_calls;
drop policy if exists "anon_update_table_calls" on public.table_calls;

-- Ne dozvoli listanje svih stolova / tokena preko anon ključa
drop policy if exists "anon_read_active_tables" on public.tables;

-- Anon i dalje sme samo javni meni (kategorije + proizvodi) — ostaje iz schema.sql

-- ─── 2) Regeneriši predvidljive tokene (QR još nije štampan) ────────────────

drop trigger if exists trg_lock_table_token on public.tables;

update public.tables
set token = substring(
  replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '')
  from 1 for 32
)
where token ~ '^(s[123]|dv)-sto[0-9]+'
   or length(token) < 24;

-- Vrati zaključavanje tokena
create or replace function public.prevent_table_token_change()
returns trigger
language plpgsql
as $$
begin
  if new.token is distinct from old.token then
    raise exception 'Token stola je zaključan za štampu QR i ne može se menjati.';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_lock_table_token on public.tables;
create trigger trg_lock_table_token
  before update on public.tables
  for each row
  execute function public.prevent_table_token_change();

-- ─── 3) Realtime više ne treba anon (staff koristi server poll) ─────────────
-- (nema DROP publication — ostaje bezbedno jer nema anon SELECT politike)
