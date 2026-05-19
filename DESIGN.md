# Panacea — Design System

Single source of truth for visual language in `panacea-front`. Generated 2026-05-19 from a Ditto AI synthesis of three medical-app references (Doctolib IT, One Medical, Withings), then refined for clinical-data gravity and dark-mode support.

The DNA in one paragraph:

> Calm and clinical-modern. Teal primary on white or near-black surfaces; quiet neutrals; editorial headings; generous spacing on a 4px grid. Status colours carry **gravity, not alarm** — error is a muted warm red, not Coca-Cola red. Two-mode by default (light and dark) for medical professionals working night shifts. WCAG AA contrast everywhere.

## Quick reference

| Token | Light | Dark |
| --- | --- | --- |
| Primary (brand) | `#0f766e` (teal-700) | `#14b8a6` (teal-500) |
| Accent (delegation, sharing) | `#0284c7` (sky-600) | `#38bdf8` (sky-400) |
| Background | `#ffffff` | `#0b1220` |
| Surface | `#f8fafc` (slate-50) | `#111827` |
| Surface raised | `#ffffff` | `#1f2937` |
| Border | `#e2e8f0` (slate-200) | `#27324a` |
| Text primary | `#0f172a` (slate-900) | `#f8fafc` |
| Text secondary | `#334155` (slate-700) | `#cbd5e1` |
| Text muted | `#64748b` (slate-500) | `#94a3b8` |
| Success | `#15803d` (green-700) | `#22c55e` (green-500) |
| Warning | `#b45309` (amber-700) | `#f59e0b` (amber-500) |
| Error | `#b91c1c` (red-700) | `#ef4444` (red-500) |

Headings: **Inter Tight** 600. Body: **Inter** 400–500. Mono: **JetBrains Mono** 500 for codes (OTP, request IDs).

Radius: **6 / 10 / 16** (sm / md / lg). Pill = `9999px`.

Spacing on a strict 4px grid: **4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64**.

## Influences and what we took from each

The synthesis blends three references — see `docs/design_system_2026-05-19.md` for the full reasoning.

- **Doctolib IT** — palette confidence, generous whitespace, Italian-healthcare voice. We **kept** the light-blue surface affinity but anchored the primary in our own teal.
- **One Medical** — editorial heading scale (we cap at 48px instead of 88px because this is a tool, not a marketing site), confident solid-fill primary buttons, dark-teal text colour.
- **Withings** — calm neutrals, subtle shadows, slow easing, refined gradient hints. We **kept** the "do not feel lifted up, feel grounded" shadow philosophy.

## Voice

- Hero: **La tua salute, finalmente nelle tue mani.**
- Sub: **Custodisci, condividi, deleghi — con la stessa cura con cui ti fidi del tuo medico.**
- Italian, professional but warm. Never patronising. Address the user as `tu`, not `lei`.
- Always say what the action does, not what we'd love them to think about it. "Carica documento" > "Aggiungi alla tua cartella". "Concedi delega" > "Apri il tuo fascicolo a chi ami".

CTA vocabulary: `Carica documento`, `Concedi delega`, `Revoca delega`, `Apri invito`, `Operi per conto di {Nome}`, `Torna a te stesso` (when exiting a delegated view).

## Colours in detail

### Brand — teal

Anchors trust and clinical reliability. Used for primary buttons, active links, focused inputs, and any "this is the action" moment.

| Token | Light | Use |
| --- | --- | --- |
| `--color-brand-50` | `#f0fdfa` | Subtle hover backgrounds, banner washes |
| `--color-brand-100` | `#ccfbf1` | Selected-state backgrounds |
| `--color-brand-300` | `#5eead4` | Light accents in illustrations |
| `--color-brand-500` | `#14b8a6` | Iconography accents, ring colours |
| `--color-brand-600` | `#0d9488` | Secondary CTAs, hover state of primary in dark mode |
| `--color-brand-700` | `#0f766e` | **Primary** — solid CTAs, focused links |
| `--color-brand-800` | `#115e59` | Hover state of `brand-700` in light mode |
| `--color-brand-900` | `#134e4a` | Pressed state, deep brand moments |

### Accent — sky

Reserved for *delegation* moments: invitation banners, "operating on behalf of" headers, share buttons. Distinct enough from teal that the user instantly registers "this is a shared/delegated action".

| Token | Light | Use |
| --- | --- | --- |
| `--color-accent-100` | `#e0f2fe` | Delegation banner background |
| `--color-accent-500` | `#0ea5e9` | "Shared with you" indicators |
| `--color-accent-600` | `#0284c7` | Primary in accent-flavoured CTAs |
| `--color-accent-700` | `#0369a1` | Hover/pressed accent CTAs |

### Surfaces (slate scale)

Slate-50 through 900. We use slate (not pure gray, not blue-gray) because it pairs naturally with teal — green-leaning neutrals feel medical without being sterile.

### Semantic — gravity, not alarm

- **Success** `#15803d` — calm green, "you did it, it's saved" — not "you levelled up".
- **Warning** `#b45309` — burnt amber, "look carefully before continuing" — not screaming yellow.
- **Error** `#b91c1c` — muted warm red, "this is serious" — not "alarm bell".

Dark-mode equivalents shift one or two tints lighter so they remain visible against dark surfaces.

## Typography

Single family for cohesion: **Inter** for body, **Inter Tight** for headings.

Inter is open-source, broad-language (Italian-friendly), and free of warmth that would clash with the clinical tone.

| Role | Family | Size | Weight | Line height | Letter spacing |
| --- | --- | --- | --- | --- | --- |
| Display | Inter Tight | 48px / 3rem | 700 | 1.1 | -0.025em |
| Title | Inter Tight | 32px / 2rem | 700 | 1.15 | -0.02em |
| Heading | Inter Tight | 24px / 1.5rem | 600 | 1.2 | -0.015em |
| Subheading | Inter | 20px / 1.25rem | 600 | 1.4 | -0.005em |
| Body | Inter | 16px / 1rem | 400 | 1.5 | 0 |
| Body strong | Inter | 16px / 1rem | 500 | 1.5 | 0 |
| Small | Inter | 14px / 0.875rem | 400 | 1.5 | 0 |
| Caption | Inter | 12px / 0.75rem | 500 | 1.4 | 0.02em |
| Mono | JetBrains Mono | 14px / 0.875rem | 500 | 1.4 | 0 |

Use Mono sparingly: OTP codes during invitation acceptance, request IDs in error states, debug surfaces.

## Spacing

Strict 4px grid. If you need a value outside the scale, you are probably solving the wrong problem.

| Token | px | rem | Typical use |
| --- | --- | --- | --- |
| 0.5 | 4 | 0.25 | Icon-to-label gaps |
| 1 | 8 | 0.5 | Tight stacks, list-item gaps |
| 1.5 | 12 | 0.75 | Form-field internal padding |
| 2 | 16 | 1 | Default control padding, card content gap |
| 3 | 24 | 1.5 | Card padding, section internals |
| 4 | 32 | 2 | Section separators, page padding mobile |
| 5 | 40 | 2.5 | Hero internal spacing |
| 6 | 48 | 3 | Section spacing, page padding desktop |
| 8 | 64 | 4 | Major section breaks, hero margins |

## Radius

- `--radius-sm: 6px` — chips, badges, small inputs.
- `--radius-md: 10px` — buttons, default inputs, alerts.
- `--radius-lg: 16px` — cards, dialogs, modal panels.
- `--radius-full: 9999px` — avatars, pill toggles.

Never mix sizes on the same surface level. A card at 16px with a button at 6px inside it reads "designed by accident".

## Shadows — grounded, not lifted

Clinical apps should not feel like everything is hovering. Shadows are subtle, signal hierarchy, never decorate.

```css
--shadow-sm: 0 1px 2px rgb(15 23 42 / 0.06);
--shadow-md: 0 1px 3px rgb(15 23 42 / 0.06), 0 4px 12px rgb(15 23 42 / 0.04);
--shadow-lg: 0 4px 20px rgb(15 23 42 / 0.08);
--shadow-focus: 0 0 0 3px rgb(15 118 110 / 0.25);
```

In dark mode the same shadows are barely visible; rely on borders instead.

## Components

### Buttons

- **Primary** — solid `brand-700` on light, `brand-600` on dark; white text; radius `md`; padding `0.5rem 1.25rem` (sm) / `0.75rem 1.5rem` (md) / `1rem 2rem` (lg).
- **Secondary** — outline; transparent background; `brand-700` text and 1px border; same radius.
- **Tertiary / ghost** — no border; `text-secondary`; uses `surface` hover background.
- **Accent** — for delegation flows only; solid `accent-600` on light, `accent-500` on dark.
- **Danger** — solid `error`; reserved for revoke / delete confirmation; never primary action without a confirm dialog.
- **Disabled** — opacity 0.4, cursor `not-allowed`, no hover state.

Focus ring on every interactive element: `--shadow-focus`. Always visible, never `outline: none` without replacement.

### Cards

- Surface `--color-surface`, border 1px `--color-border`, radius `lg`, padding `1.5rem`.
- Shadow: `--shadow-sm` resting, `--shadow-md` on hover when card is clickable.
- Never two cards inside another card. Use sections separated by spacing instead.

### Inputs

- Surface `--color-surface-raised` (white on light, near-black-lighter on dark), border `--color-border`, radius `md`.
- Focus: border switches to `brand-700`, plus `--shadow-focus` ring.
- Label above the field, 14px weight 500, gap `0.5rem`.
- Helper text below in `--color-text-muted`, 12px.
- Error state: border `error`, helper text `error`.

### Badges

- Background = colour at 12% alpha. Text = colour at full strength. No border.
- Radius `sm`. Padding `0.125rem 0.5rem`. 12px weight 500 caps-letter-spacing.

### Banner — "Operi per conto di X"

The most distinctive component in the system. When a delegate has switched into someone's record, a banner sits **persistent** below the top nav.

- Full width, height `2.5rem`.
- Background `--color-accent-100`, top + bottom 1px border `--color-accent-200`.
- Icon (Lucide `Users` or `UserCheck`) + text + `Torna a te stesso` button on the right.
- Text in `--color-accent-700`, weight 500.
- In dark mode: background `rgb(2 132 199 / 0.15)`, border `--color-accent-600`.

This banner is non-negotiable in any delegate flow. Treat it as a permanent reminder that the data you are seeing isn't yours.

## Motion

Calm by default.

- Hover, focus, press: **150ms ease-out**.
- Layout shifts (open/close, expand): **220ms cubic-bezier(0.2, 0, 0, 1)**.
- Modal/dialog: **180ms ease-out** for fade + 6px translate.
- Reduced motion: respect `prefers-reduced-motion`; replace translates with opacity-only fades.

Never animate longer than 250ms in transactional UI. Save the slow stuff for the marketing site.

## Iconography

[lucide-vue-next](https://lucide.dev) only. Pick sizes from `16 / 20 / 24`. Stroke width `1.5` on light, `1.75` on dark for legibility. Never mix Lucide with Material or Bootstrap icons in the same view.

## Accessibility floor

- Contrast: WCAG AA minimum on text, AAA goal on body copy.
- Focus indicator: always visible, never replaced by colour alone.
- Touch target: minimum 44×44 on mobile.
- Form labels: explicit `for=` / `aria-labelledby`, no placeholder-as-label.
- Errors: announced via `aria-live="polite"` to screen readers.
- Language: `html lang="it"` for the SPA; per-element `lang=` when displaying foreign-language content.

## AI Create Prompt

```
Design system "Panacea". Italian healthcare app for citizens managing their cartella clinica and delegating access. Calm, clinical-modern, discreet. Primary teal #0f766e (brand-700) on white; sky-blue accent #0284c7 reserved for delegation moments; slate neutrals; semantic colours muted (success #15803d, warning #b45309, error #b91c1c). Inter for body (400/500), Inter Tight for headings (600/700), JetBrains Mono for codes. 4px spacing grid (4/8/12/16/24/32/48/64). Radius 6/10/16. Subtle shadows, never floating. Light + dark modes both WCAG AA. Italian voice, professional and warm, always "tu". Persistent banner when operating under delegation.
```

Save this prompt anywhere — Cursor, Claude, Stitch — when you need to recreate the look.
