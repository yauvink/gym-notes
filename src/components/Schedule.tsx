import {
  Box,
  Button,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DatePicker, PickersDay } from '@mui/x-date-pickers';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { ReactComponent as Badge1 } from '../assets/images/badge_1.svg';
import { ReactComponent as Badge2 } from '../assets/images/badge_2.svg';
import dayjs, { Dayjs } from 'dayjs';
import { useAppContext } from '../providers/AppProvider/AppProvider.hook';
import { UserTrainingDayType } from '../providers/AppProvider/AppProvider';
import { calcTrainingTotalWeight, getExerciseColorById, getExerciseName } from '../utils';

const SOBER_DATE_STORAGE_KEY = 'date_key_21313';

function Schedule() {
  const { userTrainingDays, setUserTrainingDays, workouts } = useAppContext();
  const [isAddTrainingDialogOpen, setAddTrainingDialogOpen] = useState(false);
  const [isSoberDialogOpen, setSoberDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null | undefined>(dayjs(new Date()));
  const savedSoberDate = window.localStorage.getItem(SOBER_DATE_STORAGE_KEY);
  const [soberSelectedDate, setSoberSelectedDate] = React.useState<Dayjs | null | undefined>(
    savedSoberDate !== null ? dayjs(JSON.parse(savedSoberDate)) : null
  );
  const [viewedYear, setViewedYear] = useState(dayjs(new Date()).year());
  const [selectedWorkoutId, setSelectedWorkoutId] = React.useState('');

  const soberDays = useMemo(() => {
    if (soberSelectedDate !== null && soberSelectedDate !== undefined) {
      const daysDiff = dayjs(new Date()).diff(soberSelectedDate, 'day', true);

      let weekendCount = 0;

      for (let i = 0; i <= daysDiff; i++) {
        const currentDate = soberSelectedDate.add(i, 'day');
        const dayOfWeek = currentDate.day(); // 0 = Sunday, 6 = Saturday

        if (dayOfWeek === 0 || dayOfWeek === 6) {
          weekendCount++;
        }
      }

      return { total: daysDiff.toFixed(), real: weekendCount };
    }
    return { total: '+', real: null };
  }, [soberSelectedDate]);

  const handleAddTraining = useCallback(() => {
    if (selectedDate) {
      const workout = workouts.find((el) => el.id === selectedWorkoutId);
      const newTrainingDays: UserTrainingDayType[] = [
        ...userTrainingDays,
        {
          date: selectedDate.toJSON(),
          ...(workout && { workout }),
        },
      ];
      setUserTrainingDays(newTrainingDays);
      handleCloseAddTrainDayDialog();
    }
  }, [userTrainingDays, setUserTrainingDays, selectedDate, selectedWorkoutId, workouts]);

  const isTrainingDay = (date: Dayjs) => userTrainingDays.some((t) => dayjs(t.date).isSame(date, 'day'));

  const handleCloseAddTrainDayDialog = () => {
    setSelectedWorkoutId('');
    setAddTrainingDialogOpen(false);
  };

  const trainCount = useMemo(() => {
    const thisYearTrainings = userTrainingDays.filter((el) => {
      const trainingYear = dayjs(el.date).year();

      return trainingYear === viewedYear;
    });
    const daysInYear = dayjs().year(viewedYear).isLeapYear() ? 366 : 365;
    return { trainings: thisYearTrainings.length, days: daysInYear };
  }, [userTrainingDays, viewedYear]);

  const handleDeleteTrainingDay = () => {
    if (window.confirm('Are you sure want to delete training day? This action cannot be undone.')) {
      if (selectedDate) {
        const newTrainingDays = userTrainingDays.filter((el) => !dayjs(el.date).isSame(selectedDate, 'day'));
        setUserTrainingDays(newTrainingDays);
      }
    }
  };

  const selectedDayData = useMemo(() => {
    if (selectedDate) {
      const result = userTrainingDays.find((el) => dayjs(el.date).isSame(selectedDate, 'day'));
      return result;
    }
  }, [selectedDate, userTrainingDays]);
  console.log('selectedDayData', selectedDayData);

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedWorkoutId(event.target.value as string);
  };

  return (
    <Box
      sx={{
        padding: '20px 20px 30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: '20px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography sx={{ fontSize: '20px' }}>Sober days:</Typography>
          <Box
            onClick={() => setSoberDialogOpen(true)}
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              svg: {
                width: '150px',
                height: '150px',
              },
            }}
          >
            <Badge2 />
            <Typography
              sx={{
                position: 'absolute',
                fontSize: '28px',
                fontWeight: 600,
                marginTop: '5px',
                textShadow: '#c4a316 0px 0 10px',
              }}
            >
              {soberDays.total}
            </Typography>
            <Typography
              sx={{
                position: 'absolute',
                fontSize: '10px',
                fontWeight: 600,
                marginTop: '105px',
                opacity: 0.5,
              }}
            >
              {soberDays.real !== null && `(Real: ${soberDays.real})`}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: '20px',
              textAlign: 'center',
              span: {
                fontWeight: 600,
                color: 'green',
              },
            }}
          >
            Trainings in <span>{viewedYear}</span>:
          </Typography>
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              svg: {
                width: '150px',
                height: '150px',
              },
            }}
          >
            <Badge1 />
            <Typography
              sx={{
                position: 'absolute',
                fontSize: '24px',
                fontWeight: 600,
                marginTop: '5px',
                textShadow: '#c4a316 0px 0 10px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                span: {
                  fontSize: '10px',
                  fontWeight: 400,
                  margin: '-8px 0',
                },
              }}
            >
              {trainCount.trainings}
              <span>out of</span>
              {trainCount.days}
            </Typography>
          </Box>
        </Box>
      </Box>

      <DateCalendar
        disableFuture
        readOnly
        // onChange={(a, b, c) => {
        //   console.log('aa', a, b, c);
        // }}
        // defaultValue={dayjs('2022-02-02')}
        // value={viewedMonth}
        onMonthChange={(newMonth) => {
          // setViewedMonth(newMonth);
          setViewedYear(Number(newMonth.format('YYYY')));
        }}
        slots={{
          day: (props) => {
            const isTraining = isTrainingDay(props.day);

            return (
              <PickersDay
                {...props}
                onClick={() => {
                  setSelectedDate(dayjs(props.day).startOf('day'));
                }}
                sx={{
                  backgroundColor: isTraining ? 'lightblue' : 'transparent',
                  borderRadius: '50%',
                  // '&:hover': { backgroundColor: isTraining ? 'blue' : '' },
                }}
              />
            );
          },
        }}
      />

      <Box sx={{ display: 'flex', gap: '20px', width: '100%', maxWidth: '500px', marginTop: '-50px' }}>
        {selectedDayData ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                width: '100%',
              }}
            >
              <DeleteIcon sx={{ color: 'red', cursor: 'pointer' }} onClick={() => handleDeleteTrainingDay()} />
            </Box>

            {selectedDayData.workout ? (
              <Box
                sx={
                  {
                    // border: '1px solid green',
                  }
                }
              >
                <Typography
                  sx={{
                    lineHeight: 'normal',
                    marginBottom: '5px',
                    fontSize: '20px',
                    span: {
                      fontSize: '16px',
                      fontWeight: 400,
                      opacity: 0.5,
                    },
                  }}
                >
                  {selectedDayData.workout.name} <span>({calcTrainingTotalWeight(selectedDayData.workout)}kg)</span>
                </Typography>

                {selectedDayData.workout.exercises.map((exercise, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Box
                      sx={{
                        padding: '5px 20px',
                        display: 'flex',
                        gap: '40px',
                        justifyContent: 'flex-end',
                        fontSize: '14px',
                        background: `${getExerciseColorById(exercise.exercise_id)}20`,
                      }}
                    >
                      {getExerciseName(exercise.exercise_id)}
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
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography sx={{ textAlign: 'center', margin: '20px 0' }}>
                No workout data
                <br />
                for this day
              </Typography>
            )}
          </Box>
        ) : (
          <Button
            variant="contained"
            onClick={() => setAddTrainingDialogOpen(true)}
            sx={{
              margin: '20px auto',
            }}
          >
            + Add training day
          </Button>
        )}
      </Box>

      <Dialog open={isAddTrainingDialogOpen}>
        <Box
          sx={{
            padding: '60px 20px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <Box
            onClick={handleCloseAddTrainDayDialog}
            sx={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            <CloseIcon />
          </Box>
          <DatePicker
            disableFuture
            format="DD-MM-YYYY"
            shouldDisableDate={(date) => {
              return isTrainingDay(date);
            }}
            label="Date"
            value={selectedDate}
            onChange={(newValue) => {
              setSelectedDate(dayjs(newValue).startOf('day'));
            }}
          />
          <FormControl fullWidth>
            <InputLabel>Select workout</InputLabel>
            <Select value={selectedWorkoutId} label="Select workout" onChange={handleChange}>
              {workouts.map((el, i) => (
                <MenuItem key={i} value={el.id}>
                  {el.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            disabled={selectedDate ? isTrainingDay(selectedDate) : true}
            variant="contained"
            onClick={() => handleAddTraining()}
          >
            ADD
          </Button>
        </Box>
      </Dialog>

      <Dialog open={isSoberDialogOpen}>
        <Box
          sx={{
            padding: '60px 20px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <Box
            onClick={() => setSoberDialogOpen(false)}
            sx={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            <CloseIcon />
          </Box>
          <DatePicker
            disableFuture
            format="DD-MM-YYYY"
            label="Enter start date"
            value={soberSelectedDate}
            onChange={(newValue) => {
              if (newValue === null || newValue?.toJSON() === undefined) {
                setSoberSelectedDate(null);
                setSoberDialogOpen(false);
                window.localStorage.removeItem(SOBER_DATE_STORAGE_KEY);
              } else {
                setSoberSelectedDate(newValue);
                setSoberDialogOpen(false);
                window.localStorage.setItem(SOBER_DATE_STORAGE_KEY, JSON.stringify(newValue));
              }
            }}
            slotProps={{
              actionBar: {
                actions: ['today', 'clear', 'accept'],
              },
            }}
          />
        </Box>
      </Dialog>
    </Box>
  );
}

export default Schedule;
