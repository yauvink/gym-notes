import { Box } from '@mui/material';
import { NumberField } from '@base-ui-components/react/number-field';
import styles from '../common/buttons.module.css';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { MinusIcon, PlusIcon } from '../common/Icons';
import { MAX_REPEATS, MAX_WEIGHT, MIN_REPEATS, MIN_WEIGHT } from '../../providers/AppProvider/AppProvider.constants';

function Set({
  index,
  repeats,
  setRepeats,
  weight,
  setWeight,
  handleDeleteRow,
  isLast,
  exerciseIndex,
  isWarmup,
  isExerciseHasWarmup,
  showDelete,
}: {
  index: number;
  repeats: number;
  setRepeats: (v: number) => void;
  weight: number;
  setWeight: (v: number) => void;
  handleDeleteRow: (v: number) => void;
  isLast: boolean;
  exerciseIndex: number;
  isWarmup: boolean;
  isExerciseHasWarmup: boolean;
  showDelete: boolean;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '10px',
        background: '#fff',
        borderRadius: '5px',
        padding: '5px 10px',
      }}
    >
      <Box
        sx={{
          color: isWarmup ? 'green' : undefined,
          fontSize: isWarmup ? '12px' : '18px',
          minWidth: '30px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          lineHeight: '10px',
        }}
      >
        {isWarmup ? (
          <>
            warm
            <br />
            up
          </>
        ) : (
          `#${isExerciseHasWarmup ? index : index + 1}`
        )}
      </Box>
      <Box>
        <NumberField.Root
          className={styles.Field}
          value={repeats}
          onValueChange={(value) => {
            if (value && value >= MIN_REPEATS) {
              if (value > MAX_REPEATS) {
                setRepeats(MAX_REPEATS);
              } else {
                setRepeats(value);
              }
            } else {
              setRepeats(MIN_REPEATS);
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
      <Box>
        <NumberField.Root
          className={styles.Field}
          value={weight}
          onValueChange={(value) => {
            if (value && value >= MIN_WEIGHT) {
              if (value > MAX_WEIGHT) {
                setWeight(MAX_WEIGHT);
              } else {
                setWeight(value);
              }
            } else {
              setWeight(MIN_WEIGHT);
            }
          }}
        >
          <NumberField.Group className={styles.Group}>
            <NumberField.Decrement className={styles.Decrement}>
              <MinusIcon />
            </NumberField.Decrement>
            <NumberField.Input
              className={styles.Input}
              inputMode="decimal"
              id={isLast ? `last_input_element_${exerciseIndex}` : undefined}
            />
            <NumberField.Increment className={styles.Increment}>
              <PlusIcon />
            </NumberField.Increment>
          </NumberField.Group>
        </NumberField.Root>
      </Box>
      <Box
        onClick={() => {
          if (showDelete) {
            handleDeleteRow(index);
          }
        }}
        sx={{
          cursor: showDelete ? 'pointer' : undefined,
          color: 'grey',
          minWidth: '24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {showDelete && (
          <RemoveCircleOutlineIcon
            sx={{
              color: isExerciseHasWarmup && index === 0 ? 'green' : undefined,
              opacity: 0.7,
            }}
          />
        )}
      </Box>
    </Box>
  );
}

export default Set;
