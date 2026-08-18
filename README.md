# lucasmarques.dev

Landing page pessoal de Lucas Marques — DevSecOps, dados e engenharia de software.

## Stack

- [Next.js 16.3](https://nextjs.org) (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- [pnpm](https://pnpm.io) como gerenciador de pacotes
- Deploy em [Cloudflare Workers](https://developers.cloudflare.com/workers/) via [OpenNext](https://opennext.js.org/cloudflare)

## Desenvolvimento

Requer pnpm (o repositório fixa a versão via `packageManager` em `package.json`).

```bash
pnpm install
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000).

Outros comandos:

```bash
pnpm build       # build de produção (Next.js)
pnpm start       # serve o build de produção
pnpm lint        # eslint
pnpm typecheck   # tsc --noEmit
pnpm preview     # build + preview local via Wrangler (ambiente Cloudflare simulado)
pnpm deploy      # build + deploy para Cloudflare Workers
```

## Qualidade e segurança

Hooks de pre-commit (via `simple-git-hooks` + `lint-staged`) rodam automaticamente em todo commit:

- `eslint --fix` nos arquivos `.ts`/`.tsx` staged
- varredura de segredos (`scripts/check-secrets.mjs`) em todos os arquivos staged — bloqueia chaves AWS, tokens, blocos de chave privada e arquivos `.env` reais
- `tsc --noEmit` (type check completo)

Os hooks são instalados automaticamente no `pnpm install` (script `prepare`).

## CI/CD

`.github/workflows/ci-cd.yml` roda em todo push/PR para `main`:

1. **quality** — lint, type check e build (sempre)
2. **deploy** — build + deploy para Cloudflare Workers via OpenNext (somente em push para `main`, após o `quality` passar)

Para o deploy funcionar, configure estes secrets no repositório do GitHub (Settings → Secrets and variables → Actions):

- `CLOUDFLARE_API_TOKEN` — token com permissão de editar Workers (Cloudflare dashboard → My Profile → API Tokens)
- `CLOUDFLARE_ACCOUNT_ID` — ID da conta Cloudflare

Decisões de arquitetura e por que o projeto é montado desse jeito estão em
[ARCHITECTURE.md](./ARCHITECTURE.md).

## Estrutura

- `src/app` — rotas, layout raiz, ícone/favicon gerado e a Server Action de contato
- `src/components` — seções da landing page
- `src/data/profile.ts` — dados de perfil e conteúdo
- `src/lib/contact-schema.ts` — validação do formulário de contato
- `wrangler.jsonc` / `open-next.config.ts` — configuração do deploy no Cloudflare
