import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import ExercisesDialog from './ExercisesDialog';
import { useAppContext } from '../../providers/AppProvider/AppProvider.hook';
import { TrainingType } from '../../providers/AppProvider/AppProvider';

function Exercises() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { trainings } = useAppContext();
  const [editTrainingId, setEditTrainingId] = useState<string | null>(null);

  const calcTrainingTotalWeight = (training: TrainingType) => {
    return training.exercises.reduce((prev, curr) => {
      return prev + curr.sets * curr.weight;
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
          Add new training
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
                margin: '0px 0 10px',
              }}
            >
              <Typography
                sx={{
                  fontSize: '20px',
                  fontWeight: 600,
                  span: {
                    fontSize: '14px',
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
                '& .border': {
                  borderBottom: '1px solid lightgrey',
                },
                '& .wrapper': {
                  display: 'flex',
                  width: '100%',
                  padding: '5px 10px',

                  '& .name': {
                    width: '100%',
                  },
                  '& .sets': {
                    width: '100px',
                    textAlign: 'center',
                  },
                  '& .weight': {
                    width: '100px',
                    textAlign: 'center',
                  },
                },
              }}
            >
              <Box
                className="wrapper"
                sx={{
                  background: 'lightgrey',
                }}
              >
                <Typography className="name">Name</Typography>
                <Typography className="sets">Sets</Typography>
                <Typography className="weight">Weight</Typography>
              </Box>
              {el.exercises.map((exercise, i, arr) => (
                <Box key={i} className={i !== arr.length - 1 ? 'wrapper border' : 'wrapper'}>
                  <Typography className="name">{exercise.name}</Typography>
                  <Typography className="sets">{exercise.sets}</Typography>
                  <Typography className="weight">{exercise.weight} kg</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      {isDialogOpen && (
        <ExercisesDialog
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

export default Exercises;
