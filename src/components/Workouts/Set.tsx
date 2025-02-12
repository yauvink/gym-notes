import { Box } from '@mui/material';
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

function Set({
  index,
  repeats,
  setRepeats,
  weight,
  setWeight,
  handleDeleteRow,
}: {
  index: number;
  repeats: number;
  setRepeats: (v: number) => void;
  weight: number;
  setWeight: (v: number) => void;
  handleDeleteRow: (v: number) => void;
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
          color: index === 0 ? 'green' : undefined,
          fontSize: index === 0 ? '12px' : '18px',
          minWidth: '30px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          lineHeight: '10px',
        }}
      >
        {index === 0 ? (
          <>
            warm
            <br />
            up
          </>
        ) : (
          `#${index}`
        )}
      </Box>
      <Box>
        <NumberField.Root
          className={styles.Field}
          value={repeats}
          onValueChange={(value) => {
            if (value && value >= 1) {
              if (value > 50) {
                setRepeats(50);
              } else {
                setRepeats(value);
              }
            } else {
              setRepeats(1);
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
            <NumberField.Input className={styles.Input} inputMode="decimal" />
            <NumberField.Increment className={styles.Increment}>
              <PlusIcon />
            </NumberField.Increment>
          </NumberField.Group>
        </NumberField.Root>
      </Box>
      <Box
        onClick={() => {
          if (index > 1) {
            handleDeleteRow(index);
          }
        }}
        sx={{
          color: 'red',
          minWidth: '24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {index > 1 && <DeleteIcon />}
      </Box>
    </Box>
  );
}

export default Set;
