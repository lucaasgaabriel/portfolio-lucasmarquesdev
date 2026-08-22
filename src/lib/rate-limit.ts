const RATE_LIMIT_WINDOW_SECONDS = 60 * 60;
const RATE_LIMIT_MAX_PER_WINDOW = 5;
const DEDUPE_WINDOW_SECONDS = 5 * 60;

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Best-effort protection against a spam burst blowing through the email
// provider's free tier. KV is eventually consistent, so this is not a hard
// cap under concurrent requests from the same IP — a Durable Object would be
// exact, but that's more infrastructure than a personal contact form needs.
export async function checkRateLimit(kv: KVNamespace, ip: string): Promise<boolean> {
  const rateKey = `rate:${ip}`;
  const count = Number((await kv.get(rateKey)) ?? "0");

  if (count >= RATE_LIMIT_MAX_PER_WINDOW) return false;

  await kv.put(rateKey, String(count + 1), {
    expirationTtl: RATE_LIMIT_WINDOW_SECONDS,
  });

  return true;
}

export function fingerprintSubmission(ip: string, email: string, message: string): Promise<string> {
  return sha256Hex(`${ip}:${email}:${message}`);
}

export async function wasAlreadySent(kv: KVNamespace, fingerprint: string): Promise<boolean> {
  return (await kv.get(`sent:${fingerprint}`)) !== null;
}

// Only call this once the email has actually been sent — marking it earlier
// means a failed send poisons the dedupe cache, and a legitimate retry
// within the window would be told "success" without ever sending anything.
export async function markSent(kv: KVNamespace, fingerprint: string): Promise<void> {
  await kv.put(`sent:${fingerprint}`, "1", { expirationTtl: DEDUPE_WINDOW_SECONDS });
}
