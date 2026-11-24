import { useEffect, useState } from 'react';
import { getClinic } from './lib/data.js';
import Dashboard from './components/Dashboard.jsx';
import Reminders from './components/Reminders.jsx';
import ReportExplainer from './components/ReportExplainer.jsx';
import FollowUps from './components/FollowUps.jsx';
import CostCard from './components/CostCard.jsx';

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'reminders', label: 'Reminders' },
  { id: 'reports', label: 'Report Explainer' },
  { id: 'followups', label: 'Follow-ups' },
  { id: 'cost', label: 'Cost' },
];

// Small localStorage-backed set, so "done" state survives a reload in the demo.
function usePersistedSet(key) {
  const [set, setSet] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem(key) || '[]'));
    } catch {
      return new Set();
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify([...set]));
    } catch {
      /* storage unavailable — state still works in-memory */
    }
  }, [key, set]);
  const add = (id) => setSet((s) => new Set(s).add(id));
  return [set, add];
}

export default function App() {
  const clinic = getClinic();
  const [tab, setTab] = useState('dashboard');
  const [doneFollowupIds, markFollowupDone] = usePersistedSet('seva.doneFollowups');
  const [explainedReportIds, markReportExplained] = usePersistedSet('seva.explainedReports');

  return (
    <div className="app">
      <div className="ambient" aria-hidden="true" />

      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">✚</span>
            <span className="brand-name">{clinic.name}</span>
            <span className="badge badge-demo">DEMO · SYNTHETIC DATA</span>
          </div>
          <nav className="tabs" aria-label="Main">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={tab === t.id ? 'nav-tab active' : 'nav-tab'}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="shell">
        <div className="safety-banner">
          <strong>Safety rules built in:</strong> this app never diagnoses and never
          suggests treatment. Every message is a draft for a human to review —
          nothing is sent. Report explanations are information only and always end
          with “Please confirm with your doctor.”
        </div>

        <main key={tab} className="view">
          {tab === 'dashboard' && (
            <Dashboard
              doneFollowupIds={doneFollowupIds}
              explainedReportIds={explainedReportIds}
              onNavigate={setTab}
            />
          )}
          {tab === 'reminders' && <Reminders />}
          {tab === 'reports' && (
            <ReportExplainer
              explainedReportIds={explainedReportIds}
              onMarkExplained={markReportExplained}
            />
          )}
          {tab === 'followups' && (
            <FollowUps doneFollowupIds={doneFollowupIds} onMarkDone={markFollowupDone} />
          )}
          {tab === 'cost' && <CostCard />}
        </main>

        <footer>
          <p>
            <strong>Demo — synthetic data only, not medical advice.</strong> All
            patients, reports and values in this app are fictional and generated
            for demonstration. No real patient data is stored or processed.
            Template-based generation (no AI model calls in v1) · Built for the
            Executive Series episode “I built an AI front desk for a small clinic
            for ~$30/month.”
          </p>
        </footer>
      </div>
    </div>
  );
}
