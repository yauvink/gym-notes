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

function Exercise({
  exerciseId,
  setExerciseId,
  sets,
  setSets,
  weight,
  setWeight,
  handleDeleteExercise,
  showDelete,
}: {
  exerciseId: string;
  setExerciseId: (v: string) => void;
  sets: number;
  setSets: (v: number) => void;
  weight: number;
  setWeight: (v: number) => void;
  handleDeleteExercise: () => void;
  showDelete: boolean;
}) {
  const value = EXERCISES.find((el) => el.id === exerciseId);

  return (
    <Box
      sx={{
        width: '100%',
        background: 'rgba(0,0,0,0.05)',
        padding: '15px 10px',
        margin: '5px 0px',
        borderRadius: '10px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Autocomplete
          value={value}
          onChange={(event: any, newValue: ExerciseOptionType | null) => {
            if (newValue?.id) {
              setExerciseId(newValue.id);
            }
          }}
          // options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
          options={EXERCISES}
          groupBy={(option) => option.optionCategory}
          getOptionLabel={(option) => option.name}
          getOptionKey={(option) => option.id}
          fullWidth
          sx={
            {
              // width: '300px',
            }
          }
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label="Choose exercise"
              placeholder="Choose exercise"
              error={exerciseId === ''}
            />
          )}
          renderGroup={(params) => (
            <li key={params.key}>
              <GroupHeader>{params.group}</GroupHeader>
              <ul>{params.children}</ul>
            </li>
          )}
        />
        {showDelete && (
          <Box
            sx={{
              margin: '0 5px 0 10px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'red',
            }}
            onClick={() => handleDeleteExercise()}
          >
            {showDelete && <DeleteIcon />}
          </Box>
        )}
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
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
    </Box>
  );
}

export default Exercise;
