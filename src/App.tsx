import React from 'react';
import Schedule from './components/Schedule';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import updateLocale from 'dayjs/plugin/updateLocale';
import { BottomNavigation, BottomNavigationAction, Box, CssBaseline, Paper } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import Sets from './components/Sets';
import Stats from './components/Stats';

dayjs.extend(isLeapYear);
dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  weekStart: 1,
});

const VERSION = '0.02';

function App() {
  const [value, setValue] = React.useState(0);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CssBaseline />
      <Box sx={{ pb: 7 }}>
        <Box
          sx={
            {
              // background: 'red',
            }
          }
        >
          {value === 0 && <Schedule />}
          {value === 1 && <Sets />}
          {value === 2 && <Stats />}
        </Box>
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          >
            <BottomNavigationAction label="Schedule" icon={<CalendarMonthIcon />} />
            <BottomNavigationAction label="Sets" icon={<FitnessCenterIcon />} />
            <BottomNavigationAction label="Stats" icon={<QueryStatsIcon />} />
          </BottomNavigation>
        </Paper>
      </Box>
      <Box
        sx={{
          position: 'fixed',
          top: 2,
          right: 2,
          zIndex: 99,
          fontSize: '8px',
          color: 'lightgrey',
        }}
      >
        {VERSION}
      </Box>
    </LocalizationProvider>
  );
}

export default App;
