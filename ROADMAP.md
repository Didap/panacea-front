# panacea-front roadmap

## Phase 0 — Scaffolding (in progress, 2026-05-19)

- [x] Vite + Vue 3 + TypeScript bootstrap
- [x] Tailwind 4 + PrimeVue Aura + lucide-vue-next
- [x] Pinia, Vue Router with auth + role guards, vue-i18n (it)
- [x] Axios client with 401 refresh interceptor
- [x] Error-code -> i18n key mapping
- [x] Login + register pages, citizen home (documents), doctor home (placeholder)
- [x] Auth recovery pages: email verification, password reset, forgot-password (2026-06-05, see `docs/auth_pages_2026-06-05.md`)
- [x] Vitest + Vue Test Utils on happy-dom (first specs land with the deleghe UI, 2026-06-05)
- [x] CI workflow (lint + typecheck + build + test) (2026-06-05, see `docs/ci_2026-06-05.md`)

## Phase 1 — Patient documents UX

- [x] Citizen sees own documents list, can upload, download, soft-delete
- [ ] Drag-and-drop upload with progress
- [ ] Inline PDF preview, image lightbox
- [ ] Filter by category, search by title
- [ ] Empty/error/loading states polished

## Phase 2 — Doctor side (after delegation system)

- [x] List of patients who delegated me (the "Dati a cui accedo" section of `/deleghe`)
- [x] Per-patient record via "Operi per conto di" (`/deleghe/cartella`, scoped by `X-Acting-As`)
- [ ] Per-patient timeline / richer document view (currently the standard documents panel)

## Phase 4 — Delegation UX (deleghe), commit 3/3 (2026-06-05)

Full design: backend `docs/delegations_design_2026-05-19.md`. Work log:
`docs/delegations_web_2026-06-05.md`.

- [x] `Richiedi delega` form (citizen-to-citizen), 16-char fiscal-code validation
- [x] Invitation accept flow at `/inviti/:token` (existing account + create-account, OTP, reject)
- [x] Mandate list at `/deleghe` (active by default, toggle for scaduti/revocati), revoke
- [x] Acting-as session + persistent "Operi per conto di {Nome}" banner + "Torna a te stesso"
- [x] Delegated record view `/deleghe/cartella` (shared `DocumentsPanel`)
- [x] Doctor sub-delegation UI + inline revoke landing `/deleghe/:id/revoca`
- [x] i18n for deleghe/inviti/actingAs + delegation/OTP error codes
- [x] Vitest specs: acting-as store, request dialog, invitation page (9 tests)

## Phase 3 — Design system

- [x] `DESIGN.md` synthesised via Ditto MCP from Doctolib IT + One Medical + Withings (2026-05-19)
- [x] `tokens.css` light + dark with WCAG AA semantic colours
- [x] Tailwind 4 `@theme` aligned to tokens, Inter + Inter Tight + JetBrains Mono wired in `index.html`
- [ ] Theme toggle component + persisted preference
- [ ] Component wrappers (Button, Card, Input, Badge) binding PrimeVue Aura to our tokens
- [ ] Mobile-first responsive audit pass (precursor to native mobile)
- [ ] Logo design (currently using Lucide marks as placeholder)
