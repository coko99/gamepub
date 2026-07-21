"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { StaffRole } from "@/lib/types/menu";

type Props = {
  role: StaffRole;
};

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`relative z-10 rounded-lg px-3 py-2 transition ${
        active
          ? "bg-gold/15 font-medium text-gold"
          : "text-soft-white/80 hover:bg-gold/10 hover:text-gold"
      }`}
    >
      {children}
    </Link>
  );
}

export function AdminNav({ role }: Props) {
  const isAdmin = role === "admin";

  return (
    <nav className="relative z-10 flex flex-wrap gap-1 text-sm">
      {isAdmin ? (
        <>
          <NavLink href="/admin/stolovi">Stolovi &amp; QR</NavLink>
          <NavLink href="/admin/meni">Meni</NavLink>
          <NavLink href="/admin/porudzbine">Pregled porudžbina</NavLink>
          <NavLink href="/admin/statistika">Statistika</NavLink>
        </>
      ) : (
        <NavLink href="/admin/porudzbine">Porudžbine</NavLink>
      )}
    </nav>
  );
}
