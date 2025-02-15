export const USER_TRAINING_DAYS_STORAGE_KEY = 'key1231231123';
export const WORKOUTS_STORAGE_KEY = 'trainings_d1';
export const DEFAULT_WEIGHT_STORAGE_KEY = 'default_weight';
export const DEFAULT_REPEATS_STORAGE_KEY = 'default_repeats';
export const CUSTOM_EXERCISES_STORAGE_KEY = 'cumstom_exercises';

export const DEFAULT_WEIGHT = 50;
export const DEFAULT_REPEATS = 8;
export const MAX_WEIGHT = 300;
export const MIN_WEIGHT = 5;
export const MAX_REPEATS = 50;
export const MIN_REPEATS = 1;

export enum MuscleGroup {
  Chest = 'Chest',
  Back = 'Back',
  Shoulders = 'Shoulders',
  Biceps = 'Biceps',
  Triceps = 'Triceps',
  Legs = 'Legs',
  Core = 'Core',
}

export type GroupedExerciseOptionType = { category: MuscleGroup; exercises: ExerciseOptionType[] };

export type ExerciseOptionType = {
  id: string;
  name: string;
  optionCategory: MuscleGroup;
};

export const MOCKED_EXERCISES: ExerciseOptionType[] = [
  // Грудь
  { id: 'bench_press', name: 'Жим штанги лежа', optionCategory: MuscleGroup.Chest },
  { id: 'dumbbell_fly', name: 'Разведение гантелей', optionCategory: MuscleGroup.Chest },
  { id: 'incline_bench_press', name: 'Жим штанги на наклонной скамье', optionCategory: MuscleGroup.Chest },
  { id: 'decline_bench_press', name: 'Жим штанги на отрицательном наклоне', optionCategory: MuscleGroup.Chest },
  { id: 'push_ups', name: 'Отжимания', optionCategory: MuscleGroup.Chest },
  { id: 'cable_crossover', name: 'Сведение в кроссовере', optionCategory: MuscleGroup.Chest },

  // Спина
  { id: 'pull_ups', name: 'Подтягивания', optionCategory: MuscleGroup.Back },
  { id: 'deadlift', name: 'Становая тяга', optionCategory: MuscleGroup.Back },
  { id: 'bent_over_row', name: 'Тяга штанги в наклоне', optionCategory: MuscleGroup.Back },
  { id: 'lat_pulldown', name: 'Тяга верхнего блока', optionCategory: MuscleGroup.Back },
  { id: 'seated_row', name: 'Тяга горизонтального блока', optionCategory: MuscleGroup.Back },
  { id: 'dumbbell_row', name: 'Тяга гантели в наклоне', optionCategory: MuscleGroup.Back },

  // Плечи
  { id: 'overhead_press', name: 'Жим штанги над головой', optionCategory: MuscleGroup.Shoulders },
  { id: 'lateral_raise', name: 'Подъем гантелей в стороны', optionCategory: MuscleGroup.Shoulders },
  { id: 'front_raise', name: 'Подъем гантелей перед собой', optionCategory: MuscleGroup.Shoulders },
  { id: 'rear_delt_fly', name: 'Обратные махи', optionCategory: MuscleGroup.Shoulders },
  { id: 'arnold_press', name: 'Жим Арнольда', optionCategory: MuscleGroup.Shoulders },
  { id: 'shrugs', name: 'Шраги', optionCategory: MuscleGroup.Shoulders },

  // Бицепс
  { id: 'barbell_curl', name: 'Подъем штанги на бицепс', optionCategory: MuscleGroup.Biceps },
  { id: 'dumbbell_curl', name: 'Подъем гантелей на бицепс', optionCategory: MuscleGroup.Biceps },
  { id: 'hammer_curl', name: 'Молотковый подъем гантелей', optionCategory: MuscleGroup.Biceps },
  { id: 'preacher_curl', name: 'Подъем на скамье Скотта', optionCategory: MuscleGroup.Biceps },
  { id: 'concentration_curl', name: 'Концентрированный подъем на бицепс', optionCategory: MuscleGroup.Biceps },
  { id: 'cable_curl', name: 'Сгибания на блоке', optionCategory: MuscleGroup.Biceps },

  // Трицепс
  { id: 'triceps_dips', name: 'Отжимания на брусьях', optionCategory: MuscleGroup.Triceps },
  { id: 'close_grip_bench_press', name: 'Жим штанги узким хватом', optionCategory: MuscleGroup.Triceps },
  { id: 'triceps_pushdown', name: 'Разгибание рук на блоке', optionCategory: MuscleGroup.Triceps },
  { id: 'overhead_triceps_extension', name: 'Французский жим', optionCategory: MuscleGroup.Triceps },
  { id: 'skull_crusher', name: 'Разгибания штанги лежа', optionCategory: MuscleGroup.Triceps },
  { id: 'diamond_push_ups', name: 'Отжимания узким хватом', optionCategory: MuscleGroup.Triceps },

  // Ноги
  { id: 'squat', name: 'Приседания со штангой', optionCategory: MuscleGroup.Legs },
  { id: 'leg_press', name: 'Жим ногами', optionCategory: MuscleGroup.Legs },
  { id: 'lunges', name: 'Выпады', optionCategory: MuscleGroup.Legs },
  { id: 'leg_curl', name: 'Сгибание ног в тренажере', optionCategory: MuscleGroup.Legs },
  { id: 'leg_extension', name: 'Разгибание ног в тренажере', optionCategory: MuscleGroup.Legs },
  { id: 'calf_raise', name: 'Подъем на носки', optionCategory: MuscleGroup.Legs },

  // Пресс
  { id: 'crunches', name: 'Скручивания', optionCategory: MuscleGroup.Core },
  { id: 'leg_raises', name: 'Подъемы ног лежа', optionCategory: MuscleGroup.Core },
  { id: 'plank', name: 'Планка', optionCategory: MuscleGroup.Core },
  { id: 'russian_twist', name: 'Русские скручивания', optionCategory: MuscleGroup.Core },
  { id: 'hanging_leg_raises', name: 'Подъемы ног в висе', optionCategory: MuscleGroup.Core },
  { id: 'ab_rollout', name: 'Выкаты с колесом', optionCategory: MuscleGroup.Core },
];
