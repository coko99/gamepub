-- Gamepub seed — pokreni posle schema.sql + migracija

-- Stolovi po zonama (primer)
insert into public.tables (zone_id, number, token)
select z.zone_id, z.number,
  substring(replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '') from 1 for 32)
from (values
  ((select id from public.table_zones where sort_order = 1), 1),
  ((select id from public.table_zones where sort_order = 1), 2),
  ((select id from public.table_zones where sort_order = 1), 3),
  ((select id from public.table_zones where sort_order = 1), 4),
  ((select id from public.table_zones where sort_order = 2), 1),
  ((select id from public.table_zones where sort_order = 2), 2),
  ((select id from public.table_zones where sort_order = 2), 3),
  ((select id from public.table_zones where sort_order = 2), 4),
  ((select id from public.table_zones where sort_order = 3), 1),
  ((select id from public.table_zones where sort_order = 3), 2),
  ((select id from public.table_zones where sort_order = 3), 3),
  ((select id from public.table_zones where sort_order = 4), 1),
  ((select id from public.table_zones where sort_order = 4), 2),
  ((select id from public.table_zones where sort_order = 4), 3),
  ((select id from public.table_zones where sort_order = 4), 4)
) as z(zone_id, number)
on conflict (zone_id, number) do nothing;

-- Kategorije (Gamepub cenovnik)
insert into public.categories (id, name, sort_order) values
  ('22222222-2222-2222-2222-000000000001', 'Toplo', 1),
  ('22222222-2222-2222-2222-000000000002', 'Bezalkoholno', 2),
  ('22222222-2222-2222-2222-000000000003', 'Energetsko', 3),
  ('22222222-2222-2222-2222-000000000004', 'Šejkovi', 4),
  ('22222222-2222-2222-2222-000000000005', 'Vode', 5),
  ('22222222-2222-2222-2222-000000000006', 'Ceđeno', 6),
  ('22222222-2222-2222-2222-000000000007', 'Piva', 7),
  ('22222222-2222-2222-2222-000000000008', 'Vino', 8),
  ('22222222-2222-2222-2222-000000000009', 'Strano alkoholno', 9),
  ('22222222-2222-2222-2222-000000000010', 'Domaće alkoholno', 10)
on conflict (id) do nothing;

insert into public.products (category_id, name, price, sort_order)
select * from (values
  ('22222222-2222-2222-2222-000000000001'::uuid, 'Espresso', 150::numeric, 1),
  ('22222222-2222-2222-2222-000000000001'::uuid, 'Espresso sa mlekom', 170::numeric, 2),
  ('22222222-2222-2222-2222-000000000001'::uuid, 'Espresso sa šlagom', 180::numeric, 3),
  ('22222222-2222-2222-2222-000000000001'::uuid, 'Dupli espresso', 220::numeric, 4),
  ('22222222-2222-2222-2222-000000000001'::uuid, 'Dupli espresso sa mlekom', 230::numeric, 5),
  ('22222222-2222-2222-2222-000000000001'::uuid, 'Cappuccino', 190::numeric, 6),
  ('22222222-2222-2222-2222-000000000001'::uuid, 'Latte macchiato', 220::numeric, 7),
  ('22222222-2222-2222-2222-000000000001'::uuid, 'Domaća kafa', 120::numeric, 8),
  ('22222222-2222-2222-2222-000000000001'::uuid, 'Domaća kafa sa mlekom', 140::numeric, 9),
  ('22222222-2222-2222-2222-000000000001'::uuid, 'Nescafe', 180::numeric, 10),
  ('22222222-2222-2222-2222-000000000001'::uuid, 'Čaj', 200::numeric, 11),
  ('22222222-2222-2222-2222-000000000001'::uuid, 'Topla čokolada crna / bela', 260::numeric, 12),
  ('22222222-2222-2222-2222-000000000001'::uuid, 'Topla čokolada sa plazmom crna / bela', 280::numeric, 13),
  ('22222222-2222-2222-2222-000000000002'::uuid, 'Coca Cola 0,25l', 250::numeric, 1),
  ('22222222-2222-2222-2222-000000000002'::uuid, 'Fanta 0,25l', 250::numeric, 2),
  ('22222222-2222-2222-2222-000000000002'::uuid, 'Sprite 0,25l', 250::numeric, 3),
  ('22222222-2222-2222-2222-000000000002'::uuid, 'Schweppes 0,25l bitter lemon / tonic water', 250::numeric, 4),
  ('22222222-2222-2222-2222-000000000002'::uuid, 'Cockta 0,25l', 250::numeric, 5),
  ('22222222-2222-2222-2222-000000000002'::uuid, 'Cockta Blondie', 250::numeric, 6),
  ('22222222-2222-2222-2222-000000000002'::uuid, 'Cedevita 0,20l narandža / limun / limeta / zova i limun / grejp / ananas-mango', 200::numeric, 7),
  ('22222222-2222-2222-2222-000000000002'::uuid, 'Nektar sokovi 0,20l jabuka / breskva / jagoda / borovnica / narandža', 250::numeric, 8),
  ('22222222-2222-2222-2222-000000000003'::uuid, 'Guarana 0,25l', 240::numeric, 1),
  ('22222222-2222-2222-2222-000000000003'::uuid, 'Red Bull 0,25l', 380::numeric, 2),
  ('22222222-2222-2222-2222-000000000004'::uuid, 'Plazma šejk 0,30l', 330::numeric, 1),
  ('22222222-2222-2222-2222-000000000004'::uuid, 'Plazma obrok 0,30l', 360::numeric, 2),
  ('22222222-2222-2222-2222-000000000005'::uuid, 'Aqua Viva negazirana', 160::numeric, 1),
  ('22222222-2222-2222-2222-000000000005'::uuid, 'Knjaz Miloš gazirana', 170::numeric, 2),
  ('22222222-2222-2222-2222-000000000006'::uuid, 'Limunada 0,30l', 250::numeric, 1),
  ('22222222-2222-2222-2222-000000000006'::uuid, 'Ceđena narandža 0,30l', 350::numeric, 2),
  ('22222222-2222-2222-2222-000000000006'::uuid, 'Ceđena narandža & limun mix 0,30l', 380::numeric, 3),
  ('22222222-2222-2222-2222-000000000007'::uuid, 'San Miguel 0,25l', 400::numeric, 1),
  ('22222222-2222-2222-2222-000000000007'::uuid, 'Carlsberg 0,25l', 290::numeric, 2),
  ('22222222-2222-2222-2222-000000000007'::uuid, 'Lav Premium 0,33l', 260::numeric, 3),
  ('22222222-2222-2222-2222-000000000007'::uuid, 'Tuborg 0,33l', 280::numeric, 4),
  ('22222222-2222-2222-2222-000000000007'::uuid, 'Tuborg točeno 0,33l', 270::numeric, 5),
  ('22222222-2222-2222-2222-000000000007'::uuid, 'Tuborg točeno 0,5l', 350::numeric, 6),
  ('22222222-2222-2222-2222-000000000007'::uuid, 'Budweiser 0,33l', 300::numeric, 7),
  ('22222222-2222-2222-2222-000000000007'::uuid, 'Kronenbourg 0,33l', 300::numeric, 8),
  ('22222222-2222-2222-2222-000000000008'::uuid, 'Rubin Chardonnay 0,187l', 320::numeric, 1),
  ('22222222-2222-2222-2222-000000000008'::uuid, 'Rubin Medveđa krv 0,187l', 320::numeric, 2),
  ('22222222-2222-2222-2222-000000000008'::uuid, 'Somersby 0,33l jagoda 0% / borovnica / kruška / mango / jabuka', 350::numeric, 3),
  ('22222222-2222-2222-2222-000000000009'::uuid, 'Ballantines Finest 0,03l', 250::numeric, 1),
  ('22222222-2222-2222-2222-000000000009'::uuid, 'Johnnie Walker 0,03l', 280::numeric, 2),
  ('22222222-2222-2222-2222-000000000009'::uuid, 'Jack Daniels 0,03l', 350::numeric, 3),
  ('22222222-2222-2222-2222-000000000009'::uuid, 'Baileys 0,03l', 250::numeric, 4),
  ('22222222-2222-2222-2222-000000000009'::uuid, 'Campari 0,03l', 200::numeric, 5),
  ('22222222-2222-2222-2222-000000000009'::uuid, 'Jägermeister 0,03l', 270::numeric, 6),
  ('22222222-2222-2222-2222-000000000009'::uuid, 'Martini 0,05l', 250::numeric, 7),
  ('22222222-2222-2222-2222-000000000009'::uuid, 'Beefeater džin 0,03l', 280::numeric, 8),
  ('22222222-2222-2222-2222-000000000009'::uuid, 'Olmeca Tequila 0,03l', 260::numeric, 9),
  ('22222222-2222-2222-2222-000000000009'::uuid, 'Jameson 0,03l', 300::numeric, 10),
  ('22222222-2222-2222-2222-000000000010'::uuid, 'Viljamovka Takovo 0,03l', 250::numeric, 1),
  ('22222222-2222-2222-2222-000000000010'::uuid, 'Trivunova dunja 0,03l', 260::numeric, 2),
  ('22222222-2222-2222-2222-000000000010'::uuid, 'Trivunova kajsija 0,03l', 260::numeric, 3),
  ('22222222-2222-2222-2222-000000000010'::uuid, 'Trivunova šljiva 0,03l', 260::numeric, 4),
  ('22222222-2222-2222-2222-000000000010'::uuid, 'Vinjak 0,03l', 200::numeric, 5),
  ('22222222-2222-2222-2222-000000000010'::uuid, 'Stomaklija 0,03l', 150::numeric, 6),
  ('22222222-2222-2222-2222-000000000010'::uuid, 'Gorki list 0,03l', 230::numeric, 7),
  ('22222222-2222-2222-2222-000000000010'::uuid, 'Meduška 0,03l', 220::numeric, 8),
  ('22222222-2222-2222-2222-000000000010'::uuid, 'Dunja Milinčić 0,03l', 250::numeric, 9),
  ('22222222-2222-2222-2222-000000000010'::uuid, 'Loza 13. Jul 0,03l', 220::numeric, 10),
  ('22222222-2222-2222-2222-000000000010'::uuid, 'Smirnoff Vodka 0,03l', 250::numeric, 11)
) as v(category_id, name, price, sort_order)
where not exists (select 1 from public.products limit 1);

