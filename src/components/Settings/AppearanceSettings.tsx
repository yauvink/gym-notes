import { Box, Button, Slider, Typography } from '@mui/material';
import { useThemeSettings } from '../../theme';
import { AMBER_COLORS, ThemeColors } from '../../theme/defaults';
import { hexToHsl, hslToHex } from '../../theme/colorUtils';
import ThemeModeToggle from './ThemeModeToggle';

const COLOR_LABELS: Record<keyof ThemeColors, string> = {
  primary: 'Primary',
  secondary: 'Secondary',
};

const DEFAULT_HUE_SATURATION = 80;
const DEFAULT_HUE_LIGHTNESS = 54;

function ColorSliders({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}) {
  const { h } = hexToHsl(value);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.5 }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            bgcolor: value,
            border: '2px solid',
            borderColor: 'divider',
            flexShrink: 0,
          }}
        />
        <Typography sx={{ fontWeight: 700, flex: 1, fontSize: 16 }}>{label}</Typography>
        <Typography sx={{ fontSize: 13, color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
          {value}
        </Typography>
      </Box>
      <Slider
        size="small"
        value={h}
        min={0}
        max={360}
        onChange={(_, next) => onChange(hslToHex(Number(next), DEFAULT_HUE_SATURATION, DEFAULT_HUE_LIGHTNESS))}
        sx={{
          color: value,
          py: 0.75,
          '& .MuiSlider-rail': {
            opacity: 1,
            height: 6,
            background: 'linear-gradient(90deg, #F00, #FF0, #0F0, #0FF, #00F, #F0F, #F00)',
          },
          '& .MuiSlider-track': { display: 'none' },
          '& .MuiSlider-thumb': { width: 22, height: 22 },
        }}
      />
    </Box>
  );
}

function isSameHex(a: string, b: string) {
  return a.replace('#', '').toUpperCase() === b.replace('#', '').toUpperCase();
}

function AppearanceSettings() {
  const { resolvedMode, colors, setColor, resetAmber, pickRandomColors } = useThemeSettings();
  const isAmberSelected =
    isSameHex(colors.primary, AMBER_COLORS.primary) && isSameHex(colors.secondary, AMBER_COLORS.secondary);

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 420,
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
      }}
    >
      <Box>
        <Typography sx={{ fontWeight: 800, mb: 0.5, fontSize: 20 }}>Appearance</Typography>
        <Typography sx={{ fontSize: 14, color: 'text.secondary', mb: 1.5 }}>
          Theme follows System, or stays Light / Dark. Current: {resolvedMode}.
        </Typography>
        <ThemeModeToggle />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          p: 2,
          borderRadius: 1,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography sx={{ fontWeight: 800, fontSize: 16 }}>Accent colors</Typography>
        {(Object.keys(COLOR_LABELS) as Array<keyof ThemeColors>).map((key) => (
          <ColorSliders key={key} label={COLOR_LABELS[key]} value={colors[key]} onChange={(hex) => setColor(key, hex)} />
        ))}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 0.5 }}>
          <Button
            variant="contained"
            onClick={resetAmber}
            disabled={isAmberSelected}
            sx={{
              bgcolor: AMBER_COLORS.primary,
              color: '#111418',
              '&:hover': { bgcolor: '#E39A12' },
              '&.Mui-disabled': {
                bgcolor: AMBER_COLORS.primary,
                color: '#111418',
                opacity: 0.4,
              },
            }}
          >
            Reset to default (amber)
          </Button>
          <Button variant="outlined" color="inherit" onClick={pickRandomColors}>
            Pick random colors
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default AppearanceSettings;
