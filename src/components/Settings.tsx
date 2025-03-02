import { Box, Button, Dialog, TextField, Typography } from '@mui/material';
import { NumberField } from '@base-ui-components/react/number-field';
import { MinusIcon, PlusIcon } from './common/Icons';
import styles from './common/buttons.module.css';
import { useAppContext } from '../providers/AppProvider/AppProvider.hook';
import { MAX_REPEATS, MAX_WEIGHT, MIN_REPEATS, MIN_WEIGHT } from '../providers/AppProvider/AppProvider.constants';
import { useCallback, useState } from 'react';

function Settings() {
  const {
    handleExportData,
    defaultWeight,
    setDefaultWeight,
    defaultRepeats,
    setDefaultRepeats,
    localStorageUsage,
    userTrainingDays,
    setUserTrainingDays,
    workouts,
    setWorkouts,
    userWeightData,
    setUserWeightData,
    customExercises,
    setCustomExercises,
  } = useAppContext();
  const [isExportDialogOpen, setExportDialogOpen] = useState<'trainings' | 'workouts' | 'weight' | 'exercises' | null>(
    null
  );
  const [exportData, setExportData] = useState('');

  const [isImportFinished, setImportFinished] = useState(false);
  const [isError, setError] = useState(false);

  const handleImportData = useCallback(() => {
    try {
      const data = JSON.parse(exportData);
      switch (true) {
        case isExportDialogOpen === 'trainings': {
          setUserTrainingDays(data);
          break;
        }
        case isExportDialogOpen === 'workouts': {
          setWorkouts(data);
          break;
        }
        case isExportDialogOpen === 'weight': {
          setUserWeightData(data);
          break;
        }
        case isExportDialogOpen === 'exercises': {
          setCustomExercises(data);
          break;
        }
      }

      setImportFinished(true);
    } catch (err) {
      console.log('import error:', err);
      setError(true);
      setImportFinished(true);
    }
  }, [isExportDialogOpen, exportData, setUserTrainingDays, setWorkouts, setUserWeightData]);

  return (
    <Box
      sx={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '500px',
      }}
    >
      {isImportFinished && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#fff',
            padding: '50px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999999,
          }}
        >
          {isError ? (
            <Typography>Something went wrong :(</Typography>
          ) : (
            <Typography>Data imported, please reload the app</Typography>
          )}
        </Box>
      )}
      <Box
        sx={{
          position: 'fixed',
          top: 5,
          right: 10,
          left: 10,
          zIndex: 99,
          fontSize: '16px',
          color: 'grey',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box> {localStorageUsage} </Box>
        {0.037}
      </Box>
      <Typography
        sx={{
          margin: '20px 0 10px',
        }}
      ></Typography>

      <Box>
        <Typography
          sx={{
            margin: '20px 0 10px',
          }}
        >
          Default weight:
        </Typography>
        <NumberField.Root
          className={styles.Field}
          value={defaultWeight}
          onValueChange={(value) => {
            if (value && value >= MIN_WEIGHT) {
              if (value > MAX_WEIGHT) {
                setDefaultWeight(MAX_WEIGHT);
              } else {
                setDefaultWeight(value);
              }
            } else {
              setDefaultWeight(MIN_WEIGHT);
            }
          }}
        >
          <NumberField.Group className={styles.Group}>
            <NumberField.Decrement className={styles.Decrement}>
              <MinusIcon />
            </NumberField.Decrement>
            <NumberField.Input className={styles.Input} inputMode="decimal" />
            <NumberField.Increment className={styles.Increment}>
              <PlusIcon />
            </NumberField.Increment>
          </NumberField.Group>
        </NumberField.Root>
        <Typography
          sx={{
            margin: '20px 0 10px',
          }}
        >
          Default repeats:
        </Typography>
        <NumberField.Root
          className={styles.Field}
          value={defaultRepeats}
          onValueChange={(value) => {
            if (value && value >= MIN_REPEATS) {
              if (value > MAX_REPEATS) {
                setDefaultRepeats(MAX_REPEATS);
              } else {
                setDefaultRepeats(value);
              }
            } else {
              setDefaultRepeats(MIN_REPEATS);
            }
          }}
        >
          <NumberField.Group className={styles.Group}>
            <NumberField.Decrement className={styles.Decrement}>
              <MinusIcon />
            </NumberField.Decrement>
            <NumberField.Input className={styles.Input} inputMode="decimal" />
            <NumberField.Increment className={styles.Increment}>
              <PlusIcon />
            </NumberField.Increment>
          </NumberField.Group>
        </NumberField.Root>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          margin: '50px 0',
        }}
      >
        <Button
          size="small"
          onClick={() => {
            handleExportData(userTrainingDays);
          }}
          variant="outlined"
          color="secondary"
        >
          export training days data
        </Button>
        <Button
          size="small"
          onClick={() => {
            handleExportData(customExercises);
          }}
          variant="outlined"
          color="secondary"
        >
          export exercises data
        </Button>
        <Button
          size="small"
          onClick={() => {
            handleExportData(workouts);
          }}
          variant="outlined"
          color="secondary"
        >
          export workouts data
        </Button>
        <Button
          size="small"
          onClick={() => {
            handleExportData(userWeightData);
          }}
          variant="outlined"
          color="secondary"
        >
          export weight data
        </Button>

        <Button
          size="small"
          onClick={() => {
            if (window.confirm('Attention! This is unsafe and can break the app.')) {
              setExportDialogOpen('trainings');
            }
          }}
          variant="outlined"
          color="warning"
        >
          import training days
        </Button>

        <Button
          size="small"
          onClick={() => {
            if (window.confirm('Attention! This is unsafe and can break the app.')) {
              setExportDialogOpen('exercises');
            }
          }}
          variant="outlined"
          color="warning"
        >
          import exercises days
        </Button>

        <Button
          size="small"
          onClick={() => {
            if (window.confirm('Attention! This is unsafe and can break the app.')) {
              setExportDialogOpen('workouts');
            }
          }}
          variant="outlined"
          color="warning"
        >
          import workouts data
        </Button>
        <Button
          size="small"
          onClick={() => {
            if (window.confirm('Attention! This is unsafe and can break the app.')) {
              setExportDialogOpen('weight');
            }
          }}
          variant="outlined"
          color="warning"
        >
          import weight data
        </Button>
      </Box>

      <Dialog open={isExportDialogOpen !== null}>
        <Box
          sx={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            width: '300px',
          }}
        >
          <Typography>Good luck!</Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            value={exportData}
            onChange={(e) => {
              setExportData(e.target.value);
            }}
          ></TextField>
          <Button color="warning" variant="outlined" onClick={handleImportData}>
            Import data
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}

export default Settings;
