import { useEffect, useState } from "react";

/**
 * useLocalStorage
 * Named + default export for tests and app usage.
 * @param {string} key
 * @param {*} initialValue
 * @returns {[any, function]} [value, setValue]
 */
export function useLocalStorage(key, initialValue) {
  const readValue = () => {
    if (typeof window === "undefined") return initialValue;
    try {
      // Si no hay key (primer test la llama sin args), no leemos nada
      if (!key) return initialValue;
      const raw = window.localStorage.getItem(String(key));
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  };

  const [value, setValue] = useState(readValue);

  // Setter que persiste también en localStorage
  const setStoredValue = (updater) => {
    setValue((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try {
        if (typeof window !== "undefined" && key) {
          window.localStorage.setItem(String(key), JSON.stringify(next));
        }
      } catch {}
      return next;
    });
  };

  // Si cambia la key, relee
  useEffect(() => {
    setValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // (Opcional) sincroniza entre pestañas
  useEffect(() => {
    if (!key) return; // no sincronizar si no hay key
    const handler = (e) => {
      if (e.key === String(key)) {
        try {
          setValue(e.newValue !== null ? JSON.parse(e.newValue) : initialValue);
        } catch {
          setValue(initialValue);
        }
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [value, setStoredValue];
}

// Default export para que App.jsx pueda usar "import useLocalStorage from ...;"
export default useLocalStorage;
