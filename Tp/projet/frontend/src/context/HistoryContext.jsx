import { createContext, useContext, useCallback, useState, useEffect } from "react";

const STORAGE_KEY = "osteoporosis_predictions";
const MAX_ITEMS = 100;

const HistoryContext = createContext(null);

export function HistoryProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (_) {}
  }, []);

  const persist = useCallback((next) => {
    setItems((prev) => {
      const nextList = typeof next === "function" ? next(prev) : next;
      const trimmed = nextList.slice(0, MAX_ITEMS);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      } catch (_) {}
      return trimmed;
    });
  }, []);

  const addPrediction = useCallback(
    (form, result) => {
      const entry = {
        id: crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36),
        at: new Date().toISOString(),
        form: { ...form },
        result: { ...result },
      };
      persist((prev) => [entry, ...prev]);
      return entry;
    },
    [persist]
  );

  const clearHistory = useCallback(() => {
    persist([]);
  }, [persist]);

  return (
    <HistoryContext.Provider value={{ items, addPrediction, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error("useHistory must be used within HistoryProvider");
  return ctx;
}
