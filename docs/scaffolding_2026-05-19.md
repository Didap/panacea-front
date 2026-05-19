# Scaffolding 2026-05-19

First commit of `panacea-front`. Vue 3 + Vite + Tailwind 4 + PrimeVue (Aura) + Pinia + Vue Router + vue-i18n SPA.

## What ships

- **Bootstrap**: Vite + Vue 3 + TypeScript strict, Tailwind 4 via `@tailwindcss/vite`, PrimeVue with the Aura theme, Pinia and vue-router wired in `src/main.ts`.
- **Auth**: Pinia `auth` store holds access token in memory and decodes the user from the JWT payload. Refresh token in `sessionStorage` for dev (HttpOnly cookie in prod). Axios instance in `src/api/client.ts` injects the bearer header and intercepts 401s with a singleton-promise refresh flow to avoid stampedes.
- **Pages**: `LoginPage`, `RegisterPage` (role toggle between patient and doctor, with doctor-only fields), `CitizenHomePage` (lists patient's own documents, upload dialog with category/taken-at/notes, download, soft-delete with confirm), `DoctorHomePage` (placeholder pending delegation system), `NotFoundPage`.
- **Routing**: nested layout in `AppShell`, public `/login` and `/register`, default `/` redirects to the role-specific home. Role-aware guards prevent doctors from landing on the patient page and vice versa.
- **i18n**: single `it` locale in `src/i18n/locales/it.json` with sections for `auth`, `citizen`, `doctor`, `documents`, `common`, `errors`. `errors.<CODE>` keys mirror the backend error registry, so `errorKey()` in `lib/error-mapping.ts` turns any Axios failure into a translatable message.
- **Design**: Tailwind 4 with brand teal tokens (`--color-brand-*`) and Inter sans-serif. PrimeVue components are styled by Aura with the `tailwindcss-primeui` plugin so `bg-surface-*` and `text-primary` work as expected.

## What is deferred

- **Vite+ (`vp`) toolchain**: Cityfix backoffice uses Vite+. For day-one velocity we kept plain Vite + ESLint + Prettier. Migration is on the post-MVP roadmap.
- **Real refresh-cookie**: prod will move the refresh token to an HttpOnly cookie set by the backend.
- **Drag-and-drop upload, inline preview, search/filter**: post-MVP polish.
- **Empty/loading/error skeletons**: simple text states for now.
- **Dark mode + accessibility audit**: planned in Phase 3 of `ROADMAP.md`.

## Trade-offs

- **JWT decoded client-side to read role**: avoids an extra `/users/me` round-trip on every page load, but tampering with the access token only fools the UI, not the backend (every protected call is re-validated server-side).
- **`sessionStorage` over `localStorage` for the refresh token**: same-origin XSS still reads it, but at least closing the tab clears it. Acceptable for dev. Prod must switch to HttpOnly cookie.
- **Single SPA serving both roles**: simplest path to ship. Once the doctor product grows, we can lazy-load entire role bundles or split into two apps.
