import { Box } from '@mui/material';
import { ScheduleNavIcon, SettingsNavIcon, StatsNavIcon, WorkoutsNavIcon } from './NavIcons';

const TABS = [
  { label: 'Schedule', icon: <ScheduleNavIcon /> },
  { label: 'Workouts', icon: <WorkoutsNavIcon /> },
  { label: 'Stats', icon: <StatsNavIcon /> },
  { label: 'Settings', icon: <SettingsNavIcon /> },
];

function GlassTabBar({
  value,
  onChange,
}: {
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <nav className="lg-tabbar" aria-label="Main">
      <span className="lg-tabbar-blur" aria-hidden />
      <Box className="lg-tabbar-items">
        {TABS.map((tab, index) => {
          const selected = value === index;
          return (
            <button
              key={tab.label}
              type="button"
              aria-current={selected ? 'page' : undefined}
              className={selected ? 'lg-tab is-selected' : 'lg-tab'}
              onClick={() => onChange(index)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </Box>
    </nav>
  );
}

export default GlassTabBar;
