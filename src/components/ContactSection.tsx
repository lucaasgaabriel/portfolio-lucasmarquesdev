"use client";

import Script from "next/script";
import { useActionState } from "react";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { CodeWindow } from "@/components/CodeWindow";
import { useLanguage } from "@/lib/language-context";
import { TURNSTILE_SITE_KEY } from "@/lib/turnstile";

const initialState: ContactState = { status: "idle" };

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1 text-xs text-error">
      {message}
    </p>
  );
}

export function ContactSection() {
  const { t, lang } = useLanguage();
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialState,
  );

  return (
    <section id="contato" className="bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 className="font-display text-3xl font-medium text-foreground sm:text-4xl">
              {t.ui.contactHeading}
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              {t.ui.contactSubtitle}
            </p>

            <a
              href={t.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-10 flex items-center justify-between rounded-md border border-border px-4 py-3 text-sm transition-colors hover:border-accent"
            >
              <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                LinkedIn
              </span>
              <span className="text-foreground group-hover:text-accent">
                {t.linkedinHandle}
              </span>
            </a>
          </div>

          <CodeWindow title="contact.ts">
            <Script
              src="https://challenges.cloudflare.com/turnstile/v0/api.js"
              strategy="afterInteractive"
              async
              defer
            />
            <form action={formAction} noValidate className="space-y-5">
              <input type="hidden" name="lang" value={lang} />

              <div className="sr-only" aria-hidden>
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block font-mono text-xs uppercase tracking-wider text-muted"
                >
                  {t.ui.formName}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  maxLength={80}
                  placeholder={t.ui.formNamePlaceholder}
                  className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors focus:border-accent"
                />
                <FieldError message={state.fieldErrors?.name} />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block font-mono text-xs uppercase tracking-wider text-muted"
                >
                  {t.ui.formEmail}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  maxLength={254}
                  placeholder={t.ui.formEmailPlaceholder}
                  className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors focus:border-accent"
                />
                <FieldError message={state.fieldErrors?.email} />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block font-mono text-xs uppercase tracking-wider text-muted"
                >
                  {t.ui.formMessage}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  maxLength={2000}
                  placeholder={t.ui.formMessagePlaceholder}
                  className="mt-2 w-full resize-y border-b border-border bg-transparent py-2 text-sm leading-relaxed text-foreground outline-none transition-colors focus:border-accent"
                />
                <FieldError message={state.fieldErrors?.message} />
              </div>

              <div
                className="cf-turnstile"
                data-sitekey={TURNSTILE_SITE_KEY}
                data-language={lang === "pt" ? "pt-br" : "en"}
              />

              {state.status === "success" && state.message && (
                <p role="status" className="text-sm text-accent">
                  {state.message}
                </p>
              )}

              {state.status === "error" && state.message && (
                <p role="alert" className="text-sm text-error">
                  {state.message}
                </p>
              )}

              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-sm bg-accent px-4 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {pending ? t.ui.formSubmitting : t.ui.formSubmit}
              </button>
            </form>
          </CodeWindow>
        </div>
      </div>
    </section>
  );
}
