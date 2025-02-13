import { WorkoutType } from "../providers/AppProvider/AppProvider"
import { EXERCISES, MuscleGroup } from "../providers/AppProvider/AppProvider.constants"

export const getExerciseName = (id: string) => {
  return EXERCISES.find(el => el.id === id)?.name
}

export const getExerciseColorByCategory = (category: MuscleGroup | undefined) => {
  switch (category) {
    case (MuscleGroup.Chest): {
      return "#F45D01"
    }
    case (MuscleGroup.Biceps): {
      return "#EEB902"
    }
    case (MuscleGroup.Back): {
      return "#F18B02"
    }
    case (MuscleGroup.Triceps): {
      return "#C3C303"
    }
    case (MuscleGroup.Shoulders): {
      return "#97CC04"
    }
    case (MuscleGroup.Core): {
      return "#62A56B"
    }
    case (MuscleGroup.Legs): {
      return "#2D7DD2"
    }
    default: {
      return 'grey'
    }
  }
}

export const getExerciseColorById = (id: string | undefined) => {
  const category = EXERCISES.find(el => el.id === id)?.optionCategory
  return getExerciseColorByCategory(category)
}


export const calcTrainingTotalWeight = (workout: WorkoutType) => {
  const result = workout.exercises.reduce((prev, currEl) => {
    const setsTotalWeight = currEl.sets.reduce((prev, curr) => {
      return prev + curr.reps * curr.kg;
    }, 0);
    return prev + setsTotalWeight;
  }, 0);
  return result.toLocaleString();
};
