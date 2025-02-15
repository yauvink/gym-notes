import { Alert, Box, Button, Dialog, Paper, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppContext } from '../providers/AppProvider/AppProvider.hook';
import { NumberField } from '@base-ui-components/react/number-field';
import styles from './common/buttons.module.css';
import { MinusIcon, PlusIcon } from './common/Icons';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';

const VERTICAL_LINES = [0.25, 0.5, 0.75];
const HORIZONTAL_LINES = [0.16, 0.33, 0.5, 0.66, 0.83];

function WeightChart() {
  const { userWeightData, setUserWeightData } = useAppContext();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const sortedWeightData = userWeightData.sort((a, b) => a.t - b.t);
  const initialValue = sortedWeightData[sortedWeightData.length - 1]?.w ?? 80;
  const [userWeightValue, setUserWeightValue] = useState(initialValue);

  // const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  // const canvas = canvasRef.current;
  // const context = canvas?.getContext('2d');
  // const [currentValuePosition, setCurrentValuePosition] = useState(0);
  // // console.log('currentValuePosition', currentValuePosition);
  // const initialDataMock = [
  //   { time: '2018-12-15', value: 32.51 },
  //   { time: '2018-12-23', value: 31.11 },
  //   { time: '2018-12-24', value: 27.02 },
  //   { time: '2018-12-25', value: 27.32 },
  //   { time: '2018-12-26', value: 25.17 },
  //   { time: '2018-12-27', value: 28.89 },
  //   { time: '2018-12-28', value: 25.46 },
  //   { time: '2018-12-29', value: 23.92 },
  //   { time: '2018-12-30', value: 22.98 },
  //   { time: '2018-12-31', value: 22.67 },
  // ];

  // const chartData = initialDataMock
  //   .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
  //   .filter((el, index, arr) => {
  //     if (arr[index + 1]) {
  //       return el.time !== arr[index + 1].time;
  //     }
  //     return true;
  //   });

  // const { chartMaxValue, chartMinValue, chartMaxTime, chartMinTime } = useMemo(() => {
  //   let chartMaxValue = 0;
  //   let chartMinValue = 0;
  //   let chartMaxTime = 0;
  //   let chartMinTime = 0;
  //   chartData.forEach((el) => {
  //     if (chartMaxValue === 0 || chartMaxValue < el.value) {
  //       chartMaxValue = el.value;
  //     }
  //     if (chartMinValue === 0 || chartMinValue > el.value) {
  //       chartMinValue = el.value;
  //     }
  //     const time = typeof el.time === 'string' ? new Date(el.time).getTime() : el.time * 1000;
  //     if (chartMaxTime === 0 || chartMaxTime < time) {
  //       chartMaxTime = time;
  //     }
  //     if (chartMinTime === 0 || chartMinTime > time) {
  //       chartMinTime = time;
  //     }
  //   });
  //   return { chartMaxValue, chartMinValue, chartMaxTime, chartMinTime };
  // }, [chartData]);

  // const currentValue = useMemo(() => {
  //   const value = chartData[chartData.length - 1].value;
  //   if (value < 1) {
  //     return value.toFixed(9);
  //   }
  //   return chartData[chartData.length - 1].value;
  // }, [chartData]);
  // // console.log('currentValue', currentValue);

  // const CANVAS_WIDTH = canvasWrapperRef.current?.offsetWidth ?? 0;
  // const CANVAS_HEIGHT = canvasWrapperRef.current?.offsetHeight ?? 0;
  // const RIGHT_BLOCK_WIDTH = 103;
  // const BOTTOM_BLOCK_HEIGHT = 36;
  // const CHART_WIDTH = CANVAS_WIDTH - RIGHT_BLOCK_WIDTH;
  // const CHART_HEIGHT = CANVAS_HEIGHT - BOTTOM_BLOCK_HEIGHT;

  // useEffect(() => {
  //   console.log('canvas && context && canvasWrapperRef.current', canvas, context, canvasWrapperRef.current);
  //   if (canvas && context && canvasWrapperRef.current) {
  //     canvas.width = CANVAS_WIDTH;
  //     canvas.height = CANVAS_HEIGHT;
  //     console.log('tyt');
  //     context.fillStyle = '#090909';
  //     context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  //     const CHART_STEP_WIDTH = (CANVAS_WIDTH - RIGHT_BLOCK_WIDTH) / chartData.length;
  //     const getY = (value: number) => {
  //       const OFFSET = 40;
  //       const percentage = (value - chartMinValue) / ((chartMaxValue - chartMinValue) / 100);
  //       const result = (CANVAS_HEIGHT - OFFSET - BOTTOM_BLOCK_HEIGHT) * ((100 - percentage) / 100);

  //       return result + OFFSET / 2;
  //     };

  //     VERTICAL_LINES.forEach((line) => {
  //       context.beginPath();
  //       context.lineTo(CHART_WIDTH * line, 0);
  //       context.lineTo(CHART_WIDTH * line, CHART_HEIGHT);
  //       context.lineWidth = 1;
  //       context.strokeStyle = 'rgba(255, 255, 255, 0.20)';
  //       context.stroke();
  //     });

  //     HORIZONTAL_LINES.forEach((line) => {
  //       context.beginPath();
  //       context.lineTo(0, CHART_HEIGHT * line);
  //       context.lineTo(CHART_WIDTH, CHART_HEIGHT * line);
  //       context.lineWidth = 1;
  //       context.strokeStyle = 'rgba(255, 255, 255, 0.20)';
  //       context.stroke();
  //     });

  //     context.beginPath();
  //     chartData.forEach((el, index, arr) => {
  //       context.lineTo(index * CHART_STEP_WIDTH, getY(el.value));
  //       if (index !== arr.length - 1) {
  //         context.lineTo(index * CHART_STEP_WIDTH + CHART_STEP_WIDTH, getY(el.value));
  //       }
  //     });
  //     context.lineWidth = 2;
  //     context.strokeStyle = '#70FF4D';
  //     context.stroke();

  //     context.beginPath();
  //     context.lineTo(CHART_WIDTH, 0);
  //     context.lineTo(CHART_WIDTH, CHART_HEIGHT);
  //     context.lineTo(0, CHART_HEIGHT);
  //     context.lineTo(CANVAS_WIDTH, CHART_HEIGHT);
  //     context.lineWidth = 1;
  //     context.strokeStyle = 'rgba(255, 255, 255, 0.20)';
  //     context.stroke();

  //     const currentValuePositionY = getY(chartData[chartData.length - 1].value);
  //     setCurrentValuePosition(currentValuePositionY);
  //     context.beginPath();
  //     context.lineTo(0, currentValuePositionY);
  //     context.lineTo(CHART_WIDTH + 50, currentValuePositionY);
  //     context.setLineDash([4, 4]);
  //     context.lineWidth = 1;
  //     context.strokeStyle = '#70FF4D';
  //     context.stroke();
  //   }
  // }, [
  //   context,
  //   canvasWrapperRef,
  //   chartData,
  //   canvas,
  //   CANVAS_WIDTH,
  //   CANVAS_HEIGHT,
  //   CHART_HEIGHT,
  //   CHART_WIDTH,
  //   chartMaxValue,
  //   chartMinValue,
  // ]);

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

  return (
    <Box
      ref={canvasWrapperRef}
      sx={{
        maxWidth: '500px',
        // height: '335px',
        // minWidth: '200px',
        position: 'relative',
      }}
    >
      {/* <canvas
        width={'200px'}
        height={'200px'}
        style={{
          width: '100%',
          height: '100%',
        }}
        ref={canvasRef}
      /> */}

      {userWeightData.length === 0 ? (
        <Alert
          sx={{
            width: '100%',
          }}
          severity="warning"
        >
          No weight data to show
        </Alert>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            flexWrap: 'wrap',
          }}
        >
          {userWeightData.map((el, i) => (
            <Paper
              elevation={3}
              key={i}
              sx={{
                padding: '5px',
                // border: '1px solid red'
              }}
            >
              <Typography
                sx={{
                  fontSize: '10px',
                  textAlign: 'center',
                }}
              >
                {dayjs(el.t).format('DD MMM HH:mm')}
                <br />
                {el.w} kg
              </Typography>
            </Paper>
          ))}
          <Button variant="contained" onClick={() => setDialogOpen(true)}>
            Add weight
          </Button>
        </Box>
      )}

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
