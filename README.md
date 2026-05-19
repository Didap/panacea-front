# panacea-front

Vue 3 + Vite + Tailwind 4 + PrimeVue (Aura) + Pinia + Vue Router + vue-i18n SPA for Panacea. Git remote: `https://github.com/Didap/panacea-front.git`.

## Run

```sh
pnpm install
cp .env.example .env
pnpm dev          # http://localhost:5173
```

The dev server expects `panacea-backend` at `http://localhost:3000/api/v1` (configurable via `VITE_API_BASE_URL`).

## Commands

| script | purpose |
| --- | --- |
| `pnpm dev` | Vite dev server |
| `pnpm build` | typecheck + production build |
| `pnpm preview` | preview built bundle |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `vue-tsc --noEmit` |
| `pnpm test` | Vitest unit + component tests |

## Stack note

Tooling is plain Vite for the Fase 0 scaffold. Migrating to **Vite+ (`vp`)** is on the post-MVP roadmap to match the Cityfix backoffice toolchain.
