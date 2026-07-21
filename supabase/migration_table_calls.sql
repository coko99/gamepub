-- Pozivi konobaru (pozovi / račun)
-- Pokreni u Supabase SQL Editor

do $$ begin
  create type public.table_call_type as enum ('waiter', 'bill');
exception when duplicate_object then null;
end $$;

create table if not exists public.table_calls (
  id uuid primary key default gen_random_uuid(),
  table_id uuid not null references public.tables(id),
  table_zone public.table_zone not null,
  table_number integer not null,
  call_type public.table_call_type not null,
  status text not null default 'open' check (status in ('open', 'done')),
  created_at timestamptz not null default now()
);

create index if not exists idx_table_calls_open
  on public.table_calls (status, created_at desc);

alter table public.table_calls enable row level security;

-- Nema anon politika — insert/update ide preko Next.js service role

do $$ begin
  alter publication supabase_realtime add table public.table_calls;
exception when duplicate_object then null;
end $$;
