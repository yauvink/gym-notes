import { Box, Button, Dialog, LinearProgress, TextField, Typography } from '@mui/material';
import { NumberField } from '@base-ui-components/react/number-field';
import { ExportIcon, ImportIcon, MinusIcon, PlusIcon } from './common/Icons';
import styles from './common/buttons.module.css';
import { useAppContext } from '../providers/AppProvider/AppProvider.hook';
import { MAX_REPEATS, MAX_WEIGHT, MIN_REPEATS, MIN_WEIGHT } from '../providers/AppProvider/AppProvider.constants';
import { ChangeEvent, useCallback, useRef, useState } from 'react';
import AppearanceSettings from './Settings/AppearanceSettings';
import { useThemeSettings } from '../theme';
import { withAlpha } from '../theme/colorUtils';
import packageJson from '../../package.json';
import { collectObservations, observationToWeight } from '../utils/appleHealth';
import { UserWeightDataType } from '../providers/AppProvider/AppProvider.constants';

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
    setHealthWeightData,
    healthWeightData,
  } = useAppContext();
  const { colors } = useThemeSettings();
  const [isImportDialogOpen, setImportDialogOpen] = useState(false);
  const [importPayload, setImportPayload] = useState('');

  const [isImportFinished, setImportFinished] = useState(false);
  const [isError, setError] = useState(false);
  const healthFileInputRef = useRef<HTMLInputElement>(null);
  const [healthModal, setHealthModal] = useState<'closed' | 'choose' | 'paste'>('closed');
  const [healthXmlText, setHealthXmlText] = useState('');
  const [healthImport, setHealthImport] = useState<{
    status: 'idle' | 'working' | 'done' | 'error';
    label: string;
    percent: number;
    count: number;
  }>({ status: 'idle', label: '', percent: 0, count: healthWeightData.length });

  const handleExportAll = useCallback(() => {
    handleExportData({
      trainings: userTrainingDays,
      workouts,
      exercises: customExercises,
      weight: userWeightData,
    });
  }, [handleExportData, userTrainingDays, workouts, customExercises, userWeightData]);

  const processHealthXml = useCallback(
    async (xml: string, sourceLabel: string) => {
      try {
        setHealthImport({ status: 'working', label: 'Parsing XML…', percent: 28, count: healthWeightData.length });
        await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));

        const doc = new DOMParser().parseFromString(xml, 'text/xml');
        const parseError = doc.querySelector('parsererror');
        if (parseError) {
          throw new Error(parseError.textContent || 'Invalid XML');
        }

        const observations = collectObservations(doc);
        setHealthImport((prev) => ({
          ...prev,
          status: 'working',
          label: `Extracting weight… 0 / ${observations.length}`,
          percent: 36,
        }));

        const imported: UserWeightDataType[] = [];
        const chunkSize = Math.max(1, Math.ceil(observations.length / 20));
        for (let index = 0; index < observations.length; index += 1) {
          const point = observationToWeight(observations[index]);
          if (point) {
            imported.push(point);
          }

          if (index === observations.length - 1 || (index + 1) % chunkSize === 0) {
            const extractPercent = 36 + Math.round(((index + 1) / Math.max(observations.length, 1)) * 54);
            setHealthImport({
              status: 'working',
              label: `Extracting weight… ${index + 1} / ${observations.length}`,
              percent: extractPercent,
              count: imported.length,
            });
            await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
          }
        }

        setHealthImport((prev) => ({ ...prev, status: 'working', label: 'Saving…', percent: 94 }));
        const sorted = [...imported].sort((a, b) => a.t - b.t);
        setHealthWeightData(sorted);
        setHealthImport({
          status: 'done',
          label: sorted.length ? `Imported ${sorted.length} weight records` : 'No weight records found',
          percent: 100,
          count: sorted.length,
        });
      } catch (err) {
        console.log('Apple Health import failed', err);
        setHealthImport({
          status: 'error',
          label: `Could not import this ${sourceLabel}`,
          percent: 100,
          count: healthWeightData.length,
        });
      }
    },
    [healthWeightData.length, setHealthWeightData]
  );

  const handleImportAppleHealthFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = '';

      if (!file) {
        return;
      }

      const reader = new FileReader();
      setHealthImport({ status: 'working', label: 'Reading file…', percent: 4, count: healthWeightData.length });

      reader.onprogress = (progressEvent) => {
        if (progressEvent.lengthComputable) {
          const readPercent = Math.round((progressEvent.loaded / progressEvent.total) * 24);
          setHealthImport((prev) => ({
            ...prev,
            status: 'working',
            label: 'Reading file…',
            percent: Math.max(4, readPercent),
          }));
        }
      };

      reader.onload = () => {
        const xml = typeof reader.result === 'string' ? reader.result : '';
        void processHealthXml(xml, 'XML file');
      };

      reader.onerror = () => {
        setHealthImport({
          status: 'error',
          label: 'Could not read this file',
          percent: 100,
          count: healthWeightData.length,
        });
      };

      reader.readAsText(file);
    },
    [healthWeightData.length, processHealthXml]
  );

  const handleImportAppleHealthText = useCallback(() => {
    const xml = healthXmlText.trim();
    if (!xml) {
      setHealthImport({
        status: 'error',
        label: 'Paste XML first',
        percent: 100,
        count: healthWeightData.length,
      });
      return;
    }

    setHealthModal('closed');
    setHealthXmlText('');
    void processHealthXml(xml, 'XML text');
  }, [healthXmlText, healthWeightData.length, processHealthXml]);

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
        <Typography sx={{ fontWeight: 800, mb: 1.5, fontSize: 20 }}>App defaults</Typography>
        <Box
          className="glass-surface"
          sx={{
            p: 2,
            display: 'flex',
            gap: 2,
            alignItems: 'flex-end',
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
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
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ margin: '0 0 10px', fontSize: 16 }}>Default repeats:</Typography>
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
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          margin: '28px 0 48px',
          width: '100%',
          maxWidth: 420,
        }}
      >
        <Typography sx={{ fontWeight: 800, fontSize: 20 }}>Data</Typography>
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
        <input
          ref={healthFileInputRef}
          type="file"
          accept=".xml,text/xml,application/xml"
          hidden
          onChange={handleImportAppleHealthFile}
        />
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<ImportIcon />}
          disabled={healthImport.status === 'working'}
          onClick={() => setHealthModal('choose')}
        >
          Import Apple Health
        </Button>
        {healthImport.status !== 'idle' && (
          <Box
            sx={{
              py: 1.5,
              px: 2.75,
              borderRadius: 999,
              bgcolor: 'var(--glass-bg-strong)',
              border: '0.5px solid var(--glass-border)',
            }}
          >
            <Typography
              sx={{
                fontSize: 13,
                mb: 1,
                color:
                  healthImport.status === 'error'
                    ? 'error.main'
                    : healthImport.status === 'done'
                      ? 'text.primary'
                      : 'text.secondary',
              }}
            >
              {healthImport.label}
              {healthImport.status === 'working' ? ` · ${healthImport.percent}%` : ''}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={healthImport.percent}
              sx={{
                height: 6,
                borderRadius: 999,
                bgcolor: 'var(--glass-bg)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 999,
                  bgcolor: healthImport.status === 'error' ? 'error.main' : colors.primary,
                },
              }}
            />
          </Box>
        )}
      </Box>

      <Dialog
        open={healthModal !== 'closed'}
        onClose={() => {
          if (healthImport.status !== 'working') {
            setHealthModal('closed');
          }
        }}
      >
        <Box
          sx={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            width: '320px',
            maxWidth: '100%',
          }}
        >
          <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
            {healthModal === 'paste' ? 'Paste Apple Health XML' : 'Import Apple Health'}
          </Typography>
          {healthModal === 'choose' ? (
            <>
              <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
                Import weight from an export_cda.xml file or paste the XML text.
              </Typography>
              <Button
                variant="contained"
                onClick={() => {
                  setHealthModal('closed');
                  healthFileInputRef.current?.click();
                }}
              >
                From file
              </Button>
              <Button variant="outlined" color="inherit" onClick={() => setHealthModal('paste')}>
                From text
              </Button>
            </>
          ) : (
            <>
              <TextField
                multiline
                rows={7}
                fullWidth
                placeholder="Paste export_cda.xml contents"
                value={healthXmlText}
                onChange={(e) => setHealthXmlText(e.target.value)}
                sx={{
                  '& textarea': {
                    userSelect: 'text',
                    WebkitUserSelect: 'text',
                  },
                }}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="outlined" color="inherit" onClick={() => setHealthModal('choose')} sx={{ flex: 1 }}>
                  Back
                </Button>
                <Button variant="contained" onClick={handleImportAppleHealthText} sx={{ flex: 1 }}>
                  Import
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Dialog>

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
