import { Box, Button, Dialog, Typography } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DatePicker, PickersDay } from '@mui/x-date-pickers';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs, { Dayjs } from 'dayjs';

type Training = {
  date: string;
};

const STORAGE_KEY = 'key1231231123';

function Calendar() {
  const [open, setOpen] = useState(false);
  const [deleteButtonDate, setDeleteButtonDate] = useState<Dayjs | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null | undefined>(null);
  // const [viewedMonth, setViewedMonth] = useState(dayjs());
  const [viewedYear, setViewedYear] = useState(dayjs(new Date()).year());
  const storage = window.localStorage.getItem(STORAGE_KEY);
  const data: Training[] = storage ? JSON.parse(storage) : [];
  const [trainings, setTrainings] = useState<Training[]>(data);
  console.log('trainings', trainings);
  const handleAddTraining = useCallback(() => {
    if (selectedDate) {
      setTrainings((prev) => {
        const newTrainings = [...prev, { date: selectedDate.toJSON() }];
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newTrainings));
        return newTrainings;
      });
    }

    setOpen(false);
  }, [selectedDate]);

  const isTrainingDay = (date: Dayjs) => trainings.some((t) => dayjs(t.date).isSame(date, 'day'));

  const trainCount = useMemo(() => {
    const thisYearTrainings = trainings.filter((el) => {
      const trainingYear = dayjs(el.date).year();

      return trainingYear === viewedYear;
    });
    const daysInYear = dayjs().year(viewedYear).isLeapYear() ? 366 : 365;
    return { trainings: thisYearTrainings.length, days: daysInYear };
  }, [trainings, viewedYear]);

  const handleDeleteTrain = () => {
    if (window.confirm('Are you sure want to delete training day?')) {
      if (deleteButtonDate) {
        setTrainings((prev) => {
          const newTrainings = prev.filter((el) => el.date !== deleteButtonDate.toJSON());
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newTrainings));
          return newTrainings;
        });
        setDeleteButtonDate(null);
      }
    }
  };

  return (
    <Box
      sx={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography
        sx={{
          textAlign: 'center',
          span: {
            fontWeight: 600,
            color: 'green',
          },
        }}
      >
        Trainings in <span>{viewedYear}</span>:
        <br />
        <span>{trainCount.trainings}</span> out of <span>{trainCount.days}</span>
      </Typography>
      <DateCalendar
        disableFuture
        readOnly
        onChange={(a, b, c) => {
          console.log('aa', a, b, c);
        }}
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
                  if (isTrainingDay(props.day)) {
                    setDeleteButtonDate(props.day);
                  } else {
                    setDeleteButtonDate(null);
                    setSelectedDate(props.day);
                  }
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

      <Box sx={{ display: 'flex', gap: '20px' }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          + Add training
        </Button>

        {deleteButtonDate && (
          <Button variant="contained" color="error" onClick={() => handleDeleteTrain()}>
            <DeleteIcon />
          </Button>
        )}
      </Box>

      <Dialog open={open}>
        <Box
          sx={{
            padding: '60px 20px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <Box
            onClick={() => setOpen(false)}
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
            onChange={(newValue) => setSelectedDate(newValue)}
          />
          <Button
            disabled={selectedDate ? isTrainingDay(selectedDate) : false}
            variant="contained"
            onClick={() => handleAddTraining()}
          >
            ADD
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}

export default Calendar;
