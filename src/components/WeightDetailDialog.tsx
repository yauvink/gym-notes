import { Box, Dialog, IconButton, Paper, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useThemeSettings } from '../theme';
import { UserWeightDataType } from '../providers/AppProvider/AppProvider.constants';

type PeriodId = '1m' | '6m' | 'max';

const PERIODS: Array<{ id: PeriodId; label: string }> = [
  { id: '1m', label: '1 mo' },
  { id: '6m', label: '6 mo' },
  { id: 'max', label: 'Max' },
];

function periodStart(period: PeriodId, minTimestamp: number) {
  if (period === '1m') {
    return dayjs().subtract(1, 'month').valueOf();
  }
  if (period === '6m') {
    return dayjs().subtract(6, 'month').valueOf();
  }
  return minTimestamp;
}

function formatAxisDate(value: number, period: PeriodId) {
  if (period === '1m') {
    return dayjs(value).format('D MMM');
  }
  if (period === '6m') {
    return dayjs(value).format('MMM');
  }
  return dayjs(value).format('MMM YY');
}

function WeightTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: UserWeightDataType }> }) {
  if (!active || !payload?.length) {
    return null;
  }
  const point = payload[0].payload;
  return (
    <Paper sx={{ px: 1.25, py: 1 }}>
      <Typography sx={{ fontSize: 14 }}>{dayjs(point.t).format('DD MMM YYYY HH:mm')}</Typography>
      <Typography sx={{ fontSize: 16, fontWeight: 700 }}>{point.w} kg</Typography>
    </Paper>
  );
}

function WeightDetailDialog({
  open,
  onClose,
  weightData,
}: {
  open: boolean;
  onClose: () => void;
  weightData: UserWeightDataType[];
}) {
  const { colors } = useThemeSettings();
  const [period, setPeriod] = useState<PeriodId>('6m');

  const sorted = useMemo(() => [...weightData].sort((a, b) => a.t - b.t), [weightData]);
  const minTimestamp = sorted[0]?.t ?? Date.now();
  const from = periodStart(period, minTimestamp);
  const to = Date.now();

  const chartData = useMemo(() => sorted.filter((el) => el.t >= from && el.t <= to), [sorted, from, to]);
  const xDomain: [number, number] | undefined =
    chartData.length > 0 ? [chartData[0].t, chartData[chartData.length - 1].t] : undefined;

  const yDomain = useMemo<[number, number]>(() => {
    if (chartData.length === 0) {
      return [0, 100];
    }
    const weights = chartData.map((el) => el.w);
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const pad = Math.max(0.4, (max - min) * 0.14);
    return [min - pad, max + pad];
  }, [chartData]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          m: 1,
          width: 'calc(100% - 16px)',
          maxHeight: '90dvh',
        },
      }}
      TransitionProps={{
        onExited: () => setPeriod('6m'),
      }}
    >
      <Box sx={{ p: '12px 12px 16px', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontWeight: 800, fontSize: 18 }}>Weight</Typography>
          <IconButton onClick={onClose} size="small" aria-label="Close">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            px: 0.5,
            py: 0.4,
            borderRadius: 999,
            bgcolor: 'var(--glass-bg)',
            border: '0.5px solid var(--glass-border)',
          }}
        >
          {PERIODS.map((item) => {
            const selected = period === item.id;
            return (
              <Box
                key={item.id}
                component="button"
                type="button"
                onClick={() => setPeriod(item.id)}
                sx={{
                  appearance: 'none',
                  border: 0,
                  background: selected ? `${colors.primary}33` : 'transparent',
                  color: selected ? colors.primary : 'text.secondary',
                  fontWeight: selected ? 800 : 600,
                  fontSize: 14,
                  fontFamily: 'inherit',
                  px: 1.75,
                  py: 0.65,
                  borderRadius: 999,
                  cursor: 'pointer',
                }}
              >
                {item.label}
              </Box>
            );
          })}
        </Box>

        <Box sx={{ width: '100%', height: 280 }}>
          {chartData.length === 0 ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary',
                fontSize: 14,
              }}
            >
              No weight data for this period
            </Box>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis
                  type="number"
                  dataKey="t"
                  domain={xDomain}
                  padding={{ left: 0, right: 0 }}
                  tickFormatter={(value) => formatAxisDate(Number(value), period)}
                  tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                  tickLine={{ stroke: 'var(--border-subtle)' }}
                  axisLine={{ stroke: 'var(--border-subtle)' }}
                  minTickGap={28}
                />
                <YAxis
                  dataKey="w"
                  domain={yDomain}
                  width={42}
                  tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => Number(value).toFixed(1)}
                />
                <Tooltip content={<WeightTooltip />} />
                <Line
                  type="monotone"
                  dataKey="w"
                  stroke="var(--color-secondary)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Box>
      </Box>
    </Dialog>
  );
}

export default WeightDetailDialog;
