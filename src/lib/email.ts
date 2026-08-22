const SEND_URL = "https://api.resend.com/emails";

// Fixed on purpose — this site has a single owner and a single inbox to
// notify, so a secret/env var for the destination would be indirection
// without a payoff.
//
// Must match the Resend account's own email while sending from the
// onboarding@resend.dev test domain — Resend only allows that domain to
// send to its account owner until a real domain is verified. Switch back to
// contato.lucasmarquesdev@gmail.com (or anything else) once lucasgms.dev is
// verified in the Resend dashboard.
const CONTACT_DESTINATION = "lucaas.gaabriel@live.com";

// Resend's shared test domain — works with zero DNS setup. Switch to
// something like "Portfolio <contato@lucasgms.dev>" once the domain is
// verified in the Resend dashboard.
const CONTACT_FROM = "Portfolio <onboarding@resend.dev>";

export async function sendContactEmail(params: {
  apiKey: string;
  name: string;
  email: string;
  message: string;
}): Promise<boolean> {
  if (!params.apiKey) return false;

  const res = await fetch(SEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: CONTACT_FROM,
      to: CONTACT_DESTINATION,
      reply_to: params.email,
      subject: `Novo contato de ${params.name}`,
      text: `${params.message}\n\n---\n${params.name} <${params.email}>`,
    }),
  });

  if (!res.ok) {
    console.error("[email] Resend rejected the send", {
      status: res.status,
      body: await res.text().catch(() => "<unreadable>"),
    });
  }

  return res.ok;
}
