import AsyncStorage from '@react-native-async-storage/async-storage';
import { DAY } from './logic';

const KEY = 'tm_health_v2';
export const RETAIN_DAYS = 90; // local 90-day storage

const empty = { bp: [], wt: [], unit: 'kg', lastReport: null };

// Remove entries older than the retention window (auto-cleanup)
export function prune(data) {
  const cutoff = Date.now() - RETAIN_DAYS * DAY;
  let removed = 0;
  ['bp', 'wt'].forEach((k) => {
    const before = data[k].length;
    data[k] = data[k].filter((r) => r.t >= cutoff);
    removed += before - data[k].length;
  });
  return removed;
}

export async function loadData() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const data = raw ? { ...empty, ...JSON.parse(raw) } : { ...empty };
    const removed = prune(data);
    if (removed) await saveData(data);
    return data;
  } catch (e) {
    return { ...empty };
  }
}

export async function saveData(data) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {
    // ignore write failures
  }
}
