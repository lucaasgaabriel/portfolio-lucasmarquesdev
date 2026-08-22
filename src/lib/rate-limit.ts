const RATE_LIMIT_WINDOW_SECONDS = 60 * 60;
const RATE_LIMIT_MAX_PER_WINDOW = 5;
const DEDUPE_WINDOW_SECONDS = 5 * 60;

export type ContactGuardResult =
  | { allowed: true; duplicate: boolean }
  | { allowed: false; reason: "rate_limited" };

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Best-effort protection against a spam burst blowing through the email
// provider's free tier. KV is eventually consistent, so this is not a hard
// cap under concurrent requests from the same IP — a Durable Object would be
// exact, but that's more infrastructure than a personal contact form needs.
export async function guardContactSubmission(
  kv: KVNamespace,
  params: { ip: string; email: string; message: string },
): Promise<ContactGuardResult> {
  const rateKey = `rate:${params.ip}`;
  const count = Number((await kv.get(rateKey)) ?? "0");

  if (count >= RATE_LIMIT_MAX_PER_WINDOW) {
    return { allowed: false, reason: "rate_limited" };
  }

  await kv.put(rateKey, String(count + 1), {
    expirationTtl: RATE_LIMIT_WINDOW_SECONDS,
  });

  const fingerprint = await sha256Hex(`${params.ip}:${params.email}:${params.message}`);
  const dedupeKey = `sent:${fingerprint}`;
  const duplicate = (await kv.get(dedupeKey)) !== null;

  if (!duplicate) {
    await kv.put(dedupeKey, "1", { expirationTtl: DEDUPE_WINDOW_SECONDS });
  }

  return { allowed: true, duplicate };
}
