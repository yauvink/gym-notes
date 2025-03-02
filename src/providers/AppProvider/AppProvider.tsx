import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_REPEATS,
  DEFAULT_REPEATS_STORAGE_KEY,
  DEFAULT_WEIGHT,
  DEFAULT_WEIGHT_STORAGE_KEY,
  WORKOUTS_STORAGE_KEY,
  USER_TRAINING_DAYS_STORAGE_KEY,
  CUSTOM_EXERCISES_STORAGE_KEY,
  ExerciseOptionType,
  MOCKED_EXERCISES,
  USER_WEIGHT_STORAGE_KEY,
  UserWeightDataType,
} from './AppProvider.constants';
import { Alert, Box } from '@mui/material';

export interface IApp {
  workouts: WorkoutType[];
  setWorkouts: (v: WorkoutType[]) => void;
  userTrainingDays: UserTrainingDayType[];
  setUserTrainingDays: (v: UserTrainingDayType[]) => void;
  localStorageUsage: string;
  defaultRepeats: number;
  setDefaultRepeats: (v: number) => void;
  defaultWeight: number;
  setDefaultWeight: (v: number) => void;
  customExercises: ExerciseOptionType[];
  setCustomExercises: (v: ExerciseOptionType[]) => void;
  handleExportData: (data: WorkoutType[] | UserTrainingDayType[] | UserWeightDataType[] | ExerciseOptionType[]) => void;
  allExercises: ExerciseOptionType[];
  userWeightData: UserWeightDataType[];
  setUserWeightData: (v: UserWeightDataType[]) => void;
}

export type SetType = {
  // is warm up
  wu?: boolean;
  reps: number;
  kg: number;
};

export type ExerciseType = {
  exercise_id: string;
  sets: Array<SetType>;
};

export type WorkoutType = {
  id: string;
  name: string;
  exercises: ExerciseType[];
};

export type UserTrainingDayType = {
  date: string;
  workout?: WorkoutType;
};

export const AppContext = createContext<null | IApp>(null);

AppContext.displayName = 'AppContext';

function useLocalStorageState<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const storedValue = window.localStorage.getItem(key);
  const initial = storedValue ? JSON.parse(storedValue) : defaultValue;
  const [state, setState] = useState<T>(initial);

  const setStoredValue = (value: T) => {
    setState(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [state, setStoredValue];
}

function AppProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<string | null>(null);
  const [workouts, setWorkouts] = useLocalStorageState<WorkoutType[]>(WORKOUTS_STORAGE_KEY, []);
  const [userTrainingDays, setUserTrainingDays] = useLocalStorageState<UserTrainingDayType[]>(
    USER_TRAINING_DAYS_STORAGE_KEY,
    []
  );
  const [defaultWeight, setDefaultWeight] = useLocalStorageState<number>(DEFAULT_WEIGHT_STORAGE_KEY, DEFAULT_WEIGHT);
  const [defaultRepeats, setDefaultRepeats] = useLocalStorageState<number>(
    DEFAULT_REPEATS_STORAGE_KEY,
    DEFAULT_REPEATS
  );
  const [customExercises, setCustomExercises] = useLocalStorageState<ExerciseOptionType[]>(
    CUSTOM_EXERCISES_STORAGE_KEY,
    []
  );
  const [userWeightData, setUserWeightData] = useLocalStorageState<UserWeightDataType[]>(USER_WEIGHT_STORAGE_KEY, []);

  function getLocalStorageSize() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length;
      }
    }
    return `Local Storage Usage: ${(total / 1024).toFixed(2)} KB`;
  }

  useEffect(() => {
    if (alert) {
      setTimeout(() => {
        setAlert(null);
      }, 500);
    }
  }, [alert]);

  const handleExportData = (
    data: WorkoutType[] | UserTrainingDayType[] | UserWeightDataType[] | ExerciseOptionType[]
  ) => {
    const dataToExport = JSON.stringify(data);
    navigator.clipboard.writeText(dataToExport);
    setAlert('Copied to clipboard');
  };

  const allExercises = useMemo(() => {
    // save mocked exer to storage
    if (customExercises.length < MOCKED_EXERCISES.length) {
      setCustomExercises([...MOCKED_EXERCISES, ...customExercises]);
    }
    return customExercises;
  }, [customExercises, setCustomExercises]);

  const value = {
    workouts,
    setWorkouts,
    userTrainingDays,
    setUserTrainingDays,
    defaultRepeats,
    setDefaultRepeats,
    defaultWeight,
    setDefaultWeight,
    customExercises,
    setCustomExercises,
    localStorageUsage: getLocalStorageSize(),
    handleExportData,
    allExercises,
    userWeightData,
    setUserWeightData,
  };

  return (
    <AppContext.Provider value={value}>
      <>
        {alert && (
          <Box
            sx={{
              position: 'fixed',
              zIndex: 999,
              top: 0,
              width: '100%',
            }}
          >
            <Alert
              sx={{
                borderRadius: 0,
              }}
              severity="success"
              variant="filled"
            >
              {alert}
            </Alert>
          </Box>
        )}
        {children}
      </>
    </AppContext.Provider>
  );
}

export default AppProvider;
