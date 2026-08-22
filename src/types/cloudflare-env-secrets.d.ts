// Secrets set via `wrangler secret put` don't appear in wrangler.jsonc, so
// `pnpm cf-typegen` never generates their types. This merges them into the
// same global CloudflareEnv interface that the generated file declares.
declare global {
  interface CloudflareEnv {
    RESEND_API_KEY: string;
    TURNSTILE_SECRET_KEY: string;
  }
}

export {};
