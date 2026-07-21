import { loginWithPin } from "../actions";

export const metadata = {
  title: "Prijava osoblja",
};

type Props = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const next = params.next ?? "";
  const hasError = params.error === "1";

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gold/25 bg-forest-deep/80 p-8 shadow-xl">
        <p className="text-xs uppercase tracking-[0.2em] text-gold/70">GAMEPUB</p>
        <h1 className="mt-2 font-serif text-3xl text-soft-white">Prijava osoblja</h1>

        <div className="mt-4 space-y-2 rounded-xl border border-gold/15 bg-black/30 p-3 text-xs text-soft-white/65">
          <p>
            <span className="font-medium text-gold">Admin PIN</span> — Stolovi &amp; QR, meni,
            porudžbine
          </p>
          <p>
            <span className="font-medium text-gold">Konobar PIN</span> — samo porudžbine (nema
            pristup stolovima)
          </p>
        </div>

        <form action={loginWithPin} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={next} />
          <label className="block">
            <span className="mb-1.5 block text-sm text-soft-white/70">PIN</span>
            <input
              type="password"
              name="pin"
              inputMode="numeric"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-gold/25 bg-black/50 px-4 py-3 text-lg tracking-widest text-soft-white outline-none ring-gold/40 focus:ring-2"
              placeholder="••••"
            />
          </label>
          {hasError ? (
            <p className="text-sm text-red-400">
              Pogrešan PIN. Koristi <code className="text-gold/80">ADMIN_PIN</code> ili{" "}
              <code className="text-gold/80">WAITER_PIN</code> iz{" "}
              <code className="text-gold/80">.env.local</code>.
            </p>
          ) : null}
          <button
            type="submit"
            className="w-full rounded-xl bg-gold px-4 py-3 font-medium text-black transition hover:bg-gold-light"
          >
            Prijavi se
          </button>
        </form>
      </div>
    </div>
  );
}
