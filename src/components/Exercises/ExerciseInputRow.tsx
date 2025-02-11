import { Box, TextField } from '@mui/material';
import { NumberField } from '@base-ui-components/react/number-field';
import styles from './index.module.css';
import DeleteIcon from '@mui/icons-material/Delete';

function PlusIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentcolor"
      strokeWidth="1.6"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M0 5H5M10 5H5M5 5V0M5 5V10" />
    </svg>
  );
}

function MinusIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentcolor"
      strokeWidth="1.6"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M0 5H10" />
    </svg>
  );
}

function ExerciseInputRow({
  exerciseName,
  setExerciseName,
  sets,
  setSets,
  weight,
  setWeight,
  handleDeleteExercise,
  showDelete,
}: {
  exerciseName: string;
  setExerciseName: (v: string) => void;
  sets: number;
  setSets: (v: number) => void;
  weight: number;
  setWeight: (v: number) => void;
  handleDeleteExercise: () => void;
  showDelete: boolean;
}) {
  return (
    <Box
      className="wrapper"
      sx={
        {
          // background: 'lightgrey',
        }
      }
    >
      <Box className="name">
        <TextField
          error={exerciseName === ''}
          placeholder="Exercise name"
          value={exerciseName}
          onChange={(e) => {
            setExerciseName(e.target.value);
          }}
        ></TextField>
      </Box>
      <Box className="sets">
        <NumberField.Root
          inputMode="numeric"
          className={styles.Field}
          value={sets}
          onValueChange={(value) => {
            if (value && value >= 1) {
              if (value > 10) {
                setSets(10);
              } else {
                setSets(value);
              }
            } else {
              setSets(1);
            }
          }}
        >
          <NumberField.Group className={styles.Group}>
            <NumberField.Decrement className={styles.Decrement}>
              <MinusIcon />
            </NumberField.Decrement>
            <NumberField.Input className={styles.Input} />
            <NumberField.Increment className={styles.Increment}>
              <PlusIcon />
            </NumberField.Increment>
          </NumberField.Group>
        </NumberField.Root>
      </Box>
      <Box className="weight">
        <NumberField.Root
          inputMode="numeric"
          className={styles.Field}
          value={weight}
          onValueChange={(value) => {
            if (value && value >= 5) {
              if (value > 300) {
                setWeight(300);
              } else {
                setWeight(value);
              }
            } else {
              setWeight(5);
            }
          }}
        >
          <NumberField.Group className={styles.Group}>
            <NumberField.Decrement className={styles.Decrement}>
              <MinusIcon />
            </NumberField.Decrement>
            <NumberField.Input className={styles.Input} />
            <NumberField.Increment className={styles.Increment}>
              <PlusIcon />
            </NumberField.Increment>
          </NumberField.Group>
        </NumberField.Root>
      </Box>
      {showDelete && (
        <Box className="remove" onClick={() => handleDeleteExercise()}>
          {showDelete && <DeleteIcon />}
        </Box>
      )}
    </Box>
  );
}

export default ExerciseInputRow;
