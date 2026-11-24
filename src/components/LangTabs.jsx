import { LANGUAGES } from '../lib/messages.js';

export default function LangTabs({ lang, onChange }) {
  return (
    <div className="lang-tabs" role="tablist" aria-label="Language">
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          role="tab"
          aria-selected={lang === l.code}
          className={lang === l.code ? 'tab active' : 'tab'}
          onClick={() => onChange(l.code)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
