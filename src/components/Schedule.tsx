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
import dayjs, { Dayjs } from 'dayjs';
import { useAppContext } from '../providers/AppProvider/AppProvider.hook';
import { UserTrainingDayType } from '../providers/AppProvider/AppProvider';
import { calcTrainingTotalWeight, getExerciseColorById, getExerciseName } from '../utils';
import WeightChart from './WeightChart';
import StatCard from './common/StatCard';
import { useThemeSettings } from '../theme';

const SOBER_DATE_STORAGE_KEY = 'date_key_21313';

function Schedule() {
  const { userTrainingDays, setUserTrainingDays, workouts, allExercises } = useAppContext();
  const { colors } = useThemeSettings();
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

  const trainingsAvgPerMonth = useMemo(() => {
    const from = dayjs().startOf('day').subtract(30, 'day');
    const recentCount = userTrainingDays.filter((el) => !dayjs(el.date).isBefore(from, 'day')).length;
    if (recentCount === 0) {
      return null;
    }
    return (31 / recentCount).toFixed(1);
  }, [userTrainingDays]);

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
      const result = userTrainingDays.find((el) => {
        return dayjs(el.date).isSame(selectedDate, 'day');
      });
      return result;
    }
  }, [selectedDate, userTrainingDays]);

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedWorkoutId(event.target.value as string);
  };

  return (
    <Box
      sx={{
        padding: '12px 16px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '10px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          width: '100%',
          maxWidth: '500px',
        }}
      >
        <StatCard
          label="Sober days"
          value={soberDays.total}
          valueSuffix={soberDays.real !== null ? `Real: ${soberDays.real}` : undefined}
          accent={colors.secondary}
          onClick={() => setSoberDialogOpen(true)}
        />
        <StatCard
          label={`Trainings in ${viewedYear}`}
          value={trainCount.trainings}
          valueSuffix={`/${trainCount.days}`}
          corner={trainingsAvgPerMonth ? `av/m ${trainingsAvgPerMonth}` : 'av/m —'}
          accent={colors.primary}
        />
      </Box>

      <WeightChart />

      <DateCalendar
        disableFuture
        readOnly
        showDaysOutsideCurrentMonth
        onMonthChange={(newMonth) => {
          setViewedYear(Number(newMonth.format('YYYY')));
        }}
        sx={{
          width: '100%',
          maxWidth: '100%',
          height: 'auto',
          maxHeight: 'none',
          '--PickerDay-size': '48px',
          '--PickerDay-horizontalMargin': '0px',
          bgcolor: 'background.paper',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
          p: '4px 2px 6px',
          '&.MuiDateCalendar-root': {
            width: '100%',
            maxWidth: 'none',
          },
          '& .MuiDateCalendar-viewTransitionContainer, & .MuiDayCalendar-root, & .MuiDayCalendar-monthContainer': {
            width: '100%',
          },
          '& .MuiPickersCalendarHeader-root': {
            paddingLeft: '8px',
            paddingRight: '8px',
            marginTop: 0,
            marginBottom: 0,
            minHeight: 40,
            width: '100%',
          },
          '& .MuiPickersCalendarHeader-label': {
            fontWeight: 800,
            fontSize: 16,
          },
          '& .MuiPickersArrowSwitcher-button, & .MuiPickersCalendarHeader-switchViewButton': {
            width: 36,
            height: 36,
          },
          '& .MuiDayCalendar-header, & .MuiDayCalendar-weekContainer': {
            justifyContent: 'space-between',
            margin: 0,
            padding: '0 4px',
          },
          '& .MuiDayCalendar-weekDayLabel': {
            width: 48,
            height: 22,
            fontSize: 12,
            fontWeight: 700,
            margin: 0,
          },
          '& .MuiDayCalendar-slideTransition': {
            minHeight: 288,
          },
          '& .MuiPickersDay-root': {
            width: 48,
            height: 48,
            fontSize: 16,
            fontWeight: 600,
            margin: 0,
            borderRadius: '16px',
          },
          '& .MuiYearCalendar-root, & .MuiMonthCalendar-root': {
            width: '100%',
          },
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
                  width: 48,
                  height: 48,
                  fontSize: 16,
                  backgroundColor: isTraining ? colors.primary : 'transparent',
                  color: isTraining ? 'primary.contrastText' : undefined,
                  fontWeight: isTraining ? 700 : 600,
                  borderRadius: '16px',
                  '&.MuiPickersDay-today': {
                    borderRadius: '16px',
                  },
                  '&.Mui-selected': {
                    backgroundColor: colors.secondary,
                    color: 'secondary.contrastText',
                    '&:hover, &:focus': {
                      backgroundColor: colors.secondary,
                    },
                  },
                }}
              />
            );
          },
        }}
      />

      <Box sx={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '500px' }}>
        {selectedDayData ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
            }}
          >
            {selectedDayData.workout ? (
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                    mb: '5px',
                  }}
                >
                  <Typography
                    sx={{
                      lineHeight: 'normal',
                      fontSize: '18px',
                      fontWeight: 700,
                      span: {
                        fontSize: '15px',
                        fontWeight: 400,
                        opacity: 0.5,
                      },
                    }}
                  >
                    {selectedDayData.workout.name} <span>({calcTrainingTotalWeight(selectedDayData.workout)}kg)</span>
                  </Typography>
                  <DeleteIcon sx={{ color: '#C47B7B', cursor: 'pointer', flexShrink: 0 }} onClick={() => handleDeleteTrainingDay()} />
                </Box>

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
                        background: `${getExerciseColorById(exercise.exercise_id, allExercises)}20`,
                      }}
                    >
                      {getExerciseName(exercise.exercise_id, allExercises)}
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
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1,
                }}
              >
                <Typography sx={{ textAlign: 'left', fontSize: 16 }}>
                  No workout data
                  <br />
                  for this day
                </Typography>
                <DeleteIcon sx={{ color: '#C47B7B', cursor: 'pointer', flexShrink: 0 }} onClick={() => handleDeleteTrainingDay()} />
              </Box>
            )}
          </Box>
        ) : (
          <Button
            variant="contained"
            onClick={() => setAddTrainingDialogOpen(true)}
            sx={{
              margin: '4px auto',
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
