import { EXERCISES } from "../AppProvider.constants"

export const getExerciseName = (id: string) => {
  return EXERCISES.find(el => el.id === id)?.name
}
