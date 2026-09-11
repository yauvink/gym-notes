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
      <svg className="lg-tabbar-filter" aria-hidden focusable="false">
        <filter id="lg-tabbar-refract" x="-8%" y="-20%" width="116%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="7" result="n" />
          <feGaussianBlur in="n" stdDeviation="1.2" result="blurred" />
          <feDisplacementMap in="SourceGraphic" in2="blurred" scale="14" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <span className="lg-tabbar-glass" aria-hidden />
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
