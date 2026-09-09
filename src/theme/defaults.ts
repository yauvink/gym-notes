export const THEME_MODE_STORAGE_KEY = 'ui_theme_mode';
export const THEME_COLORS_STORAGE_KEY = 'ui_theme_colors';

export type ThemeMode = 'system' | 'light' | 'dark';

export type ThemeColors = {
  primary: string;
  secondary: string;
};

export const AMBER_COLORS: ThemeColors = {
  primary: '#FFB020',
  secondary: '#FF6A2B',
};

export const DEFAULT_THEME_MODE: ThemeMode = 'system';
export const DEFAULT_THEME_COLORS: ThemeColors = AMBER_COLORS;
