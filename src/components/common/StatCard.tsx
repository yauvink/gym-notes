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
      className="glass-surface"
      sx={{
        flex: 1,
        minWidth: 0,
        p: '10px 18px 12px',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        '&:before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(160deg, ${accent}2E, transparent 58%)`,
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
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: '-0.04em',
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
