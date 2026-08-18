# Arquitetura

Notas técnicas sobre como esse projeto foi construído e por quê. O README cobre
como rodar; este arquivo cobre as decisões por trás do código.

## Stack

Next.js 16 (App Router) com React 19 e TypeScript. Praticamente tudo é Server
Component — só três pedaços da UI precisam rodar no cliente: o formulário de
contato (`useActionState`), o menu mobile (estado de aberto/fechado) e o
destaque de seção ativa no menu (`IntersectionObserver`). O resto é renderizado
no servidor e enviado como HTML estático, sem hidratação desnecessária.

O formulário de contato usa uma Server Action (`src/app/actions/contact.ts`)
em vez de uma API route. Não tem por que existir um endpoint HTTP separado
para receber um POST que só é chamado pelo próprio formulário — a Server
Action já cobre isso com menos código e sem expor uma rota adicional.

## Segurança

O CSP em `next.config.ts` é restrito por padrão (`default-src 'self'`, sem
scripts inline arbitrários, sem `unsafe-eval`). A única flexibilização é
`'unsafe-eval'` em desenvolvimento, porque o React precisa disso para
reconstruir stack traces no Fast Refresh — em produção essa permissão não
existe.

O formulário tem um campo honeypot (`website`, escondido via `sr-only` e fora
da ordem de tab) e validação inteira no servidor (`src/lib/contact-schema.ts`),
independente do que o HTML do formulário permite ou não no navegador. Envio
que preenche o honeypot recebe uma resposta de sucesso genérica, sem indicar
que foi filtrado — não faz sentido dar feedback específico pra um bot.

Todo commit passa por `scripts/check-secrets.mjs`, um scanner de segredos sem
dependências (regex simples pra chaves AWS, tokens do GitHub/Slack, blocos de
chave privada, atribuições genéricas de secret/token) rodando via
`lint-staged` só nos arquivos staged. Arquivos `.env` reais nunca passam do
staging. Isso mais o `pnpm audit` no CI cobre a superfície razoável pra um
projeto desse tamanho sem precisar de uma ferramenta paga.

## Design system

Toda cor vem de custom properties CSS em `globals.css` — uma paleta escura
inspirada no tema One Dark. O que não é óbvio olhando o arquivo isolado: essas
mesmas variáveis de cor são reaproveitadas como um vocabulário de categorias
em todo o site. `--accent-cloud` não é só "azul", é a cor que identifica
tudo relacionado a Cloud — no card de Cloud em Stacks, na flag `--iac` do
painel de foco, em qualquer lugar que precise sinalizar esse domínio. Trocar
uma cor na raiz propaga pra cada lugar que a usa.

Os ícones de cada categoria (`src/components/icons.tsx`) são SVGs desenhados
à mão, não uma biblioteca de ícones importada — o CSP bloqueia CDN externo
por padrão, e trazer um pacote de ícones inteiro pra usar dez não compensava.

## A "chuva" de ícones no Hero

`IconRain.tsx` anima ícones caindo atrás do conteúdo do Hero usando só
`transform` em CSS (`@keyframes` + `will-change: transform`), sem nenhum JS
rodando por frame — a animação inteira roda na compositor thread. As posições,
tamanhos e delays de cada ícone são valores fixos, não `Math.random()`: como o
componente renderiza primeiro no servidor, gerar posições aleatórias ali
criaria um HTML diferente do que o cliente monta na hidratação, e o React
reclama disso (ou pior, aceita silenciosamente e deixa a tela piscando no
primeiro render). Fixar os valores resolve isso e ainda garante um resultado
visual consistente entre carregamentos.

Todo o site respeita `prefers-reduced-motion`: a chuva de ícones some
inteira, o cursor do header para de piscar, o traço do Hero aparece já
desenhado.

## Deploy

O adapter é o `@opennextjs/cloudflare`, não o `@cloudflare/next-on-pages`.
A diferença importa aqui especificamente porque o site usa Server Actions —
o adapter mais antigo não suporta isso direito, o OpenNext sim. `wrangler.jsonc`
e `open-next.config.ts` configuram o build; `pnpm deploy` empacota e publica
num único comando.

## CI/CD

`.github/workflows/ci-cd.yml` roda em dois estágios. O primeiro (`quality`)
roda em todo push e PR: lint, type check, build. Não depende de nenhum
secret, então roda igual em PRs de fora. O segundo (`deploy`) só dispara em
push pra `main` e só depois que o `quality` passa — nunca publica uma build
que não passou pelos checks.
