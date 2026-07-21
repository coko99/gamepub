-- Zaključaj tokene stolova (štampa QR) — token se više ne može UPDATE-ovati
-- Pokreni u Supabase SQL Editor

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
