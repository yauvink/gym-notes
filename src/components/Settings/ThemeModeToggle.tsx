import { Box } from '@mui/material';
import { ThemeMode } from '../../theme/defaults';
import { useThemeSettings } from '../../theme';

function SunIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 3.2v1.8M12 19v1.8M3.2 12h1.8M19 12h1.8M5.7 5.7l1.3 1.3M17 17l1.3 1.3M18.3 5.7l-1.3 1.3M7 17l-1.3 1.3" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="4" width="17" height="12" rx="1.6" />
      <path d="M12 16v3.2M8 20.2h8" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.2 14.6A6.2 6.2 0 0 1 9.4 7.8 6.3 6.3 0 1 0 16.2 14.6Z" />
      <path d="M16.8 4.6l.45 1.15L18.4 6.2l-1.15.45L16.8 7.8l-.45-1.15L15.2 6.2l1.15-.45Z" />
      <path d="M20.2 9.2l.28.7.72.28-.72.28-.28.7-.28-.7-.72-.28.72-.28Z" />
    </svg>
  );
}

const OPTIONS: Array<{ id: ThemeMode; label: string; icon: JSX.Element }> = [
  { id: 'light', label: 'Light', icon: <SunIcon /> },
  { id: 'system', label: 'System', icon: <MonitorIcon /> },
  { id: 'dark', label: 'Dark', icon: <MoonIcon /> },
];

function ThemeModeToggle() {
  const { mode, setMode, resolvedMode } = useThemeSettings();
  const selectedIndex = OPTIONS.findIndex((option) => option.id === mode);
  const isDark = resolvedMode === 'dark';

  return (
    <Box
      role="radiogroup"
      aria-label="Theme"
      sx={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        alignItems: 'center',
        height: 52,
        p: '4px',
        borderRadius: 999,
        bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#E6E6EA',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 4,
          bottom: 4,
          width: 'calc((100% - 8px) / 3)',
          left: `calc(4px + ${selectedIndex} * ((100% - 8px) / 3))`,
          borderRadius: 999,
          bgcolor: isDark ? '#2A3036' : '#FFFFFF',
          border: '1px solid',
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
          boxShadow: isDark ? '0 1px 4px rgba(0,0,0,0.35)' : '0 1px 3px rgba(0,0,0,0.08)',
          transition: 'left 200ms ease',
          pointerEvents: 'none',
        }}
      />
      {OPTIONS.map((option) => {
        const selected = mode === option.id;
        return (
          <Box
            key={option.id}
            component="button"
            type="button"
            role="radio"
            aria-label={option.label}
            aria-checked={selected}
            onClick={() => setMode(option.id)}
            sx={{
              position: 'relative',
              zIndex: 1,
              height: 44,
              border: 0,
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: selected ? (isDark ? '#F4F5F7' : '#111418') : isDark ? '#9AA3AD' : '#3A3F45',
              transition: 'color 160ms ease',
            }}
          >
            {option.icon}
          </Box>
        );
      })}
    </Box>
  );
}

export default ThemeModeToggle;
