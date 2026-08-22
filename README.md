# lucasgms.dev

Landing page pessoal de Lucas Marques (DevSecOps / Engenharia de Software,
Dados & IA). Uma única rota, sem CMS, sem banco de dados: conteúdo bilíngue
(PT/EN) em `src/data/content.ts`, uma Server Action de contato que valida e
loga (não persiste nada), deploy em Cloudflare Workers.

Stack: Next.js 16.3 (App Router), React 19, TypeScript, Tailwind CSS v4,
pnpm, adapter `@opennextjs/cloudflare`.

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
- `src/lib/contact-schema.ts` — validação do formulário
- `wrangler.jsonc` / `open-next.config.ts` — build e deploy no Cloudflare
- `public/_headers` — headers de segurança para os assets estáticos servidos
  direto pelo binding `ASSETS` do Cloudflare (ver nota de segurança abaixo)
- `scripts/check-secrets.mjs` — scanner de segredos do pre-commit

## Decisões que valem uma nota

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
- **CI/CD em estágios** — `quality` (lint, typecheck, audit, build) e
  `secrets-scan` (Gitleaks) rodam em todo push/PR sem precisar de secret;
  `deploy` só dispara em push para `main` e só depois que os dois passam;
  `dast` roda depois do deploy, contra o site já publicado (ver "Segurança").

## Segurança

- CSP restritivo em `next.config.ts` (`default-src 'self'`, `X-Frame-Options:
  DENY`, `Permissions-Policy` sem câmera/microfone/geolocalização).
  `'unsafe-eval'` em `script-src` existe só em desenvolvimento. `'unsafe-inline'`
  em `script-src`/`style-src` é permanente (exigido pelo script de tema/idioma
  e pelas cores aplicadas via `style={{ color }}`) — sem nonce.
- Formulário de contato: honeypot (`website`, `sr-only` + fora da ordem de
  tab), validação só no servidor (`noValidate` no form, regras reais em
  `contact-schema.ts`), log minimizado (e-mail, nome e tamanho da mensagem,
  não o conteúdo). Sem rate limiting nem CAPTCHA/Turnstile — aceitável
  enquanto a única consequência de spam é poluir um log de texto.
- O formulário não envia e-mail nem persiste dados; o log do Worker é a
  única forma de ver o que foi enviado.
- Sem autenticação e sem banco de dados — a superfície de ataque real do
  site é só esse formulário.

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

## CI/CD — secrets necessários

Para o job `deploy` (GitHub → Settings → Secrets and variables → Actions):

- `CLOUDFLARE_API_TOKEN` — token com permissão de editar Workers
- `CLOUDFLARE_ACCOUNT_ID` — ID da conta Cloudflare

O job `quality` não usa nenhum secret.

## Qualidade

Pre-commit (`simple-git-hooks` + `lint-staged`, instalado no `pnpm install`):

- `eslint --fix --max-warnings=0` nos arquivos `.ts`/`.tsx` staged
- `scripts/check-secrets.mjs` em todo arquivo staged
- `tsc --noEmit` (projeto inteiro)

Não há suíte de testes automatizados hoje.
