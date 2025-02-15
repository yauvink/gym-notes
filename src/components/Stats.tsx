import { Alert, Box, Checkbox, FormControlLabel } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useAppContext } from '../providers/AppProvider/AppProvider.hook';
import { useMemo, useState } from 'react';
import { getExerciseAvarageWeight } from '../utils';
import ExerciseSelect from './common/ExerciseSelect';
import dayjs from 'dayjs';

function Stats() {
  const { userTrainingDays } = useAppContext();
  const [includeWarmups, setIncludeWarmups] = useState(false);
  const [showAverageWeight, setShowAverageWeight] = useState(true);
  const [selectedExerciseId, setSelectedExerciseId] = useState('bench_press');

  const data = useMemo(() => {
    const resultData: Array<{ date: number | string; weight: number }> = [];

    userTrainingDays
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .forEach((el) => {
        if (el.workout) {
          el.workout.exercises.forEach((exercise) => {
            if (selectedExerciseId === exercise.exercise_id) {
              if (!showAverageWeight) {
                exercise.sets.forEach((set) => {
                  if (includeWarmups || !set.wu) {
                    resultData.push({
                      date: dayjs(el.date).format('DD MMM'),
                      weight: set.kg,
                    });
                  }
                });
              } else {
                const averageWeight = getExerciseAvarageWeight(exercise, includeWarmups);
                resultData.push({
                  date: dayjs(el.date).format('DD MMM'),
                  weight: averageWeight,
                });
              }
            }
          });
        }
      });

    return resultData;
  }, [userTrainingDays, selectedExerciseId, includeWarmups, showAverageWeight]);

  console.log('data', data);
  return (
    <Box
      sx={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
      }}
    >
      <Box
        sx={{
          marginTop: '20px',
          display: 'flex',
          alignItems: 'flex-start',
          flexDirection: 'column',
          gap: '20px',
          width: '100%',
        }}
      >
        <ExerciseSelect exerciseId={selectedExerciseId} setExerciseId={setSelectedExerciseId} fade={10} />
        <FormControlLabel
          label="Include warmups"
          control={
            <Checkbox
              checked={includeWarmups}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setIncludeWarmups(event.target.checked);
              }}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          }
        ></FormControlLabel>
        <FormControlLabel
          label="Average exercise weight"
          control={
            <Checkbox
              checked={showAverageWeight}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setShowAverageWeight(event.target.checked);
              }}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          }
        ></FormControlLabel>

        {data.length === 0 ? (
          <Alert
            sx={{
              width: '100%',
            }}
            severity="warning"
          >
            No workouts data for selected excercise
          </Alert>
        ) : (
          <LineChart
            width={window.innerWidth - 20}
            height={300}
            data={data}
            style={
              {
                // border: '1px solid green',
              }
            }
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="right-axis" orientation="right" />
            <Tooltip />
            <Line yAxisId="right-axis" type="monotone" dataKey="weight" stroke="blue" />
          </LineChart>
        )}
      </Box>
    </Box>
  );
}

export default Stats;
