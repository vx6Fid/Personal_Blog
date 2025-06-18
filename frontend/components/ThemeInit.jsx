'use client';

import { useEffect } from 'react';

export default function ThemeInit({ children }) {
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (stored === 'light' || (!stored && prefersLight)) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, []);

  return children;
}