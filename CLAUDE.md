# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Edelfalter is a Bun-only app: an Elysia API plus a React 19 frontend (Tailwind v4 + shadcn), traced end-to-end with OpenTelemetry → OpenObserve. It deliberately mirrors the structure of `gsbenevides2/integra` (same instrumentation, workflows and conventions), so look there for a reference implementation when adding something new.

## Commands

```bash
bun install
bun run dev              # bun --watch server/index.ts, serves API + frontend on :3000
bun run lint             # eslint (lint:fix to autofix); bun run format = prettier --write .
bun run typecheck        # tsc --noEmit
bun run test             # bun test + test/check-coverage.ts (both must pass)
bun test test/server/modules/hello/index.test.ts   # single file
bun test -t "name"       # single test by name
bun run db:sync          # drizzle-kit push (schema-push, no migrations folder)
bun run db:studio
```

Config comes from `.env.local` (copy `.env.example`): `DATABASE_URL`, `OTEL_EXPORTER_OTLP_ENDPOINT`/`_HEADERS`, and `PUBLIC_RUM_*` for the frontend. Ask before running `db:sync` against a shared database.

## Architecture

- **Single process.** `server/index.ts` builds one Elysia app (`elysiaOtel` → `openapi` → one Elysia instance per module under `server/modules/<domain>/`, each `.use()`'d explicitly) and hands it to `Bun.serve`. `"/"` is served by Bun's HTML route (`routes: { "/": indexHtml }`) because the OTEL plugin overrides Elysia's native home response; `app.fetch` handles everything else.
- **Frontend is bundled by Bun itself** (`public/index.html` → `public/index.tsx`), with `bun-plugin-tailwind` configured in `bunfig.toml` (`[serve.static]`, `PUBLIC_*` env inlined). No Vite.
- **Type-safe client.** Frontend calls the API through Eden Treaty clients (`public/hello-client.ts`) typed from the module's Elysia instance via `import type ... from "@server/modules/..."`. Routes live under `/api/...`.
- **Telemetry** (`server/instrumentation/`): `instrumentFetch()` patches global `fetch` (plain `fetch` is already traced; pass `skipInstrumentation: true` to bypass), `instrumentDb` wraps Bun `SQL` for Drizzle (`server/db/index.ts`), `withSpan` for manual spans, `getLogger`/`logInfo/logWarn/logError` instead of `console.*`. All share `appResource`. `POST /v1/traces` proxies browser spans to the collector so the auth header never reaches the bundle. `flushTelemetryOnExit()` flushes on SIGTERM/SIGINT.
- **Frontend telemetry** (`public/instrumentFrontend.ts`) is a no-op without `PUBLIC_RUM_TOKEN`, so the app renders before OpenObserve is configured.
- **shadcn** uses aliases onto `@public/*` (see `components.json`): UI in `public/components/ui`, `cn` in `public/lib/utils.ts`, theme tokens in `public/styles/global.css`.
- Path aliases: `@server/*`, `@public/*`.

## Gotchas

- **Pinned versions:** `typescript` must stay `^6` (typescript-eslint doesn't support TS 7), and the `@opentelemetry/*-logs` / `api-logs` packages must stay `^0.200.0` (newer ones break `instrumentLogger`).
- **ESLint:** `eslint-plugin-react` needs the explicit `version: "19"` (`"detect"` crashes on ESLint 10). Import order is enforced by `simple-import-sort` (React first in `.tsx`, then `@server`/`@public`, then packages, then relative) — run `lint:fix` rather than ordering by hand. `css/no-invalid-at-rules` and tailwind `enforce-consistent-line-wrapping` are off on purpose.
- **Tests:** 100% line/function/statement coverage is enforced (`bunfig.toml`), and `test/check-coverage.ts` fails if any `server/**`/`public/**` source file is never loaded by a test (type-only files excepted). Tests mirror the source tree under `test/`, run under happy-dom (`test/setup.ts`). Tests that import `server/index.ts` must stub `Bun.serve` and `process.once`.
- `server/db/schema.ts` is currently empty; when tables are added, add a schema test like integra's `test/server/db/db.test.ts`.
- `bun build --compile` is not used; the Docker image runs from source (`bun run server/index.ts`).

## CI / release

`.github/workflows/pr.yml` (AI PR review, lint + typecheck + tests, docker build) and `release.yml` (on `package.json` version change on `main`: tests, AI release notes + tag, push image to ghcr, trigger Coolify). Bumping `version` in `package.json` is what releases; `prepare-release.sh` compares against `HEAD~1`. `TOKEN_GITHUB` is only used for ghcr login and the releases API — the image build takes no build-args.
