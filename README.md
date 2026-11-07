# DevCamp — Starter React + Orval + Tailwind + TypeScript

Starter extraído do padrão do **bree-web**.

## Stack

- **React 19** + **TypeScript** (strict) + **Vite 7**
- **TanStack Router** (file-based, `layout.tsx` / `index.tsx`, code splitting automático)
- **TanStack Query** + **Orval** (hooks gerados a partir do Swagger, mutator axios)
- **Tailwind CSS v4** + **shadcn/ui** (estilo `base-nova`, Base UI)
- **react-hook-form** + **zod**, **nuqs** (filtros na URL), **zustand**, **sonner**
- **Biome** (lint + format, tabs, aspas duplas)

## Começando

```bash
cp .env.example .env    # ajuste VITE_API_BASE_URL e VITE_API_SWAGGER_URL
pnpm install
pnpm generate:api       # gera src/api/generated a partir do Swagger
pnpm dev
```

| Script | O que faz |
| --- | --- |
| `pnpm dev` | servidor de desenvolvimento |
| `pnpm build` | typecheck (`tsc -b`) + build |
| `pnpm generate:api` | roda o Orval |
| `pnpm check` | Biome (lint + format) |
| `pnpm test` | Vitest |

## Estrutura

```
src/
├── assets/brand/           # SVG do símbolo (exportado do Figma)
├── api/
│   ├── generated/          # saída do Orval (não editar)
│   └── stubs/              # mocks no formato do Orval enquanto o back não existe
├── components/
│   ├── ui/                 # shadcn (pnpm dlx shadcn@latest add <comp>)
│   ├── data-table/         # DataTable + paginação + empty state
│   ├── brand/              # Logo e símbolo da marca
│   ├── layout/             # sidebar, navegação, tema
│   └── <modulo>/           # componentes de cada feature (columns, form, dialog…)
├── config/                 # app.ts, navigation.ts
├── hooks/
│   └── filters/            # createFilterParams + use-<modulo>-filters.ts
├── lib/                    # api-client (mutator), auth, utils
├── providers/              # Query, Auth
├── routes/
│   ├── __root.tsx
│   ├── (auth)/             # login (redireciona se já logado)
│   └── (protected)/        # beforeLoad: ensureAuthenticated()
├── schemas/                # schemas zod dos formulários
├── stores/                 # zustand (tema, permissões)
├── types/
└── utils/                  # env, routes, route-guards, on-error, format-date…
```

## Identidade visual

Fonte de verdade: [Figma — Identidade Visual · Sistema para Devs](https://www.figma.com/design/Xsc2Zp8VO5sNOJpYGFQix5/Identidade-Visual-%E2%80%94-Sistema-para-Devs?node-id=2-19).
Os tokens vivem em `src/styles.css` e estão mapeados nos tokens do shadcn (`primary`, `background`, `border`…).

### Conceito
**Todo time precisa de um acampamento base.** A marca combina o calor da fogueira (brasa, papel)
com a precisão do terminal (mono, grafite).

1. **Calmo, não frenético** — menos notificações, mais clareza. Espaço em branco é funcionalidade.
2. **Feito por quem codifica** — atalhos, markdown, linguagem de commit. Fala a língua do dev.
3. **Quente e humano** — a brasa e o papel do caderno de campo trazem acolhimento.

### Logo — barraca + cursor
O símbolo é uma barraca desenhada como um caractere (`^`) com o cursor do terminal (`_`) aceso na
entrada, como uma fogueira. Lido como código, `^_` também é um rosto sorrindo.

```tsx
import { Logo, LogoSymbol } from "@/components/brand/logo";

<Logo />                                            // horizontal, fundo claro
<Logo wordmarkClassName="text-paper-50" />          // fundo escuro
<LogoSymbol className="size-16" />                  // só o símbolo
```

| Variação | Uso |
| --- | --- |
| Principal claro | interfaces, site e documentação |
| Principal escuro | capa, terminal, apresentações e dark mode |
| Símbolo | favicon, app icon, avatar de bot e CLI |

- **Área de proteção:** respiro igual à altura do símbolo ÷ 2.
- **Tamanho mínimo:** símbolo 16px; logo horizontal 96px de largura.
- **Não faça:** não gire, não aplique gradiente, não troque a fonte do wordmark, não use brasa sobre brasa.

### Cores — brasa, grafite e papel
Paleta quente e contida. **Brasa** só em ações principais e foco; **grafite** e **papel** fazem 90% do trabalho.

No código os nomes estão em inglês: brasa → `ember`, grafite → `graphite`, papel → `paper`,
e os status → `todo`, `in-progress`, `in-review`, `done`, `blocked`, `info`.

| Grupo | Token | Hex | Classe |
| --- | --- | --- | --- |
| Marca | Brasa | `#FF5A1F` | `bg-ember-500` (= `primary`) |
| Marca | Brasa escura | `#E04410` | `bg-ember-600` (hover) |
| Marca | Brasa clara | `#FFE6DA` | `bg-ember-100` |
| Neutro | Grafite 900 | `#14161A` | `bg-graphite-900` (texto, sidebar) |
| Neutro | Grafite 800 | `#1E2128` | `bg-graphite-800` |
| Neutro | Grafite 700 | `#2B2F38` | `bg-graphite-700` |
| Neutro | Grafite 500 | `#5B616E` | `text-graphite-500` (= `muted-foreground`) |
| Neutro | Grafite 300 | `#A9AEB8` | `text-graphite-300` |
| Neutro | Papel 50 | `#FBF9F5` | `bg-paper-50` (= `background`) |
| Neutro | Papel 100 | `#F4F0E8` | `bg-paper-100` (= `muted`) |
| Neutro | Papel 200 | `#E7E1D5` | `border-paper-200` (= `border`) |
| Status | Feito | `#22A867` | `bg-status-done` (= `success`) |
| Status | Em revisão | `#7C5CFF` | `bg-status-in-review` |
| Status | Em andamento | `#F5B02E` | `bg-status-in-progress` (= `warning`) |
| Status | Bloqueado | `#E5484D` | `bg-status-blocked` (= `destructive`) |
| Status | Info | `#3D7BFF` | `bg-status-info` (= `info`) |

**Proporção de uso:** papel 55% · grafite 35% · brasa 10%.

### Tipografia — três vozes, uma conversa
- **Space Grotesk** — personalidade nos títulos e display (`font-display`).
- **Inter** — leitura confortável na interface (`font-sans`, padrão).
- **JetBrains Mono** — código, rótulos, IDs e metadados (`font-mono`).

| Estilo | Fonte | Classe | Exemplo |
| --- | --- | --- | --- |
| Display/XL | Space Grotesk Bold · 72px | `text-display-xl` | O acampamento base |
| Display/L | Space Grotesk Bold · 48px | `text-display-l` | Sprint 42 entregue |
| Heading/H1 | Space Grotesk Bold · 32px | `text-heading-h1` | Refatorar autenticação |
| Heading/H2 | Space Grotesk Medium · 24px | `text-heading-h2` | Discussão: migrar para Postgres 17? |
| Body/L | Inter Regular · 18px | `text-body-l` | Vamos quebrar a migração em três PRs… |
| Body/M | Inter Regular · 15px | `text-body-m` | Ana comentou em “Deploy…” há 5 min. |
| Label/S | Inter Medium · 13px | `text-label-s` | Atribuído a você · vence sexta |
| Code/M | JetBrains Mono Regular · 14px | `text-code-m` | `git checkout -b feat/dc-42-oauth` |
| Code/Label | JetBrains Mono Medium · 12px | `text-code-label` | `DC-42` · `MEUS PROJETOS` |

> Essas classes estão registradas no `cn()` (`src/lib/utils.ts`) como tamanho de fonte — se criar
> uma nova, adicione lá também, senão o `tailwind-merge` a confunde com cor.

### Componentes — peças da oficina
Cantos de 10–16px, bordas finas em papel/200, sombras quase imperceptíveis. Atalhos e IDs em mono
aparecem onde o dev espera.

```tsx
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { StatusTag } from "@/components/ui/status-tag";

<Button size="lg">Novo projeto <Kbd>N</Kbd></Button>                 // primário (brasa)
<Button size="lg" variant="outline">Convidar time</Button>           // secundário
<Button size="lg" variant="dark">Abrir terminal <Kbd>N</Kbd></Button> // escuro

<StatusTag status="todo" />        // todo | in-progress | in-review | done | blocked
```

### Aplicação
Sidebar em **grafite** (o "terminal"), conteúdo em **papel** (o "caderno"). A brasa só aparece no que
pede ação — item ativo da navegação, botão principal, foco.

## Padrões

### Orval
- `orval.config.ts` lê `VITE_API_SWAGGER_URL` e gera em `tags-split` usando `src/lib/api-client.ts` como mutator.
- O `api-client` injeta o Bearer token e faz refresh automático em 401 (com fila de requisições).
- **Queries sem `staleTime`**; após mutations, invalide a key de índice:
  ```ts
  queryClient.invalidateQueries({ queryKey: getIndexXQueryKey() });
  ```

### Autenticação
- `src/lib/auth-api.ts` tem `login`, `me` e `refreshToken` escritos à mão (endpoints em `AUTH_ENDPOINTS`).
  Depois do `generate:api`, troque pelos gerados em `@/api/generated/auth/auth` e
  os tipos de `src/types/auth.ts` pelos models gerados.
- Rotas protegidas ficam em `routes/(protected)/` — o `layout.tsx` chama `ensureAuthenticated()`.
- Permissões: `usePermissions().hasPermission("x")` e `ensureRoutePermissions()` no `beforeLoad`.

### Nova feature de listagem (CRUD)
Use `routes/(protected)/exemplos/` como referência:
1. `hooks/filters/use-<modulo>-filters.ts` → `createFilterParams({ base: true, custom: {...} })`
2. `components/<modulo>/<modulo>-columns.tsx` → `ColumnDef[]` (meta: `grow`, `fit`, `actionIcon`)
3. `routes/(protected)/<rota>/index.tsx` → hook `useIndexX` gerado + `DataTable` + `DataTablePagination`
4. `schemas/<modulo>.ts` → schema zod do formulário
5. Adicione o path em `utils/routes.ts` e o item em `config/navigation.ts`
