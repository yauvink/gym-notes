import { Alert, Box, Button, Dialog, Paper, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppContext } from '../providers/AppProvider/AppProvider.hook';
import { NumberField } from '@base-ui-components/react/number-field';
import styles from './common/buttons.module.css';
import { MinusIcon, PlusIcon } from './common/Icons';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import { CartesianGrid, Line, LineChart, Tooltip } from 'recharts';

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
            fontSize: '14px',
          }}
        >
          {dayjs(date).format('DD MMM HH:mm')}
        </Typography>
        <Typography
          sx={{
            fontSize: '14px',
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
  const [isDialogOpen, setDialogOpen] = useState(false);
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
            ref={chartWrapperRef}
            sx={{
              width: '100%',
              height: '100px',
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
              <LineChart width={chartWidth} height={100} data={dataToShow}>
                <Tooltip content={<CustomTooltip />} />
                <CartesianGrid strokeDasharray="3 3" />
                <Line type="monotone" dataKey="chartValue" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            )}
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '2px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                div: {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  fontSize: '10px',
                  svg: {
                    width: '40px',
                    maxWidth: '40px',
                  },
                },
              }}
            >
              <Box>
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <rect width="200" height="200" fill="skyblue" />
                  <circle cx="100" cy="140" r="40" fill="orange" />
                  <rect x="0" y="140" width="200" height="60" fill="lightyellow" />
                </svg>
                {weightData.morningAverage}
              </Box>
              <Box>
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <rect width="200" height="200" fill="deepskyblue" />
                  <circle cx="100" cy="80" r="40" fill="yellow" />
                </svg>
                {weightData.dayAverage}
              </Box>
              <Box>
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <rect width="200" height="200" fill="midnightblue" />
                  <circle cx="130" cy="60" r="30" fill="lightgray" />
                  <circle cx="125" cy="55" r="30" fill="midnightblue" />
                  <circle cx="50" cy="40" r="3" fill="white" />
                  <circle cx="70" cy="80" r="2" fill="white" />
                  <circle cx="150" cy="120" r="2.5" fill="white" />
                </svg>
                {weightData.eveningAverage}
              </Box>
            </Box>
            <Typography
              sx={{
                fontSize: '10px',
                textAlign: 'center',
                span: {
                  fontSize: '14px',
                },
              }}
            >
              Weekly: <span>{weightData.weeklyAverage}</span> kg
            </Typography>
            <Button
              variant="contained"
              onClick={() => setDialogOpen(true)}
              sx={{
                fontSize: '10px',
                padding: '5px',
                textWrap: 'nowrap',
                // width: '90px'
              }}
            >
              Add weight
            </Button>
          </Box>
        </Box>
      </Box>

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
