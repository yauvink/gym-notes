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
      fontFamily: '"Manrope", "Segoe UI", sans-serif',
      fontSize: 16,
      h1: { fontFamily: '"Oswald", "Manrope", sans-serif', fontWeight: 700, fontSize: '2rem' },
      h2: { fontFamily: '"Oswald", "Manrope", sans-serif', fontWeight: 700, fontSize: '1.6rem' },
      h3: { fontFamily: '"Oswald", "Manrope", sans-serif', fontWeight: 700, fontSize: '1.35rem' },
      body1: { fontSize: '1rem', lineHeight: 1.5 },
      body2: { fontSize: '0.9375rem', lineHeight: 1.45 },
      caption: { fontSize: '0.8125rem', lineHeight: 1.35 },
      button: {
        textTransform: 'none',
        fontWeight: 700,
        fontSize: '0.9375rem',
        letterSpacing: 0.2,
      },
    },
    shape: {
      borderRadius: 12,
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
            borderRadius: 12,
            paddingInline: 16,
            minHeight: 44,
            boxShadow: 'none',
          },
          contained: {
            '&:hover': {
              boxShadow: 'none',
            },
          },
          outlined: {
            borderWidth: 1.5,
            '&:hover': {
              borderWidth: 1.5,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            transition: 'background-color 1s ease, border-color 1s ease, color 1s ease',
          },
        },
      },
      MuiAccordion: {
        styleOverrides: {
          root: {
            backgroundColor: surface.paper,
            backgroundImage: 'none',
            boxShadow: 'none',
            border: `1px solid ${surface.divider}`,
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
            backgroundColor: surface.paper,
            border: `1px solid ${surface.divider}`,
            transition: 'background-color 1s ease, border-color 1s ease, color 1s ease',
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiBottomNavigation: {
        styleOverrides: {
          root: {
            backgroundColor: surface.paper,
            borderTop: `1px solid ${surface.divider}`,
            transition: 'background-color 1s ease, border-color 1s ease',
          },
        },
      },
      MuiBottomNavigationAction: {
        styleOverrides: {
          root: {
            color: surface.muted,
            transition: 'color 220ms ease, background-color 220ms ease',
            '& .MuiTouchRipple-child': {
              backgroundColor: colors.primary,
            },
            '&.Mui-selected': {
              color: colors.primary,
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? surface.elevated : surface.paper,
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

  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) {
    themeMeta.setAttribute('content', surface.default);
  }
}

export { surfaces };
