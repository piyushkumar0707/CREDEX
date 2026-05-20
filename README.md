# SpendScope by Credex

SpendScope is a free AI spend audit tool for startup founders and engineering managers who want a second opinion before paying another AI-tools invoice. It captures tool plans, seats, spend, team size, and use case, then returns an instant savings report with Credex surfaced only when the savings opportunity is meaningful.

Live URL: `TODO: add deployed Vercel URL`

## Screenshots

Add three screenshots after deployment:

- Landing and spend input form
- Audit result with per-tool recommendations
- Public share URL preview

## Quick Start

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill Supabase, Anthropic, and Resend keys for full backend/email/AI behavior. Without keys, the app still runs locally with in-memory audit storage and templated AI summaries.

## Deploy

Deploy to Vercel, add the environment variables from `.env.example`, and create the Supabase tables described in `ARCHITECTURE.md`.

## Decisions

- Used Next.js App Router because public report pages need server-rendered metadata for Open Graph previews.
- Kept audit math deterministic because financial recommendations should be inspectable and testable.
- Used Supabase instead of a custom Postgres server to ship a real backend quickly without auth complexity.
- Used Resend because the API surface is small and works well from server routes.
- Added fallback summaries so missing or failing Anthropic calls never block audit completion.
