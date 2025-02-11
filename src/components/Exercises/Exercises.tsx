import { Box, Button, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import ExercisesDialog from './ExercisesDialog';

export type TrainingType = {
  name: string;
  exercises: Array<{
    name: string;
    sets: number;
    weight: number;
  }>;
};

function Exercises() {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const [trainings, setTrainings] = useState<TrainingType[]>([
    {
      name: 'Monday',
      exercises: [
        {
          name: 'жим лежа',
          sets: 4,
          weight: 70,
        },
        {
          name: 'жим стоя',
          sets: 4,
          weight: 20,
        },
        {
          name: 'жим сидя',
          sets: 8,
          weight: 170,
        },
      ],
    },
    {
      name: 'Wednesday',
      exercises: [
        {
          name: 'жим лежа',
          sets: 4,
          weight: 70,
        },
        {
          name: 'жим стоя',
          sets: 4,
          weight: 20,
        },
        {
          name: 'жим сидя',
          sets: 8,
          weight: 170,
        },
      ],
    },
  ]);

  const handleSaveTraining = useCallback(() => {
    console.log('save!');
    setDialogOpen(false);
  }, []);

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
          Add training
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
          <Box key={i} sx={{ border: '1px solid gray', borderRadius: '12px', padding: '20px' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: '10px 0',
              }}
            >
              <Typography
                sx={{
                  fontSize: '20px',
                  fontWeight: 600,
                }}
              >
                {el.name}
              </Typography>
              <Box
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
                  <Typography className="weight">{exercise.weight}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      <ExercisesDialog isDialogOpen={isDialogOpen} setDialogOpen={setDialogOpen} />
    </Box>
  );
}

export default Exercises;
