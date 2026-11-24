# Seva Clinic — Build Report

**Status: COMPLETE — production build verified green.**
Built locally by Muse's builder after two Google AI Studio attempts failed
on Google's side (service errors/stalls, Nov 23–24 2026) and Dhiraj reversed
the route (“You build it after all”, Nov 24 2026). The partial scaffold from
the first stopped run was inspected, kept, and finished.

## Design direction (applied Nov 24, 2026, per Dhiraj)

**Modern cinematic, Apple / Tesla app language** — this overrides the
original plain teal/white direction:

- Near-black canvas (`#05080a`) with fixed ambient gradient glows
  (teal/cyan radials) behind the content.
- Glassmorphism cards: translucent white gradient, 1px light borders,
  `backdrop-filter` blur, deep soft shadows, 22px radii.
- Frosted-glass sticky top bar (blur + saturate) with brand mark and pill
  navigation; minimal chrome, content-first.
- One restrained accent — electric teal `#2dd4bf` — for highlights, status,
  primary actions and the cost figure (teal→cyan gradient text).
- Big confident type: 46–78px hero headline (“Good morning.”), 58px stat
  numerals, tight tracking, generous whitespace.
- Dashboard as a hero screen: greeting/status panel, three large animated
  stat tiles (count-up on mount), appointments as cinematic list cards with
  hover slide.
- Micro-interactions: hover lifts on tiles/cards, accent border glow,
  0.45s fade/slide view transitions, `prefers-reduced-motion` respected.
- Status colours tuned for dark: in-range green `#34d399`, out-of-range
  amber `#fbbf24`, both on tinted glass chips — clearly readable.
- Font stack is system-first (SF Pro on Apple devices) with **Noto Sans
  Devanagari / Kohinoor Devanagari / Mangal fallbacks**, so Hindi/Marathi
  renders cleanly. (Hindi/Marathi copy is native Devanagari script — see
  the Polish pass section below.)

## Stack

- Vite 5.4 + React 18.3, JavaScript (JSX), plain CSS design system — no UI
  framework, no router (tab state), no external APIs, no LLM calls.
- Data: local seed fixtures (`src/data/seed.js`) behind a data-access module
  (`src/lib/data.js`); message/report logic in `src/lib/messages.js`
  (template/rule-based only).
- State: React state + localStorage persistence for follow-up “done” and
  report “explained” flags.
- `vercel.json` included (Vite preset, `dist` output, SPA rewrite).
- `supabase/schema.sql` included for the future live wiring; `.env.example`
  carries `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` placeholders. App
  runs fully with no env vars set.

## Features implemented (all working on seeded synthetic data)

1. **Dashboard** — hero status panel; animated counters for appointments
   today (3), follow-ups pending (4), report explanations pending (3);
   today's appointments as cards; follow-ups-due and reports-waiting lists.
   Stat tiles navigate to the matching view.
2. **Appointment reminders** — all 5 seeded appointments selectable; reminder
   generated in English, Hindi and Marathi with name/visit/date/time/doctor
   filled in; defaults to the patient's own language; every draft visibly
   ends “draft only — not sent” (EN/HI/MR equivalents), and the page states
   the demo never sends.
3. **Lab report explainer** — 3 seeded reports; every value shown against
   its printed reference range with Inside/Below/Above-range badge;
   per-value plain-language explanation in EN/HI/MR; full patient summary in
   the chosen language ending with the info-only line and the hard-coded
   **“Please confirm with your doctor”** (+ HI/MR equivalents, also shown as
   a highlighted line on the page); mark-as-explained state.
4. **Follow-up tracker** — 5 seeded follow-ups with computed due status
   (due: Asha, Rohan, Sunita, Prakash; on track: Kavita); draft nudge per due
   patient in EN/HI/MR with language switcher; mark-as-done persists in
   localStorage and updates the dashboard counts.
5. **Cost page** — stack breakdown (hosting $0, domain $1, database $0,
   AI API $12, WhatsApp API $14, misc $3) totalling **~$30/month**, badged
   “Estimate”, with an explicit note that v1 actually runs at $0 and figures
   must be re-measured before being quoted publicly.

**Seed thread:** Asha Patil runs through everything — appointment today
(pregnancy check-up, 11:30 AM), antenatal panel (CBC + thyroid: Hemoglobin
10.8 below range, TSH 2.1 in range, Vitamin D 18 below range), and a due
follow-up (34 days vs 30-day cadence). Plus Rohan Mehta, Sunita Desai,
Kavita Joshi, Prakash Nair — all fictional.

**Guardrails verified in the built bundle:** “Please confirm with your
doctor”, “not medical advice”, “draft only”, synthetic-data footer on every
view, safety banner under the top bar. No diagnosis or treatment language
anywhere in UI copy.

## Build status

```
npm install  → OK (7 packages looking for funding notice only)
npm run build → ✓ built in 1.26s
  dist/index.html                0.68 kB │ gzip:  0.42 kB
  dist/assets/index-*.css        9.85 kB │ gzip:  2.89 kB
  dist/assets/index-*.js       163.98 kB │ gzip: 52.49 kB
  ✓ 41 modules transformed, no errors
```

## Real vs stubbed

- **Real:** all five features end-to-end on seed data; trilingual template
  generation; range-position logic; due-date logic; localStorage state;
  responsive layout; production build.
- **Stubbed/by design:** data layer returns local fixtures (Supabase swap is
  a one-file change, documented in README); no sending channel exists at all
  (drafts only — intentional); dates are display labels (“Today”/
  “Tomorrow”) so the demo never goes stale; cost figures are the plan's
  estimate, not measured.

## Polish pass (Nov 24, 2026, per Dhiraj)

Two upgrades on top of the completed build; production build re-verified
green afterwards (41 modules, JS 166.7 kB / gzip 54.1 kB, CSS 12.5 kB,
built in 1.25s, no errors).

**1. Native Devanagari script for all Hindi and Marathi copy.**
Every HI/MR string was converted from Roman transliteration to native
Devanagari: reminder templates, follow-up nudge drafts, per-value lab
explanations and report summaries (in `src/lib/messages.js`), all seeded
per-value plain descriptions (in `src/data/seed.js`), the info-only line,
and the language-tab labels (now “Hindi · हिन्दी” / “Marathi · मराठी”).
Hindi and Marathi are written as separate languages, not copies — Marathi
uses its own forms (e.g. आपल्या, डॉक्टरांशी, खात्री, मर्यादा, आठवण).
Patient/doctor/clinic names, test names and numbers stay as-is inside the
templates; English copy unchanged. The closing guardrail lines are now:

- Hindi: **कृपया अपने डॉक्टर से इस रिपोर्ट पर बात करके पुष्टि करें।**
- Marathi: **कृपया आपल्या डॉक्टरांशी या रिपोर्टबद्दल बोलून खात्री करा।**

Rendering: a `[lang="hi"] / [lang="mr"]` CSS rule puts Noto Sans
Devanagari / Kohinoor Devanagari / Mangal first in the font stack, and the
message panels (reminder draft, explanation list, patient summary,
confirm line, nudge drafts) carry matching `lang` attributes. Verified:
the built bundle contains the Devanagari strings (डॉक्टर, कृपया and both
closing lines grepped verbatim from `dist/assets/*.js`).

**2. Signal-first hero on the dashboard.**
The dashboard top is now a “Needs attention” panel (WHOOP/Oura pattern)
instead of counts alone. Attention items are computed by fixed rules from
the seed data and ranked: lab reports with out-of-range values awaiting
explanation first (more out-of-range values rank higher), then due/overdue
follow-ups (longer overdue ranks higher), then today's appointments whose
reminder draft has not been reviewed. The single most urgent item is shown
prominently — patient name, what, and why — with an action button into the
matching view (explainer / follow-ups / reminders); the remaining items
sit in a compact clickable list below it. With the current seed data the
top item is Rohan Mehta's diabetes panel (3 of 4 values outside the
printed range) and the panel lists 10 items. When nothing needs action,
the panel switches to a calm green “All clear” state. The panel is styled
as the hero of the page — amber-tinted glass with an amber action button,
readable on the dark canvas — and the existing greeting hero and animated
stat tiles now sit below it. Marking a report explained or a follow-up
done removes it from the panel immediately, as before.

## Exact next steps (not done — need Dhiraj's accounts/approvals)

1. **GitHub push:** create repo under **aupabsr** (GitHub under
   dhirajraikantiwar6@gmail.com), `git remote add origin …`, push `main`.
   (This folder is already a git repo; nothing has been pushed.)
2. **Vercel deploy:** import the GitHub repo in Vercel under
   dhirajraikantiwar6@gmail.com; Vite preset; no env vars needed; deploy and
   verify the live URL on desktop + mobile.
3. **Supabase (optional, later):** create project → run
   `supabase/schema.sql` → set `VITE_SUPABASE_URL` /
   `VITE_SUPABASE_ANON_KEY` in Vercel → swap `src/lib/data.js` to Supabase
   queries → redeploy.
4. **Before filming:** re-measure the real monthly cost for the episode's
   cost card; capture demo footage of the three flows.
