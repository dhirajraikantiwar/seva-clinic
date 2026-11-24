// ─────────────────────────────────────────────────────────────────────────────
// Data-access layer.
//
// v1: serves the local seed data in src/data/seed.js. The app runs fully
// offline with no environment variables set.
//
// Later (Supabase): the functions below are the ONLY place that touches data.
// To go live, create the tables from supabase/schema.sql, set
// VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY (see .env.example), install
// @supabase/supabase-js, and replace each function body with the matching
// Supabase query (patients / appointments / lab_reports + lab_values /
// followups / message_drafts). The UI never imports seed data directly.
// ─────────────────────────────────────────────────────────────────────────────

import {
  clinic,
  patients,
  appointments,
  labReports,
  followups,
  costStack,
} from '../data/seed.js';

const patientById = new Map(patients.map((p) => [p.id, p]));

export function getClinic() {
  return clinic;
}

export function getPatients() {
  return patients;
}

export function getPatient(id) {
  return patientById.get(id);
}

// Appointments joined with their patient, in schedule order.
export function getAppointments() {
  return appointments.map((a) => ({ ...a, patient: patientById.get(a.patientId) }));
}

export function getTodaysAppointments() {
  return getAppointments().filter((a) => a.dateLabel === 'Today');
}

export function getLabReports() {
  return labReports.map((r) => ({ ...r, patient: patientById.get(r.patientId) }));
}

export function getPendingLabReports() {
  return getLabReports().filter((r) => r.status === 'pending');
}

// Follow-ups joined with patient + a computed `due` flag.
export function getFollowups() {
  return followups.map((f) => ({
    ...f,
    patient: patientById.get(f.patientId),
    due: f.lastVisitDays >= f.followEveryDays,
  }));
}

export function getCostStack() {
  return costStack;
}

export function getCostTotal() {
  return costStack.reduce((sum, row) => sum + row.monthly, 0);
}
