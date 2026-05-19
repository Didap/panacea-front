# panacea-front roadmap

## Phase 0 — Scaffolding (in progress, 2026-05-19)

- [x] Vite + Vue 3 + TypeScript bootstrap
- [x] Tailwind 4 + PrimeVue Aura + lucide-vue-next
- [x] Pinia, Vue Router with auth + role guards, vue-i18n (it)
- [x] Axios client with 401 refresh interceptor
- [x] Error-code -> i18n key mapping
- [x] Login + register pages, citizen home (documents), doctor home (placeholder)
- [ ] CI workflow (typecheck + lint + tests)
- [ ] Vitest setup with happy-dom

## Phase 1 — Patient documents UX

- [x] Citizen sees own documents list, can upload, download, soft-delete
- [ ] Drag-and-drop upload with progress
- [ ] Inline PDF preview, image lightbox
- [ ] Filter by category, search by title
- [ ] Empty/error/loading states polished

## Phase 2 — Doctor side (after delegation system)

- [ ] List of patients who delegated me
- [ ] Per-patient timeline of documents
- [ ] Read-only access enforced by backend RLS

## Phase 3 — Design system polish

- [ ] Tailwind tokens for clinical palette (calm, accessible, AA contrast)
- [ ] Dark mode
- [ ] Mobile-first responsive layouts (precursor to native mobile)
