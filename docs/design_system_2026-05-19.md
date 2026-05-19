# Design system bootstrap (2026-05-19)

First codified design system for `panacea-front`. Replaces the placeholder Tailwind tokens from the scaffold commit with a proper token layer + light/dark themes documented in `DESIGN.md`.

## How it was synthesised

Three reference systems were extracted via the Ditto MCP from successful health-domain web products, then a fourth was generated to blend them and anchor on Panacea's brand. All four are saved in William's Ditto library.

| Reference | URL | Why |
| --- | --- | --- |
| Doctolib IT | https://www.doctolib.it/ | Direct Italian healthcare precedent. Clarity, trust signals, generous whitespace. |
| One Medical | https://www.onemedical.com/ | Confident primary CTAs, editorial heading scale, dark-teal text colour. |
| Withings | https://www.withings.com/ | Calm neutrals, quiet spacing rhythm, subtle gradient hints, refined typography. |

Forward Health was the original third pick but the domain has resolved out — replaced with Withings.

The Ditto AI Create then synthesised a "Panacea" design from a brief that combined the qualities above with our hard requirements: teal brand anchor, Inter family, 4px spacing grid, light AND dark modes, Italian voice, status-colour gravity.

The AI output was strong on structure but landed on three semantic colours that felt off for clinical data:

- Success `#8bc34a` — too lime; replaced with `#15803d` (green-700) light / `#22c55e` dark.
- Warning `#ffd700` — too candy-yellow; replaced with `#b45309` (amber-700) light / `#f59e0b` dark.
- Error `#ff9999` — pastel pink; replaced with `#b91c1c` (red-700) light / `#ef4444` dark.

Dark mode tokens were missing entirely from the AI output and were authored fresh.

## What changed in the repo

- **New** `DESIGN.md` at the repo root — single source of truth, ~280 lines covering palette, type, spacing, radius, shadows, components, motion, accessibility, AI prompt.
- **New** `src/assets/tokens.css` — raw CSS custom properties for light and dark, plus a `prefers-color-scheme: dark` fallback for users who haven't explicitly chosen a theme.
- **Rewritten** `src/assets/main.css` — Tailwind 4 `@theme` declarations that mirror the tokens, base typography, focus-ring rule, `prefers-reduced-motion` shim, `@custom-variant dark` registration.
- **Updated** `index.html` — preconnect to Google Fonts and preload Inter / Inter Tight / JetBrains Mono.

The existing pages continue to compile: they already used `brand-*`, `surface-*`, and PrimeUI tokens that the new @theme preserves.

## Decisions and trade-offs

- **Single font family (Inter + Inter Tight)** rather than a serif + sans pairing. Reason: a serif would skew either editorial-magazine or fancy-luxury — both wrong for clinical data. Inter Tight on headings gives us editorial weight without departing from the family.
- **Sky accent reserved exclusively for delegation moments.** Reads as "shared with someone you trust". Should never be used for ordinary CTAs (those stay teal) or this distinctness collapses.
- **Shadows kept minimal.** Clinical apps shouldn't feel like they're hovering. Borders carry hierarchy; shadows whisper.
- **Italian voice anchored in `tu` form.** Decision is final — `lei` form felt distant and "Ministry of Health" rather than companion-like. Reviewable post-PMF.
- **Dark mode opt-in via `.dark` class with `prefers-color-scheme: dark` fallback.** Users who haven't toggled get system default; users who explicitly toggle override the system.
- **Persistent "Operi per conto di X" banner** is part of the design system, not just a one-off component. When the delegation system ships in commit 3 the banner will be implemented from the spec in `DESIGN.md` § Banner.

## What is not in this commit

- Logo. The Ditto placeholder mark is referenced; a real Panacea logo is pending design work.
- Email templates (Resend + React Email) — will use the same tokens when they ship in Phase 1 of the backend roadmap.
- Component implementations (Button, Card, Input wrappers around PrimeVue with our token bindings). The current pages still call PrimeVue components directly with Tailwind utility classes; component-level standardisation is a follow-up.

## How to verify locally

```sh
cd /Users/w/Panacea/web
pnpm install
pnpm dev
```

Open `http://localhost:5173`, toggle dark mode by running `document.documentElement.classList.toggle('dark')` in DevTools, verify nothing breaks.
