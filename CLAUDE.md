# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal website / portfolio for MAXOUXAX (maxouxax.me), built on the T3 Stack conventions (Next.js + tRPC + Tailwind), deployed to Cloudflare Workers via OpenNext.

Tech stack: Next.js 16 (App Router), React 19, tRPC 11, next-intl, Tailwind CSS v4, shadcn/ui (base-luma style, Phosphor icons), Motion, Zod, @t3-oss/env-nextjs, OpenNext.js Cloudflare adapter.

Package manager: **bun** (`bun.lock` is the lockfile — use `bun install` / `bun run <script>`, not npm/yarn/pnpm).

## Commands

- `bun run dev` — start the Next.js dev server
- `bun run build` — production build (`next build`)
- `bun run check` — run both eslint and `tsc --noEmit` (use this as the general "is it green" check)
- `bun run lint` / `bun run lint:fix` — eslint only
- `bun run typecheck` — `tsc --noEmit` only
- `bun run format:check` / `bun run format:write` — Prettier (with `prettier-plugin-tailwindcss`) over `**/*.{ts,tsx,js,jsx,mdx}`
- No test suite / test runner is currently configured in this repo.

Cloudflare deployment (via OpenNext, not `next start` in prod):
- `bun run ci:build` — `opennextjs-cloudflare build`
- `bun run ci:deploy` — `opennextjs-cloudflare deploy`
- `bun run ci:upload` — `opennextjs-cloudflare upload`
- `bun run cf-typegen` — regenerate `cloudflare-env.d.ts` from `wrangler.jsonc` bindings

Other:
- `bun run favicons:generate` — regenerate favicon/manifest icon assets via `scripts/favicon-generation/index.ts`

## Architecture

### Runtime target: Cloudflare Workers, not Node

The app is built with Next.js but actually deployed as a Cloudflare Worker through `@opennextjs/cloudflare` (`open-next.config.ts`, `wrangler.jsonc`). `wrangler.jsonc` declares the Worker name (`maxouxax-portfolio`), a self-referencing service binding (`WORKER_SELF_REFERENCE`), an `ASSETS` binding for static files, and an `IMAGES` binding for Next/Image optimization. Keep this in mind when adding server-side code — anything that assumes a persistent Node.js process or filesystem access outside of build time will not work on Workers. `nodejs_compat` is enabled, so most Node built-ins are usable, but prefer Web APIs where possible.

### Environment variables

All env vars must be declared in `src/env.js` (via `@t3-oss/env-nextjs` + Zod) — both the schema (`server`/`client`) and the `runtimeEnv` mapping. Do not read `process.env` directly elsewhere; import `env` from `~/env`. `.env.example` documents the vars for local setup and must be kept in sync when new vars are added (it is committed; `.env` is not).

### tRPC layout

- `src/server/api/root.ts` — the single `appRouter`; every new router must be registered here.
- `src/server/api/trpc.ts` — core tRPC setup (context, `publicProcedure`, timing middleware). There is currently no auth/session — `publicProcedure` is the only procedure type.
- `src/server/api/routers/*.ts` — one file per sub-router (e.g. `projects.ts`, which proxies the GitHub REST API for `MAXOUXAX`'s repos with a 1-hour `fetch` revalidation cache — no database is used).
- Two client entry points into the same `appRouter`:
  - `src/trpc/server.ts` — RSC/server-side caller (`api`, `HydrateClient`) for use in Server Components.
  - `src/trpc/react.tsx` — `TRPCReactProvider` + `api` hooks for Client Components, using `httpBatchStreamLink` + SuperJSON against `/api/trpc`.
- The HTTP handler lives at `src/app/api/trpc/[trpc]/route.ts`.

### Internationalization

Uses `next-intl`, but locale is **not** part of the URL path (no `[locale]` route segment). Locale resolution is cookie-based:
- `src/services/locale.ts` reads/writes the `NEXT_LOCALE` cookie server-side, falling back to `Accept-Language` parsing, then `defaultLocale`.
- `src/i18n/config.ts` defines supported `locales` (`en`, `fr`) and `defaultLocale` (`en`).
- `src/i18n/request.ts` wires `getUserLocale()` into `next-intl`'s `getRequestConfig`, loading `src/i18n/locales/{locale}.json`.
- Messages live in `src/i18n/locales/en.json` / `fr.json`; add new keys to both files. `src/config/site.ts` also pulls default metadata strings directly from `en.json` as a fallback.

### UI components

`src/components/ui/*` is a large generated shadcn/ui set (style `base-luma`, `neutral` base color, Phosphor icon library — see `components.json`). Treat these as generated primitives: prefer composing/extending them from `src/components/*` rather than hand-editing generated internals unless fixing a real bug. Use the `shadcn` MCP server / CLI to add new components rather than hand-authoring them, to stay consistent with the configured style.

Path aliases (also declared in `tsconfig.json`): `~/components`, `~/components/ui`, `~/lib`, `~/hooks` all resolve under `src/`.

### Middleware

`src/middleware.ts` matches all routes except `_next`, `api`, and `favicon.ico`. It stamps `x-current-path` on the request headers and contains a deliberate workaround for a Next.js Server Actions bug (see comment in file) — when `next-action`/`x-action` headers are present it must pass the request through untouched, so be careful not to reintroduce header mutation on that path.

### Linting/formatting conventions

- ESLint (`eslint.config.js`) extends `eslint-config-next` (core-web-vitals + typescript) plus `typescript-eslint` recommended/recommendedTypeChecked/stylisticTypeChecked, with project-specific overrides: prefer `type` imports (inline style), unused vars prefixed with `_` are allowed, `no-misused-promises` ignores JSX attribute handlers.
- Prettier is the source of truth for formatting (`prettier.config.js`, includes `prettier-plugin-tailwindcss` for class sorting) — run `format:write` rather than hand-formatting.
