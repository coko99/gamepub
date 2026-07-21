type Bucket = { timestamps: number[] };

const buckets = new Map<string, Bucket>();

/**
 * In-memory sliding window. On serverless this is per-isolate (not perfect),
 * but still slows bursts; combine with DB checks for guest spam.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0] ?? now;
    const retryAfterSec = Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000));
    buckets.set(key, bucket);
    return { ok: false, retryAfterSec };
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);

  // Soft bound on map size
  if (buckets.size > 5000) {
    const firstKey = buckets.keys().next().value;
    if (firstKey) buckets.delete(firstKey);
  }

  return { ok: true };
}
