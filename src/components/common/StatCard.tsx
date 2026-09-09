import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

function StatCard({
  label,
  value,
  valueSuffix,
  corner,
  accent,
  onClick,
}: {
  label: string;
  value: ReactNode;
  valueSuffix?: ReactNode;
  corner?: ReactNode;
  accent: string;
  onClick?: () => void;
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        flex: 1,
        minWidth: 0,
        p: '8px 20px',
        borderRadius: 1,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        '&:before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(160deg, ${accent}33, transparent 55%)`,
          pointerEvents: 'none',
        },
      }}
    >
      <Typography sx={{ fontSize: 14, color: 'text.secondary', fontWeight: 600, position: 'relative' }}>
        {label}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 0.75,
          mt: 0.25,
          position: 'relative',
          pr: corner ? 6 : 0,
        }}
      >
        <Typography
          sx={{
            fontFamily: '"Oswald", "Manrope", sans-serif',
            fontSize: 28,
            fontWeight: 700,
            lineHeight: 1,
            color: accent,
          }}
        >
          {value}
        </Typography>
        {valueSuffix ? (
          <Typography sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600 }}>{valueSuffix}</Typography>
        ) : null}
      </Box>
      {corner ? (
        <Typography
          sx={{
            position: 'absolute',
            right: '12px',
            bottom: '8px',
            fontSize: 12,
            fontWeight: 600,
            color: 'text.secondary',
            zIndex: 1,
          }}
        >
          {corner}
        </Typography>
      ) : null}
    </Box>
  );
}

export default StatCard;
