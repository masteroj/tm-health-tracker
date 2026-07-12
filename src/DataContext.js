import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { loadData, saveData } from './storage';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [data, setData] = useState({ bp: [], wt: [], unit: 'kg', lastReport: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const d = await loadData();
      setData(d);
      setLoading(false);
    })();
  }, []);

  const persist = useCallback((updater) => {
    setData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveData(next);
      return next;
    });
  }, []);

  const addBP = useCallback((sys, dia, t = Date.now()) => {
    persist((d) => ({ ...d, bp: [...d.bp, { t, s: sys, d: dia }] }));
  }, [persist]);

  const addWeight = useCallback((kg, t = Date.now()) => {
    persist((d) => ({ ...d, wt: [...d.wt, { t, kg }] }));
  }, [persist]);

  const updateEntry = useCallback((kind, oldT, fields) => {
    persist((d) => ({
      ...d,
      [kind]: d[kind].map((r) => (r.t === oldT ? { ...r, ...fields } : r)),
    }));
  }, [persist]);

  const deleteEntry = useCallback((kind, t) => {
    persist((d) => ({ ...d, [kind]: d[kind].filter((r) => r.t !== t) }));
  }, [persist]);

  const setUnit = useCallback((unit) => {
    persist((d) => ({ ...d, unit }));
  }, [persist]);

  const markReported = useCallback(() => {
    persist((d) => ({ ...d, lastReport: Date.now() }));
  }, [persist]);

  const clearAll = useCallback(() => {
    persist((d) => ({ ...d, bp: [], wt: [] }));
  }, [persist]);

  return (
    <DataContext.Provider
      value={{ data, loading, addBP, addWeight, updateEntry, deleteEntry, setUnit, markReported, clearAll }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
