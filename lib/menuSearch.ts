const SERBIAN_MAP: Record<string, string> = {
  ć: "c",
  č: "c",
  š: "s",
  ž: "z",
  đ: "d",
  Ć: "c",
  Č: "c",
  Š: "s",
  Ž: "z",
  Đ: "d",
};

export function normalizeMenuSearch(value: string) {
  return value
    .trim()
    .toLowerCase()
    .split("")
    .map((char) => SERBIAN_MAP[char] ?? char)
    .join("")
    .replace(/\s+/g, " ");
}

export function menuItemMatchesQuery(
  itemName: string,
  categoryTitle: string,
  query: string,
) {
  const normalized = normalizeMenuSearch(query);
  if (!normalized) return true;

  const haystack = normalizeMenuSearch(`${itemName} ${categoryTitle}`);
  const tokens = normalized.split(" ").filter(Boolean);

  return tokens.every((token) => haystack.includes(token));
}

export function highlightMatch(text: string, query: string) {
  const normalizedQuery = normalizeMenuSearch(query);
  if (!normalizedQuery) return [{ text, match: false }];

  const tokens = normalizedQuery.split(" ").filter(Boolean);
  let parts: { text: string; match: boolean }[] = [{ text, match: false }];

  for (const token of tokens) {
    const next: { text: string; match: boolean }[] = [];

    for (const part of parts) {
      if (part.match) {
        next.push(part);
        continue;
      }

      const lower = normalizeMenuSearch(part.text);
      const index = lower.indexOf(token);

      if (index === -1) {
        next.push(part);
        continue;
      }

      if (index > 0) {
        next.push({ text: part.text.slice(0, index), match: false });
      }

      next.push({
        text: part.text.slice(index, index + token.length),
        match: true,
      });

      const rest = part.text.slice(index + token.length);
      if (rest) next.push({ text: rest, match: false });
    }

    parts = next;
  }

  return parts.filter((part) => part.text.length > 0);
}
