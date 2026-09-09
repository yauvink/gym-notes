import { Box, Button, Dialog, TextField, Typography } from '@mui/material';
import { NumberField } from '@base-ui-components/react/number-field';
import { ExportIcon, ImportIcon, MinusIcon, PlusIcon } from './common/Icons';
import styles from './common/buttons.module.css';
import { useAppContext } from '../providers/AppProvider/AppProvider.hook';
import { MAX_REPEATS, MAX_WEIGHT, MIN_REPEATS, MIN_WEIGHT } from '../providers/AppProvider/AppProvider.constants';
import { useCallback, useState } from 'react';
import AppearanceSettings from './Settings/AppearanceSettings';
import { useThemeSettings } from '../theme';
import { withAlpha } from '../theme/colorUtils';
import packageJson from '../../package.json';

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
  const { colors } = useThemeSettings();
  const [isImportDialogOpen, setImportDialogOpen] = useState(false);
  const [importPayload, setImportPayload] = useState('');

  const [isImportFinished, setImportFinished] = useState(false);
  const [isError, setError] = useState(false);

  const handleExportAll = useCallback(() => {
    handleExportData({
      trainings: userTrainingDays,
      workouts,
      exercises: customExercises,
      weight: userWeightData,
    });
  }, [handleExportData, userTrainingDays, workouts, customExercises, userWeightData]);

  const handleImportData = useCallback(() => {
    try {
      const data = JSON.parse(importPayload);
      if (
        !data ||
        !Array.isArray(data.trainings) ||
        !Array.isArray(data.workouts) ||
        !Array.isArray(data.exercises) ||
        !Array.isArray(data.weight)
      ) {
        throw new Error('Invalid backup format');
      }

      setUserTrainingDays(data.trainings);
      setWorkouts(data.workouts);
      setCustomExercises(data.exercises);
      setUserWeightData(data.weight);

      setImportFinished(true);
    } catch (err) {
      console.log('import error:', err);
      setError(true);
      setImportFinished(true);
    }
  }, [importPayload, setUserTrainingDays, setWorkouts, setUserWeightData, setCustomExercises]);

  return (
    <Box
      sx={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
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
            bgcolor: 'background.default',
            padding: '50px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999999,
          }}
        >
          {isError ? (
            <Typography sx={{ fontSize: 18 }}>Something went wrong :(</Typography>
          ) : (
            <Typography sx={{ fontSize: 18 }}>Data imported, please reload the app</Typography>
          )}
        </Box>
      )}
      <Box
        sx={{
          width: '100%',
          maxWidth: 420,
          mb: 2,
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 1.5,
        }}
      >
        <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>{localStorageUsage}</Typography>
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 700,
            color: withAlpha(colors.primary, 0.55),
            fontVariantNumeric: 'tabular-nums',
            flexShrink: 0,
          }}
        >
          v{packageJson.version}
        </Typography>
      </Box>

      <AppearanceSettings />

      <Box sx={{ width: '100%', maxWidth: 420, mt: 3 }}>
        <Typography sx={{ fontWeight: 800, mb: 1.5, fontSize: 20 }}>Defaults</Typography>
        <Box
          sx={{
            p: 2,
            borderRadius: 1,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography sx={{ margin: '0 0 10px', fontSize: 16 }}>Default weight:</Typography>
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
          <Typography sx={{ margin: '20px 0 10px', fontSize: 16 }}>Default repeats:</Typography>
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
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          margin: '28px 0 0',
          width: '100%',
          maxWidth: 420,
        }}
      >
        <Typography sx={{ fontWeight: 800, fontSize: 20 }}>Backup</Typography>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            onClick={handleExportAll}
            variant="contained"
            startIcon={<ExportIcon />}
            sx={{
              flex: 1,
              bgcolor: '#2F9E6B',
              color: '#F7F8F4',
              '&:hover': { bgcolor: '#26845A' },
            }}
          >
            Export
          </Button>
          <Button
            onClick={() => {
              if (window.confirm('Attention! This is unsafe and can break the app.')) {
                setImportDialogOpen(true);
              }
            }}
            variant="outlined"
            startIcon={<ImportIcon />}
            sx={{
              flex: 1,
              color: '#E85D4C',
              borderColor: '#E85D4C',
              '&:hover': {
                borderColor: '#D14B3B',
                bgcolor: 'rgba(232, 93, 76, 0.08)',
              },
            }}
          >
            Import
          </Button>
        </Box>
      </Box>

      <Dialog open={isImportDialogOpen} onClose={() => setImportDialogOpen(false)}>
        <Box
          sx={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            width: '300px',
            maxWidth: '100%',
          }}
        >
          <Typography sx={{ fontSize: 16, fontWeight: 700 }}>Paste backup JSON</Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            value={importPayload}
            onChange={(e) => {
              setImportPayload(e.target.value);
            }}
            sx={{
              '& textarea': {
                userSelect: 'text',
                WebkitUserSelect: 'text',
              },
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
