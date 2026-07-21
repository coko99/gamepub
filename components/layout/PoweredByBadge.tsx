import Image from "next/image";
import { footerContent } from "@/content/site";
import { cn } from "@/lib/utils";

type PoweredByBadgeProps = {
  className?: string;
};

export function PoweredByBadge({ className }: PoweredByBadgeProps) {
  const { poweredBy } = footerContent;

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 border-t border-white/5 bg-[#050510]/95 px-4 py-3",
        className,
      )}
    >
      <span className="text-[11px] tracking-wide text-[#B8B8C8]/80 uppercase">
        {poweredBy.label}
      </span>
      <a
        href={poweredBy.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2"
      >
        <Image
          src={poweredBy.logo}
          alt={poweredBy.name}
          width={28}
          height={28}
          className="h-7 w-7 rounded-full object-cover transition-transform group-hover:scale-105"
        />
        <span className="font-heading text-sm font-semibold text-[#00E5FF] transition-colors group-hover:text-white">
          {poweredBy.name}
        </span>
      </a>
    </div>
  );
}
