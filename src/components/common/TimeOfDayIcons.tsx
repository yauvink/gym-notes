import { ReactNode } from 'react';
import { softenColor } from '../../theme/colorUtils';

type TwoToneIconProps = {
  bg?: string;
  fg?: string;
  size?: number;
};

const DEFAULT_BG = 'var(--color-secondary-soft)';
const DEFAULT_FG = 'var(--color-primary)';

function SceneFrame({
  bg,
  fg,
  size = 40,
  children,
}: TwoToneIconProps & { children: ReactNode }) {
  const sky = bg ? softenColor(bg, 0.22) : DEFAULT_BG;

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      style={{ borderRadius: 8, display: 'block' }}
    >
      <rect width="200" height="200" fill={sky} />
      <g fill={fg ?? DEFAULT_FG}>{children}</g>
    </svg>
  );
}

export function MorningIcon({ bg, fg, size }: TwoToneIconProps) {
  return (
    <SceneFrame bg={bg} fg={fg} size={size}>
      <circle cx="100" cy="148" r="44" />
      <rect x="0" y="148" width="200" height="52" />
    </SceneFrame>
  );
}

export function DayIcon({ bg, fg, size }: TwoToneIconProps) {
  const rays = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <SceneFrame bg={bg} fg={fg} size={size}>
      <circle cx="100" cy="100" r="34" />
      {rays.map((angle) => (
        <rect
          key={angle}
          x="94"
          y="16"
          width="12"
          height="28"
          rx="6"
          transform={`rotate(${angle} 100 100)`}
        />
      ))}
    </SceneFrame>
  );
}

export function NightIcon({ bg, fg, size }: TwoToneIconProps) {
  return (
    <SceneFrame bg={bg} fg={fg} size={size}>
      <path d="M118 52a38 38 0 1 0 8 68 30 30 0 1 1-8-68z" />
      <path d="M148 34l5 11 12 5-12 5-5 11-5-11-12-5 12-5z" />
      <path d="M46 62l3.5 8 8.5 3.5-8.5 3.5L46 85l-3.5-8-8.5-3.5 8.5-3.5z" />
      <path d="M62 138l2.5 6 6.5 2.5-6.5 2.5L62 155l-2.5-6-6.5-2.5 6.5-2.5z" />
    </SceneFrame>
  );
}
