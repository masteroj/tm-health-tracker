import { classifyBP, fromKg, summarize, within, DAY } from './logic';

// Build a printable HTML report for the last `days` days (used by expo-print)
export function buildReportHTML(data, days = 90) {
  const unit = data.unit;
  const bp = within(data.bp, days);
  const wt = within(data.wt, days);
  const since = Date.now() - days * DAY;
  const period = `${new Date(since).toLocaleDateString()} – ${new Date().toLocaleDateString()}`;

  const sS = summarize(bp, (r) => r.s);
  const sD = summarize(bp, (r) => r.d);
  const sW = summarize(wt, (r) => fromKg(r.kg, unit));

  const fix = (v, w) => (v == null ? '—' : v.toFixed(w ? 1 : 0));
  const chg = (s, w) => (s ? (s.last - s.first > 0 ? '+' : '') + (s.last - s.first).toFixed(w ? 1 : 0) : '—');

  const sumRow = (label, s, u, w) =>
    s
      ? `<tr><td>${label}</td><td>${fix(s.avg, w)} ${u}</td><td>${fix(s.min, w)}</td><td>${fix(s.max, w)}</td><td>${chg(s, w)}</td><td>${s.n}</td></tr>`
      : '';

  const bpRows = bp
    .slice()
    .reverse()
    .map((r) => {
      const c = classifyBP(r.s, r.d);
      return `<tr><td>${new Date(r.t).toLocaleString()}</td><td>${r.s}/${r.d}</td><td><b style="color:${c.color}">${c.label}</b></td></tr>`;
    })
    .join('');

  const wtRows = wt
    .slice()
    .reverse()
    .map((r) => `<tr><td>${new Date(r.t).toLocaleString()}</td><td>${fromKg(r.kg, unit).toFixed(1)} ${unit}</td></tr>`)
    .join('');

  const wtChange = sW
    ? `Net weight change: <b>${chg(sW, true)} ${unit}</b> over the period.`
    : '';

  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  body{font-family:-apple-system,Helvetica,Arial,sans-serif;color:#1A2530;margin:0;padding:28px}
  h1{color:#1C6DD0;font-size:22px;margin:0}
  .hd{border-bottom:3px solid #1C6DD0;padding-bottom:10px;margin-bottom:18px}
  .sub{color:#6B7A8D;font-size:12px;margin-top:3px}
  h2{font-size:15px;margin:22px 0 6px}
  table{width:100%;border-collapse:collapse;margin:8px 0 20px;font-size:12px}
  th,td{text-align:left;padding:7px 9px;border-bottom:1px solid #E2E9F0}
  th{background:#EEF3F8;text-transform:uppercase;font-size:10px;letter-spacing:.4px;color:#6B7A8D}
  .note{background:#E7F0FB;border-radius:8px;padding:12px;font-size:12px;margin:12px 0}
</style></head><body>
  <div class="hd">
    <h1>Trend Micro · Health Report</h1>
    <div class="sub">Active Lifestyle Program · Period: ${period} · Generated ${new Date().toLocaleString()}</div>
  </div>
  <h2>Summary</h2>
  <table>
    <tr><th>Metric</th><th>Average</th><th>Min</th><th>Max</th><th>Change</th><th>Readings</th></tr>
    ${sumRow('Systolic', sS, 'mmHg', false)}
    ${sumRow('Diastolic', sD, 'mmHg', false)}
    ${sumRow('Weight', sW, unit, true)}
  </table>
  ${wtChange ? `<div class="note">${wtChange}</div>` : ''}
  ${bpRows ? `<h2>Blood Pressure Readings (${bp.length})</h2>
    <table><tr><th>Date &amp; time</th><th>BP (mmHg)</th><th>Category</th></tr>${bpRows}</table>` : ''}
  ${wtRows ? `<h2>Weight Readings (${wt.length})</h2>
    <table><tr><th>Date &amp; time</th><th>Weight</th></tr>${wtRows}</table>` : ''}
  ${!bpRows && !wtRows ? '<p>No readings recorded in this period.</p>' : ''}
  <p class="sub">BP categories: Normal (&lt;120/80), Elevated (120–129/&lt;80), High (≥130/80).
  For personal tracking only — not medical advice.</p>
</body></html>`;
}
