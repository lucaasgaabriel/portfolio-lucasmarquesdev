"use server";

import { validateContactPayload } from "@/lib/contact-schema";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>;
};

const copy = {
  pt: {
    reviewFields: "Revise os campos destacados.",
    received: "Mensagem recebida. Retorno em breve pelo e-mail informado.",
  },
  en: {
    reviewFields: "Please review the highlighted fields.",
    received: "Message received. I'll get back to you at the email you provided.",
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

  console.info("[contact]", {
    at: new Date().toISOString(),
    from: result.data.email,
    name: result.data.name,
    length: result.data.message.length,
  });

  return {
    status: "success",
    message: c.received,
  };
}
