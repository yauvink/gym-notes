import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

function StatCard({
  label,
  value,
  caption,
  accent,
  onClick,
}: {
  label: string;
  value: ReactNode;
  caption?: ReactNode;
  accent: string;
  onClick?: () => void;
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        flex: 1,
        minWidth: 0,
        p: 1.5,
        borderRadius: 2,
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
      <Typography
        sx={{
          fontFamily: '"Oswald", "Manrope", sans-serif',
          fontSize: 36,
          fontWeight: 700,
          lineHeight: 1.05,
          mt: 0.75,
          position: 'relative',
          color: accent,
        }}
      >
        {value}
      </Typography>
      {caption ? (
        <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 0.5, position: 'relative' }}>{caption}</Typography>
      ) : null}
    </Box>
  );
}

export default StatCard;
