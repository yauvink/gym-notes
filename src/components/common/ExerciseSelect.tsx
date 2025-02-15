import { FormControl, InputLabel, ListSubheader, MenuItem, Select } from '@mui/material';
import { GroupedExerciseOptionType } from '../../providers/AppProvider/AppProvider.constants';
import { getExerciseColorByCategory, getExerciseColorById } from '../../utils';
import { useMemo } from 'react';
import { useAppContext } from '../../providers/AppProvider/AppProvider.hook';

function ExerciseSelect({
  exerciseId,
  setExerciseId,
  fade = 20,
}: {
  exerciseId: string;
  setExerciseId: (v: string) => void;
  fade?: number;
}) {
  const { allExercises } = useAppContext();

  const groupedByCategoryExercises: Array<GroupedExerciseOptionType> = useMemo(() => {
    const groupedExercises: any = {};

    allExercises.forEach((exercise) => {
      const category = exercise.optionCategory;
      if (!groupedExercises[category]) {
        groupedExercises[category] = {
          category: category,
          exercises: [],
        };
      }
      groupedExercises[category].exercises.push(exercise);
    });

    return Object.values(groupedExercises);
  }, [allExercises]);

  const renderSelectGroup = (groupedOptions: GroupedExerciseOptionType) => {
    const items = groupedOptions.exercises.map((p) => {
      return (
        <MenuItem key={p.id} value={p.id}>
          {p.name}
        </MenuItem>
      );
    });
    return [
      <ListSubheader
        sx={{
          background: `${getExerciseColorByCategory(groupedOptions.category)}`,
        }}
      >
        {groupedOptions.category}
      </ListSubheader>,
      items,
    ];
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Select exercise</InputLabel>
      <Select
        error={exerciseId === ''}
        fullWidth
        value={exerciseId}
        onChange={(e) => {
          setExerciseId(e.target.value);
        }}
        sx={{
          background: `${getExerciseColorById(exerciseId, allExercises)}${fade}`,
        }}
      >
        {groupedByCategoryExercises?.map((groupedOptions) => renderSelectGroup(groupedOptions))}
      </Select>
    </FormControl>
  );
}

export default ExerciseSelect;
