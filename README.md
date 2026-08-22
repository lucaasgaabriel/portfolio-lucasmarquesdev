# lucasgms.dev

[![CI/CD](https://github.com/lucaasgaabriel/portfolio-lucasmarquesdev/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/lucaasgaabriel/portfolio-lucasmarquesdev/actions/workflows/ci-cd.yml)

**[lucasgms.dev](https://lucasgms.dev)** — landing page pessoal de Lucas
Marques (DevSecOps / Engenharia de Software, Dados & IA).

Não é uma vitrine estática: é publicado como um serviço de produção de
verdade, com pipeline de CI/CD em estágios, formulário de contato com defesa
em profundidade contra abuso e uma esteira de segurança automatizada (SAST,
DAST, scanner de segredos, auditoria de dependências) rodando a cada push.

**Stack:** Next.js 16.3 (App Router) · React 19 · TypeScript · Tailwind CSS v4
· Cloudflare Workers (`@opennextjs/cloudflare`)

## Destaques técnicos

- **Zero backend tradicional** — sem CMS, sem banco de dados. Conteúdo
  bilíngue (PT/EN) versionado em código, formulário de contato via Server
  Action, e-mail via Resend, tudo publicado como um único Worker na borda da
  Cloudflare.
- **Defesa em profundidade no formulário de contato** — honeypot → validação
  de schema → CAPTCHA (Turnstile) → rate limit por IP → deduplicação, todas
  camadas antes de qualquer e-mail sair (detalhes em "Formulário de
  contato").
- **Esteira de segurança automatizada em cada push** — CodeQL (SAST), OWASP
  ZAP (DAST), Gitleaks + scanner local de segredos, `pnpm audit` +
  Dependabot (detalhes em "Segurança").
- **Decisões de arquitetura documentadas, não só código** — cada escolha não
  óbvia (Server Action vs. API route, KV vs. Durable Object, duplicação de
  headers entre Worker e assets estáticos) está registrada com o porquê, não
  só o quê (ver "Arquitetura").

## Rodando localmente

Requer pnpm (versão fixada via `packageManager` em `package.json`).

```bash
pnpm install
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000).

```bash
pnpm build       # build de produção
pnpm start       # serve o build de produção
pnpm lint        # eslint
pnpm typecheck   # tsc --noEmit
pnpm preview     # build + preview local via Wrangler
pnpm deploy      # build + deploy para Cloudflare Workers
```

`pnpm install` também instala os git hooks de pre-commit (ver "Qualidade").

## Estrutura

- `src/app` — layout raiz, página única, ícone/favicon gerado (`icon.tsx`) e
  a Server Action de contato (`actions/contact.ts`)
- `src/components` — seções da página e componentes de interação (nav, tema,
  idioma, formulário)
- `src/data/content.ts` — todo o conteúdo do site, em português e inglês
- `src/lib/language-context.tsx` — contexto de idioma (`LanguageProvider` +
  `useLanguage`)
- `src/lib/contact-schema.ts` — validação e sanitização do formulário
- `src/lib/turnstile.ts` — verificação server-side do CAPTCHA (Cloudflare
  Turnstile)
- `src/lib/rate-limit.ts` — limite de envios por IP e deduplicação de
  submissões idênticas, via Cloudflare KV
- `src/lib/email.ts` — envio da notificação de contato via Resend
- `src/types/cloudflare-env-secrets.d.ts` — tipagem dos secrets do Worker que
  não aparecem no `wrangler.jsonc` (ver "Configuração no Cloudflare")
- `wrangler.jsonc` / `open-next.config.ts` — build, bindings e deploy no
  Cloudflare
- `public/_headers` — headers de segurança para os assets estáticos servidos
  direto pelo binding `ASSETS` do Cloudflare (ver nota de arquitetura abaixo)
- `scripts/check-secrets.mjs` — scanner de segredos do pre-commit

## Arquitetura — decisões que valem uma nota

- **Server Action, não API route** — o formulário é o único consumidor;
  uma rota `/api/contact` separada não teria benefício.
- **Server vs. Client Components** — como o idioma é decidido no cliente
  (sem roteamento por locale), todo componente que exibe texto do site
  (`Hero`, `StackSection`, `ProjectsSection`, `Footer`, `ContactSection`)
  precisa ser Client Component para reagir à troca de idioma. `Header`,
  `CodeWindow` e `IconRain` continuam Server Component.
- **Cores como taxonomia** — as custom properties de cor em `globals.css`
  (`--accent-cloud`, `--accent-lang` etc.) identificam categorias inteiras,
  reaproveitadas entre `StackSection`, o painel `whoami --focus` do Hero e o
  `IconRain`. Adicionar uma categoria nova exige tocar três arquivos
  (variável de cor, ícone em `icons.tsx`, entrada em `CATEGORY_META`).
- **Tema e idioma via `data-theme`/`data-lang` + `localStorage`** — sem
  `next-themes` ou `next-intl`. Um script inline em `layout.tsx` aplica a
  preferência salva antes da hidratação, evitando flash do tema/idioma
  errado. Limitação aceita: a metadata da página (`<title>`, `og:*`) fica
  fixa em português, já que é resolvida no servidor antes de qualquer
  preferência de cliente existir.
- **OpenNext, não `@cloudflare/next-on-pages`** — o site usa Server Actions,
  que o adapter mais antigo da Cloudflare não suporta bem.
- **Headers de segurança duplicados (`next.config.ts` + `public/_headers`)**
  — no Cloudflare, a página estática e os arquivos em `_next/static/*` são
  servidos direto pelo binding `ASSETS`, sem passar pelo Worker. Isso significa
  que `headers()` do `next.config.ts` nunca chega nessas respostas em produção;
  só afeta `next dev`/`next start`. `public/_headers` (convenção do Cloudflare)
  é a fonte real dos headers no site publicado; o `next.config.ts` existe só
  para manter paridade em desenvolvimento.
- **Resend em vez de SMTP** — a API HTTP da Resend funciona nativamente no
  runtime de Workers (uma chamada `fetch`, sem socket TCP nem SDK Node-only).
  Free tier cobre o volume esperado de um formulário de contato pessoal.
- **Rate limit e deduplicação via Cloudflare KV, não Durable Object** — KV é
  eventualmente consistente, então não é um limite atômico sob concorrência
  real na mesma janela de tempo; para um formulário de contato pessoal isso é
  suficiente e evita a complexidade de um Durable Object.
- **CI/CD em estágios** — `quality` (lint, typecheck, audit, build) e
  `secrets-scan` (Gitleaks) rodam em todo push/PR sem precisar de secret;
  `deploy` só dispara em push para `main` e só depois que os dois passam;
  `dast` roda depois do deploy, contra o site já publicado (ver "Segurança").

## Formulário de contato

Fluxo de uma submissão, na ordem em que cada camada pode rejeitá-la:

1. **Honeypot** (`website`) — campo invisível fora da ordem de tab; se vier
   preenchido, a submissão é descartada silenciosamente (sucesso falso para
   o bot, sem consumir as camadas abaixo).
2. **Validação de schema** (`contact-schema.ts`) — nome, e-mail e tamanho da
   mensagem, com sanitização de espaços.
3. **CAPTCHA** (`turnstile.ts`) — o token do widget Cloudflare Turnstile é
   verificado no servidor contra a API da Cloudflare antes de qualquer envio.
4. **Rate limit por IP** (`rate-limit.ts`) — máximo de 5 submissões por IP a
   cada hora, contado em Cloudflare KV.
5. **Deduplicação** (`rate-limit.ts`) — um hash de IP + e-mail + mensagem é
   guardado por 5 minutos; reenvios idênticos nesse intervalo (duplo clique,
   retry de rede) são aceitos para o usuário mas não disparam um segundo
   e-mail.
6. **Envio** (`email.ts`) — notificação por e-mail via Resend para
   `contato.lucasmarquesdev@gmail.com`, com `reply_to` apontando para o
   remetente.

Nenhum dado é persistido em banco — o único registro que sobrevive é o log
do Worker (e-mail, nome e tamanho da mensagem, nunca o conteúdo).

## Segurança

- CSP restritivo em `next.config.ts` (`default-src 'self'`, `X-Frame-Options:
  DENY`, `Permissions-Policy` sem câmera/microfone/geolocalização).
  `'unsafe-eval'` em `script-src` existe só em desenvolvimento. `'unsafe-inline'`
  em `script-src`/`style-src` é permanente (exigido pelo script de tema/idioma
  e pelas cores aplicadas via `style={{ color }}`) — sem nonce. `challenges.
  cloudflare.com` é liberado em `script-src`/`connect-src`/`frame-src`
  exclusivamente para o widget do Turnstile.
- Formulário de contato: honeypot, CAPTCHA, validação só no servidor
  (`noValidate` no form, regras reais em `contact-schema.ts`), rate limit e
  deduplicação por IP (ver "Formulário de contato" acima).
- Sem autenticação e sem banco de dados — a superfície de ataque real do
  site é o formulário de contato e a integração com Resend/Turnstile.

**Automação de segurança:**

| Camada | Ferramenta | Quando roda |
| --- | --- | --- |
| Segredos (staged) | `scripts/check-secrets.mjs` (git hook) | pre-commit |
| Segredos (histórico completo) | Gitleaks (`secrets-scan`) | todo push/PR |
| Dependências | `pnpm audit --audit-level=high` + Dependabot | todo push/PR + semanal |
| SAST | CodeQL | todo push/PR + semanal |
| DAST | OWASP ZAP baseline contra `https://lucasgms.dev` | após cada deploy |

CodeQL e ZAP são informativos (resultados na aba Security do repositório);
nenhum dos dois bloqueia o deploy.

## Configuração no Cloudflare

Além do binding `ASSETS`, o Worker precisa de um namespace KV e dois secrets
para o formulário de contato funcionar em produção:

```bash
# 1. Criar o namespace KV e colar o id retornado em wrangler.jsonc
wrangler kv namespace create CONTACT_KV

# 2. Configurar os secrets (nunca em wrangler.jsonc ou .env)
wrangler secret put RESEND_API_KEY
wrangler secret put TURNSTILE_SECRET_KEY

# 3. Regenerar os tipos do binding de KV
pnpm cf-typegen
```

- `RESEND_API_KEY` — gerada em [resend.com](https://resend.com); o remetente
  por padrão é o domínio de teste `onboarding@resend.dev` (zero configuração
  de DNS). Para enviar como `contato@lucasgms.dev`, verifique o domínio no
  painel da Resend e ajuste `CONTACT_FROM` em `src/lib/email.ts`.
- `TURNSTILE_SECRET_KEY` — gerada ao criar um widget em Cloudflare →
  Turnstile. A *site key* correspondente (pública por natureza) fica
  hardcoded em `src/lib/turnstile.ts` como `TURNSTILE_SITE_KEY`, atrelada ao
  domínio do widget criado no dashboard.

## CI/CD — secrets necessários

Para o job `deploy` (GitHub → Settings → Secrets and variables → Actions):

- `CLOUDFLARE_API_TOKEN` — token com permissão de editar Workers
- `CLOUDFLARE_ACCOUNT_ID` — ID da conta Cloudflare

O job `quality` não usa nenhum secret. Os secrets de runtime do formulário
(`RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`) vivem no Worker, não no GitHub
Actions — ver "Configuração no Cloudflare".

## Qualidade

Pre-commit (`simple-git-hooks` + `lint-staged`, instalado no `pnpm install`):

- `eslint --fix --max-warnings=0` nos arquivos `.ts`/`.tsx` staged
- `scripts/check-secrets.mjs` em todo arquivo staged
- `tsc --noEmit` (projeto inteiro)

Sem suíte de testes automatizados — decisão de escopo, não lacuna
esquecida: a única lógica de negócio real é o pipeline de contato
(`contact-schema.ts` + `rate-limit.ts` + `turnstile.ts` + `email.ts`), hoje
coberta por `tsc --noEmit` a cada commit e validação manual do fluxo antes
de cada mudança. Se essa lógica crescer, o próximo passo natural é testes
unitários para `contact-schema.ts` e `rate-limit.ts` — são as duas peças
com regras (limites, formatos, janelas de tempo) fáceis de quebrar sem
notar.
