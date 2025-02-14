import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useAppContext } from '../providers/AppProvider/AppProvider.hook';
import { useMemo, useState } from 'react';
import { EXERCISES } from '../providers/AppProvider/AppProvider.constants';
import { getExerciseAvarageWeight, getExerciseName } from '../utils';
import { ExerciseType } from '../providers/AppProvider/AppProvider';

function Stats() {
  const { userTrainingDays } = useAppContext();
  // const selectedCathegory = MuscleGroup.Chest
  const selectedExerciseId = EXERCISES[0].id;
  const [includeWarmups, setIncludeWarmups] = useState(false);

  const data = useMemo(() => {
    console.log('userTrainingDays', userTrainingDays);
    const exerToCalculate: ExerciseType[] = [];
    const resData: Array<{ date: number | string; weight: number }> = [];

    userTrainingDays
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .forEach((el) => {
        if (el.workout) {
          el.workout.exercises.forEach((exercise) => {
            // const exCategory = getExerciseData(exercise.exercise_id)?.optionCategory;
            // console.log('exCategory',exCategory);
            // console.log('selectedExercise',selectedExercise);
            // if (exCategory === selectedExercise) {
            //   exerToCalculate.push(exercise)
            // }

            if (selectedExerciseId === exercise.exercise_id) {
              exerToCalculate.push(exercise);

              const averageWeight = getExerciseAvarageWeight(exercise, includeWarmups);

              resData.push({
                // date: new Date(el.date).getTime(),
                date: el.date.slice(5, 10),
                weight: averageWeight,
              });
            }
          });
        }
      });
    console.log('resData', resData);

    return resData;
  }, [userTrainingDays, selectedExerciseId, includeWarmups]);

  return (
    <Box
      sx={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <Box
        sx={{
          // border: '1px solid red',
          marginTop: '100px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        <Typography>{getExerciseName(selectedExerciseId)}</Typography>
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
        <LineChart width={375} height={200} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          {/* <YAxis yAxisId="left-axis" /> */}
          <YAxis yAxisId="right-axis" orientation="right" />
          <Tooltip />
          {/* <Line
            yAxisId="left-axis"
            // 'basis' | 'basisClosed' | 'basisOpen' | 'bumpX' | 'bumpY' | 'bump' | 'linear' | 'linearClosed' | 'natural' | 'monotoneX' | 'monotoneY' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter' | CurveFactory;
            type="monotone"
            dataKey="date"
            stroke="pink"
          /> */}
          <Line yAxisId="right-axis" type="monotone" dataKey="weight" stroke="blue" />
        </LineChart>
      </Box>
    </Box>
  );
}

export default Stats;
