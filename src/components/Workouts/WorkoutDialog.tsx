import { Box, Button, Dialog, TextField } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { ExerciseType, WorkoutType } from '../../providers/AppProvider/AppProvider';
import { useAppContext } from '../../providers/AppProvider/AppProvider.hook';
import Exercise from './Exercise';
import DeleteIcon from '@mui/icons-material/Delete';

function WorkoutDialog({ closeDialog, editTrainingId }: { closeDialog: () => void; editTrainingId: string | null }) {
  const { workouts, setWorkouts, defaultRepeats, defaultWeight } = useAppContext();
  const editInitialData = workouts.find((el) => el.id === editTrainingId);
  const [workoutName, setWorkoutName] = useState(editInitialData?.name ?? '');
  const INITIAL_WORKOUT_DATA: ExerciseType = {
    exercise_id: '',
    sets: [
      { wu: true, reps: defaultRepeats, kg: defaultWeight / 2 },
      { reps: defaultRepeats, kg: defaultWeight },
    ],
  };
  const [exercises, setExercises] = useState<ExerciseType[]>(editInitialData?.exercises ?? [INITIAL_WORKOUT_DATA]);

  const handleSaveTraining = useCallback(() => {
    const newWorkouts: WorkoutType[] = editTrainingId
      ? workouts.map((el) => {
          if (el.id === editTrainingId) {
            return {
              ...el,
              name: workoutName,
              exercises,
            };
          }
          return el;
        })
      : [
          ...workouts,
          {
            id: crypto.randomUUID(),
            name: workoutName,
            exercises,
          },
        ];
    setWorkouts(newWorkouts);
    closeDialog();
  }, [setWorkouts, workouts, workoutName, exercises, closeDialog, editTrainingId]);

  const handleAddExercise = () => {
    setExercises((prev) => [...prev, INITIAL_WORKOUT_DATA]);
  };

  const handleDeleteExercise = (rowIndex: number) => {
    if (window.confirm('Remove this exercise?')) {
      setExercises((prev) => [...prev.slice(0, rowIndex), ...prev.slice(rowIndex + 1, prev.length)]);
    }
  };

  const handleDeleteTraining = () => {
    if (editTrainingId) {
      if (window.confirm('Are you sure want to delete this workout? This action cannot be undone.')) {
        const newWorkouts = workouts.filter((el) => el.id !== editTrainingId);
        setWorkouts(newWorkouts);
        closeDialog();
      }
    }
  };

  const isDisabled = useMemo(() => {
    return workoutName === '' || exercises.some((el) => el.exercise_id === '');
  }, [workoutName, exercises]);

  return (
    <Dialog
      fullScreen
      open
      sx={{
        '& .MuiPaper-root': {
          // margin: '0px',
          // width: '100%',
          maxWidth: '600px',
        },
      }}
    >
      <Box
        sx={{
          // backgroundColor: 'grey',
          padding: '60px 5px 120px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {editTrainingId && (
          <Box
            onClick={() => handleDeleteTraining()}
            sx={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              color: 'red',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            <DeleteIcon />
          </Box>
        )}
        <Box
          onClick={() => closeDialog()}
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
        <Box
          sx={{
            display: 'flex',
          }}
        >
          <TextField
            sx={{
              width: '100%',
            }}
            placeholder="Workout name"
            label="Workout name"
            error={workoutName === ''}
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
          ></TextField>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {exercises.map((exercise, rowIndex, arr) => (
            <Exercise
              key={rowIndex}
              exerciseIndex={rowIndex}
              showDelete={arr.length > 1}
              exerciseId={exercise.exercise_id}
              setExerciseId={(newValue) => {
                setExercises((prev) => {
                  return prev.map((el, i): ExerciseType => {
                    if (i === rowIndex) {
                      return {
                        ...el,
                        exercise_id: newValue,
                      };
                    }
                    return el;
                  });
                });
              }}
              sets={exercise.sets}
              setSets={(newValue) => {
                setExercises((prev) => {
                  return prev.map((el, i): ExerciseType => {
                    if (i === rowIndex) {
                      return {
                        ...el,
                        sets: newValue,
                      };
                    }
                    return el;
                  });
                });
              }}
              handleDeleteExercise={() => {
                handleDeleteExercise(rowIndex);
              }}
            />
          ))}
        </Box>

        <Button variant="contained" color="inherit" onClick={() => handleAddExercise()}>
          + Add exercise
        </Button>

        <Button disabled={isDisabled} variant="contained" onClick={() => handleSaveTraining()}>
          Save workout
        </Button>
      </Box>
    </Dialog>
  );
}

export default WorkoutDialog;
