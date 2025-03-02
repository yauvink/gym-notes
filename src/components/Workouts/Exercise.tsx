import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { SetType } from '../../providers/AppProvider/AppProvider';
import Set from './Set';
import ExerciseSelect from '../common/ExerciseSelect';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { getExerciseColorById, getExerciseName } from '../../utils';
import { ExerciseOptionType } from '../../providers/AppProvider/AppProvider.constants';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

function Exercise({
  exerciseId,
  setExerciseId,
  sets,
  setSets,
  handleDeleteExercise,
  showDelete,
  exerciseIndex,
  allExercises,
  handleExpand,
  handleTopUp,
  expanded,
}: {
  exerciseId: string;
  setExerciseId: (v: string) => void;
  sets: Array<SetType>;
  setSets: (v: Array<SetType>) => void;
  handleDeleteExercise: () => void;
  showDelete: boolean;
  exerciseIndex: number;
  allExercises: ExerciseOptionType[];
  handleExpand: () => void;
  handleTopUp: () => void;
  expanded: boolean;
}) {
  const isExerciseHasWarmup = Boolean(sets[0]?.wu);

  return (
    <Accordion
      defaultExpanded={exerciseId === ''}
      expanded={expanded}
      onChange={(e, expanded) => {
        handleExpand();
      }}
      sx={
        {
          // background: `${getExerciseColorById(exerciseId, allExercises)}10`,
        }
      }
    >
      <AccordionSummary
        expandIcon={expanded ? undefined : <ArrowDropDownIcon />}
        sx={{
          background: `${getExerciseColorById(exerciseId, allExercises)}40`,
        }}
      >
        <Box
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleTopUp();
          }}
          sx={{
            marginRight: '16px',
            cursor: 'n-resize',
            visibility: exerciseIndex === 0 ? 'hidden' : 'visible',
          }}
        >
          <ArrowUpwardIcon />
        </Box>

        <Typography
          sx={{
            fontSize: '18px',
            lineHeight: 'normal',
          }}
        >
          {getExerciseName(exerciseId, allExercises)}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          background: 'rgba(0,0,0,0.08)',
          padding: '10px 10px 10px',
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
            <ExerciseSelect exerciseId={exerciseId} setExerciseId={setExerciseId} fade={0} />
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
              display: sets.length === 0 ? 'none' : 'block',
            }}
          >
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
              {!isExerciseHasWarmup && (
                <Button
                  variant="contained"
                  onClick={() => {
                    setSets([{ wu: true, reps: sets[0].reps, kg: sets[0].kg }, ...sets]);
                  }}
                  sx={{
                    background: 'rgba(0,255,0,0.1)',
                    height: '20px',
                    fontSize: '12px',
                    marginTop: '10px',
                    color: 'black',
                  }}
                >
                  + Add warmup
                </Button>
              )}
              {sets.map((set, setRowIndex, arr) => (
                <Set
                  showDelete={arr.length > 1}
                  isWarmup={Boolean(set.wu)}
                  isExerciseHasWarmup={isExerciseHasWarmup}
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
                  height: '30px',
                  fontSize: '12px',
                  marginTop: '10px',
                  color: 'black',
                }}
              >
                + Add set
              </Button>
            </Box>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

export default Exercise;
