const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 80;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 2000;

export type ContactFieldErrors = Partial<
  Record<"name" | "email" | "message", string>
>;

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
  website?: string;
};

export type ContactValidationResult =
  | { ok: true; data: Omit<ContactPayload, "website"> }
  | { ok: false; errors: ContactFieldErrors };

function sanitize(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function validateContactPayload(
  payload: ContactPayload,
): ContactValidationResult {
  if (payload.website?.trim()) {
    return { ok: false, errors: {} };
  }

  const errors: ContactFieldErrors = {};
  const name = sanitize(payload.name);
  const email = sanitize(payload.email).toLowerCase();
  const message = sanitize(payload.message);

  if (!name || name.length < 2) {
    errors.name = "Informe seu nome.";
  } else if (name.length > MAX_NAME) {
    errors.name = `Máximo de ${MAX_NAME} caracteres.`;
  }

  if (!email || !EMAIL_PATTERN.test(email)) {
    errors.email = "Informe um e-mail válido.";
  } else if (email.length > MAX_EMAIL) {
    errors.email = "E-mail muito longo.";
  }

  if (!message || message.length < 20) {
    errors.message = "Mensagem deve ter ao menos 20 caracteres.";
  } else if (message.length > MAX_MESSAGE) {
    errors.message = `Máximo de ${MAX_MESSAGE} caracteres.`;
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, data: { name, email, message } };
}
