import { createTheme, MantineProvider } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateSystemTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    // Set initial theme
    updateSystemTheme(mediaQuery);

    // Listen for changes
    mediaQuery.addEventListener('change', updateSystemTheme);

    return () => {
      mediaQuery.removeEventListener('change', updateSystemTheme);
    };
  }, []);

  // Determine the actual theme to use
  const actualTheme = themeMode === 'system' ? systemTheme : themeMode;

  // Create Mantine theme
  const theme = createTheme({
    // You can add more theme customization here
    primaryColor: 'green',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  });

  // Force a key change to ensure MantineProvider re-renders when theme changes
  const providerKey = `theme-${actualTheme}`;

  return (
    <MantineProvider
      key={providerKey}
      theme={theme}
      defaultColorScheme={actualTheme}
    >
      {children}
    </MantineProvider>
  );
}
