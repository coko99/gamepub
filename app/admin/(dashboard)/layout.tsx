import Link from "next/link";
import { PoweredByBadge } from "@/components/layout/PoweredByBadge";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireStaff, logoutAdmin } from "../actions";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await requireStaff();
  const isAdmin = role === "admin";

  return (
    <>
      <header className="sticky top-0 z-[10001] border-b border-gold/20 bg-black/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="relative z-10 flex flex-wrap items-center gap-4 sm:gap-6">
            <Link
              href={isAdmin ? "/admin/stolovi" : "/admin/porudzbine"}
              className="relative z-10 font-serif text-xl tracking-wide text-gold"
            >
              GAMEPUB {isAdmin ? "Admin" : "Konobar"}
            </Link>
            <AdminNav role={role} />
          </div>
          <div className="relative z-10 flex items-center gap-3">
            <span className="hidden text-xs text-soft-white/40 sm:inline">
              {isAdmin ? "Admin — stolovi, meni, QR" : "Konobar — samo porudžbine"}
            </span>
            <form action={logoutAdmin}>
              <button
                type="submit"
                className="rounded-lg border border-gold/30 px-3 py-1.5 text-sm text-gold/90 transition hover:bg-gold/10"
              >
                Odjava
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-6 pb-24">{children}</div>
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-gold/10 bg-black/90 backdrop-blur-md">
        <PoweredByBadge className="border-0 bg-transparent" />
      </div>
    </>
  );
}
