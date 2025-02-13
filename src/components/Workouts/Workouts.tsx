import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import TrainingDialog from './TrainingDialog';
import { useAppContext } from '../../providers/AppProvider/AppProvider.hook';
import { TrainingType } from '../../providers/AppProvider/AppProvider';
import { getExerciseName } from '../../providers/AppProvider/utils';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function Workouts() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { trainings } = useAppContext();
  const [editTrainingId, setEditTrainingId] = useState<string | null>(null);

  const calcTrainingTotalWeight = (training: TrainingType) => {
    return training.exercises.reduce((prev, currEl) => {
      const setsTotalWeight = currEl.sets.reduce((prev, curr) => {
        return prev + curr.repeats * curr.weight;
      }, 0);
      return prev + setsTotalWeight;
    }, 0);
  };
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
        {trainings.map((el, i) => (
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
                <Accordion key={i}>
                  <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    sx={
                      {
                        // color: 'red',
                      }
                    }
                  >
                    <Typography
                      sx={{
                        fontSize: '18px',
                        lineHeight: 'normal',
                      }}
                    >
                      {getExerciseName(exercise.exercise_id)}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
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
                    {exercise.sets.map((set, i) => (
                      <Box
                        key={i}
                        sx={{
                          padding: '0 20px',
                          display: 'flex',
                          gap: '40px',
                          justifyContent: 'flex-end',
                          fontSize: '14px',
                          opacity: 0.6,
                          borderBottom: '1px solid rgba(0,0,0,0.07)',
                          div: {
                            width: '50px',
                            textAlign: 'center',
                            color: i === 0 ? 'green' : undefined,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            lineHeight: i === 0 ? '6px' : undefined,
                            fontSize: i === 0 ? '10px' : undefined,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          {i === 0 ? (
                            <>
                              warm
                              <br />
                              up
                            </>
                          ) : (
                            i
                          )}
                        </Box>
                        <Box>{set.repeats}</Box>
                        <Box>{set.weight} kg</Box>
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
        <TrainingDialog
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
