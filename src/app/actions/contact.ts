"use server";

import { validateContactPayload } from "@/lib/contact-schema";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>;
};

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const result = validateContactPayload({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
    website: String(formData.get("website") ?? ""),
  });

  if (!result.ok) {
    if (Object.keys(result.errors).length === 0) {
      return { status: "success" };
    }

    return {
      status: "error",
      message: "Revise os campos destacados.",
      fieldErrors: result.errors,
    };
  }

  // YAGNI: sem serviço de e-mail configurado — validação server-side + resposta segura.
  // Integre Resend, SES ou similar quando necessário.
  console.info("[contact]", {
    at: new Date().toISOString(),
    from: result.data.email,
    name: result.data.name,
    length: result.data.message.length,
  });

  return {
    status: "success",
    message: "Mensagem recebida. Retorno em breve pelo e-mail informado.",
  };
}
