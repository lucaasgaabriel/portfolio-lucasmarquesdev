// WHATWG HTML spec's email regex (same one browsers use for <input type="email">).
const EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
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
  lang?: "pt" | "en";
};

export type ContactValidationResult =
  | { ok: true; data: Omit<ContactPayload, "website" | "lang"> }
  | { ok: false; errors: ContactFieldErrors };

const messages = {
  pt: {
    name: "Informe seu nome.",
    nameMax: (max: number) => `Máximo de ${max} caracteres.`,
    email: "Informe um e-mail válido.",
    emailMax: "E-mail muito longo.",
    message: "Mensagem deve ter ao menos 20 caracteres.",
    messageMax: (max: number) => `Máximo de ${max} caracteres.`,
  },
  en: {
    name: "Please enter your name.",
    nameMax: (max: number) => `Maximum of ${max} characters.`,
    email: "Please enter a valid email.",
    emailMax: "Email is too long.",
    message: "Message must be at least 20 characters long.",
    messageMax: (max: number) => `Maximum of ${max} characters.`,
  },
} as const;

function sanitize(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function validateContactPayload(
  payload: ContactPayload,
): ContactValidationResult {
  if (payload.website?.trim()) {
    return { ok: false, errors: {} };
  }

  const m = messages[payload.lang === "en" ? "en" : "pt"];
  const errors: ContactFieldErrors = {};
  const name = sanitize(payload.name);
  const email = sanitize(payload.email).toLowerCase();
  const message = sanitize(payload.message);

  if (!name || name.length < 2) {
    errors.name = m.name;
  } else if (name.length > MAX_NAME) {
    errors.name = m.nameMax(MAX_NAME);
  }

  if (!email || !EMAIL_PATTERN.test(email)) {
    errors.email = m.email;
  } else if (email.length > MAX_EMAIL) {
    errors.email = m.emailMax;
  }

  if (!message || message.length < 20) {
    errors.message = m.message;
  } else if (message.length > MAX_MESSAGE) {
    errors.message = m.messageMax(MAX_MESSAGE);
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, data: { name, email, message } };
}
