# Lowe

Template de projeto full-stack em Bun: API com **Elysia**, frontend **React 19** com **Tailwind v4 + shadcn/ui**, banco **PostgreSQL** (Drizzle) e telemetria completa com **OpenTelemetry → OpenObserve**.

## Stack

- **Runtime / bundler:** Bun (sem Node, sem Vite)
- **API:** Elysia, OpenAPI em `/openapi`, cliente tipado com Eden Treaty
- **Frontend:** React 19, Tailwind CSS v4, shadcn/ui
- **Banco:** PostgreSQL + Drizzle ORM (`drizzle-kit push`, sem migrations)
- **Observabilidade:** traces, logs e métricas via OTLP (backend) e OpenObserve RUM + traces (frontend)
- **Qualidade:** ESLint, Prettier, testes com 100% de cobertura obrigatória
- **CI/CD:** GitHub Actions (review por IA, testes, release, imagem Docker no ghcr, deploy via Coolify)

## Começando

```bash
bun install
cp .env.example .env.local   # preencha DATABASE_URL e as variáveis OTEL_* / PUBLIC_RUM_*
bun run dev                  # http://localhost:3000
```

Sem `PUBLIC_RUM_TOKEN` a telemetria do frontend fica desligada e a página renderiza normalmente.

## Scripts

| Comando             | O que faz                                   |
| ------------------- | ------------------------------------------- |
| `bun run dev`       | Servidor com watch (API + frontend)         |
| `bun run lint`      | ESLint (`lint:fix` para corrigir)           |
| `bun run format`    | Prettier                                    |
| `bun run typecheck` | `tsc --noEmit`                              |
| `bun run test`      | Testes + checagem de cobertura de 100%      |
| `bun run db:sync`   | Aplica o schema no Postgres (`drizzle-kit`) |
| `bun run db:studio` | Drizzle Studio                              |

## Estrutura

```text
server/
├── index.ts            # monta o app Elysia e o Bun.serve
├── openapi.ts
├── db/                 # Drizzle + schema
├── instrumentation/    # OTEL: HTTP, fetch, DB, logs, métricas
└── modules/<domínio>/  # um Elysia por módulo
public/
├── index.html / index.tsx
├── components/ui/      # shadcn
└── instrumentFrontend.ts
test/                   # espelha server/ e public/
```

Mais detalhes para trabalhar no repositório em [`CLAUDE.md`](./CLAUDE.md).

## Usando como template

Clique em **Use this template** no GitHub e depois ajuste o nome em `package.json`, `server/instrumentation/resource.ts` (`OTEL_SERVICE_NAME`), `public/instrumentFrontend.ts`, `public/index.html`, `server/openapi.ts` e `docker-compose.yml`.

## Licença

[MIT](./LICENSE) © Guilherme da Silva Benevides
