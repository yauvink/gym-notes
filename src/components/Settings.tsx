import { Box, Typography } from '@mui/material';
import { NumberField } from '@base-ui-components/react/number-field';
import { MinusIcon, PlusIcon } from './common/Icons';
import styles from './common/buttons.module.css';
import { useAppContext } from '../providers/AppProvider/AppProvider.hook';
import { MAX_REPEATS, MAX_WEIGHT, MIN_REPEATS, MIN_WEIGHT } from '../providers/AppProvider/AppProvider.constants';

function Settings() {
  const { defaultWeight, setDefaultWeight, defaultRepeats, setDefaultRepeats, localStorageUsage } = useAppContext();
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
        {0.019}
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
    </Box>
  );
}

export default Settings;
