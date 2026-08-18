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
- **CI/CD em estágios** — `quality` (lint, typecheck, audit, build) e
  `secrets-scan` (Gitleaks) rodam em todo push/PR sem precisar de secret;
  `deploy` só dispara em push para `main` e só depois que os dois passam;
  `dast` roda depois do deploy, contra o site já publicado.

## Segurança

- CSP restritivo em `next.config.ts` (`default-src 'self'`, `X-Frame-Options:
  DENY`, `Permissions-Policy` sem câmera/microfone/geolocalização).
  `'unsafe-eval'` em `script-src` existe só em desenvolvimento. `'unsafe-inline'`
  em `script-src`/`style-src` é permanente (exigido pelo script de tema/idioma
  e pelas cores aplicadas via `style={{ color }}`) — sem nonce.
- Formulário de contato: honeypot (`website`, `sr-only` + fora da ordem de
  tab), validação só no servidor (`noValidate` no form, regras reais em
  `contact-schema.ts`), log minimizado (e-mail, nome e tamanho da mensagem,
  não o conteúdo).
- **O formulário não envia e-mail nem persiste nada** — a única forma de
  saber que alguém escreveu é olhar o log do Worker. Isso é uma lacuna
  funcional, não só de segurança.
- Sem rate limiting e sem CAPTCHA/Turnstile no formulário — aceitável hoje
  porque a única consequência de spam é poluir um log; deixaria de ser
  aceitável se o formulário passasse a disparar algo com custo.
- `scripts/check-secrets.mjs` é um scanner de padrões conhecidos (chaves AWS,
  tokens, blocos de chave privada) que roda localmente via git hook, sobre os
  arquivos staged. Em CI, o job `secrets-scan` roda Gitleaks sobre o histórico
  completo do repositório a cada push/PR — cobertura mais ampla (entropia,
  regras da comunidade), como camada extra e não substituto do hook local.
- `pnpm audit --audit-level=high` roda no job `quality` do CI a cada push/PR
  (sem vulnerabilidades conhecidas no momento em que isso foi escrito, mas
  isso só vale para esse instante). Dependabot está ativo para atualizações
  de segurança e para PRs semanais de dependências (`.github/dependabot.yml`).
- CodeQL (SAST) roda em todo push/PR e semanalmente, com os resultados na aba
  Security do repositório — não bloqueia o deploy, é uma camada de revisão.
- OWASP ZAP baseline (DAST) roda depois de cada deploy bem-sucedido, contra
  `https://lucasgms.dev` — relatório informativo, não bloqueia nada porque o
  deploy já aconteceu quando ele roda.
- Sem autenticação, sem banco de dados — a superfície de ataque real é só o
  formulário de contato.

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
