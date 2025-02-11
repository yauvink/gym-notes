import { createContext, ReactNode, useState } from 'react';

export interface IApp {
  trainings: TrainingType[];
  setTrainings: (trainings: TrainingType[]) => void;
}

export const INITIAL_EXERCISE_DATA: ExerciseType = {
  name: '',
  sets: 4,
  weight: 50,
};

export type ExerciseType = {
  name: string;
  sets: number;
  weight: number;
};

export type TrainingType = {
  id: string;
  name: string;
  exercises: ExerciseType[];
};

export const AppContext = createContext<null | IApp>(null);

AppContext.displayName = 'AppContext';

const TRAININGS_STORAGE_KEY = 'dsadasdsadas';

function AppProvider({ children }: { children: ReactNode }) {
  const storageTrainingData = window.localStorage.getItem(TRAININGS_STORAGE_KEY);
  const initialTrainingData: TrainingType[] = storageTrainingData ? JSON.parse(storageTrainingData) : [];
  const [trainings, setTrainingsLocal] = useState<TrainingType[]>(initialTrainingData);
  const setTrainings = (newTrainings: TrainingType[]) => {
    setTrainingsLocal(newTrainings);
    window.localStorage.setItem(TRAININGS_STORAGE_KEY, JSON.stringify(newTrainings));
  };

  const value = {
    trainings,
    setTrainings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppProvider;
