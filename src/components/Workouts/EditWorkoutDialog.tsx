import { Box, Button, Dialog, TextField } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { ExerciseType, WorkoutType } from '../../providers/AppProvider/AppProvider';
import { useAppContext } from '../../providers/AppProvider/AppProvider.hook';
import Exercise from './Exercise';
import DeleteIcon from '@mui/icons-material/Delete';

function EditWorkoutDialog({
  closeDialog,
  editTrainingId,
}: {
  closeDialog: () => void;
  editTrainingId: string | null;
}) {
  const { workouts, setWorkouts, defaultRepeats, defaultWeight, allExercises, userTrainingDays } = useAppContext();
  const editInitialData = workouts.find((el) => el.id === editTrainingId);
  const [workoutName, setWorkoutName] = useState(editInitialData?.name ?? '');
  const INITIAL_WORKOUT_DATA: ExerciseType = {
    exercise_id: '',
    sets: [],
  };
  const [exercises, setExercises] = useState<ExerciseType[]>(editInitialData?.exercises ?? [INITIAL_WORKOUT_DATA]);
  const [expandedId, setExpandedId] = useState('');
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

  const topUpExercise = (index: number) => {
    console.log('index', index);
    setExercises((prev) => {
      if (index <= 0 || index >= prev.length) return prev; // No change if index is out of bounds

      const newArr = [...prev]; // Create a copy of the array

      // Swap elements
      [newArr[index], newArr[index - 1]] = [newArr[index - 1], newArr[index]];

      return newArr;
    });
  };

  const expandExercise = (id: string) => {
    // console.log('ii',index);
    setExpandedId(id);
  };

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
              allExercises={allExercises}
              expanded={expandedId === exercise.exercise_id}
              setExerciseId={(newValue) => {
                setExercises((prev) => {
                  return prev.map((el, i): ExerciseType => {
                    if (i === rowIndex) {
                      const sorted = userTrainingDays.sort(
                        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                      );
                      const latestExrcises: ExerciseType[] = [];
                      sorted.forEach((el) => {
                        if (el.workout) {
                          const savedExercise = el.workout.exercises.find(
                            (exercise) => exercise.exercise_id === newValue
                          );
                          if (savedExercise) {
                            latestExrcises.push(savedExercise);
                          }
                        }
                      });

                      if (latestExrcises.length > 0) {
                        return {
                          exercise_id: newValue,
                          sets: latestExrcises[0].sets,
                        };
                      }

                      return {
                        exercise_id: newValue,
                        sets: [{ reps: defaultRepeats, kg: defaultWeight }],
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
              handleTopUp={() => {
                topUpExercise(rowIndex);
              }}
              handleExpand={() => {
                expandExercise(exercise.exercise_id);
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

export default EditWorkoutDialog;
