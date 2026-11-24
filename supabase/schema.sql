-- ─────────────────────────────────────────────────────────────────────────────
-- Seva Clinic — Supabase schema (for the FUTURE live wiring; v1 runs on
-- local seed data and does not need this).
--
-- Run this in the Supabase SQL editor for your project, then seed rows that
-- mirror src/data/seed.js, set VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY,
-- and swap the function bodies in src/lib/data.js for Supabase queries.
--
-- ⚠️ Before any real clinic use: enable Row Level Security with policies
-- scoped to clinic staff, use BAA-covered vendors (US/HIPAA) or DPDP consent
-- handling (India), and never store real patient data in a demo project.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists patients (
  id          text primary key,
  name        text not null,
  language    text not null default 'en' check (language in ('en', 'hi', 'mr')),
  doctor      text not null,
  created_at  timestamptz not null default now()
);

create table if not exists appointments (
  id          text primary key,
  patient_id  text not null references patients (id) on delete cascade,
  visit_type  text not null,
  starts_at   timestamptz not null,
  status      text not null default 'scheduled'
              check (status in ('scheduled', 'reminded', 'done', 'cancelled')),
  created_at  timestamptz not null default now()
);

create table if not exists lab_reports (
  id          text primary key,
  patient_id  text not null references patients (id) on delete cascade,
  title       text not null,
  reported_at date not null,
  status      text not null default 'pending'
              check (status in ('pending', 'explained')),
  created_at  timestamptz not null default now()
);

create table if not exists lab_values (
  id          bigint generated always as identity primary key,
  report_id   text not null references lab_reports (id) on delete cascade,
  name        text not null,
  value       numeric not null,
  unit        text not null,
  ref_low     numeric not null,
  ref_high    numeric not null,
  -- Plain "what this test measures" text per language. Descriptive only —
  -- never an interpretation, diagnosis or treatment suggestion.
  plain_en    text not null,
  plain_hi    text not null,
  plain_mr    text not null
);

create table if not exists followups (
  id                text primary key,
  patient_id        text not null references patients (id) on delete cascade,
  reason            text not null,
  last_visit_at     date not null,
  follow_every_days integer not null,
  status            text not null default 'open'
                    check (status in ('open', 'done')),
  created_at        timestamptz not null default now()
);

-- Every generated message is stored as a DRAFT with a review state.
-- Nothing is sent from this system without a human approving it.
create table if not exists message_drafts (
  id            bigint generated always as identity primary key,
  patient_id    text not null references patients (id) on delete cascade,
  kind          text not null check (kind in ('reminder', 'nudge', 'report_summary')),
  language      text not null check (language in ('en', 'hi', 'mr')),
  body          text not null,
  related_id    text,  -- appointment / followup / lab_report id, as applicable
  review_status text not null default 'draft'
                check (review_status in ('draft', 'approved', 'sent', 'discarded')),
  created_at    timestamptz not null default now()
);

create index if not exists idx_appointments_patient on appointments (patient_id);
create index if not exists idx_lab_reports_patient on lab_reports (patient_id);
create index if not exists idx_lab_values_report on lab_values (report_id);
create index if not exists idx_followups_patient on followups (patient_id);
create index if not exists idx_drafts_patient on message_drafts (patient_id);
