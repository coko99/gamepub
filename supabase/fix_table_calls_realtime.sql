-- Ako pozivi rade u bazi ali konobar ne vidi alert, pokreni ovo:
do $$ begin
  alter publication supabase_realtime add table public.table_calls;
exception when duplicate_object then null;
end $$;
