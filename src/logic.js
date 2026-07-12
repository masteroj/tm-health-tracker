import { colors } from './theme';

// ---- BP classification: Normal / Elevated / High ----
export function classifyBP(sys, dia) {
  if (sys < 120 && dia < 80) {
    return { label: 'Normal', color: colors.normal, soft: colors.normalSoft, level: 0 };
  }
  if (sys >= 120 && sys <= 129 && dia < 80) {
    return { label: 'Elevated', color: colors.elevated, soft: colors.elevatedSoft, level: 1 };
  }
  return { label: 'High', color: colors.high, soft: colors.highSoft, level: 2 };
}

// ---- weight unit conversion (canonical storage is kg) ----
const LB_PER_KG = 2.2046226218;
export const toKg = (v, unit) => (unit === 'lb' ? v / LB_PER_KG : v);
export const fromKg = (kg, unit) => (unit === 'lb' ? kg * LB_PER_KG : kg);
export const fmtWeight = (kg, unit) => `${fromKg(kg, unit).toFixed(1)} ${unit}`;

// ---- date helpers ----
export const DAY = 86400000;
export function fmtDate(t) {
  return new Date(t).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
export function fmtDateTime(t) {
  return new Date(t).toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

// ---- stats ----
export function summarize(arr, pick) {
  const v = arr.map(pick).filter((x) => x != null);
  if (!v.length) return null;
  const sum = v.reduce((a, b) => a + b, 0);
  return {
    n: v.length,
    avg: sum / v.length,
    min: Math.min(...v),
    max: Math.max(...v),
    first: v[0],
    last: v[v.length - 1],
  };
}

export function within(arr, days) {
  const cutoff = Date.now() - days * DAY;
  return arr.filter((r) => r.t >= cutoff).sort((a, b) => a.t - b.t);
}
