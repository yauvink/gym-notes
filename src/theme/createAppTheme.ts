import { createTheme, Theme } from '@mui/material/styles';
import { getContrastText, withAlpha } from './colorUtils';
import { ThemeColors } from './defaults';
import DialogSlideUp from './DialogTransition';

type PaletteMode = 'light' | 'dark';

const surfaces = {
  dark: {
    default: '#0A0C0E',
    paper: '#14181C',
    elevated: '#1C2228',
    text: '#F2F4F5',
    muted: '#8B939C',
    divider: 'rgba(255,255,255,0.08)',
  },
  light: {
    default: '#F3F4F6',
    paper: '#FFFFFF',
    elevated: '#EEF0F3',
    text: '#111418',
    muted: '#5C6570',
    divider: 'rgba(17,20,24,0.08)',
  },
};

export function createAppTheme(mode: PaletteMode, colors: ThemeColors): Theme {
  const surface = surfaces[mode];
  const primaryContrast = getContrastText(colors.primary);
  const secondaryContrast = getContrastText(colors.secondary);

  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.primary,
        contrastText: primaryContrast,
      },
      secondary: {
        main: colors.secondary,
        contrastText: secondaryContrast,
      },
      background: {
        default: surface.default,
        paper: surface.paper,
      },
      text: {
        primary: surface.text,
        secondary: surface.muted,
      },
      divider: surface.divider,
    },
    typography: {
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", sans-serif',
      fontSize: 16,
      h1: { fontWeight: 700, fontSize: '2rem', letterSpacing: '-0.03em' },
      h2: { fontWeight: 700, fontSize: '1.55rem', letterSpacing: '-0.025em' },
      h3: { fontWeight: 650, fontSize: '1.28rem', letterSpacing: '-0.02em' },
      body1: { fontSize: '1rem', lineHeight: 1.45, letterSpacing: '-0.015em' },
      body2: { fontSize: '0.9375rem', lineHeight: 1.4, letterSpacing: '-0.01em' },
      caption: { fontSize: '0.78rem', lineHeight: 1.3, letterSpacing: '-0.01em' },
      button: {
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.9375rem',
        letterSpacing: '-0.01em',
      },
    },
    shape: {
      borderRadius: 22,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: surface.default,
            color: surface.text,
            transition: 'background-color 1s ease, color 1s ease',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            paddingInline: 18,
            minHeight: 46,
            boxShadow: 'none',
            overflow: 'hidden',
            backgroundImage: 'none',
            isolation: 'isolate',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          outlined: {
            borderWidth: 0.5,
            backgroundColor: 'var(--bg-paper)',
            '&:hover': {
              borderWidth: 0.5,
              backgroundColor: 'var(--bg-paper)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: 'var(--glass-bg-strong)',
            backdropFilter: 'blur(28px) saturate(180%)',
            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
            border: '0.5px solid var(--glass-border)',
            boxShadow: 'var(--glass-shadow)',
            transition: 'background-color 1s ease, border-color 1s ease, color 1s ease',
          },
        },
      },
      MuiAccordion: {
        styleOverrides: {
          root: {
            backgroundColor: 'var(--glass-bg-strong)',
            backgroundImage: 'none',
            boxShadow: 'var(--glass-shadow)',
            border: '0.5px solid var(--glass-border)',
            backdropFilter: 'blur(24px) saturate(170%)',
            overflow: 'hidden',
            transition: 'background-color 1s ease, border-color 1s ease, color 1s ease',
            '&:before': { display: 'none' },
            '&.Mui-expanded': {
              margin: 0,
            },
          },
        },
      },
      MuiAccordionSummary: {
        styleOverrides: {
          root: {
            minHeight: 56,
          },
        },
      },
      MuiDialog: {
        defaultProps: {
          TransitionComponent: DialogSlideUp,
        },
        styleOverrides: {
          paper: {
            backgroundImage: 'none',
            backgroundColor: 'var(--glass-bg-strong)',
            backdropFilter: 'blur(40px) saturate(190%)',
            WebkitBackdropFilter: 'blur(40px) saturate(190%)',
            border: '0.5px solid var(--glass-border)',
            boxShadow: 'var(--glass-shadow-lg)',
            borderRadius: 28,
            overflow: 'hidden',
            transition: 'background-color 1s ease, border-color 1s ease, color 1s ease',
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            border: '0.5px solid var(--glass-border)',
            backdropFilter: 'blur(16px)',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundColor: 'var(--glass-bg)',
            backdropFilter: 'blur(16px)',
          },
          notchedOutline: {
            borderColor: 'var(--glass-border)',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 999,
          },
        },
      },
    },
  });
}

export function applyThemeCssVars(mode: PaletteMode, colors: ThemeColors) {
  const surface = surfaces[mode];
  const root = document.documentElement;
  root.setAttribute('data-theme', mode);
  root.style.colorScheme = mode;
  root.style.removeProperty('background-color');
  root.style.setProperty('--color-primary', colors.primary);
  root.style.setProperty('--color-secondary', colors.secondary);
  root.style.setProperty('--color-primary-contrast', getContrastText(colors.primary));
  root.style.setProperty('--color-secondary-contrast', getContrastText(colors.secondary));
  root.style.setProperty('--bg-default', surface.default);
  root.style.setProperty('--bg-paper', surface.paper);
  root.style.setProperty('--bg-elevated', surface.elevated);
  root.style.setProperty('--text-primary', surface.text);
  root.style.setProperty('--text-muted', surface.muted);
  root.style.setProperty('--border-subtle', surface.divider);
  root.style.setProperty('--color-primary-soft', withAlpha(colors.primary, 0.18));
  root.style.setProperty('--color-secondary-soft', withAlpha(colors.secondary, 0.18));

  const isDark = mode === 'dark';
  root.style.setProperty('--glass-bg', isDark ? 'rgba(28, 34, 40, 0.52)' : 'rgba(255, 255, 255, 0.58)');
  root.style.setProperty('--glass-bg-strong', isDark ? 'rgba(22, 26, 32, 0.72)' : 'rgba(255, 255, 255, 0.78)');
  root.style.setProperty('--glass-border', isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.72)');
  root.style.setProperty('--glass-highlight', isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.92)');
  root.style.setProperty('--glass-shadow', isDark ? '0 10px 32px rgba(0, 0, 0, 0.38)' : '0 10px 28px rgba(16, 24, 40, 0.08)');
  root.style.setProperty('--glass-shadow-lg', isDark ? '0 24px 60px rgba(0, 0, 0, 0.5)' : '0 20px 50px rgba(16, 24, 40, 0.14)');
  root.style.setProperty('--tabbar-bg', isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.42)');
  root.style.setProperty('--tabbar-selected', isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.72)');
  root.style.setProperty('--tabbar-ink', isDark ? 'rgba(232, 236, 240, 0.78)' : 'rgba(17, 20, 24, 0.78)');

  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) {
    themeMeta.setAttribute('content', 'transparent');
  }
}

export { surfaces };
