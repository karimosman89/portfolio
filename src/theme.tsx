import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type Accent = 'cyber' | 'aurora' | 'purple' | 'emerald' | 'neon' | 'default';

export const ACCENTS: { id: Accent; label: string; swatch: string }[] = [
  { id: 'default', label: 'AI Dark', swatch: 'linear-gradient(120deg,#6366f1,#a855f7)' },
  { id: 'aurora', label: 'Aurora', swatch: 'linear-gradient(120deg,#2dd4bf,#818cf8)' },
  { id: 'cyber', label: 'Cyber Blue', swatch: 'linear-gradient(120deg,#38bdf8,#3b82f6)' },
  { id: 'purple', label: 'Glass Purple', swatch: 'linear-gradient(120deg,#a855f7,#d946ef)' },
  { id: 'emerald', label: 'Emerald AI', swatch: 'linear-gradient(120deg,#10b981,#2dd4bf)' },
  { id: 'neon', label: 'Neon Gradient', swatch: 'linear-gradient(120deg,#ec4899,#8b5cf6)' },
];

interface ThemeCtx {
  isDark: boolean;
  toggleDark: () => void;
  accent: Accent;
  setAccent: (a: Accent) => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return true; // default to dark for the AI-native aesthetic
  });

  const [accent, setAccentState] = useState<Accent>(() => {
    if (typeof window === 'undefined') return 'default';
    return (localStorage.getItem('accent') as Accent) || 'default';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) { root.classList.add('dark'); localStorage.setItem('theme', 'dark'); }
    else { root.classList.remove('dark'); localStorage.setItem('theme', 'light'); }
  }, [isDark]);

  useEffect(() => {
    const root = document.documentElement;
    if (accent === 'default') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', accent);
    localStorage.setItem('accent', accent);
  }, [accent]);

  const toggleDark = useCallback(() => setIsDark((p) => !p), []);
  const setAccent = useCallback((a: Accent) => setAccentState(a), []);

  return <Ctx.Provider value={{ isDark, toggleDark, accent, setAccent }}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
