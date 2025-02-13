import { createContext, ReactNode, useState } from 'react';
import {
  DEFAULT_REPEATS,
  DEFAULT_REPEATS_STORAGE_KEY,
  DEFAULT_WEIGHT,
  DEFAULT_WEIGHT_STORAGE_KEY,
  TRAININGS_STORAGE_KEY,
} from './AppProvider.constants';

export interface IApp {
  trainings: TrainingType[];
  setTrainings: (trainings: TrainingType[]) => void;

  defaultRepeats: number;
  setDefaultRepeats: (v: number) => void;
  defaultWeight: number;
  setDefaultWeight: (v: number) => void;
}

export type SetType = {
  reps: number;
  kg: number;
};

export type ExerciseType = {
  exercise_id: string;
  sets: Array<SetType>;
};

export type TrainingType = {
  id: string;
  name: string;
  exercises: ExerciseType[];
};

export const AppContext = createContext<null | IApp>(null);

AppContext.displayName = 'AppContext';

function AppProvider({ children }: { children: ReactNode }) {
  const storageTrainingData = window.localStorage.getItem(TRAININGS_STORAGE_KEY);
  const initialTrainingData: TrainingType[] = storageTrainingData ? JSON.parse(storageTrainingData) : [];
  const [trainings, setTrainingsLocal] = useState<TrainingType[]>(initialTrainingData);
  const setTrainings = (newTrainings: TrainingType[]) => {
    setTrainingsLocal(newTrainings);
    window.localStorage.setItem(TRAININGS_STORAGE_KEY, JSON.stringify(newTrainings));
  };

  const storageDefaultWeight = window.localStorage.getItem(DEFAULT_WEIGHT_STORAGE_KEY);
  const initialDefaultWeight: number = storageDefaultWeight ? JSON.parse(storageDefaultWeight) : DEFAULT_WEIGHT;
  const [defaultWeight, setDefaultWeightLocal] = useState(initialDefaultWeight);

  const storageDefaultRepeats = window.localStorage.getItem(DEFAULT_REPEATS_STORAGE_KEY);
  const initialDefaultRepeats: number = storageDefaultRepeats ? JSON.parse(storageDefaultRepeats) : DEFAULT_REPEATS;
  const [defaultRepeats, setDefaultRepeatsLocal] = useState(initialDefaultRepeats);

  const setDefaultWeight = (newValue: number) => {
    setDefaultWeightLocal(newValue);
    window.localStorage.setItem(DEFAULT_WEIGHT_STORAGE_KEY, JSON.stringify(newValue));
  };

  const setDefaultRepeats = (newValue: number) => {
    setDefaultRepeatsLocal(newValue);
    window.localStorage.setItem(DEFAULT_REPEATS_STORAGE_KEY, JSON.stringify(newValue));
  };

  const value = {
    trainings,
    setTrainings,
    defaultRepeats,
    setDefaultRepeats,
    defaultWeight,
    setDefaultWeight,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppProvider;
