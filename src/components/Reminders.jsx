import { useState } from 'react';
import { getAppointments } from '../lib/data.js';
import { buildReminder } from '../lib/messages.js';
import LangTabs from './LangTabs.jsx';

export default function Reminders() {
  const appointments = getAppointments();
  const [selectedId, setSelectedId] = useState(appointments[0].id);
  const selected = appointments.find((a) => a.id === selectedId);
  const [lang, setLang] = useState(selected.patient.language);
  const [draft, setDraft] = useState('');

  function pick(id) {
    const appt = appointments.find((a) => a.id === id);
    setSelectedId(id);
    setLang(appt.patient.language); // default to the patient's own language
    setDraft('');
  }

  return (
    <section className="card">
      <h2>Appointment reminders</h2>
      <p className="sub">
        Pick an appointment, generate the reminder in the patient&apos;s language.
        Drafts only — this demo never sends a message.
      </p>

      <label>Appointment</label>
      <select value={selectedId} onChange={(e) => pick(e.target.value)}>
        {appointments.map((a) => (
          <option key={a.id} value={a.id}>
            {a.patient.name} — {a.visitType} ({a.dateLabel}, {a.time})
          </option>
        ))}
      </select>

      <label>Language</label>
      <LangTabs lang={lang} onChange={(l) => { setLang(l); setDraft(''); }} />

      <button className="primary" onClick={() => setDraft(buildReminder(selected.patient, selected, lang))}>
        Generate reminder draft
      </button>

      <div className="out" aria-live="polite" lang={draft ? lang : undefined}>
        {draft || 'The draft reminder will appear here…'}
      </div>
    </section>
  );
}
