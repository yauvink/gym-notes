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
import Workouts from './components/Workouts/Workouts';
import Stats from './components/Stats';
import Settings from './components/Settings';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';

dayjs.extend(isLeapYear);
dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  weekStart: 1,
});

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
          {value === 1 && <Workouts />}
          {value === 2 && <Stats />}
          {value === 3 && <Settings />}
        </Box>
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            sx={{
              height: '60px',
              '& .MuiBottomNavigationAction-root': {
                paddingBottom: '10px',
              },
            }}
          >
            <BottomNavigationAction label="Schedule" icon={<CalendarMonthIcon />} />
            <BottomNavigationAction label="Workouts" icon={<FitnessCenterIcon />} />
            <BottomNavigationAction label="Stats" icon={<QueryStatsIcon />} />
            <BottomNavigationAction label="Settings" icon={<SettingsSuggestIcon />} />
          </BottomNavigation>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
}

export default App;
