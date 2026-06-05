# Delegations UX (deleghe) - web - 2026-06-05

Closes Phase 3 commit 3/3: the whole web surface for the delegation system. The backend
(controllers, RLS, notifications, cron, `X-Acting-As`) already existed; this adds the UI and the
acting-as session plumbing, against the enriched `GET /delegations` shipped in panacea-back the same
day.

## Model

The future delegate initiates a request (`POST /delegation-requests`, targeting the data owner's
email + fiscal code). The data owner accepts via the invitation link. In a `Delegation`,
`delegatorUserId` is the data owner, `delegateUserId` is who gains access. To act on the owner's
record the delegate sends `X-Acting-As: <delegatorUserId>` on `/documents`.

## What landed

- `api/delegations.api.ts`: client for all endpoints (request/cancel/list-mine, invitation
  lookup/otp/accept/accept-and-signup/reject, list/revoke/sub-delegate).
- `stores/acting-as.ts`: Pinia store holding the data owner being operated on, persisted in
  `sessionStorage` so the banner survives a reload. `api/client.ts` attaches `X-Acting-As` from it
  on non-auth requests.
- `components/DocumentsPanel.vue`: the documents list/upload/download/delete extracted from
  `CitizenHomePage` (now a thin wrapper) so the same panel serves the citizen's own record and the
  delegated record. It uses `documentsApi`, which carries the acting-as header automatically.
- `pages/DelegationsPage.vue` (`/deleghe`): two sections, "Dati a cui accedo" (as delegate, with
  "Operi per conto di {Nome}", revoke, and sub-delega when `canSubDelegate`) and "Chi accede ai miei
  dati" (as delegator, with revoke), an inactive toggle, pending-invites section, and the request
  dialog.
- `pages/InvitationPage.vue` (`/inviti/:token`, public): lookup, OTP request, then accept for an
  existing logged-in account ("Concedi delega") or create-account-and-accept for a new user
  (auto-login afterward since the signup endpoint issues no tokens), plus reject.
- `pages/DelegatedRecordPage.vue` (`/deleghe/cartella`): the delegated record view; redirects to
  `/deleghe` if no acting-as session. Needed because a doctor delegate does not pass the
  patient-only guard on the citizen home.
- `pages/RevokeDelegationPage.vue` (`/deleghe/:id/revoca`): landing from the sub-delegation notice
  email; confirms and revokes by id.
- `components/{RequestDelegationDialog,SubDelegateDialog,ActingAsBanner}.vue`: request form (16-char
  fiscal-code validation), doctor-to-doctor sub-delega form, and the persistent accent banner
  ("Operi per conto di {Nome}" / "Torna a te stesso") mounted in `AppShell`.
- `layouts/AppShell.vue`: nav links (Home, Deleghe) + the banner. `pages/DoctorHomePage.vue`: CTA
  into the deleghe area. `router/index.ts`: the public invitation route and three authenticated
  deleghe routes.
- `i18n/locales/it.json`: `deleghe`, `inviti`, `actingAs` namespaces, `nav.deleghe`, and the new
  `DELEGATION_*` / `OTP_*` / `ACTING_AS_NOT_ALLOWED` error keys (mapped via the generic
  `error-mapping.ts`).

Design system: accent sky for delegation moments (invitation card, banner, "accedo" section); brand
teal for owner-side; CTA vocabulary per `DESIGN.md` ("Richiedi delega", "Concedi delega",
"Revoca delega", "Operi per conto di {Nome}", "Torna a te stesso").

## Tests

Vitest + Vue Test Utils (happy-dom): `acting-as` store (actAs/clear + sessionStorage hydration),
`RequestDelegationDialog` (email normalization + fiscal-code gating), `InvitationPage` (renders
requester, OTP step gating, closed-state message). 3 files, 9 tests green.

## Pre-existing build/test fixes (uncovered while wiring tests)

- `tsconfig.node.json` extended `@vue/tsconfig/tsconfig.node.json`, removed in `@vue/tsconfig@0.7`;
  now extends `@vue/tsconfig/tsconfig.json`. Without this, vitest could not parse the project.
- `vite.config.ts` declared a `test` block but imported `defineConfig` from `vite` (no `test` in its
  type); now imported from `vitest/config`, so `vue-tsc -b` build passes.

## Review follow-ups (Cristiano)

- Acting-as session isolation: `auth.clear()` (logout, failed-refresh) and `auth.setTokens()` (any
  new login, including accept-and-signup) now clear the acting-as store. Without this a second user
  on the same tab could inherit the first user's `X-Acting-As` on Art.9 health data. Covered by
  `stores/auth.spec.ts`.
- `X-Acting-As` is now attached only to `/documents` (the sole route the backend reads it on),
  an allowlist instead of "everything except /auth".
- `error-mapping.ts` falls back to `errors.UNKNOWN` when a code has no i18n key (via `te`), so an
  unmapped backend code never renders a raw `errors.SOMETHING` string.

Known limit: `RevokeDelegationPage` resolves a single delegation by id by fetching the full
`/delegations` list and `find()`-ing it (no `GET /delegations/:id` endpoint yet). Acceptable for the
low-traffic email-landing path; revisit if an id endpoint lands.

## Verification

`npm run typecheck`, `npm run lint` (0 errors), `npm run build`, `npm run test` (11/11) all pass.
Manual end-to-end against the backend (console notifications driver prints OTP + invite URL): request
-> accept via `/inviti/:token` -> mandate visible on both sides -> "Operi per conto di" scopes the
documents via `X-Acting-As` with the banner shown -> "Torna a te stesso" clears it.
