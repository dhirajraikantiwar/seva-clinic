import { useEffect, useState } from 'react';
import {
  getTodaysAppointments,
  getFollowups,
  getPendingLabReports,
} from '../lib/data.js';
import { valuePosition } from '../lib/messages.js';

// Cheap animated counter — eases from 0 to the target on mount.
function useCountUp(target, duration = 700) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

function StatTile({ value, label, onClick }) {
  const shown = useCountUp(value);
  return (
    <button className="stat-card" onClick={onClick}>
      <span className="stat-num">{shown}</span>
      <span className="stat-label">{label}</span>
    </button>
  );
}

// ── Signal-first attention model ────────────────────────────────────────────
// Everything that actually needs a human action today, ranked by urgency.
// Pure rules over the seed data — no interpretation of any medical value
// beyond its position vs the range printed on the report.
function buildAttentionItems({ pendingReports, pendingFollowups, todays }) {
  const items = [];

  for (const r of pendingReports) {
    const outside = r.values.filter((v) => valuePosition(v) !== 'inside');
    if (outside.length > 0) {
      items.push({
        id: `report-${r.id}`,
        kind: 'report',
        // Reports with values outside the printed range rank first; more
        // out-of-range values = more urgent.
        score: 100 + outside.length,
        patientName: r.patient.name,
        headline: 'Lab report waiting to be explained',
        detail: `${r.title} (${r.dateLabel}) — ${outside.length} of ${r.values.length} values outside the printed range: ${outside.map((v) => v.name).join(', ')}.`,
        actionLabel: 'Open the explainer',
        target: 'reports',
      });
    } else {
      items.push({
        id: `report-${r.id}`,
        kind: 'report',
        score: 45,
        patientName: r.patient.name,
        headline: 'Lab report waiting to be explained',
        detail: `${r.title} (${r.dateLabel}) — all values inside the printed range, explanation still pending.`,
        actionLabel: 'Open the explainer',
        target: 'reports',
      });
    }
  }

  for (const f of pendingFollowups) {
    const overdueBy = f.lastVisitDays - f.followEveryDays;
    items.push({
      id: `followup-${f.id}`,
      kind: 'followup',
      // Due follow-ups rank next; the longer overdue, the higher.
      score: 60 + Math.min(Math.max(overdueBy, 0), 30),
      patientName: f.patient.name,
      headline: overdueBy > 0 ? `Follow-up overdue by ${overdueBy} days` : 'Follow-up due now',
      detail: `${f.reason} — last visit ${f.lastVisitDays} days ago, due every ${f.followEveryDays} days. Nudge draft not sent yet.`,
      actionLabel: 'Review follow-ups',
      target: 'followups',
    });
  }

  for (const a of todays) {
    items.push({
      id: `appt-${a.id}`,
      kind: 'appointment',
      score: 30,
      patientName: a.patient.name,
      headline: 'Reminder draft not reviewed yet',
      detail: `${a.visitType} — today at ${a.time} with ${a.patient.doctor}.`,
      actionLabel: 'Review reminders',
      target: 'reminders',
    });
  }

  return items.sort((x, y) => y.score - x.score);
}

function SignalPanel({ items, onNavigate }) {
  if (items.length === 0) {
    return (
      <div className="signal-panel signal-clear">
        <p className="signal-eyebrow signal-eyebrow-ok">✓ All clear</p>
        <h3 className="signal-title">Nothing needs attention right now.</h3>
        <p className="signal-detail">
          No unexplained reports, no follow-ups due, and every reminder for
          today has been reviewed.
        </p>
      </div>
    );
  }

  const [top, ...rest] = items;
  return (
    <div className="signal-panel">
      <div className="signal-head">
        <p className="signal-eyebrow">⚠ Needs attention</p>
        <span className="signal-count">
          {items.length} item{items.length === 1 ? '' : 's'} today
        </span>
      </div>

      <p className="signal-patient">{top.patientName}</p>
      <h3 className="signal-title">{top.headline}</h3>
      <p className="signal-detail">{top.detail}</p>
      <button className="signal-action" onClick={() => onNavigate(top.target)}>
        {top.actionLabel} →
      </button>

      {rest.length > 0 && (
        <ul className="signal-list">
          {rest.map((item) => (
            <li key={item.id}>
              <button className="signal-item" onClick={() => onNavigate(item.target)}>
                <span className="signal-item-main">
                  <strong>{item.patientName}</strong> — {item.headline}
                </span>
                <span className="signal-item-detail">{item.detail}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Dashboard({ doneFollowupIds, explainedReportIds, onNavigate }) {
  const todays = getTodaysAppointments();
  const pendingFollowups = getFollowups().filter(
    (f) => f.due && !doneFollowupIds.has(f.id),
  );
  const pendingReports = getPendingLabReports().filter(
    (r) => !explainedReportIds.has(r.id),
  );
  const attention = buildAttentionItems({
    pendingReports,
    pendingFollowups,
    todays,
  });

  return (
    <section>
      <SignalPanel items={attention} onNavigate={onNavigate} />

      <div className="hero">
        <p className="hero-eyebrow">Seva Clinic · Front Desk</p>
        <h2 className="hero-title">Good morning.</h2>
        <p className="hero-sub">
          {todays.length} appointments today · {pendingFollowups.length} follow-ups
          waiting · {pendingReports.length} reports to explain — in English, Hindi
          and Marathi, before the first patient walks in.
        </p>
      </div>

      <div className="stat-row">
        <StatTile value={todays.length} label="Appointments today" onClick={() => onNavigate('reminders')} />
        <StatTile value={pendingFollowups.length} label="Follow-ups pending" onClick={() => onNavigate('followups')} />
        <StatTile value={pendingReports.length} label="Report explanations pending" onClick={() => onNavigate('reports')} />
      </div>

      <div className="card">
        <h2>Today&apos;s appointments</h2>
        <div className="appt-list">
          {todays.map((a) => (
            <div key={a.id} className="appt-card">
              <div className="appt-time">{a.time}</div>
              <div className="appt-main">
                <div className="appt-name">{a.patient.name}</div>
                <div className="appt-visit">{a.visitType}</div>
              </div>
              <div className="appt-doctor">{a.patient.doctor}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h2>Follow-ups due</h2>
          {pendingFollowups.length === 0 && <p className="muted">Nobody is waiting on a follow-up.</p>}
          <ul className="plain-list">
            {pendingFollowups.map((f) => (
              <li key={f.id}>
                <strong>{f.patient.name}</strong> — {f.reason}, last visit {f.lastVisitDays} days ago
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h2>Reports waiting for an explanation</h2>
          {pendingReports.length === 0 && <p className="muted">All reports explained.</p>}
          <ul className="plain-list">
            {pendingReports.map((r) => (
              <li key={r.id}>
                <strong>{r.patient.name}</strong> — {r.title} ({r.dateLabel})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
