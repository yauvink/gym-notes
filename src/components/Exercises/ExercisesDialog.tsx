import { Box, Button, Dialog, TextField, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { NumberField } from '@base-ui-components/react/number-field';
import styles from './index.module.css';

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

function ExercisesDialog({
  isDialogOpen,
  setDialogOpen,
}: {
  isDialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [trainingName, setTrainingName] = useState('');
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);

  const handleSaveTraining = useCallback(() => {
    console.log('save!');
    setDialogOpen(false);
  }, [setDialogOpen]);

  return (
    <Dialog open={isDialogOpen}>
      <Box
        sx={{
          padding: '60px 20px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
          }}
        >
          <TextField
            placeholder="Training name"
            value={trainingName}
            onChange={(e) => setTrainingName(e.target.value)}
          ></TextField>

          <Box
            onClick={() => setDialogOpen(false)}
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
              padding: '5px 10px',
              gap: '10px',
              '& .name': {
                width: '100%',
              },
              '& .sets': {
                width: '130px',
                minWidth: '130px',
                textAlign: 'center',
              },
              '& .weight': {
                minWidth: '130px',
                width: '130px',
                textAlign: 'center',
              },
            },
          }}
        >
          <Box
            className="wrapper"
            sx={{
              background: 'lightgrey',
            }}
          >
            <Typography className="name">Name</Typography>
            <Typography className="sets">Sets</Typography>
            <Typography className="weight">Weight</Typography>
          </Box>
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
                placeholder="Exercise name"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
              ></TextField>
            </Box>
            <Box className="sets">
              <NumberField.Root
                className={styles.Field}
                onValueChange={(value) => {
                  setSets(value);
                }}
                value={sets}
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
              {' '}
              <NumberField.Root
                className={styles.Field}
                onValueChange={(value) => {
                  setWeight(value);
                }}
                value={weight}
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
          </Box>
        </Box>

        <Button variant="contained" onClick={() => handleSaveTraining()}>
          Save
        </Button>
      </Box>
    </Dialog>
  );
}

export default ExercisesDialog;
