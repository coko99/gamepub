"use client";

type BarItem = {
  label: string;
  value: number;
  sublabel?: string;
};

const BAR_COLORS = [
  "from-gold to-amber-600",
  "from-emerald-500 to-teal-600",
  "from-sky-500 to-blue-600",
  "from-violet-500 to-purple-600",
  "from-rose-500 to-pink-600",
  "from-orange-500 to-red-500",
];

export function HorizontalBarChart({
  items,
  valueLabel,
  emptyText = "Nema podataka.",
}: {
  items: BarItem[];
  valueLabel?: (value: number) => string;
  emptyText?: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-soft-white/45">{emptyText}</p>;
  }

  const max = Math.max(...items.map((i) => i.value), 1);
  const format = valueLabel ?? ((v: number) => String(v));

  return (
    <ul className="space-y-3">
      {items.map((item, index) => {
        const pct = Math.max(4, Math.round((item.value / max) * 100));
        const color = BAR_COLORS[index % BAR_COLORS.length];
        return (
          <li key={item.label}>
            <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 truncate text-soft-white/85">{item.label}</span>
              <span className="shrink-0 font-medium text-gold">{format(item.value)}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-500`}
                style={{ width: `${pct}%` }}
              />
            </div>
            {item.sublabel ? (
              <p className="mt-0.5 text-[11px] text-soft-white/40">{item.sublabel}</p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export function DailyTrendChart({
  points,
  emptyText = "Nema podataka za trend.",
}: {
  points: { date: string; label: string; orders: number; revenue: number }[];
  emptyText?: string;
}) {
  if (points.length === 0) {
    return <p className="text-sm text-soft-white/45">{emptyText}</p>;
  }

  const maxOrders = Math.max(...points.map((p) => p.orders), 1);
  const chartH = 120;

  return (
    <div>
      <div className="flex items-end justify-between gap-2" style={{ height: chartH }}>
        {points.map((point) => {
          const h = Math.max(6, Math.round((point.orders / maxOrders) * (chartH - 20)));
          return (
            <div key={point.date} className="flex min-w-0 flex-1 flex-col items-center gap-1">
              <span className="text-[10px] font-medium text-gold">{point.orders}</span>
              <div
                className="w-full max-w-10 rounded-t-md bg-gradient-to-t from-gold/80 to-amber-400/90 transition-all duration-500"
                style={{ height: h }}
                title={`${point.label}: ${point.orders} porudžbina`}
              />
              <span className="max-w-full truncate text-[9px] text-soft-white/45">
                {point.label.split(" ")[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DonutZoneChart({
  items,
  emptyText = "Nema podataka.",
}: {
  items: { label: string; value: number }[];
  emptyText?: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-soft-white/45">{emptyText}</p>;
  }

  const total = items.reduce((s, i) => s + i.value, 0) || 1;
  const colors = ["#d4af37", "#34d399", "#38bdf8", "#a78bfa", "#fb7185", "#fb923c"];
  let offset = 0;
  const segments = items.map((item, i) => {
    const pct = (item.value / total) * 100;
    const seg = { ...item, pct, color: colors[i % colors.length], offset };
    offset += pct;
    return seg;
  });

  const gradient = segments
    .map((s) => `${s.color} ${s.offset}% ${s.offset + s.pct}%`)
    .join(", ");

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
      <div
        className="relative h-36 w-36 shrink-0 rounded-full"
        style={{
          background: `conic-gradient(${gradient})`,
        }}
      >
        <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-[#0c1410] text-center">
          <span className="text-2xl font-serif text-gold">{total}</span>
          <span className="text-[10px] uppercase tracking-wider text-soft-white/45">porudžbina</span>
        </div>
      </div>
      <ul className="min-w-0 flex-1 space-y-2">
        {segments.map((seg) => (
          <li key={seg.label} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: seg.color }}
            />
            <span className="min-w-0 flex-1 truncate text-soft-white/80">{seg.label}</span>
            <span className="text-soft-white/50">
              {seg.value} ({Math.round(seg.pct)}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
