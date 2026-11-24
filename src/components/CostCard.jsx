import { getCostStack, getCostTotal } from '../lib/data.js';

export default function CostCard() {
  const rows = getCostStack();
  const total = getCostTotal();

  return (
    <section className="card">
      <h2>What it costs to run</h2>
      <p className="sub">
        The stack behind this front desk, at small-clinic volume.
      </p>

      <div className="cost-total">
        <span className="cost-big">~${total}/month</span>
        <span className="badge badge-estimate">Estimate</span>
      </div>

      <table>
        <thead>
          <tr><th>Item</th><th>Notes</th><th className="num">$/month</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.item}>
              <td>{r.item}</td>
              <td className="muted">{r.detail}</td>
              <td className="num">${r.monthly}</td>
            </tr>
          ))}
          <tr className="total-row">
            <td>Total</td><td></td><td className="num">~${total}</td>
          </tr>
        </tbody>
      </table>

      <p className="warn-note">
        ⚠️ These figures are an <strong>estimate</strong> for planning and for the
        Executive Series episode — not a measured bill. v1 of this app actually runs
        at $0 (static hosting + local seed data, no paid APIs). Before quoting any
        number publicly, run the real stack for a month and use the actual invoices.
      </p>
    </section>
  );
}
