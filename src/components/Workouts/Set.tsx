import { Autocomplete, Box, styled, TextField, Typography } from '@mui/material';
import { NumberField } from '@base-ui-components/react/number-field';
import styles from './index.module.css';
import DeleteIcon from '@mui/icons-material/Delete';
import { ExerciseOptionType, EXERCISES } from '../../providers/AppProvider/AppProvider.constants';

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

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  color: 'blue',
  backgroundColor: 'lightgrey',
}));

function Set({
  sets,
  setSets,
  weight,
  setWeight,
}: {
  sets: number;
  setSets: (v: number) => void;
  weight: number;
  setWeight: (v: number) => void;
}) {
  // const value = EXERCISES.find((el) => el.id === exerciseId);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        border: '1px solid red',
      }}
    >
      <Box
        sx={{
          marginRight: '10px',
        }}
      >
        <Typography textAlign={'center'} margin={'5px'}>
          Reps:
        </Typography>

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
            <NumberField.Input className={styles.Input} inputMode="numeric" />
            <NumberField.Increment className={styles.Increment}>
              <PlusIcon />
            </NumberField.Increment>
          </NumberField.Group>
        </NumberField.Root>
      </Box>
      <Box>
        <Typography textAlign={'center'} margin={'5px'}>
          Weight:
        </Typography>

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
            <NumberField.Input className={styles.Input} inputMode="numeric" />
            <NumberField.Increment className={styles.Increment}>
              <PlusIcon />
            </NumberField.Increment>
          </NumberField.Group>
        </NumberField.Root>
      </Box>
    </Box>
  );
}

export default Set;
