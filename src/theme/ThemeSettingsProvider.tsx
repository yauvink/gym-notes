import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { applyThemeCssVars, createAppTheme } from './createAppTheme';
import { randomHarmoniousColors } from './colorUtils';
import {
  AMBER_COLORS,
  DEFAULT_THEME_COLORS,
  DEFAULT_THEME_MODE,
  THEME_COLORS_STORAGE_KEY,
  THEME_MODE_STORAGE_KEY,
  ThemeColors,
  ThemeMode,
} from './defaults';

type ResolvedMode = 'light' | 'dark';

interface ThemeSettingsContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  resolvedMode: ResolvedMode;
  colors: ThemeColors;
  setColors: (colors: ThemeColors) => void;
  setColor: (key: keyof ThemeColors, value: string) => void;
  resetAmber: () => void;
  pickRandomColors: () => void;
}

const ThemeSettingsContext = createContext<ThemeSettingsContextValue | null>(null);

function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function getSystemMode(): ResolvedMode {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeSettingsProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => readStored(THEME_MODE_STORAGE_KEY, DEFAULT_THEME_MODE));
  const [colors, setColorsState] = useState<ThemeColors>(() => {
    const stored = readStored<Partial<ThemeColors>>(THEME_COLORS_STORAGE_KEY, DEFAULT_THEME_COLORS);
    return {
      primary: stored.primary || DEFAULT_THEME_COLORS.primary,
      secondary: stored.secondary || DEFAULT_THEME_COLORS.secondary,
    };
  });
  const [systemMode, setSystemMode] = useState<ResolvedMode>(() => getSystemMode());

  const resolvedMode: ResolvedMode = mode === 'system' ? systemMode : mode;

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setSystemMode(media.matches ? 'dark' : 'light');
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    applyThemeCssVars(resolvedMode, colors);
  }, [resolvedMode, colors]);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    window.localStorage.setItem(THEME_MODE_STORAGE_KEY, JSON.stringify(next));
  };

  const setColors = (next: ThemeColors) => {
    setColorsState(next);
    window.localStorage.setItem(THEME_COLORS_STORAGE_KEY, JSON.stringify(next));
  };

  const setColor = (key: keyof ThemeColors, value: string) => {
    setColors({ ...colors, [key]: value });
  };

  const theme = useMemo(() => createAppTheme(resolvedMode, colors), [resolvedMode, colors]);

  const value: ThemeSettingsContextValue = {
    mode,
    setMode,
    resolvedMode,
    colors,
    setColors,
    setColor,
    resetAmber: () => setColors(AMBER_COLORS),
    pickRandomColors: () => {
      const [primary, secondary] = randomHarmoniousColors();
      setColors({ primary, secondary });
    },
  };

  return (
    <ThemeSettingsContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeSettingsContext.Provider>
  );
}

export function useThemeSettings() {
  const context = useContext(ThemeSettingsContext);
  if (!context) {
    throw new Error('useThemeSettings must be used inside ThemeSettingsProvider');
  }
  return context;
}
