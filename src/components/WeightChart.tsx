import { Alert, Box, Button, Dialog, Paper, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppContext } from '../providers/AppProvider/AppProvider.hook';
import { NumberField } from '@base-ui-components/react/number-field';
import styles from './common/buttons.module.css';
import { MinusIcon, PlusIcon } from './common/Icons';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import { CartesianGrid, Line, LineChart, Tooltip } from 'recharts';
import { DayIcon, MorningIcon, NightIcon } from './common/TimeOfDayIcons';
import { useThemeSettings } from '../theme';
import WeightDetailDialog from './WeightDetailDialog';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const date: number = payload[0].payload.t;
    const value: number = payload[0].payload.w;
    return (
      <Paper
        sx={{
          padding: '10px',
        }}
      >
        <Typography
          sx={{
            fontSize: '15px',
          }}
        >
          {dayjs(date).format('DD MMM HH:mm')}
        </Typography>
        <Typography
          sx={{
            fontSize: '15px',
            fontWeight: 600,
          }}
        >
          {value} kg
        </Typography>
      </Paper>
    );
  }

  return null;
};

function WeightChart() {
  const { userWeightData, setUserWeightData } = useAppContext();
  const { colors } = useThemeSettings();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isDetailOpen, setDetailOpen] = useState(false);
  const sortedWeightData = userWeightData.sort((a, b) => a.t - b.t);
  const initialValue = sortedWeightData[sortedWeightData.length - 1]?.w ?? 80;
  const [userWeightValue, setUserWeightValue] = useState(initialValue);
  const [chartWidth, setChartWidth] = useState(0);
  const chartWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartWrapperRef.current) {
      setChartWidth(chartWrapperRef.current.getBoundingClientRect().width);
    }
    const handleResize = () => {
      if (chartWrapperRef.current) {
        setChartWidth(chartWrapperRef.current.getBoundingClientRect().width);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSaveWeight = useCallback(() => {
    if (userWeightValue) {
      setUserWeightData([
        ...userWeightData,
        {
          t: Date.now(),
          w: userWeightValue,
        },
      ]);
      setDialogOpen(false);
    }
  }, [userWeightValue, userWeightData, setUserWeightData]);

  const dataToShow = useMemo(() => {
    if (userWeightData.length > 0) {
      const sortedByDate = [...userWeightData].sort((a, b) => a.t - b.t);
      const sortedByWeight = [...userWeightData].sort((a, b) => a.w - b.w);
      const minValue = sortedByWeight[0].w;

      const converted = sortedByDate.map((el) => ({
        ...el,
        chartValue: el.w - minValue + 1,
      }));

      return converted;
    }
    return [];
  }, [userWeightData]);

  const getAverage = (weightData: Array<{ w: number }>) => {
    if (weightData.length > 0) {
      const average =
        weightData.reduce((prev, curr) => {
          return prev + curr.w;
        }, 0) / weightData.length;
      return average.toFixed(2);
    }
    return '-';
  };

  const weightData = useMemo(() => {
    const lastWeekData = dataToShow.filter((el) => el.t > Date.now() - 7 * 24 * 60 * 60 * 1000);
    if (lastWeekData.length > 0) {
      const morningWeightData = lastWeekData.filter((el) => {
        const hour = dayjs(el.t).hour();
        return hour >= 2 && hour < 12;
      });
      const dayWeightData = lastWeekData.filter((el) => {
        const hour = dayjs(el.t).hour();
        return hour >= 12 && hour < 18;
      });
      const eveningWeightData = lastWeekData.filter((el) => {
        const hour = dayjs(el.t).hour();
        return hour >= 18 || hour < 2;
      });
      const morningAverage = getAverage(morningWeightData);
      const dayAverage = getAverage(dayWeightData);
      const eveningAverage = getAverage(eveningWeightData);
      const dataToCalc = [
        ...(!isNaN(Number(morningAverage)) ? [{ w: Number(morningAverage) }] : []),
        ...(!isNaN(Number(dayAverage)) ? [{ w: Number(dayAverage) }] : []),
        ...(!isNaN(Number(eveningAverage)) ? [{ w: Number(eveningAverage) }] : []),
      ];
      const weeklyAverage = getAverage(dataToCalc);
      return {
        weeklyAverage: weeklyAverage,
        morningAverage: morningAverage,
        dayAverage: dayAverage,
        eveningAverage: eveningAverage,
      };
    } else {
      return { weeklyAverage: '?', morningAverage: '-', dayAverage: '-', eveningAverage: '-' };
    }
  }, [dataToShow]);

  return (
    <Box
      sx={{
        maxWidth: '500px',
        width: '100%',
        position: 'relative',
        mt: 0,
        p: '8px 10px',
        borderRadius: 1,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            gap: '10px',
          }}
        >
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 0.5,
            }}
          >
            <Box
              ref={chartWrapperRef}
              sx={{
                width: '100%',
                height: '84px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {dataToShow.length === 0 ? (
                <Alert
                  sx={{
                    width: '100%',
                  }}
                  severity="warning"
                >
                  No weight data to show
                </Alert>
              ) : (
                <LineChart width={chartWidth} height={84} data={dataToShow}>
                  <Tooltip content={<CustomTooltip />} />
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <Line type="monotone" dataKey="chartValue" stroke="var(--color-secondary)" dot={false} activeDot={false} />
                </LineChart>
              )}
            </Box>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => setDetailOpen(true)}
              disabled={dataToShow.length === 0}
              sx={{
                alignSelf: 'center',
                minHeight: 26,
                height: 26,
                px: 1.5,
                fontSize: 11,
                lineHeight: 1,
              }}
            >
              Expand
            </Button>
          </Box>

          <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '4px',
              }}
            >
            <Box
              sx={{
                display: 'flex',
                gap: '6px',
                div: {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  fontSize: '11px',
                  gap: '2px',
                },
              }}
            >
              <Box>
                <MorningIcon bg={colors.secondary} fg={colors.primary} size={34} />
                {weightData.morningAverage}
              </Box>
              <Box>
                <DayIcon bg={colors.secondary} fg={colors.primary} size={34} />
                {weightData.dayAverage}
              </Box>
              <Box>
                <NightIcon bg={colors.secondary} fg={colors.primary} size={34} />
                {weightData.eveningAverage}
              </Box>
            </Box>
            <Typography
              sx={{
                fontSize: '12px',
                textAlign: 'center',
                lineHeight: 1.2,
                span: {
                  fontSize: '14px',
                  fontWeight: 700,
                },
              }}
            >
              Weekly: <span>{weightData.weeklyAverage}</span> kg
            </Typography>
            <Button
              variant="contained"
              onClick={() => setDialogOpen(true)}
              sx={{
                fontSize: '13px',
                padding: '6px 10px',
                minHeight: 36,
                textWrap: 'nowrap',
              }}
            >
              Add weight
            </Button>
          </Box>
        </Box>
      </Box>

      <WeightDetailDialog
        open={isDetailOpen}
        onClose={() => setDetailOpen(false)}
        weightData={userWeightData}
      />

      <Dialog open={isDialogOpen}>
        <Box
          sx={{
            padding: '30px 20px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            width: '300px',
          }}
        >
          <Box
            onClick={() => setDialogOpen(false)}
            sx={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            <CloseIcon />
          </Box>

          <Typography>{dayjs(Date.now()).format('DD MMM YYYY HH:mm')}</Typography>
          <NumberField.Root
            className={styles.Field}
            value={userWeightValue}
            step={0.1}
            onValueChange={(value) => {
              if (value && value >= 10) {
                if (value > 300) {
                  setUserWeightValue(300);
                } else {
                  setUserWeightValue(value);
                }
              } else {
                setUserWeightValue(10);
              }
            }}
          >
            <NumberField.Group className={styles.Group}>
              <NumberField.Decrement className={styles.LargeDecrement}>
                <MinusIcon />
              </NumberField.Decrement>
              <NumberField.Input className={styles.LargeInput} inputMode="decimal" />
              <NumberField.Increment className={styles.LargeIncrement}>
                <PlusIcon />
              </NumberField.Increment>
            </NumberField.Group>
          </NumberField.Root>
          <Button fullWidth variant="outlined" onClick={handleSaveWeight}>
            Save weight
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}

export default WeightChart;
