import { ThemeProvider as EmotionThemeProvider, type Theme } from '@emotion/react';
import React from 'react';

export type ColorName = 'default' | 'primary' | 'success' | 'danger';
export type Variant = 'solid' | 'bordered' | 'ghost' | 'light' | 'flat' | 'shadow';
export type Size = 'sm' | 'md' | 'lg';
export type Radius = 'none' | 'sm' | 'md' | 'lg' | 'full';
export type ThemeMode = 'light' | 'dark';

export interface ThemePalette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface AppTheme extends Theme {
  mode: ThemeMode;
  isDark: boolean;
  radius: Record<Radius, string>;
  font: {
    family: string;
    sizes: Record<Size, string>;
    weights: { medium: number; semibold: number };
  };
  spacing: { xxs: string; xs: string; sm: string; md: string; lg: string };
  shadow: { sm: string; md: string; lg: string };
  colors: {
    background: string;
    foreground: string;
    border: string;
    overlay: string;
    muted: string;
    default: ThemePalette;
    primary: ThemePalette;
    success: ThemePalette;
    danger: ThemePalette;
    header: string;
  };
}

const mkPalette = (hex500: string): ThemePalette => ({
  50: '#f9fafb',
  100: '#f3f4f6',
  200: '#e5e7eb',
  300: '#d1d5db',
  400: '#9ca3af',
  500: hex500,
  600: '#4b5563',
  700: '#374151',
  800: '#1f2937',
  900: '#111827',
});

export const createTheme = (mode: ThemeMode = 'dark'): AppTheme => {
  const isDark = mode === 'dark';

  return {
    mode,
    isDark,
    radius: { none: '0px', sm: '6px', md: '10px', lg: '14px', full: '9999px' },
    font: {
      family: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial",
      sizes: { sm: '14px', md: '16px', lg: '20px' },
      weights: { medium: 500, semibold: 600 },
    },
    spacing: { xxs: '4px', xs: '6px', sm: '8px', md: '12px', lg: '16px' },
    shadow: {
      sm: '0 1px 3px rgba(0,0,0,.2)',
      md: '0 6px 18px rgba(0,0,0,.25)',
      lg: '0 14px 36px rgba(0,0,0,.3)',
    },
    colors: {
      background: isDark ? '#111111' : '#ffffff',
      foreground: isDark ? '#f5f6f7' : '#111315',
      border: isDark ? '#32343E' : '#e5e7eb',
      overlay: isDark ? 'rgba(0,0,0,.6)' : 'rgba(0,0,0,.4)',
      muted: isDark ? '#9aa0a6' : '#6b7280',
      header: isDark ? '#ffffff0f' : '#0000000a',

      default: mkPalette(isDark ? '#2a2f3a' : '#e5e7eb'),

      primary: {
        50: '#fef3ed',
        100: '#fde6d9',
        200: '#fac7b0',
        300: '#f7a887',
        400: '#f4895d',
        500: '#d55510',
        600: '#aa440d',
        700: '#803309',
        800: '#552206',
        900: '#2a1103',
      },
      success: {
        50: '#ecfdf5',
        100: '#d1fae5',
        200: '#a7f3d0',
        300: '#6ee7b7',
        400: '#34d399',
        500: '#10b981',
        600: '#0ea371',
        700: '#0a895f',
        800: '#0a6e4d',
        900: '#064e3b',
      },
      danger: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
      },
    },
  };
};

export const lightTheme = createTheme('light');
export const darkTheme = createTheme('dark');

export const ThemeProvider: React.FC<React.PropsWithChildren<{ theme?: AppTheme }>> = ({
  children,
  theme,
}) => {
  return <EmotionThemeProvider theme={theme ?? darkTheme}>{children}</EmotionThemeProvider>;
};
