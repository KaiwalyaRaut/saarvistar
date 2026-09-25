'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export function ThemeSync() {
  const { themeMode } = useAppStore();

  useEffect(() => {
    const applyTheme = (mode: 'dark' | 'light' | 'system') => {
      const root = document.documentElement;
      let effectiveTheme = mode;

      if (mode === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        effectiveTheme = isDark ? 'dark' : 'light';
      }

      if (effectiveTheme === 'light') {
        root.classList.remove('dark');
        root.classList.add('light-mode');
      } else {
        root.classList.remove('light-mode');
        root.classList.add('dark');
      }
    };

    applyTheme(themeMode);

    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeMode]);

  return null;
}
