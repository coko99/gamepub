import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const menuPath = path.join(__dirname, "../content/menu.ts");
const src = fs.readFileSync(menuPath, "utf8");
const match = src.match(/export const menuCategories[\s\S]*?=\s*(\[[\s\S]*?\n\]);/);
if (!match) throw new Error("menuCategories not found");

const categories = eval(match[1]);

let catSql = "-- Kategorije (Gamepub cenovnik)\ninsert into public.categories (id, name, sort_order) values\n";
const catRows = categories.map((c, i) => {
  const id = `22222222-2222-2222-2222-${String(i + 1).padStart(12, "0")}`;
  const name = c.title.replace(/'/g, "''");
  return `  ('${id}', '${name}', ${i + 1})`;
});
catSql += `${catRows.join(",\n")}\non conflict (id) do nothing;\n\n`;

const prodRows = [];
categories.forEach((c, ci) => {
  const catId = `22222222-2222-2222-2222-${String(ci + 1).padStart(12, "0")}`;
  c.items.forEach((item, ii) => {
    const name = item.name.replace(/'/g, "''");
    prodRows.push(`  ('${catId}'::uuid, '${name}', ${item.price}::numeric, ${ii + 1})`);
  });
});

const prodSql = `insert into public.products (category_id, name, price, sort_order)
select * from (values
${prodRows.join(",\n")}
) as v(category_id, name, price, sort_order)
where not exists (select 1 from public.products limit 1);

`;

const tablesSql = `-- Stolovi po zonama (primer)
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

`;

const out = `-- Gamepub seed — pokreni posle schema.sql + migracija\n\n${tablesSql}${catSql}${prodSql}`;
fs.writeFileSync(path.join(__dirname, "../supabase/seed.sql"), out);
console.log(`seed.sql written (${prodRows.length} products)`);
