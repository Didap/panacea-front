# Auth recovery pages (verify / reset / forgot) - web - 2026-06-05

Closes the identity-hardening loop on the frontend. The backend already issues verification and
reset tokens and exposes the endpoints; this adds the public web pages that consume them, plus the
entry points on the login screen. Web-only change, no backend touch.

## What landed

- `api/auth.api.ts`: `verifyEmail(token)`, `resendVerification(email)`, `forgotPassword(email)`,
  `resetPassword(token, password)`.
- `pages/ForgotPasswordPage.vue` (`/password-dimenticata`): email -> forgot-password. Always shows a
  success-shaped message (no account enumeration), mirroring the backend.
- `pages/ResetPasswordPage.vue` (`/reset-password/:token`): new password + confirm (min 8, must
  match, gated submit) -> reset-password -> success with a link to login.
- `pages/VerifyEmailPage.vue` (`/verifica-email/:token`): verifies on mount; on failure shows the
  coded error and an inline resend form (email -> resend-verification, also success-shaped).
- `pages/LoginPage.vue`: a "Password dimenticata?" link to the forgot page.
- `router/index.ts`: the three public routes (the slugs match the URLs the backend puts in emails).
- `i18n/locales/it.json`: `auth.forgot` / `auth.reset` / `auth.verify` copy, the login link, and the
  new error keys `AUTH_TOKEN_INVALID`, `AUTH_TOKEN_EXPIRED`, `EMAIL_ALREADY_VERIFIED`.

Layout reuses the centered brand-teal auth card from `LoginPage`; errors render inline via the
existing `errorKey` mapping.

## Tests

Vitest + Vue Test Utils: `ResetPasswordPage` (submits when valid+matching, blocks on mismatch /
too-short) and `VerifyEmailPage` (verify-on-mount success; failure shows error + resend then
confirms resend). 6 files, 16 tests green.

Note: each conditional branch is wrapped in a single `<div>` (not a multi-child `<template>`) to
avoid a happy-dom fragment-patching error (`nextSibling of null`) when swapping branches after an
interaction. Harmless in a real browser; the wrapper keeps the test env stable.

## Review follow-ups (Cristiano)

- `VerifyEmailPage.resend()` now stays success-shaped on any real backend response (even an error
  status, to avoid an enumeration oracle) but surfaces a transport failure (no response) honestly,
  so a genuine outage no longer tells the user to check an inbox for an email that was never sent.
- Noted for later (not this PR): a shared `ErrorCode` union mirroring the backend registry, so a
  renamed code becomes a typecheck failure instead of a silent `errors.UNKNOWN` fallback.

## Verification

`npm run typecheck`, `npm run lint` (0 errors), `npm run build`, `npm run test` (16/16) all pass.
End-to-end: register/forgot/reset/verify links are printed by the backend console notifications
driver in dev; the pages POST to the matching `/auth/*` endpoints.
