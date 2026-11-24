# Seva Clinic — AI Front Desk (Demo)

A demo web app of an AI front desk for a small clinic, built for Dhiraj's
Executive Series episode **“I built an AI front desk for a small clinic for
~$30/month.”**

It does the three jobs a clinic front desk repeats every day:

1. **Appointment reminders** — pick an appointment, get a ready reminder draft
   in the patient's language (English / Hindi / Marathi).
2. **Lab report explainer** — each value shown against the reference range
   printed on the report, with a plain-language line about what the test
   measures, plus a patient summary in all three languages.
3. **Follow-up tracker** — who is due, who is on track, and a draft nudge for
   each due patient, with mark-as-done tracking.

Plus a **Dashboard** (today's appointments, pending follow-ups, reports
awaiting explanation) and a **Cost** page (the ~$30/month stack, labelled as
an estimate).

> **Demo — synthetic data only, not medical advice.** Every patient, report
> and value in this app is fictional. No real patient data is stored or
> processed anywhere in this project.

## Guardrails (non-negotiable, baked into the code)

- **No diagnosis, no treatment advice** — the report explainer only states a
  value's position vs the range printed on the report, plus what the test
  measures. Nothing more.
- **Every report explanation ends with “Please confirm with your doctor”**
  (hard-coded in `src/lib/messages.js`, with Hindi/Marathi equivalents).
- **Drafts only** — every reminder, nudge and summary is a draft for a human
  to review. This app sends nothing, to anyone, ever.
- **Synthetic data only** — seed data lives in `src/data/seed.js`; all names
  and values are invented.

## Design

Modern cinematic UI in the Apple / Tesla app language: near-black canvas with
ambient gradient glows, glassmorphism cards, a frosted sticky top bar, one
electric-teal accent, large confident typography, animated dashboard
counters, and soft micro-interactions (hover lifts, view transitions).
Status colours (in-range / below / above) are tuned to stay readable on dark,
and the font stack includes Devanagari fallbacks for Hindi/Marathi text.

## Run locally

```bash
npm install
npm run dev        # local dev server
npm run build      # production build → dist/
npm run preview    # preview the production build
```

No environment variables are needed — the app runs fully on local seed data.

## Deploy to Vercel

The repo includes `vercel.json` (Vite framework, `dist` output, SPA rewrite).

1. Push this repo to GitHub (account **aupabsr**).
2. In Vercel (signed in as dhirajraikantiwar6@gmail.com): **Add New →
   Project → Import** the GitHub repo.
3. Framework preset: **Vite**. Build command `npm run build`, output `dist`
   (already set in `vercel.json`).
4. No environment variables required for v1. Deploy.

## Connecting Supabase (later, optional)

v1 runs entirely on seed data behind a small data-access layer
(`src/lib/data.js`) — the UI never imports seed data directly, so swapping
the backend touches one file.

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the project's SQL editor (tables: patients,
   appointments, lab_reports, lab_values, followups, message_drafts — message
   drafts carry a review state; nothing is ever auto-sent).
3. Seed rows mirroring `src/data/seed.js`.
4. Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY` (in Vercel: Project → Settings → Environment
   Variables).
5. `npm install @supabase/supabase-js` and replace the function bodies in
   `src/lib/data.js` with Supabase queries.

⚠️ Before any real clinic use: enable Row Level Security scoped to clinic
staff, use BAA-covered vendors (US/HIPAA) or DPDP consent handling (India),
and keep human review in front of every patient message.

## Cost note

The Cost page's ~$30/month is an **estimate** for planning and for the
episode — not a measured bill. v1 as shipped actually runs at $0 (static
hosting + local seed data, no paid APIs, template-based generation with no
LLM calls). Before quoting any figure publicly, run the real stack for a
month and use the actual invoices.

## Stack

Vite 5 · React 18 · plain CSS (custom cinematic design system, no UI
framework) · localStorage for demo state · Supabase schema included, not
required.
