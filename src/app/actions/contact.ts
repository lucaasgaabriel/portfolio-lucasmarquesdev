"use server";

import { headers } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { validateContactPayload } from "@/lib/contact-schema";
import { verifyTurnstile } from "@/lib/turnstile";
import { checkRateLimit, fingerprintSubmission, markSent, wasAlreadySent } from "@/lib/rate-limit";
import { sendContactEmail } from "@/lib/email";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>;
};

const copy = {
  pt: {
    reviewFields: "Revise os campos destacados.",
    received: "Mensagem recebida. Retorno em breve pelo e-mail informado.",
    captcha: "Não foi possível confirmar que você não é um robô. Tente novamente.",
    rateLimited: "Muitas tentativas em pouco tempo. Tente novamente mais tarde.",
    sendFailed: "Não consegui enviar sua mensagem agora. Tente novamente em instantes.",
  },
  en: {
    reviewFields: "Please review the highlighted fields.",
    received: "Message received. I'll get back to you at the email you provided.",
    captcha: "Couldn't confirm you're not a robot. Please try again.",
    rateLimited: "Too many attempts in a short time. Please try again later.",
    sendFailed: "Couldn't send your message right now. Please try again shortly.",
  },
} as const;

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const lang = formData.get("lang") === "en" ? "en" : "pt";
  const c = copy[lang];

  const result = validateContactPayload({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
    website: String(formData.get("website") ?? ""),
    lang,
  });

  if (!result.ok) {
    if (Object.keys(result.errors).length === 0) {
      return { status: "success" };
    }

    return {
      status: "error",
      message: c.reviewFields,
      fieldErrors: result.errors,
    };
  }

  const requestHeaders = await headers();
  // cf-connecting-ip is set by Cloudflare's edge and can't be spoofed by the
  // client; unlike x-forwarded-for, it isn't a header the caller controls,
  // so there's no fallback to it here.
  const ip = requestHeaders.get("cf-connecting-ip") ?? "unknown";

  const { env } = await getCloudflareContext();

  const turnstileToken = String(formData.get("cf-turnstile-response") ?? "");
  const captchaOk = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, ip);

  if (!captchaOk) {
    console.warn("[contact] captcha rejected", { ip });
    return { status: "error", message: c.captcha };
  }

  const rateOk = await checkRateLimit(env.CONTACT_KV, ip);

  if (!rateOk) {
    console.warn("[contact] rate limited", { ip });
    return { status: "error", message: c.rateLimited };
  }

  const fingerprint = await fingerprintSubmission(ip, result.data.email, result.data.message);
  const duplicate = await wasAlreadySent(env.CONTACT_KV, fingerprint);

  console.info("[contact]", {
    at: new Date().toISOString(),
    from: result.data.email,
    name: result.data.name,
    length: result.data.message.length,
    duplicate,
  });

  if (!duplicate) {
    const sent = await sendContactEmail({
      apiKey: env.RESEND_API_KEY,
      name: result.data.name,
      email: result.data.email,
      message: result.data.message,
    });

    if (!sent) {
      return { status: "error", message: c.sendFailed };
    }

    await markSent(env.CONTACT_KV, fingerprint);
  }

  return {
    status: "success",
    message: c.received,
  };
}
