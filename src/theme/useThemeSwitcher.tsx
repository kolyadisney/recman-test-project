import { useEffect, useMemo, useState } from 'react';

import { createTheme, type ThemeMode } from './index';

const STORAGE_KEY = 'app-theme-mode';

const getInitialMode = (): ThemeMode => {
  if (typeof window === 'undefined') return 'dark';
  const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
  if (saved === 'light' || saved === 'dark') return saved;
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

export const useThemeSwitcher = () => {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const theme = useMemo(() => createTheme(mode), [mode]);

  const isDark = theme.isDark;
  const toggle = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));
  const setDark = () => setMode('dark');
  const setLight = () => setMode('light');

  return { mode, theme, isDark, toggle, setDark, setLight };
};
