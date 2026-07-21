/** Kalendarski dan u Europe/Belgrade (YYYY-MM-DD) */
export function belgradeStatDate(iso: string | Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Belgrade",
  }).format(typeof iso === "string" ? new Date(iso) : iso);
}

export function formatStatDateLabel(statDate: string): string {
  const [y, m, d] = statDate.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("sr-RS", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
