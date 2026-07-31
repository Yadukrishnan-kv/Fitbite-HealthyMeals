import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'fitbite-admin-theme';

/** Read the persisted theme, falling back to the OS preference. */
function getInitialTheme() {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* ignore */
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Light/dark theme for the admin panel only. Applies `data-admin-theme` to the
 * document root (so portaled modals/toasts inherit the tokens) and removes it
 * when the admin unmounts, leaving the public site untouched.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-admin-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
    return () => root.removeAttribute('data-admin-theme');
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
