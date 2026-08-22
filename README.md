# lucasgms.dev

[![CI/CD](https://github.com/lucaasgaabriel/portfolio-lucasmarquesdev/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/lucaasgaabriel/portfolio-lucasmarquesdev/actions/workflows/ci-cd.yml)

Landing page pessoal de Lucas Marques (DevSecOps / Engenharia de Software,
Dados & IA), publicada em [lucasgms.dev](https://lucasgms.dev). Uma única
rota, sem CMS, sem banco de dados: conteúdo bilíngue (PT/EN) em
`src/data/content.ts`, formulário de contato com honeypot + CAPTCHA + rate
limit + envio via Resend, deploy em Cloudflare Workers.

**Stack:** Next.js 16.3 (App Router) · React 19 · TypeScript · Tailwind CSS v4
· `@opennextjs/cloudflare`

## Estrutura

- `src/app` — layout raiz, página única, ícone/favicon gerado (`icon.tsx`) e
  a Server Action de contato (`actions/contact.ts`)
- `src/components` — seções da página e componentes de interação (nav, tema,
  idioma, formulário)
- `src/data/content.ts` — todo o conteúdo do site, em português e inglês
- `src/lib/language-context.tsx` — contexto de idioma (`LanguageProvider` +
  `useLanguage`)
- `src/lib/contact-schema.ts` — validação e sanitização do formulário
- `src/lib/turnstile.ts` — verificação server-side do CAPTCHA (Turnstile)
- `src/lib/rate-limit.ts` — rate limit por IP e deduplicação de submissões,
  via Cloudflare KV
- `src/lib/email.ts` — envio da notificação de contato via Resend
- `src/types/cloudflare-env-secrets.d.ts` — tipos dos secrets do Worker
  (`RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`) que não aparecem no
  `wrangler.jsonc` por serem configurados via `wrangler secret put`
- `wrangler.jsonc` / `open-next.config.ts` — build, bindings e deploy
- `public/_headers` — headers de segurança dos assets servidos direto pelo
  binding `ASSETS` do Cloudflare (ver "Arquitetura")
- `scripts/check-secrets.mjs` — scanner de segredos do pre-commit

## Arquitetura

- **Server Action, não API route** — o formulário é o único consumidor; uma
  rota `/api/contact` separada não teria benefício.
- **Server vs. Client Components** — o idioma é decidido no cliente (sem
  roteamento por locale), então todo componente que exibe texto do site
  (`Hero`, `StackSection`, `ProjectsSection`, `Footer`, `ContactSection`)
  precisa ser Client Component. `Header`, `CodeWindow` e `IconRain`
  continuam Server Component.
- **Cores como taxonomia** — as custom properties de cor em `globals.css`
  (`--accent-cloud`, `--accent-lang` etc.) identificam categorias inteiras,
  reaproveitadas entre `StackSection`, o painel `whoami --focus` do Hero e o
  `IconRain`. Categoria nova = três arquivos (variável de cor, ícone em
  `icons.tsx`, entrada em `CATEGORY_META`).
- **Tema e idioma via `data-theme`/`data-lang` + `localStorage`**, sem
  `next-themes` nem `next-intl`. Um script inline em `layout.tsx` aplica a
  preferência salva antes da hidratação. Limitação aceita: `<title>` e
  `og:*` ficam fixos em português, por serem resolvidos no servidor antes de
  qualquer preferência de cliente existir.
- **OpenNext, não `@cloudflare/next-on-pages`** — Server Actions não são bem
  suportadas pelo adapter mais antigo.
- **Headers duplicados em `next.config.ts` e `public/_headers`** — no
  Cloudflare, a página estática e `_next/static/*` são servidos direto pelo
  binding `ASSETS`, sem passar pelo Worker, então `headers()` do
  `next.config.ts` só vale em `next dev`/`next start`. `public/_headers` é a
  fonte real dos headers em produção.
- **Resend em vez de SMTP** — API HTTP, funciona direto no runtime de
  Workers (um `fetch`, sem socket TCP nem SDK Node-only).
- **Rate limit e deduplicação via KV, não Durable Object** — KV é
  eventualmente consistente, então não é um limite atômico sob concorrência
  real. Suficiente para um formulário de contato pessoal; um Durable Object
  seria mais infraestrutura do que o problema pede.
- **CI/CD em estágios, todos bloqueantes** — `quality`, `secrets-scan` e
  `codeql` rodam em todo push/PR; `dast` builda o Worker e escaneia o
  preview local (`wrangler dev`) com OWASP ZAP; `deploy` só dispara em push
  para `main`, depois que os quatro passam.

## Formulário de contato

Ordem em que uma submissão pode ser rejeitada:

1. **Honeypot** (`website`) — campo invisível fora da ordem de tab; se vier
   preenchido, sucesso falso pro bot, sem consumir as camadas abaixo.
2. **Validação de schema** (`contact-schema.ts`) — nome, e-mail, tamanho da
   mensagem, sanitização de espaços.
3. **CAPTCHA** (`turnstile.ts`) — token do Turnstile verificado no servidor
   contra a API da Cloudflare antes de qualquer envio.
4. **Rate limit por IP** (`rate-limit.ts`) — máximo de 5 submissões por hora,
   contado em KV.
5. **Deduplicação** (`rate-limit.ts`) — hash de IP + e-mail + mensagem
   guardado por 5 minutos; reenvio idêntico nesse intervalo (duplo clique,
   retry) responde sucesso mas não dispara um segundo e-mail.
6. **Envio** (`email.ts`) — Resend, para `contato.lucasmarquesdev@gmail.com`,
   com `reply_to` apontando para o remetente.

Nada é persistido em banco; o log do Worker (e-mail, nome, tamanho da
mensagem, nunca o conteúdo) é o único registro.

## Segurança

- CSP restritivo em `next.config.ts` (`default-src 'self'`, `X-Frame-Options:
  DENY`, `Permissions-Policy` sem câmera/microfone/geolocalização).
  `'unsafe-eval'` só em desenvolvimento. `'unsafe-inline'` em
  `script-src`/`style-src` é permanente (script de tema/idioma e cores via
  `style={{ color }}`) — sem nonce. `challenges.cloudflare.com` liberado só
  para o widget do Turnstile.
- Sem autenticação, sem banco de dados — a superfície de ataque real é o
  formulário de contato e as integrações com Resend/Turnstile.

| Camada | Ferramenta | Quando roda |
| --- | --- | --- |
| Segredos (staged) | `scripts/check-secrets.mjs` (git hook) | pre-commit |
| Segredos (histórico completo) | Gitleaks (`secrets-scan`) | todo push/PR |
| Dependências | `pnpm audit --audit-level=high` + Dependabot | todo push/PR + semanal |
| SAST | CodeQL | todo push/PR (bloqueia deploy) + scan semanal agendado |
| DAST | OWASP ZAP baseline contra o Worker buildado localmente | todo push/PR (bloqueia deploy) |

## Qualidade

Pre-commit (`simple-git-hooks` + `lint-staged`, instalado no `pnpm install`):

- `eslint --fix --max-warnings=0` nos arquivos `.ts`/`.tsx` staged
- `scripts/check-secrets.mjs` em todo arquivo staged
- `tsc --noEmit` (projeto inteiro)

Sem suíte de testes automatizados. A única lógica com regras que valem
teste é o pipeline de contato (`contact-schema.ts`, `rate-limit.ts`) — se
crescer, é o primeiro lugar pra cobrir com testes unitários.
