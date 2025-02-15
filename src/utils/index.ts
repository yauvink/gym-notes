import { ExerciseType, WorkoutType } from "../providers/AppProvider/AppProvider"
import { ExerciseOptionType, MuscleGroup } from "../providers/AppProvider/AppProvider.constants"

export const getExerciseName = (id: string, exercises: ExerciseOptionType[]) => {
  return exercises.find(el => el.id === id)?.name
}

export const getExerciseData = (id: string, exercises: ExerciseOptionType[]) => {
  return exercises.find(el => el.id === id)
}

export const getExerciseColorByCategory = (category: MuscleGroup | undefined) => {
  switch (category) {
    case (MuscleGroup.Chest): {
      return "#F45D01"
    }
    case (MuscleGroup.Biceps): {
      return "#C3C303"
    }
    case (MuscleGroup.Back): {
      return "#62A56B"
    }
    case (MuscleGroup.Triceps): {
      return "#EEB902"
    }
    case (MuscleGroup.Shoulders): {
      return "#97CC04"
    }
    case (MuscleGroup.Core): {
      return "#F18B02"
    }
    case (MuscleGroup.Legs): {
      return "#2D7DD2"
    }
    default: {
      return 'grey'
    }
  }
}

export const getExerciseColorById = (id: string | undefined, exercises: ExerciseOptionType[]) => {
  const category = exercises.find(el => el.id === id)?.optionCategory
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


export const getExerciseAvarageWeight = (exercise: ExerciseType, withWarmup?: boolean) => {
  const setsToCalculate = exercise.sets.filter(el => { return withWarmup ? true : !el.wu })
  const res = setsToCalculate.reduce((prev, currValue, i, arr) => {
    return prev + (currValue.kg)
  }, 0)
  return res / setsToCalculate.length

}
