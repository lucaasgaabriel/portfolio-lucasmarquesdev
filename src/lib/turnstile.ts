const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// Public by design — Cloudflare's own docs put this directly in client HTML.
// Replace with the real site key after creating a Turnstile widget in the
// Cloudflare dashboard (Turnstile → Add site).
export const TURNSTILE_SITE_KEY = "1x00000000000000000000AA";

export async function verifyTurnstile(
  token: string,
  secretKey: string,
  ip: string,
): Promise<boolean> {
  if (!token || !secretKey) return false;

  const body = new URLSearchParams({ secret: secretKey, response: token });
  if (ip !== "unknown") body.set("remoteip", ip);

  const res = await fetch(VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) return false;

  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}
