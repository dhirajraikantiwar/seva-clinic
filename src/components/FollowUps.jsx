import { useState } from 'react';
import { getFollowups } from '../lib/data.js';
import { buildNudge } from '../lib/messages.js';
import LangTabs from './LangTabs.jsx';

export default function FollowUps({ doneFollowupIds, onMarkDone }) {
  const followups = getFollowups();
  const [drafts, setDrafts] = useState({}); // followupId -> { lang, text }

  function draftFor(f) {
    if (!drafts[f.id]) {
      const lang = f.patient.language;
      setDrafts((d) => ({ ...d, [f.id]: { lang, text: buildNudge(f.patient, f, lang) } }));
    }
  }

  function setLang(f, lang) {
    setDrafts((d) => ({ ...d, [f.id]: { lang, text: buildNudge(f.patient, f, lang) } }));
  }

  return (
    <section className="card">
      <h2>Follow-up tracker</h2>
      <p className="sub">
        Who is due, who is on track — and a draft nudge for each due patient, in their
        language. Drafts only; a human reviews before anything is ever sent.
      </p>

      <table>
        <thead>
          <tr><th>Patient</th><th>Reason</th><th>Last visit</th><th>Cadence</th><th>Status</th><th></th></tr>
        </thead>
        <tbody>
          {followups.map((f) => {
            const done = doneFollowupIds.has(f.id);
            return (
              <tr key={f.id} className={done ? 'row-done' : ''}>
                <td>{f.patient.name}</td>
                <td>{f.reason}</td>
                <td>{f.lastVisitDays} days ago</td>
                <td>every {f.followEveryDays} days</td>
                <td>
                  {done
                    ? <span className="badge badge-inside">Done</span>
                    : f.due
                      ? <span className="badge badge-above">Due now</span>
                      : <span className="badge badge-inside">On track</span>}
                </td>
                <td>
                  {f.due && !done && (
                    <button className="small" onClick={() => draftFor(f)}>Draft nudge</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {followups.filter((f) => drafts[f.id] && !doneFollowupIds.has(f.id)).map((f) => (
        <div key={f.id} className="nudge-box">
          <div className="nudge-head">
            <strong>Draft nudge — {f.patient.name}</strong>
            <LangTabs lang={drafts[f.id].lang} onChange={(l) => setLang(f, l)} />
          </div>
          <div className="out" lang={drafts[f.id].lang}>{drafts[f.id].text}</div>
          <button className="primary" onClick={() => onMarkDone(f.id)}>
            Mark follow-up as done
          </button>
        </div>
      ))}
    </section>
  );
}
