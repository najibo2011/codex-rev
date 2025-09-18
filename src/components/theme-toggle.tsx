'use client';

import { useEffect, useState } from 'react';

const storageKey = 'senior-zen-theme';

type Theme = 'light' | 'dark';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(storageKey) as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const nextTheme = stored ?? (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    setTheme(nextTheme);
  }, []);

  const toggle = () => {
    const nextTheme: Theme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    window.localStorage.setItem(storageKey, nextTheme);
    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex items-center gap-2 rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700 transition hover:border-brand hover:text-brand dark:border-slate-700 dark:text-slate-200"
    >
      <span aria-hidden>{theme === 'light' ? '☀️' : '🌙'}</span>
      <span>{theme === 'light' ? 'Clair' : 'Sombre'}</span>
    </button>
  );
}
