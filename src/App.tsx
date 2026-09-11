import React from 'react';
import Schedule from './components/Schedule';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import updateLocale from 'dayjs/plugin/updateLocale';
import { Box } from '@mui/material';
import Workouts from './components/Workouts/Workouts';
import Stats from './components/Stats';
import Settings from './components/Settings';
import GlassTabBar from './components/common/GlassTabBar';
import AppToaster from './components/common/AppToaster';

dayjs.extend(isLeapYear);
dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  weekStart: 1,
});

function App() {
  const [value, setValue] = React.useState(0);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AppToaster />
      <Box
        sx={{
          height: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'transparent',
          overflow: 'hidden',
        }}
      >
        <Box
          key={value}
          className="tab-panel"
          sx={{ pb: 'calc(56px + env(safe-area-inset-bottom))' }}
        >
          {value === 0 && <Schedule />}
          {value === 1 && <Workouts />}
          {value === 2 && <Stats />}
          {value === 3 && <Settings />}
        </Box>
        <GlassTabBar value={value} onChange={setValue} />
      </Box>
    </LocalizationProvider>
  );
}

export default App;
