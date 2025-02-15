import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import EditWorkoutDialog from './EditWorkoutDialog';
import { useAppContext } from '../../providers/AppProvider/AppProvider.hook';
import { calcTrainingTotalWeight, getExerciseColorById, getExerciseName } from '../../utils';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddExerciseDialog from './AddExerciseDialog';

function Workouts() {
  const [isWorkoutDialogOpen, setWorkoutDialogOpen] = useState(false);
  const [isExerciseDialogOpen, setExerciseDialogOpen] = useState(false);
  const { workouts, allExercises } = useAppContext();
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
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'flex-end',
          paddingBottom: '20px',
        }}
      >
        <Button variant="contained" onClick={() => setWorkoutDialogOpen(true)}>
          Add new workout
        </Button>
        <Button variant="contained" color="success" onClick={() => setExerciseDialogOpen(true)}>
          Add new exercise
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
          <Accordion key={i}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box
                  onClick={() => {
                    setEditTrainingId(el.id);
                    setWorkoutDialogOpen(true);
                  }}
                  sx={{
                    cursor: 'pointer',
                    marginRight: '10px',
                    '&:hover': {
                      opacity: 0.5,
                    },
                  }}
                >
                  <EditIcon />
                </Box>
                <Typography
                  sx={{
                    fontSize: '24px',
                    fontWeight: 600,
                    lineHeight: 'normal',
                    span: {
                      fontSize: '16px',
                      fontWeight: 400,
                      opacity: 0.5,
                    },
                  }}
                >
                  {el.name} <span>({calcTrainingTotalWeight(el)}kg)</span>
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
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
                      background: `${getExerciseColorById(exercise.exercise_id, allExercises)}70`,
                    }}
                  >
                    <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                      <Typography
                        sx={{
                          fontSize: '18px',
                          lineHeight: 'normal',
                        }}
                      >
                        {getExerciseName(exercise.exercise_id, allExercises)}
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
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {isWorkoutDialogOpen && (
        <EditWorkoutDialog
          closeDialog={() => {
            setWorkoutDialogOpen(false);
            setEditTrainingId(null);
          }}
          editTrainingId={editTrainingId}
        />
      )}

      {isExerciseDialogOpen && (
        <AddExerciseDialog
          closeDialog={() => {
            setExerciseDialogOpen(false);
          }}
        />
      )}
    </Box>
  );
}

export default Workouts;
