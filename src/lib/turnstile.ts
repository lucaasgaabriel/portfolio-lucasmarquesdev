const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// Public by design — Cloudflare's own docs put this directly in client HTML.
export const TURNSTILE_SITE_KEY = "0x4AAAAAAEYKYUgEJ5AgJfSc";

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
