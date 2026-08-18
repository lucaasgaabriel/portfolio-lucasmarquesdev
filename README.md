# lucasmarques.dev

Landing page pessoal de Lucas Marques (DevSecOps / Engenharia de Software,
Dados & IA). Uma única rota, sem CMS, sem banco de dados: conteúdo bilíngue
(PT/EN) em `src/data/content.ts`, uma Server Action de contato que valida e
loga (não persiste nada), deploy em Cloudflare Workers.

Stack: Next.js 16.3 (App Router), React 19, TypeScript, Tailwind CSS v4,
pnpm, adapter `@opennextjs/cloudflare` para rodar em Cloudflare Workers.

Este documento cobre como rodar o projeto e, principalmente, as decisões de
engenharia por trás dele — inclusive os pontos em que essas decisões têm
custo. Não é material de marketing do próprio projeto.

## Rodando localmente

Requer pnpm (a versão é fixada via `packageManager` em `package.json`;
`.npmrc` desativa a checagem estrita de engine, então uma versão de Node
ligeiramente diferente da usada em CI — Node 22 — não trava a instalação).

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
pnpm cf-typegen  # gera cloudflare-env.d.ts a partir de wrangler.jsonc
```

`pnpm install` também instala os git hooks (script `prepare` →
`simple-git-hooks`). Ver "Qualidade" abaixo.

## Estrutura

- `src/app` — layout raiz, página única (`page.tsx`), ícone/favicon gerado
  (`icon.tsx`) e a Server Action de contato (`actions/contact.ts`)
- `src/components` — seções da landing page e os componentes de interação
  (nav, tema, formulário)
- `src/data/content.ts` — todo o conteúdo textual do site em português e
  inglês (perfil, stacks, projetos, links do menu, textos de UI) — trocar o
  conteúdo do site é editar este arquivo, não a UI
- `src/lib/language-context.tsx` — contexto de idioma (`LanguageProvider` +
  `useLanguage`), lido por todo componente que exibe texto
- `src/lib/contact-schema.ts` — validação do formulário, isolada da Server
  Action para poder ser testada/reaproveitada sem depender de `"use server"`
- `wrangler.jsonc` / `open-next.config.ts` — configuração do build e deploy
  no Cloudflare
- `scripts/check-secrets.mjs` — scanner de segredos do pre-commit (ver
  "Segurança")

## Engenharia

### Server Action em vez de API route

O formulário de contato (`src/app/actions/contact.ts`) usa uma Server Action,
não uma rota `/api/contact`. Não existe nenhum outro consumidor desse
endpoint além do próprio formulário, então uma rota HTTP separada só
adicionaria uma superfície a mais para expor e documentar sem trazer
benefício — a Server Action já dá o binding tipado entre client e server e o
mecanismo de estado (`useActionState`) sem isso. É a escolha certa aqui
porque o consumidor é único e interno; deixaria de ser em qualquer cenário em
que outro cliente (um app mobile, um webhook, um script externo) precisasse
chamar o mesmo endpoint — Server Actions não são uma API pública.

### Server vs. Client Components

Isso mudou de forma real quando o i18n (PT/EN) entrou. Antes do idioma virar
uma escolha do usuário em runtime, a maior parte da árvore era Server
Component. Hoje, todo componente que exibe texto do site precisa ser Client
Component, porque o texto depende de `useLanguage()` — um hook, e hooks só
existem no cliente. Isso inclui `Hero`, `StackSection`, `ProjectsSection`,
`Footer` e `ContactSection`, que antes não precisavam de nenhum JS de
hidratação e agora precisam. O motivo não é escolha de estilo — é
consequência direta de não ter roteamento de locale no servidor (ver
"Internacionalização" abaixo): sem isso, não existe como o servidor saber em
qual idioma renderizar, então quem decide é sempre o cliente, e qualquer
coisa que dependa dessa decisão vira Client Component.

Continuam Server Component: `page.tsx`, `Header` (só compõe componentes
filhos, não lê `useLanguage()` diretamente), `CodeWindow`, `IconRain` e
`icons.tsx`. Os componentes de interação (`MobileNav`, `NavLinks`,
`ThemeToggle`, `LanguageToggle`) já eram client antes do i18n existir, por
motivos independentes: `MobileNav` tem estado local de aberto/fechado,
`NavLinks` usa `IntersectionObserver` (API só de browser), `ThemeToggle` e
`LanguageToggle` leem/escrevem `localStorage` e atributos do `<html>`.

Vale notar que `IconRain.tsx`, apesar de ser uma animação, continua Server
Component — a animação inteira é CSS (`@keyframes` + `transform`), não há
`useState`/`useEffect` nela, então não precisa de JS no cliente para existir.
Isso só funciona porque as posições dos ícones são valores fixos, não
`Math.random()`: gerar posições aleatórias em um componente que renderiza
primeiro no servidor produziria um HTML diferente do que o cliente monta na
hidratação, e o React ou reclama disso ou pior — aceita silenciosamente e
deixa a tela "piscando" no primeiro render. Fixar os valores evita isso e o
resultado visual é o mesmo em toda visita, o que aqui não é problema real
(não há necessidade de aleatoriedade no design).

### Cores como taxonomia, não só paleta

`globals.css` define uma paleta escura (inspirada no tema One Dark) via
custom properties (`--accent-cloud`, `--accent-lang`, `--accent-security`
etc.), com uma variante clara sob `:root[data-theme="light"]`. O que não é
óbvio olhando `globals.css` isoladamente é que essas variáveis funcionam como
um vocabulário de categorias reaproveitado em todo o site: `--accent-cloud`
não é "um azul qualquer", é a cor que identifica tudo relacionado a Cloud —
usada no ícone e na borda do card de Cloud em `StackSection`
(`icons.tsx` → `CATEGORY_META`), na flag `--devops`/`--ai`/etc. do painel
`whoami --focus` no Hero, e nos ícones que caem no `IconRain`. Trocar uma
cor na raiz propaga para cada lugar que a referencia. O acoplamento
inverso também é verdadeiro: adicionar uma nova categoria de stack exige
adicionar a variável de cor, o ícone em `icons.tsx` e a entrada em
`CATEGORY_META` — são três arquivos tocados para uma mudança de conteúdo,
o que é o preço de não ter um sistema de design formal por trás disso.

Os ícones de categoria (`src/components/icons.tsx`) são SVGs escritos à mão,
não uma biblioteca importada (lucide, heroicons etc.) — o CSP do projeto
bloqueia CDN externo por padrão, e importar um pacote de ícones inteiro para
usar dez ícones fixos não se paga aqui. Isso deixa de fazer sentido se o
projeto crescer para dezenas de ícones ou precisar deles em variações
(outline/fill, tamanhos) que a biblioteca já resolveria de graça.

### Tema claro/escuro

Não há um "sistema" de tema além de um atributo no `<html>`. Um script
inline em `layout.tsx` (`dangerouslySetInnerHTML`) roda antes da hidratação e
aplica `data-theme="light"` se `localStorage` tiver essa preferência
salva — isso evita o flash de tema errado no primeiro paint. `ThemeToggle.tsx`
só sincroniza seu ícone com o que esse script já decidiu e persiste a troca
manual. Ver a seção Tradeoffs para o que essa abordagem não cobre.

### Internacionalização (PT/EN)

Não usa `next-intl`, roteamento por locale (`/en/...`) nem nenhuma lib de
i18n. É um `LanguageProvider` (`src/lib/language-context.tsx`) guardando o
idioma atual em `useState`, inicializado por um script inline em
`layout.tsx` (o mesmo padrão do tema: lê `localStorage`, aplica
`data-lang="en"` no `<html>` antes da hidratação, evita flash do idioma
errado). Todo o conteúdo bilíngue vive em `src/data/content.ts`, um objeto
`{ pt: {...}, en: {...} }` com a mesma forma nos dois idiomas; os
componentes chamam `useLanguage()` e leem `t.<campo>` em vez de importar
texto direto.

A troca de idioma no formulário de contato merece nota: como a Server
Action roda no servidor e não tem acesso ao estado do `LanguageProvider`
(que é client-only), o idioma atual é passado explicitamente via um campo
oculto (`<input type="hidden" name="lang">` em `ContactSection.tsx`) e lido
de volta em `contact.ts`/`contact-schema.ts` para escolher as mensagens de
erro/sucesso no idioma certo. Sem esse campo, as mensagens de validação
sempre voltariam em português, não importa o que a UI estivesse mostrando.

O que essa abordagem não cobre — e por quê isso é aceitável aqui: a
metadata da página (`<title>`, `og:description`) é fixada em português em
`layout.tsx`, porque metadata é resolvida no servidor antes de qualquer
JS do cliente rodar, e não há como o servidor saber a preferência de
idioma sem cookie ou header `Accept-Language` (nenhum dos dois é lido
hoje). Um usuário que abre o site, troca para inglês e compartilha o link
compartilha uma página cujo `<title>` continua em português — para um
site institucional multilíngue isso seria um problema real de SEO; para
um portfólio pessoal com uma audiência majoritariamente brasileira, é uma
lacuna consciente, não um bug esquecido.

### Deploy: OpenNext/Cloudflare, não `@cloudflare/next-on-pages`

O adapter usado é `@opennextjs/cloudflare` (`wrangler.jsonc` +
`open-next.config.ts`), não o adapter mais antigo da própria Cloudflare
(`@cloudflare/next-on-pages`). Isso importa especificamente porque o site usa
Server Actions: o `next-on-pages` não tem suporte completo a esse recurso do
App Router, enquanto o OpenNext — que compila o Next para rodar como um
Worker "quase normal", em vez de reescrever o output para o formato de Pages
Functions — sim. `pnpm deploy` builda e publica em um único comando; `pnpm
preview` faz o mesmo mas serve localmente via Wrangler, o mais perto que dá
de testar o ambiente de produção antes de publicar de fato.

### CI/CD em dois estágios

`.github/workflows/ci-cd.yml` roda em todo push e PR para `main`, em dois
jobs:

1. **quality** — `pnpm install --frozen-lockfile`, lint, type check, build.
   Roda sempre, inclusive em PRs de fora do repositório, porque não depende
   de nenhum secret.
2. **deploy** — só dispara em push direto para `main` (`if: github.event_name
   == 'push' && github.ref == 'refs/heads/main'`) e só depois que `quality`
   passa (`needs: quality`). Builda de novo (não reaproveita artefato do job
   anterior) e publica via `pnpm run deploy`.

O efeito prático é que nenhuma build quebrada — de lint, de tipo ou de
compilação — chega a ser publicada, e um PR de fora não consegue disparar
deploy mesmo que `quality` passe, porque o `if` do job de deploy exige
`push`. O lado fraco: os dois jobs re-instalam dependências e rebuildam do
zero (~1-2 min a mais por run); para um projeto deste tamanho não compensa a
complexidade de compartilhar artefato entre jobs, mas é o tipo de coisa que
para de se pagar se o build ficar mais pesado.

## Segurança

### CSP

`next.config.ts` define um CSP restritivo por padrão: `default-src 'self'`,
sem `frame-ancestors`, com `Permissions-Policy` desabilitando câmera/
microfone/geolocalização e `X-Frame-Options: DENY`. A única diferença entre
ambientes é `'unsafe-eval'` em `script-src`, presente **só** em
desenvolvimento (`NODE_ENV === "development"`), porque o React/Turbopack
precisam disso para reconstruir stack traces no Fast Refresh — em produção
essa permissão não existe.

Importante ser preciso aqui (o `ARCHITECTURE.md` anterior descrevia isso de
forma um pouco otimista): o CSP **não** bloqueia scripts inline em nenhum
ambiente — `script-src` inclui `'unsafe-inline'` incondicionalmente, exigido
pelo script de tema (`dangerouslySetInnerHTML` em `layout.tsx`) que roda
antes da hidratação. `style-src` também tem `'unsafe-inline'` sempre, porque
vários componentes aplicam cor via `style={{ color }}` (a taxonomia de cores
descrita acima depende de atributo `style`, não de classes Tailwind
estáticas). Nenhum dos dois usa nonce. Na prática isso significa que, se
existisse uma forma de injetar HTML/script arbitrário no DOM (não existe
hoje — não há `dangerouslySetInnerHTML` com dado de usuário em lugar
nenhum), o CSP não impediria a execução. Um CSP com nonce para o script
inline fecharia essa brecha, mas dado que o site não renderiza nenhum dado
de usuário (o formulário só é lido no servidor, nunca ecoado de volta na
página), o risco residual hoje é baixo.

Outro detalhe: `style-src`/`font-src` liberam `fonts.googleapis.com`/
`fonts.gstatic.com`, mas `next/font/google` baixa e hospeda as fontes em
build time — não há chamada em runtime para domínio do Google. Essas
diretivas parecem ser sobra e não têm efeito prático hoje; não são um
problema de segurança, mas também não fazem nada.

### Formulário de contato

- **Honeypot**: campo `website`, escondido via `sr-only` e fora da ordem de
  tab (`tabIndex={-1}`, `autoComplete="off"`). Preenchimento (só bots fazem
  isso) faz a Server Action devolver uma resposta de sucesso genérica sem
  indicar que a submissão foi descartada — não há por que dar feedback
  específico a um bot.
- **Validação só no servidor, de propósito**: o `<form>` tem `noValidate`, ou
  seja, os atributos HTML (`required`, `type="email"`, `maxLength`) são
  apenas UX — quem quiser pode desligar o JS do navegador ou chamar a Server
  Action diretamente e a validação real (`src/lib/contact-schema.ts`) roda do
  mesmo jeito, com suas próprias regras de tamanho mínimo/máximo e regex de
  e-mail (uma regex simples, não RFC 5322 completo — decisão consciente, não
  é esse o ponto de falha que importa aqui).
- **O que é logado**: a Server Action loga e-mail, nome e o *tamanho* da
  mensagem (`console.info`), não o conteúdo da mensagem. É uma escolha
  razoável de minimizar PII em log, mas é importante ser claro sobre o que
  isso significa na prática: **a submissão não vai a lugar nenhum além do
  log do Worker**. Não há e-mail de notificação, não há persistência em
  banco, não há integração com nenhum serviço externo. Hoje, se alguém
  preencher o formulário, a única forma de Lucas saber é entrando
  manualmente nos logs do Cloudflare Workers. Isso não é uma limitação de
  segurança — é uma lacuna funcional real que vale mais a atenção do que
  qualquer um dos pontos de CSP acima.

### Scanner de segredos no pre-commit

`scripts/check-secrets.mjs` roda via `lint-staged` em todo commit, sobre os
arquivos staged. É deliberadamente sem dependências: uma lista de regex para
chave de acesso AWS, `aws_secret_access_key`, blocos `BEGIN PRIVATE KEY`,
tokens do Slack/GitHub e atribuições genéricas do tipo
`secret/token/password = "..."`, além de bloquear qualquer `.env*` real
(exceto `.env.example`).

Sendo honesto sobre o que isso é e o que não é: **isto não é o gitleaks (nem
o trufflehog)**. É um filtro de padrões conhecidos, não uma ferramenta com
detecção por entropia, sem os centenas de padrões de provedores que uma
ferramenta madura mantém atualizados, e sem varredura de histórico — se um
segredo real já foi commitado antes de existir este script, ele continua no
histórico do git independente disso. Um valor com nome de variável fora do
padrão, um segredo partido em duas linhas, ou uma string codificada em
base64 passam batido. Para este projeto — sem segredos de aplicação no
repositório (o único segredo real, o token da Cloudflare, vive nos GitHub
Secrets, nunca no código) — isso é uma rede de segurança razoável e barata,
mas não deveria ser lido como "commit passou, logo não tem segredo". Trocar
por gitleaks é uma mudança de poucas linhas no hook se o projeto crescer ou
passar a lidar com segredos de verdade.

### O que não tem (e se isso é aceitável)

- **Sem rate limiting no formulário de contato.** A Server Action pode ser
  chamada quantas vezes alguém quiser; nada impede um script de enviar
  centenas de submissões. O honeypot filtra bots simples que preenchem todo
  campo do form, não impede um envio programático que já sabe ignorar o
  campo `website`. Dado que a única consequência de um spam de submissões
  hoje é poluir um log do Worker (sem custo de banco, sem envio de e-mail,
  sem gatilho de nenhuma ação), o impacto de um abuso é baixo — mas o
  cálculo muda no dia em que o formulário passar a disparar algo com custo
  (um e-mail via serviço pago, uma escrita em banco, uma notificação): nesse
  ponto, rate limiting deixa de ser opcional.
- **Sem CAPTCHA/Turnstile.** Consistente com o ponto acima — o honeypot é a
  única barreira contra bot, e é a barreira mais barata que existe. Cloudflare
  Turnstile seria a adição natural se o volume de spam justificar.
- **`pnpm audit` não roda no CI.** O `ARCHITECTURE.md` anterior a este README
  afirmava que o pipeline cobria isso; não cobre — `.github/workflows/ci-cd.yml`
  não tem esse passo (rodei `pnpm audit` manualmente durante esta revisão:
  hoje não há vulnerabilidades conhecidas nas dependências, mas isso só vale
  para o instante em que rodou). Não há Dependabot configurado. Isso é uma
  lacuna real e barata de fechar — um `pnpm audit --audit-level=high` no job
  `quality` ou um `dependabot.yml` cobriria a maior parte do risco de
  dependências desatualizadas sem custo de manutenção relevante.
- **Sem autenticação, sem banco de dados.** Não há sessão, não há CSRF a
  proteger além do que a própria Server Action já garante (Next só aceita a
  Action a partir de origem própria por padrão), não há superfície de
  injeção de banco porque não existe banco. A única entrada de usuário no
  site inteiro é o formulário de contato. Isso reduz bastante a superfície
  de ataque real do projeto — a maior parte do que uma checklist de
  segurança genérica cobraria (rotação de sessão, hashing de senha, ORM
  parametrizado) simplesmente não se aplica aqui.

## Tradeoffs

Decisões de engenharia trocam uma coisa por outra; a lista abaixo é
explícita sobre o que foi trocado por quê, e em que ponto a escolha pararia
de fazer sentido.

- **Sem banco de dados, tudo estático + uma Server Action que só loga** —
  troca simplicidade e custo operacional (zero infraestrutura de dados, zero
  runtime com estado, deploy é só um Worker + assets estáticos) por perder
  qualquer persistência real de lead. Certo para um portfólio pessoal de uma
  página; deixaria de ser certo no dia em que o formulário de contato
  precisasse efetivamente notificar alguém ou guardar histórico — nesse
  momento a "simplicidade" vira "as submissões se perdem".

- **CSS custom properties + Tailwind, sem biblioteca de componentes** — troca
  zero dependência de UI kit e controle total do visual (inclusive a
  taxonomia de cores por categoria, que nenhuma lib pronta ofereceria) por
  ter que implementar à mão qualquer coisa que uma lib resolveria de graça:
  aqui isso custou pouco porque não há modais, dropdowns, comboboxes ou
  qualquer coisa com gerenciamento de foco complexo. Pararia de compensar se
  o site ganhasse esse tipo de componente interativo — reimplementar
  acessibilidade de um dialog do zero é um trabalho real que uma lib madura
  já fez.

- **Tema claro/escuro via `data-theme` + `localStorage`, sem `next-themes`**
  — troca uma dependência (mesmo que pequena) por ~15 linhas de script
  inline mais um componente simples. O custo real, que vale apontar: o
  mecanismo atual **não lê `prefers-color-scheme`** — um visitante com o
  sistema em modo claro que nunca tocou no toggle recebe o tema escuro (o
  default do `:root`) mesmo assim; só depois de clicar manualmente é que a
  preferência é salva e respeitada nas próximas visitas. `next-themes`
  resolveria isso de fábrica. Para um site com estética deliberadamente
  "terminal escuro" isso é defensável como escolha de design, mas é
  importante que seja uma escolha e não um efeito colateral não percebido.

- **i18n caseiro (Context + objeto bilíngue) em vez de `next-intl`** — troca
  zero dependência e controle total do formato do conteúdo por perder tudo
  que uma lib de i18n madura resolve de fábrica: SEO por idioma (a metadata
  fica presa em português, ver "Internacionalização" acima), rotas
  dedicadas por locale, pluralização, formatação de data/número por
  localidade. Também tem um custo de arquitetura já pago: componentes que
  antes eram Server Component (`Hero`, `StackSection`, `ProjectsSection`,
  `Footer`) viraram Client Component só porque agora leem `useLanguage()` —
  mais JS enviado ao cliente do que estritamente necessário para o conteúdo
  que exibem. Aceitável para duas rotas de idioma e um conteúdo que não
  muda com frequência; pararia de compensar assim que o site precisasse de
  SEO multilíngue de verdade (páginas indexadas separadamente por idioma) ou
  de um terceiro idioma — nesse ponto o custo de adotar `next-intl` (ou
  roteamento por locale nativo do App Router) seria menor do que continuar
  crescendo esse Context à mão.

- **`next/font` (IBM Plex Sans, Space Grotesk, JetBrains Mono) em vez de
  fontes do sistema** — troca zero bytes de fonte (system font stack não
  baixa nada) por identidade visual consistente com a estética de terminal/
  editor de código que o site inteiro constrói (o mono em particular faz
  sentido para números, tags e o "código" simulado dos `CodeWindow`). O
  custo é real, mesmo com `next/font` fazendo self-host e subsetting (sem
  chamada de rede para o Google em runtime): três famílias de fonte para uma
  landing page de uma página é mais peso do que o conteúdo estritamente
  precisa. Aceitável aqui porque a tipografia é parte do produto (é um
  portfólio de dev, o "look de terminal" é a proposta visual), não faria
  sentido no mesmo grau para um site de conteúdo denso onde performance de
  carregamento pesa mais que identidade visual.

- **Scanner de segredos caseiro em vez de gitleaks** — troca zero
  dependência extra e controle total das regras por cobertura
  significativamente menor (sem entropia, sem histórico, lista de padrões
  pequena e mantida à mão). Aceitável para um repositório pessoal sem
  segredos de aplicação versionados; um projeto de time, ou um projeto que
  passe a versionar qualquer coisa sensível, deveria trocar isso por
  gitleaks/trufflehog rodando tanto no pre-commit quanto no CI (o scanner
  atual só roda localmente, via git hook — nada impede um push que pulou o
  hook, ex. `git commit --no-verify` ou um commit feito fora da máquina que
  tem o hook instalado).

- **OpenNext/Cloudflare Workers em vez de Vercel** — Vercel é o caminho
  "padrão" para Next.js (mesma empresa mantém o framework, suporte de dia
  zero para recursos novos). A troca aqui é por custo/infra (Cloudflare
  Workers tem free tier generoso e reaproveita conta Cloudflare que já
  existe) e por não depender do runtime específico da Vercel. O preço é
  depender de um adapter de terceiros (`@opennextjs/cloudflare`, mantido pela
  comunidade/OpenNext, não pela equipe do Next.js) para features novas do
  Next — historicamente isso significa suporte com atraso em relação a
  lançamentos do framework, e é o tipo de risco que cresce, não diminui, com
  o tempo: este projeto já está em Next 16.3, uma versão recente, e depende
  de o OpenNext continuar acompanhando o ritmo de release do Next. Para um
  site pessoal de baixo tráfego, esse risco é administrável (o pior cenário
  é segurar upgrade do Next até o adapter alcançar); para uma aplicação de
  produção com SLA, seria um fator de peso real a favor de Vercel.

## CI/CD — secrets necessários

Para o job `deploy` funcionar, configure no repositório do GitHub (Settings
→ Secrets and variables → Actions → environment `production`):

- `CLOUDFLARE_API_TOKEN` — token com permissão de editar Workers (Cloudflare
  dashboard → My Profile → API Tokens)
- `CLOUDFLARE_ACCOUNT_ID` — ID da conta Cloudflare

O job `quality` não usa nenhum secret e roda igual em PRs de fora do
repositório.

## Qualidade

Hooks de pre-commit (`simple-git-hooks` + `lint-staged`), instalados
automaticamente no `pnpm install`:

- `eslint --fix --max-warnings=0` nos arquivos `.ts`/`.tsx` staged
- `scripts/check-secrets.mjs` em todo arquivo staged (`ts`, `tsx`, `js`,
  `jsx`, `mjs`, `cjs`, `json`, `md`, `css`) — ver limitações na seção
  Segurança
- `tsc --noEmit` (type check completo do projeto, não só dos arquivos
  staged)

Nenhum desses passos roda testes automatizados — não há suíte de testes no
projeto hoje. Para o tamanho e a natureza do site (sem lógica de negócio
além da validação do formulário, que é pura e pequena o suficiente para ler
e revisar a olho) isso é defensável; `src/lib/contact-schema.ts` seria o
primeiro candidato óbvio a testes unitários se o projeto ganhar mais lógica.
