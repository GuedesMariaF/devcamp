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
├── api/
│   ├── generated/          # saída do Orval (não editar)
│   └── stubs/              # mocks no formato do Orval enquanto o back não existe
├── components/
│   ├── ui/                 # shadcn (pnpm dlx shadcn@latest add <comp>)
│   ├── data-table/         # DataTable + paginação + empty state
│   ├── layout/             # header, footer, navegação, tema
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
