import React from 'react';
import Schedule from './components/Schedule';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import updateLocale from 'dayjs/plugin/updateLocale';
import { BottomNavigation, BottomNavigationAction, Box, Paper } from '@mui/material';
import Workouts from './components/Workouts/Workouts';
import Stats from './components/Stats';
import Settings from './components/Settings';
import { ScheduleNavIcon, SettingsNavIcon, StatsNavIcon, WorkoutsNavIcon } from './components/common/NavIcons';

dayjs.extend(isLeapYear);
dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  weekStart: 1,
});

function App() {
  const [value, setValue] = React.useState(0);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          height: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
          overflow: 'hidden',
        }}
      >
        <Box
          key={value}
          className="tab-panel"
          sx={{ pb: 'calc(72px + env(safe-area-inset-bottom))' }}
        >
          {value === 0 && <Schedule />}
          {value === 1 && <Workouts />}
          {value === 2 && <Stats />}
          {value === 3 && <Settings />}
        </Box>
        <Paper
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: 0,
            bgcolor: 'background.paper',
            pb: 'env(safe-area-inset-bottom)',
          }}
          elevation={0}
        >
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            sx={{
              height: 64,
              '& .MuiBottomNavigationAction-root': {
                minWidth: 0,
                paddingTop: '8px',
                paddingBottom: '8px',
                fontSize: 12,
              },
              '& .MuiBottomNavigationAction-label': {
                fontSize: '12px',
                fontWeight: 700,
                marginTop: '4px',
              },
            }}
          >
            <BottomNavigationAction label="Schedule" icon={<ScheduleNavIcon />} />
            <BottomNavigationAction label="Workouts" icon={<WorkoutsNavIcon />} />
            <BottomNavigationAction label="Stats" icon={<StatsNavIcon />} />
            <BottomNavigationAction label="Settings" icon={<SettingsNavIcon />} />
          </BottomNavigation>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
}

export default App;
