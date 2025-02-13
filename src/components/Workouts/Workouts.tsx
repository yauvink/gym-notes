import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import WorkoutDialog from './WorkoutDialog';
import { useAppContext } from '../../providers/AppProvider/AppProvider.hook';
import { calcTrainingTotalWeight, getExerciseColorById, getExerciseName } from '../../utils';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function Workouts() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { workouts } = useAppContext();
  const [editTrainingId, setEditTrainingId] = useState<string | null>(null);

  return (
    <Box
      sx={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        maxWidth: '500px',
        margin: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'flex-end',
          paddingBottom: '20px',
        }}
      >
        <Button variant="contained" onClick={() => setDialogOpen(true)}>
          Add new workout
        </Button>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          width: '100%',
        }}
      >
        {workouts.map((el, i) => (
          <Box key={i} sx={{ border: '1px solid gray', borderRadius: '12px', padding: '10px' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{
                  fontSize: '24px',
                  fontWeight: 600,
                  span: {
                    fontSize: '16px',
                    fontWeight: 400,
                    opacity: 0.5,
                  },
                }}
              >
                {el.name} <span>({calcTrainingTotalWeight(el)}kg)</span>
              </Typography>
              <Box
                onClick={() => {
                  setEditTrainingId(el.id);
                  setDialogOpen(true);
                }}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.5,
                  },
                }}
              >
                <EditIcon />
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: '10px',
              }}
            >
              {el.exercises.map((exercise, i, arr) => (
                <Accordion
                  key={i}
                  sx={{
                    background: `${getExerciseColorById(exercise.exercise_id)}70`,
                  }}
                >
                  <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                    <Typography
                      sx={{
                        fontSize: '18px',
                        lineHeight: 'normal',
                      }}
                    >
                      {getExerciseName(exercise.exercise_id)}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      background: '#fff',
                      padding: '0px 0px 10px',
                    }}
                  >
                    <Box
                      sx={{
                        padding: '0 20px',
                        display: 'flex',
                        gap: '40px',
                        justifyContent: 'flex-end',
                        fontSize: '14px',
                        background: 'rgba(0,0,0,0.05)',
                        div: {
                          width: '50px',
                          textAlign: 'center',
                        },
                      }}
                    >
                      <Box>#</Box>
                      <Box>Repeats</Box>
                      <Box>Weight</Box>
                    </Box>
                    {exercise.sets.map((set, i, arr) => (
                      <Box
                        key={i}
                        sx={{
                          padding: '0 20px',
                          display: 'flex',
                          gap: '40px',
                          justifyContent: 'flex-end',
                          fontSize: '14px',
                          opacity: 0.6,
                          borderBottom: i !== arr.length - 1 ? '1px solid rgba(0,0,0,0.07)' : undefined,
                          div: {
                            width: '50px',
                            textAlign: 'center',
                            color: set.wu ? 'green' : undefined,
                            textWrap: 'nowrap',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            lineHeight: set.wu ? '6px' : undefined,
                            fontSize: set.wu ? '10px' : undefined,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          {set.wu ? (
                            <>
                              warm
                              <br />
                              up
                            </>
                          ) : arr[0].wu ? (
                            i
                          ) : (
                            i + 1
                          )}
                        </Box>
                        <Box>{set.reps}</Box>
                        <Box>{set.kg} kg</Box>
                      </Box>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      {isDialogOpen && (
        <WorkoutDialog
          closeDialog={() => {
            setDialogOpen(false);
            setEditTrainingId(null);
          }}
          editTrainingId={editTrainingId}
        />
      )}
    </Box>
  );
}

export default Workouts;
