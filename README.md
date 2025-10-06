
# Custom Hook — `useLocalStorage` (Windows + VS Code) / **README Internacional (ES/EN)**

**Base repo:** `https://github.com/ada-school/assignments-micro-course-custom-hooks.git`  
**Challenge branch:** `custom-hook`  
**Goal / Objetivo:** Build a reusable React hook `useLocalStorage` to persist state in `localStorage`, integrate it into `App.jsx`, pass Ada tests, and push to **your** GitHub repository.

---

## ✅ Prerequisites / Prerrequisitos
- **Windows 10/11**, **VS Code**, **Git**, **Node.js 18+ (LTS)**  
  Check / Verifica:
```powershell
node -v
npm -v
git --version
```
> If `vite` is “not recognized”, you **don’t** need a global install — use `npm run dev` (uses local dependency).

---

## 1) Clone & prepare / Clonar y preparar
**Git Bash**
```bash
git clone https://github.com/ada-school/assignments-micro-course-custom-hooks.git
cd assignments-micro-course-custom-hooks
git checkout custom-hook
```

**PowerShell (root of the repo)**
```powershell
npm install
npm run dev
```
Open the URL printed by Vite (typically `http://localhost:5173`).

---

## 2) Implement the hook / Implementa el hook
Create **`src/hooks/useLocalStorage.js`** with **named + default export** (tests expect the named one; app can use default):  
Crea **`src/hooks/useLocalStorage.js`** con **export nombrado y por defecto**.

```javascript
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
      if (!key) return initialValue; // tests call without args
      const raw = window.localStorage.getItem(String(key));
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  };

  const [value, setValue] = useState(readValue);

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

  useEffect(() => {
    setValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!key) return;
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

export default useLocalStorage;
```

---

## 3) Use it in App.jsx / Úsalo en App.jsx
Replace the `useState` todos with the hook:  
Reemplaza el `useState` de la lista por el hook:

```diff
- import { useState } from 'react'
+ import useLocalStorage from './hooks/useLocalStorage'

- const [todos, setTodos] = useState([])
+ const [todos, setTodos] = useLocalStorage('todos', [])
```

Typical handlers / Manejadores típicos:
```javascript
const addTodo = (text) => {
  const newTodo = { id: crypto.randomUUID?.() ?? String(Date.now()), text, done: false };
  setTodos((prev) => [...prev, newTodo]);
};

const toggleTodo = (id) => {
  setTodos((prev) => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
};

const deleteTodo = (id) => {
  setTodos((prev) => prev.filter(t => t.id !== id));
};
```

Manual check / Validación manual:
1) Create a todo → refresh page → it should persist.  
2) Clear local storage key `todos` if needed (DevTools → Application → Local Storage).

---

## 4) Ada client & tests / Cliente Ada y pruebas
**Windows (PowerShell)** — put `ada-client.exe` at the repo root.  
Coloca `ada-client.exe` en la raíz.

```powershell
.\ada-client.exe start https://eci.learn.ada-school.org/cohorts/6899f26ac3afb25ec7ead6ca/assignments/678ef7d9d2a1f0bb144e91bc
npm run ada-test
```

Submit / Enviar:
```powershell
.\ada-client.exe submit https://eci.learn.ada-school.org/cohorts/6899f26ac3afb25ec7ead6ca/assignments/678ef7d9d2a1f0bb144e91bc
```

---

## 5) Push to your GitHub / Subir a tu GitHub
Target repo / Repo destino: **https://github.com/AlejoCNYT/useLocalStorage** (create it empty first).

**Git Bash — set remotes & push**
```bash
# Go to project
cd ~/Downloads/assignments-micro-course-custom-hooks

# Avoid "dubious ownership" if it appears (Windows path)
git config --global --add safe.directory "C:/Users/usuario/Downloads/assignments-micro-course-custom-hooks"

# Keep Ada repo as upstream; set YOUR repo as origin
git remote rename origin upstream 2>/dev/null || true
git remote add origin https://github.com/AlejoCNYT/useLocalStorage.git 2>/dev/null || git remote set-url origin https://github.com/AlejoCNYT/useLocalStorage.git

git remote -v

# Create a branch for the lab work (optional but recommended)
git checkout -b feat/useLocalStorage

# Add and commit your changes
git add -A
git commit -m "feat: implement useLocalStorage hook and integrate in App.jsx"

# Push your branch to your repo
git push -u origin feat/useLocalStorage

# If you want your main branch to contain the work:
git switch -c main 2>/dev/null || git checkout main
git merge --no-ff feat/useLocalStorage -m "merge: bring useLocalStorage implementation"
git push -u origin main
```

> Tip: You can keep syncing with Ada’s repo using `upstream`:  
> `git fetch upstream` → `git merge upstream/custom-hook` (or rebase) when needed.

---

## 6) Troubleshooting / Solución de problemas
- **“useLocalStorage is not a function”** → Ensure **named export** exists (`export function useLocalStorage`) and import matches in tests; keep **default export** for the app.  
- **“vite is not recognized”** → Use `npm run dev` (no global vite needed).  
- **localStorage errors in tests** → Hook already checks `typeof window`; don’t access `localStorage` outside the hook.  
- **Dubious ownership**:
```bash
git config --global --add safe.directory "C:/Users/usuario/Downloads/assignments-micro-course-custom-hooks"
```
- **Change remotes**:
```bash
git remote set-url origin https://github.com/AlejoCNYT/useLocalStorage.git
```

---

## 7) Summary / Resumen
- Build `src/hooks/useLocalStorage.js` (named + default export).  
- Replace todos state in `App.jsx` and use the hook’s setter everywhere.  
- Run Ada tests; submit when green.  
- Push to your GitHub repo `AlejoCNYT/useLocalStorage` with Git Bash.

¡Éxitos! / Happy coding! 🚀
