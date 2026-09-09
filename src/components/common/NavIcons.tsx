const iconProps = {
  width: 26,
  height: 26,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function ScheduleNavIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3.2" y="4.5" width="17.6" height="16" rx="2.4" />
      <path d="M3.2 9.2h17.6M8 3.2v3.2M16 3.2v3.2" />
      <path d="M8.2 13h2.2M11.9 13h2.2M15.6 13h2.2M8.2 16.4h2.2M11.9 16.4h2.2" />
    </svg>
  );
}

export function WorkoutsNavIcon() {
  return (
    <svg {...iconProps}>
      <path d="M7.2 9.2V14.8M16.8 9.2V14.8" />
      <path d="M4.2 8.4h3.2v7.2H4.2zM16.6 8.4h3.2v7.2h-3.2z" />
      <path d="M7.2 12h9.6" />
    </svg>
  );
}

export function StatsNavIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4 18.5h16" />
      <path d="M6.4 14.8v3.7M10.8 10.4v8.1M15.2 12.6v5.9M19.2 7.6v11" />
    </svg>
  );
}

export function SettingsNavIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4 8h11" />
      <circle cx="17.4" cy="8" r="2.1" />
      <path d="M4 16h7" />
      <circle cx="13.4" cy="16" r="2.1" />
      <path d="M20 16h-4.2" />
    </svg>
  );
}
