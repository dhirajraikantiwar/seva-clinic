import { useState } from 'react';
import { getLabReports } from '../lib/data.js';
import {
  buildReportSummary,
  explainValue,
  valuePosition,
  DOCTOR_CONFIRM_LINE,
} from '../lib/messages.js';
import LangTabs from './LangTabs.jsx';

const POSITION_BADGE = { inside: 'Inside range', below: 'Below range', above: 'Above range' };

export default function ReportExplainer({ explainedReportIds, onMarkExplained }) {
  const reports = getLabReports();
  const [selectedId, setSelectedId] = useState(reports[0].id);
  const report = reports.find((r) => r.id === selectedId);
  const [lang, setLang] = useState(report.patient.language);

  function pick(id) {
    const r = reports.find((x) => x.id === id);
    setSelectedId(id);
    setLang(r.patient.language);
  }

  return (
    <section className="card">
      <h2>Lab report explainer</h2>
      <p className="sub">
        Each value is shown against the reference range printed on the report, with a
        plain-language line about what the test measures. Information only — this tool
        never diagnoses and never suggests treatment.
      </p>

      <label>Lab report (synthetic)</label>
      <select value={selectedId} onChange={(e) => pick(e.target.value)}>
        {reports.map((r) => (
          <option key={r.id} value={r.id}>
            {r.patient.name} — {r.title} ({r.dateLabel})
            {explainedReportIds.has(r.id) ? ' ✓ explained' : ''}
          </option>
        ))}
      </select>

      <table>
        <thead>
          <tr><th>Test</th><th>Value</th><th>Printed range</th><th>Position</th></tr>
        </thead>
        <tbody>
          {report.values.map((v) => {
            const pos = valuePosition(v);
            return (
              <tr key={v.name}>
                <td>{v.name}</td>
                <td>{v.value} {v.unit}</td>
                <td>{v.low}–{v.high} {v.unit}</td>
                <td><span className={`badge badge-${pos}`}>{POSITION_BADGE[pos]}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <label>Explanation language</label>
      <LangTabs lang={lang} onChange={setLang} />

      <h3 className="mt">Plain-language explanation</h3>
      <ul className="explain-list" lang={lang}>
        {report.values.map((v) => (
          <li key={v.name}>
            <strong>{v.name}:</strong> {explainValue(v, lang)}
          </li>
        ))}
      </ul>

      <h3 className="mt">Patient summary (draft)</h3>
      <div className="out" lang={lang}>{buildReportSummary(report.patient, report, lang)}</div>

      <p className="confirm-line" lang={lang}>{DOCTOR_CONFIRM_LINE[lang]}</p>

      {!explainedReportIds.has(report.id) ? (
        <button className="primary" onClick={() => onMarkExplained(report.id)}>
          Mark explanation as done
        </button>
      ) : (
        <p className="muted">✓ Explanation marked done for this report.</p>
      )}
    </section>
  );
}
