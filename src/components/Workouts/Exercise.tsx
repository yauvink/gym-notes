import { Autocomplete, Box, Button, Paper, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ExerciseOptionType, EXERCISES, MuscleGroup } from '../../providers/AppProvider/AppProvider.constants';
import { SetType } from '../../providers/AppProvider/AppProvider';
import Set from './Set';
import { getExerciseColorByCategory, getExerciseColorById } from '../../utils';

function Exercise({
  exerciseId,
  setExerciseId,
  sets,
  setSets,
  handleDeleteExercise,
  showDelete,
  exerciseIndex,
}: {
  exerciseId: string;
  setExerciseId: (v: string) => void;
  sets: Array<SetType>;
  setSets: (v: Array<SetType>) => void;
  handleDeleteExercise: () => void;
  showDelete: boolean;
  exerciseIndex: number;
}) {
  const value = EXERCISES.find((el) => el.id === exerciseId);

  return (
    <Paper
      elevation={3}
      sx={{
        padding: '15px 10px',
        margin: '10px 0px',
        background: 'rgba(0,0,0,0.05)',
      }}
    >
      <Box
        sx={{
          width: '100%',
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
            sx={{
              // width: '300px',
              // background: '#fff',
              // background: getExerciseColor(value?.id)
              background: `${getExerciseColorById(value?.id)}20`,
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                label="Choose exercise"
                placeholder="Choose exercise"
                error={exerciseId === ''}
              />
            )}
            renderGroup={(params) => {
              console.log('params', params);
              return (
                <li key={params.key}>
                  <Box
                    sx={{
                      position: 'sticky',
                      top: '-8px',
                      padding: '4px 10px',
                      fontWeight: 600,
                      backgroundColor: getExerciseColorByCategory(params.group as MuscleGroup),
                    }}
                  >
                    {params.group}
                  </Box>
                  <ul>{params.children}</ul>
                </li>
              );
            }}
          />
          {showDelete && (
            <Box
              sx={{
                margin: '0 5px 0 10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'red',
                cursor: 'pointer',
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
          {sets.map((set, setRowIndex, arr) => (
            <Set
              isLast={setRowIndex === arr.length - 1}
              key={setRowIndex}
              index={setRowIndex}
              exerciseIndex={exerciseIndex}
              weight={set.kg}
              setWeight={(newValue) => {
                setSets(
                  sets.map((el, i): SetType => {
                    if (i === setRowIndex) {
                      return {
                        ...el,
                        kg: newValue,
                      };
                    }
                    return el;
                  })
                );
              }}
              repeats={set.reps}
              setRepeats={(newValue) => {
                setSets(
                  sets.map((el, i): SetType => {
                    if (i === setRowIndex) {
                      return {
                        ...el,
                        reps: newValue,
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
            onClick={() => {
              const prevSet = sets[sets.length - 1];
              setSets([...sets, { reps: prevSet.reps, kg: prevSet.kg }]);

              setTimeout(() => {
                const target = document.getElementById(`last_input_element_${exerciseIndex}`);
                if (target) {
                  target.focus();
                  target.scrollIntoView({ behavior: 'smooth' });
                }
              }, 200);
            }}
            sx={{
              background: '#fff',
              height: '20px',
              fontSize: '12px',
              marginTop: '10px',
              color: 'black',
            }}
          >
            + Add set
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default Exercise;
