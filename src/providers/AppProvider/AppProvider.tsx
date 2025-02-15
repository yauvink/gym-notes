import { createContext, ReactNode, useEffect, useState } from 'react';
import {
  DEFAULT_REPEATS,
  DEFAULT_REPEATS_STORAGE_KEY,
  DEFAULT_WEIGHT,
  DEFAULT_WEIGHT_STORAGE_KEY,
  WORKOUTS_STORAGE_KEY,
  USER_TRAINING_DAYS_STORAGE_KEY,
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
  handleExportData: (data: WorkoutType[] | UserTrainingDayType[]) => void;
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

function AppProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<string | null>(null);
  const storageTrainingData = window.localStorage.getItem(WORKOUTS_STORAGE_KEY);
  const initialTrainingData: WorkoutType[] = storageTrainingData ? JSON.parse(storageTrainingData) : [];
  const [workouts, setWorkoutsLocal] = useState<WorkoutType[]>(initialTrainingData);
  const setWorkouts = (newWorkouts: WorkoutType[]) => {
    setWorkoutsLocal(newWorkouts);
    window.localStorage.setItem(WORKOUTS_STORAGE_KEY, JSON.stringify(newWorkouts));
  };

  const storageUserTrainingDaysData = window.localStorage.getItem(USER_TRAINING_DAYS_STORAGE_KEY);
  const initialUserTrainingDaysData: UserTrainingDayType[] = storageUserTrainingDaysData
    ? JSON.parse(storageUserTrainingDaysData)
    : [];
  const [userTrainingDays, setUserTrainingDaysLocal] = useState<UserTrainingDayType[]>(initialUserTrainingDaysData);
  const setUserTrainingDays = (newTrainingDays: UserTrainingDayType[]) => {
    setUserTrainingDaysLocal(newTrainingDays);
    window.localStorage.setItem(USER_TRAINING_DAYS_STORAGE_KEY, JSON.stringify(newTrainingDays));
  };

  const storageDefaultWeight = window.localStorage.getItem(DEFAULT_WEIGHT_STORAGE_KEY);
  const initialDefaultWeight: number = storageDefaultWeight ? JSON.parse(storageDefaultWeight) : DEFAULT_WEIGHT;
  const [defaultWeight, setDefaultWeightLocal] = useState(initialDefaultWeight);
  const setDefaultWeight = (newValue: number) => {
    setDefaultWeightLocal(newValue);
    window.localStorage.setItem(DEFAULT_WEIGHT_STORAGE_KEY, JSON.stringify(newValue));
  };

  const storageDefaultRepeats = window.localStorage.getItem(DEFAULT_REPEATS_STORAGE_KEY);
  const initialDefaultRepeats: number = storageDefaultRepeats ? JSON.parse(storageDefaultRepeats) : DEFAULT_REPEATS;
  const [defaultRepeats, setDefaultRepeatsLocal] = useState(initialDefaultRepeats);
  const setDefaultRepeats = (newValue: number) => {
    setDefaultRepeatsLocal(newValue);
    window.localStorage.setItem(DEFAULT_REPEATS_STORAGE_KEY, JSON.stringify(newValue));
  };

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

  const handleExportData = (data: WorkoutType[] | UserTrainingDayType[]) => {
    const dataToExport = JSON.stringify(data);
    console.log('dataToExport', dataToExport);
    navigator.clipboard.writeText(dataToExport);
    setAlert('Copied to clipboard');
  };

  const value = {
    workouts,
    setWorkouts,
    userTrainingDays,
    setUserTrainingDays,
    defaultRepeats,
    setDefaultRepeats,
    defaultWeight,
    setDefaultWeight,
    localStorageUsage: getLocalStorageSize(),
    handleExportData,
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
