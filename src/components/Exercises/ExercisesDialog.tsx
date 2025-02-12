import { Box, Button, Dialog, TextField, Typography } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { TrainingExerciseType, INITIAL_EXERCISE_DATA, TrainingType } from '../../providers/AppProvider/AppProvider';
import { useAppContext } from '../../providers/AppProvider/AppProvider.hook';
import ExerciseInputRow from './ExerciseInputRow';
import DeleteIcon from '@mui/icons-material/Delete';

function ExercisesDialog({ closeDialog, editTrainingId }: { closeDialog: () => void; editTrainingId: string | null }) {
  const { trainings, setTrainings } = useAppContext();
  const editInitialData = trainings.find((el) => el.id === editTrainingId);
  const [trainingName, setTrainingName] = useState(editInitialData?.name ?? '');
  const [exercises, setExercises] = useState<TrainingExerciseType[]>(
    editInitialData?.exercises ?? [INITIAL_EXERCISE_DATA]
  );

  const handleSaveTraining = useCallback(() => {
    const newTrainings: TrainingType[] = editTrainingId
      ? trainings.map((el) => {
          if (el.id === editTrainingId) {
            return {
              ...el,
              name: trainingName,
              exercises,
            };
          }
          return el;
        })
      : [
          ...trainings,
          {
            id: crypto.randomUUID(),
            name: trainingName,
            exercises,
          },
        ];
    setTrainings(newTrainings);
    closeDialog();
  }, [setTrainings, trainings, trainingName, exercises, closeDialog, editTrainingId]);

  const handleAddExercise = () => {
    setExercises((prev) => [...prev, INITIAL_EXERCISE_DATA]);
  };

  const handleDeleteExercise = (rowIndex: number) => {
    setExercises((prev) => [...prev.slice(0, rowIndex), ...prev.slice(rowIndex + 1, prev.length)]);
  };

  const handleDeleteTraining = () => {
    if (editTrainingId) {
      if (window.confirm('Are you sure want to delete this training?')) {
        const newTrainings = trainings.filter((el) => el.id !== editTrainingId);
        setTrainings(newTrainings);
        closeDialog();
      }
    }
  };

  const isDisabled = useMemo(() => {
    return trainingName === '' || exercises.some((el) => el.exercise_id === '');
  }, [trainingName, exercises]);

  return (
    <Dialog
      open
      sx={{
        '& .MuiPaper-root': {
          margin: '5px',
          width: '100%',
        },
      }}
    >
      <Box
        sx={{
          padding: '60px 5px 20px',
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
            placeholder="Training name"
            label="Training name"
            error={trainingName === ''}
            value={trainingName}
            onChange={(e) => setTrainingName(e.target.value)}
          ></TextField>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            '& .border': {
              borderBottom: '1px solid lightgrey',
            },
            '& .wrapper': {
              display: 'flex',
              width: '100%',
              padding: '5px 0px',
              gap: '10px',
              '& .name': {
                width: '100%',
              },
              '& .sets': {
                width: '90px',
                minWidth: '90px',
                textAlign: 'center',
              },
              '& .weight': {
                minWidth: '90px',
                width: '90px',
                textAlign: 'center',
              },
              '& .remove': {
                width: '24px',
                minWidth: '24px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'red',
              },
            },
          }}
        >
          <Typography>Exercises:</Typography>
          {exercises.map((exercise, rowIndex, arr) => (
            <ExerciseInputRow
              key={rowIndex}
              showDelete={arr.length > 1}
              exerciseId={exercise.exercise_id}
              setExerciseId={(newValue) => {
                setExercises((prev) => {
                  return prev.map((el, i) => {
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
                  return prev.map((el, i) => {
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
              weight={exercise.weight}
              setWeight={(newValue) => {
                setExercises((prev) => {
                  return prev.map((el, i) => {
                    if (i === rowIndex) {
                      return {
                        ...el,
                        weight: newValue,
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

          <Button variant="contained" color="secondary" onClick={() => handleAddExercise()} sx={{ marginTop: '10px' }}>
            + Add exercise
          </Button>
        </Box>

        <Button disabled={isDisabled} variant="contained" onClick={() => handleSaveTraining()}>
          Save
        </Button>
      </Box>
    </Dialog>
  );
}

export default ExercisesDialog;
