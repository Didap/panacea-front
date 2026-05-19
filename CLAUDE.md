# Web — agent guide

Vue 3 SPA, role-aware. One frontend serves `patient`, `doctor`, and (later) `institution_admin` views.

## Layout

```
src/
  main.ts                 boot: pinia, router, i18n, primevue, tailwind
  App.vue                 root layout host
  router/index.ts         routes + auth guard + role guard
  stores/auth.ts          pinia, holds access token (memory) + minimal user
  api/
    client.ts             axios instance + 401 refresh interceptor (singleton promise)
    auth.api.ts
    documents.api.ts
  lib/
    token-storage.ts      sessionStorage for refresh token (dev); httpOnly cookie in prod
    error-mapping.ts      map ErrorCode -> i18n key
  i18n/
    index.ts
    locales/it.json
  layouts/AppShell.vue    sidebar + header + outlet
  pages/
    LoginPage.vue
    RegisterPage.vue
    CitizenHomePage.vue
    DoctorHomePage.vue
    NotFoundPage.vue
```

## Design system

`DESIGN.md` at the repo root is the single source of truth for visual language. Read it before touching any UI. Rationale and synthesis history live in `docs/design_system_2026-05-19.md`. Raw CSS tokens (light + dark) are in `src/assets/tokens.css`; Tailwind 4 `@theme` declarations that mirror them are in `src/assets/main.css`.

In short: brand teal `#0f766e` on white/near-black, sky-blue accent reserved for delegation moments, Inter / Inter Tight typography, 4px spacing grid, radius 6/10/16, subtle shadows, status colours muted (gravity not alarm), light + dark with WCAG AA, persistent "Operi per conto di X" banner when in a delegated session.

## Conventions

- **Components & pages: PascalCase**. Composables: `useXxx`. API client modules end in `.api.ts`.
- **Tailwind + PrimeVue Aura**. Tokens come from the design system above. Icons from `lucide-vue-next` only. No PrimeIcons.
- **No ad-hoc hex values.** If a colour isn't in `tokens.css`, either it doesn't belong or the design system needs a new token (PR `DESIGN.md` + `tokens.css` together).
- **i18n is mandatory** for user-facing strings. No hard-coded Italian in templates. Single locale `it` in v0, add `en` later.
- **All API calls through `api/client.ts`**. Never `fetch` or `axios.create` outside it. Interceptors handle token refresh and surface error codes.
- **Error UX**: every catch maps backend `code` to an i18n key via `error-mapping.ts`. Never display raw `message` from backend to users.
- **State**: Pinia composition API stores. Auth token in memory (Pinia state), refresh in `sessionStorage` in v0 (HttpOnly cookie in prod). Never put either token in `localStorage`.
