import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

function StatCard({
  label,
  value,
  valueSuffix,
  corner,
  accent,
  flex = 1,
  headerAction,
  onClick,
}: {
  label: string;
  value: ReactNode;
  valueSuffix?: ReactNode;
  corner?: ReactNode;
  accent: string;
  flex?: number | string;
  headerAction?: ReactNode;
  onClick?: () => void;
}) {
  return (
    <Box
      onClick={onClick}
      className="glass-surface"
      sx={{
        flex,
        minWidth: 0,
        p: "10px 14px 12px",
        cursor: onClick ? "pointer" : "default",
        position: "relative",
        overflow: "hidden",
        "&:before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: `linear-gradient(160deg, ${accent}2E, transparent 58%)`,
          pointerEvents: "none",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 0.75,
          position: "relative",
          minHeight: 28,
        }}
      >
        <Typography
          sx={{
            fontSize: 14,
            color: "text.secondary",
            fontWeight: 600,
            minWidth: 0,
          }}
        >
          {label}
        </Typography>
        {headerAction}
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          mt: 0.25,
          position: "relative",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            gap: "2px",
            minWidth: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              color: accent,
            }}
          >
            {value}
          </Typography>
          {valueSuffix ? (
            <Typography
              sx={{
                fontSize: 13,
                color: "text.secondary",
                fontWeight: 600,
                lineHeight: 1,
              }}
            >
              {valueSuffix}
            </Typography>
          ) : null}
        </Box>
        {corner ? (
          <Box
            sx={{
              ml: "auto",
              fontSize: 13,
              fontWeight: 600,
              lineHeight: 1,
              color: "text.secondary",
              textAlign: "right",
              display: "flex",
              alignItems: "center",
            }}
          >
            {corner}
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}

export default StatCard;
