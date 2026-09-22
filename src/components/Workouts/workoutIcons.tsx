import { Box, BoxProps } from '@mui/material';
import { WorkoutIconId } from '../../providers/AppProvider/AppProvider';
import legsIcon from '../../assets/images/workout-legs.png';
import backIcon from '../../assets/images/workout-back.png';
import chestIcon from '../../assets/images/workout-chest.png';

export const WORKOUT_ICON_IDS: WorkoutIconId[] = ['legs', 'back', 'chest'];

const WORKOUT_ICON_SET = new Set<string>(WORKOUT_ICON_IDS);

export function isWorkoutIconId(value: unknown): value is WorkoutIconId {
  return typeof value === 'string' && WORKOUT_ICON_SET.has(value);
}

const ICON_SRC: Record<WorkoutIconId, string> = {
  legs: legsIcon,
  back: backIcon,
  chest: chestIcon,
};

export function WorkoutIcon({
  icon,
  size = 24,
  ...props
}: { icon: WorkoutIconId; size?: number } & Omit<BoxProps, 'component'>) {
  return (
    <Box
      component="img"
      src={ICON_SRC[icon]}
      alt=""
      sx={{
        width: size,
        height: size,
        objectFit: 'contain',
        display: 'block',
        borderRadius: '20%',
      }}
      {...props}
    />
  );
}
