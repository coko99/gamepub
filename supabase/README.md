# Supabase — Gamepub digitalni meni

## 1. Kreiraj Supabase projekat

Na [supabase.com](https://supabase.com) napravi novi projekat za Gamepub.

## 2. Env varijable

Kopiraj `.env.example` u `.env.local` i popuni vrednosti iz Supabase → Settings → API.

## 3. SQL migracije (redosled)

U **SQL Editor** pokreni fajlove iz `supabase/`:

1. `schema.sql` — tabele, zone, RLS
2. `migration_featured.sql` — istaknuti proizvodi (ako nisu u schema)
3. `migration_table_calls.sql` — poziv konobara / račun
4. `lock_table_tokens.sql` — QR token se ne menja posle štampe
5. `seed.sql` — stolovi + meni iz Gamepub cenovnika

Za postojeću bazu sa starim enum zonama: pokreni `migration_dynamic_zones.sql` (jednom).
Za statistiku i zatvaranje smene: pokreni `migration_order_stats.sql` (jednom).
Za postojeću bazu: pokreni i `migration_security.sql` ako postoji stari setup.

## 4. Regeneriši meni seed

Posle izmene `content/menu.ts`:

```bash
node scripts/generate-seed.mjs
```

Zatim ponovo pokreni `seed.sql` (samo ako baza nema proizvode).

## 5. Rute

| Ruta | Ko |
|------|-----|
| `/meni?t=TOKEN` | Gost (QR sken) |
| `/admin/login` | Osoblje (PIN) |
| `/admin/stolovi` | Admin — zone, stolovi i QR |
| `/admin/meni` | Admin — meni CRUD |
| `/admin/porudzbine` | Admin/konobar — live porudžbine |
| `/admin/statistika` | Admin — statistika i zatvaranje smene |

## 6. QR kod

Svaki sto ima URL:

```
https://tvoj-domen.rs/meni?t={TOKEN}
```

Token se generiše u admin panelu. Štampaj QR iz **Stolovi & QR** sekcije.
