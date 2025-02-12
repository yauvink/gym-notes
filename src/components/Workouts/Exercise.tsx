import { Autocomplete, Box, Button, styled, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ExerciseOptionType, EXERCISES } from '../../providers/AppProvider/AppProvider.constants';
import { INITIAL_EXERCISE_DATA, SetType } from '../../providers/AppProvider/AppProvider';
import Set from './Set';

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
  handleDeleteExercise,
  showDelete,
}: {
  exerciseId: string;
  setExerciseId: (v: string) => void;
  sets: Array<SetType>;
  setSets: (v: Array<SetType>) => void;
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
          gap: '10px',
          justifyContent: 'space-between',
          margin: '5px 0',
        }}
      >
        <Box minWidth={30} />
        <Typography
          sx={{
            width: '115px',
            minWidth: '115px',
            textAlign: 'center',
          }}
        >
          Reps.
        </Typography>
        <Typography
          sx={{
            width: '115px',
            minWidth: '115px',
            textAlign: 'center',
          }}
        >
          kg
        </Typography>
        <Box minWidth={24} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
        }}
      >
        {sets.map((set, setRowIndex) => (
          <Set
            key={setRowIndex}
            index={setRowIndex}
            weight={set.weight}
            setWeight={(newValue) => {
              setSets(
                sets.map((el, i) => {
                  if (i === setRowIndex) {
                    return {
                      ...el,
                      weight: newValue,
                    };
                  }
                  return el;
                })
              );
            }}
            repeats={set.repeats}
            setRepeats={(newValue) => {
              setSets(
                sets.map((el, i) => {
                  if (i === setRowIndex) {
                    return {
                      ...el,
                      repeats: newValue,
                    };
                  }
                  return el;
                })
              );
            }}
            handleDeleteRow={(rowIndex) => {
              setSets([...sets].filter((_, i) => i !== rowIndex));
            }}
          />
        ))}
        <Button
          variant="contained"
          color="inherit"
          onClick={() => {
            setSets([
              ...sets,
              { repeats: INITIAL_EXERCISE_DATA.sets[1].repeats, weight: INITIAL_EXERCISE_DATA.sets[1].weight },
            ]);
          }}
          sx={{
            height: '20px',
            fontSize: '12px',
            marginTop: '10px',
          }}
        >
          + Add set
        </Button>
      </Box>
    </Box>
  );
}

export default Exercise;
