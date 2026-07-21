"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { createTableCall } from "@/app/meni/actions";
import { PoweredByBadge } from "@/components/layout/PoweredByBadge";
import { siteConfig } from "@/content/site";
import { tableLabel, type TableRow } from "@/lib/types/menu";

type Props = {
  table: TableRow;
  onOrderMore: () => void;
};

export function PostOrderHub({ table, onOrderMore }: Props) {
  const [pending, startTransition] = useTransition();

  function call(type: "waiter" | "bill") {
    startTransition(async () => {
      const result = await createTableCall({
        tableToken: table.token,
        callType: type,
      });
      if (!result.ok) {
        window.alert(result.error);
        return;
      }
      window.alert(
        type === "bill" ? "Zahtev za račun poslat konobaru!" : "Konobar je pozvan!",
      );
    });
  }

  return (
    <div className="flex min-h-dvh flex-col bg-black">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-5 pb-4 pt-10 lg:max-w-2xl lg:px-8 lg:pt-16">
        <div className="mb-8 text-center lg:mb-12">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/20 text-2xl text-gold lg:h-20 lg:w-20 lg:text-3xl">
            ✓
          </div>
          <h1 className="font-serif text-3xl text-soft-white lg:text-5xl">Porudžbina poslata</h1>
          <p className="mt-2 text-sm text-soft-white/60 lg:mt-4 lg:text-lg">
            {tableLabel(table.zone_name, table.number)}
          </p>
        </div>

        <div className="mx-auto grid w-full max-w-xl grid-cols-2 gap-3 lg:gap-5">
          <button
            type="button"
            disabled={pending}
            onClick={() => call("waiter")}
            className="flex flex-col items-center gap-2 rounded-2xl border border-emerald-500/25 bg-[#13261c] px-3 py-5 transition active:scale-[0.98] disabled:opacity-50 lg:gap-4 lg:px-6 lg:py-8"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-2xl lg:h-16 lg:w-16 lg:text-3xl">
              🔔
            </span>
            <span className="text-sm font-semibold text-soft-white lg:text-lg">
              Pozovi konobara
            </span>
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => call("bill")}
            className="flex flex-col items-center gap-2 rounded-2xl border border-gold/30 bg-gold/10 px-3 py-5 transition active:scale-[0.98] disabled:opacity-50 lg:gap-4 lg:px-6 lg:py-8"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 text-2xl lg:h-16 lg:w-16 lg:text-3xl">
              🧾
            </span>
            <span className="text-sm font-semibold text-gold lg:text-lg">Zatraži račun</span>
          </button>
        </div>

        <div className="mx-auto mt-4 flex w-full max-w-xl flex-1 flex-col gap-3 lg:mt-8 lg:gap-4">
          <button
            type="button"
            disabled={pending}
            onClick={onOrderMore}
            className="rounded-2xl border border-gold/25 bg-forest-deep/50 px-5 py-4 text-center text-sm font-semibold text-soft-white transition active:scale-[0.98] disabled:opacity-50 lg:py-5 lg:text-base"
          >
            Naruči još nešto
          </button>
          <a
            href={siteConfig.googleReview}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-center text-sm text-soft-white/80 transition active:scale-[0.98] lg:py-4 lg:text-base"
          >
            Oceni nas na Google
          </a>
          <Link
            href="/"
            target="_blank"
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-center text-sm text-soft-white/80 transition active:scale-[0.98] lg:py-4 lg:text-base"
          >
            Poseti naš sajt
          </Link>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 pb-2 lg:mt-12">
          <Image
            src="/images/cokoladni-aj-ti-logo.png"
            alt="čokoladni aj ti"
            width={48}
            height={48}
            className="rounded-full opacity-90 lg:h-14 lg:w-14"
          />
          <PoweredByBadge className="w-full rounded-xl lg:max-w-xl" />
        </div>
      </div>
    </div>
  );
}
