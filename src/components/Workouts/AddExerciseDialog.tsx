import {
  Box,
  Button,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { useCallback, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useAppContext } from '../../providers/AppProvider/AppProvider.hook';
import { ExerciseOptionType, MuscleGroup } from '../../providers/AppProvider/AppProvider.constants';
import { getExerciseColorByCategory } from '../../utils';

function AddExerciseDialog({ closeDialog }: { closeDialog: () => void }) {
  const { customExercises, setCustomExercises } = useAppContext();
  const [exerciseName, setExerciseName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(MuscleGroup.Chest);

  const handleAddExercise = useCallback(() => {
    const newCustomExercises: ExerciseOptionType[] = [
      ...customExercises,
      {
        id: String(new Date().getTime()),
        name: exerciseName,
        optionCategory: selectedCategory,
      },
    ];
    setCustomExercises(newCustomExercises);
    closeDialog();
  }, [exerciseName, selectedCategory, customExercises, setCustomExercises, closeDialog]);

  return (
    <Dialog
      open
      sx={{
        '& .MuiPaper-root': {
          width: '300px',
          maxWidth: '600px',
        },
      }}
    >
      <Box
        sx={{
          padding: '60px 20px 20px',
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
        <TextField
          sx={{
            width: '100%',
          }}
          placeholder="Exercise name"
          label="Exercise name"
          error={exerciseName === ''}
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
        ></TextField>
        <FormControl fullWidth>
          <InputLabel>Select category</InputLabel>
          <Select
            value={selectedCategory}
            label="Select workout"
            onChange={(event: SelectChangeEvent) => {
              setSelectedCategory(event.target.value as MuscleGroup);
            }}
          >
            {(Object.keys(MuscleGroup) as Array<keyof typeof MuscleGroup>).map((el, i) => (
              <MenuItem
                key={i}
                value={el}
                sx={{
                  background: `${getExerciseColorByCategory(el as MuscleGroup)}60`,
                }}
              >
                {el}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button disabled={exerciseName.length < 2} variant="contained" onClick={() => handleAddExercise()}>
          Save new exercise
        </Button>
      </Box>
    </Dialog>
  );
}

export default AddExerciseDialog;
