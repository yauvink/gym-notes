import React from 'react';
import Calendar from './components/Calendar';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import updateLocale from 'dayjs/plugin/updateLocale';

dayjs.extend(isLeapYear);
dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  weekStart: 1,
});

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Calendar />
    </LocalizationProvider>
  );
}

export default App;
