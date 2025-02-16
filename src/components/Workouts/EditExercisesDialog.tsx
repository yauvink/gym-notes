import { Box, Button, Dialog, Paper, TextField } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useAppContext } from '../../providers/AppProvider/AppProvider.hook';
import { GroupedExerciseOptionType } from '../../providers/AppProvider/AppProvider.constants';
import { getExerciseColorByCategory } from '../../utils';

const renderGroup = (
  groupedOptions: GroupedExerciseOptionType,
  handleChangeValue: (value: string, id: string) => void
) => {
  const items = groupedOptions.exercises.map((exercise) => {
    return (
      <Box
        key={exercise.id}
        sx={{
          padding: '5px 10px',
        }}
      >
        <TextField
          error={exercise.name.length < 5}
          fullWidth
          sx={{
            padding: '0px',
            '& .MuiInputBase-input': {
              padding: '5px 5px',
            },
          }}
          onChange={(e) => {
            handleChangeValue(e.target.value, exercise.id);
          }}
          value={exercise.name}
        ></TextField>
      </Box>
    );
  });
  return [
    <Box
      key={groupedOptions.category}
      sx={{
        background: `${getExerciseColorByCategory(groupedOptions.category)}`,
        padding: '5px',
        margin: '5px 0',
      }}
    >
      {groupedOptions.category}
    </Box>,
    items,
  ];
};

function EditExercisesDialog({ closeDialog }: { closeDialog: () => void }) {
  const { allExercises, setCustomExercises } = useAppContext();
  const [localExercisesData, setLocalExercisesData] = useState(allExercises);
  const groupedByCategoryExercises: Array<GroupedExerciseOptionType> = useMemo(() => {
    const groupedExercises: any = {};

    localExercisesData.forEach((exercise) => {
      const category = exercise.optionCategory;
      if (!groupedExercises[category]) {
        groupedExercises[category] = {
          category: category,
          exercises: [],
        };
      }
      groupedExercises[category].exercises.push(exercise);
    });

    return Object.values(groupedExercises);
  }, [localExercisesData]);

  const handleChangeValue = (newValue: string, id: string) => {
    const newData = localExercisesData.map((exercise) => {
      if (exercise.id === id) {
        return {
          ...exercise,
          name: newValue,
        };
      }
      return exercise;
    });
    setLocalExercisesData(newData);
  };

  const handleSaveExercises = useCallback(() => {
    setCustomExercises(localExercisesData);
    closeDialog();
  }, [localExercisesData, setCustomExercises, closeDialog]);

  const isSaveDisabled = useMemo(() => {
    return localExercisesData.some((ex) => ex.name.length < 5);
  }, [localExercisesData]);

  return (
    <Dialog fullScreen open>
      <Box
        sx={{
          padding: '60px 10px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
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
        <Paper elevation={3}>
          <Box>
            {groupedByCategoryExercises?.map((groupedOptions) => renderGroup(groupedOptions, handleChangeValue))}
          </Box>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              padding: '20px',
            }}
          ></Box>
        </Paper>
        <Button
          disabled={isSaveDisabled}
          variant="contained"
          sx={{
            margin: '20px 0 30px',
          }}
          onClick={() => {
            handleSaveExercises();
          }}
        >
          Save
        </Button>
      </Box>
    </Dialog>
  );
}

export default EditExercisesDialog;
