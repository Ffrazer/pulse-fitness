import { WorkoutDay, UserProfile } from '../types';

const STORAGE_KEYS = {
  WORKOUTS: 'fitflow_workouts_v1',
  PROFILE: 'fitflow_profile_v1',
  EXERCISES_CATALOG: 'fitflow_exercises_v1',
};

// Helper to format Date to YYYY-MM-DD in local time
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDayNameUk(date: Date): string {
  const days = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П’ятниця', 'Субота'];
  return days[date.getDay()];
}

// Generate default workout schedule starting from today
export function generateInitialWorkouts(): WorkoutDay[] {
  const today = new Date();

  // Day 0 (Today)
  const d0 = new Date(today);
  // Day +1
  const d1 = new Date(today);
  d1.setDate(d1.getDate() + 1);
  // Day +2
  const d2 = new Date(today);
  d2.setDate(d2.getDate() + 2);
  // Day +4
  const d4 = new Date(today);
  d4.setDate(d4.getDate() + 4);

  return [
    {
      id: 'w-today-push',
      date: formatDate(d0),
      dayName: getDayNameUk(d0),
      title: 'Груди + Трицепс (Power Push)',
      focus: 'Верхня частина тіла: груди, дельти, трицепс',
      timeScheduled: '18:30',
      reminderEnabled: true,
      durationMinutes: 55,
      status: 'planned',
      color: 'emerald',
      notes: 'Звернути увагу на повільний темп опускання штанги.',
      exercises: [
        {
          id: 'ex-1',
          name: 'Жим штанги на горизонтальній лаві',
          targetMuscle: 'Грудні м’язи',
          sets: 4,
          reps: '8-10',
          weightKg: 75,
          restSeconds: 90,
          completedSets: 0,
          completed: false,
          tips: 'Лопатки зведені разом, упор стопами в підлогу.',
        },
        {
          id: 'ex-2',
          name: 'Жим гантелей під кутом 30°',
          targetMuscle: 'Верхній пучок грудей',
          sets: 3,
          reps: '10-12',
          weightKg: 24,
          restSeconds: 75,
          completedSets: 0,
          completed: false,
          tips: 'Глибока амплітуда без ривків.',
        },
        {
          id: 'ex-3',
          name: 'Віджимання на брусах з акцентом на груди',
          targetMuscle: 'Низ грудей, трицепс',
          sets: 3,
          reps: '10-12',
          weightKg: 0,
          restSeconds: 60,
          completedSets: 0,
          completed: false,
          tips: 'Нахил корпусу вперед на 30 градусів.',
        },
        {
          id: 'ex-4',
          name: 'Французький жим з EZ-грифом лежачи',
          targetMuscle: 'Трицепс',
          sets: 3,
          reps: '10-12',
          weightKg: 30,
          restSeconds: 60,
          completedSets: 0,
          completed: false,
          tips: 'Лікті тримайте строго вертикально.',
        },
        {
          id: 'ex-5',
          name: 'Розгинання на блоці з канатною рукояткою',
          targetMuscle: 'Латеральна голівка трицепса',
          sets: 3,
          reps: '12-15',
          weightKg: 25,
          restSeconds: 45,
          completedSets: 0,
          completed: false,
          tips: 'Розведення канатів у нижній точці.',
        },
      ],
    },
    {
      id: 'w-next-pull',
      date: formatDate(d1),
      dayName: getDayNameUk(d1),
      title: 'Спина + Біцепс (Hypertrophy Pull)',
      focus: 'Ширина та товщина спини, біцепси',
      timeScheduled: '19:00',
      reminderEnabled: true,
      durationMinutes: 60,
      status: 'planned',
      color: 'cyan',
      notes: 'Підтягування виконувати з повною амплітудою.',
      exercises: [
        {
          id: 'ex-6',
          name: 'Підтягування широким хватом',
          targetMuscle: 'Найширші м’язи спини',
          sets: 4,
          reps: '8-10',
          weightKg: 0,
          restSeconds: 90,
          completedSets: 0,
          completed: false,
          tips: 'Тягніться грудьми до перекладини.',
        },
        {
          id: 'ex-7',
          name: 'Тяга штанги в нахилі до поясу',
          targetMuscle: 'Середина спини, ромбоподібні',
          sets: 4,
          reps: '8-10',
          weightKg: 65,
          restSeconds: 90,
          completedSets: 0,
          completed: false,
          tips: 'Не сутульте поперек.',
        },
        {
          id: 'ex-8',
          name: 'Тяга гантелі в нахилі однією рукою',
          targetMuscle: 'Найширші м’язи',
          sets: 3,
          reps: '10-12',
          weightKg: 28,
          restSeconds: 60,
          completedSets: 0,
          completed: false,
          tips: 'Тягніть ліктем вздовж тулуба.',
        },
        {
          id: 'ex-9',
          name: 'Згинання рук з штангою стоячи',
          targetMuscle: 'Біцепс',
          sets: 3,
          reps: '10-12',
          weightKg: 32.5,
          restSeconds: 60,
          completedSets: 0,
          completed: false,
          tips: 'Фіксуйте лікті коло боків.',
        },
      ],
    },
    {
      id: 'w-next-legs',
      date: formatDate(d2),
      dayName: getDayNameUk(d2),
      title: 'День Ніг & Плечі (Titan Legs)',
      focus: 'Квадріцепси, задня поверхня, дельтовидні',
      timeScheduled: '18:00',
      reminderEnabled: true,
      durationMinutes: 65,
      status: 'planned',
      color: 'indigo',
      notes: 'Гарно розім’яти тазостегнові та колінні суглоби.',
      exercises: [
        {
          id: 'ex-10',
          name: 'Присідання зі штангою',
          targetMuscle: 'Квадріцепси, сідниці',
          sets: 4,
          reps: '8-10',
          weightKg: 90,
          restSeconds: 120,
          completedSets: 0,
          completed: false,
          tips: 'Рівномірний тиск на всю стопу.',
        },
        {
          id: 'ex-11',
          name: 'Румунська тяга з штангою',
          targetMuscle: 'Задня поверхня стегна',
          sets: 4,
          reps: '10-12',
          weightKg: 60,
          restSeconds: 90,
          completedSets: 0,
          completed: false,
          tips: 'Таз максимально назад, відчуйте натяг.',
        },
        {
          id: 'ex-12',
          name: 'Армійський жим стоячи (Оверхед)',
          targetMuscle: 'Плечі (дельти)',
          sets: 4,
          reps: '8-10',
          weightKg: 45,
          restSeconds: 75,
          completedSets: 0,
          completed: false,
          tips: 'Напружуйте сідниці та прес для стійкості.',
        },
      ],
    },
    {
      id: 'w-next-core',
      date: formatDate(d4),
      dayName: getDayNameUk(d4),
      title: 'Кор, Мобільність & HIIT Спринти',
      focus: 'Прес, кардіо-витривалість, стретчинг',
      timeScheduled: '10:00',
      reminderEnabled: false,
      durationMinutes: 45,
      status: 'planned',
      color: 'amber',
      exercises: [
        {
          id: 'ex-13',
          name: 'Підйом ніг у висі на турніку',
          targetMuscle: 'Прес',
          sets: 3,
          reps: '15',
          weightKg: 0,
          restSeconds: 45,
          completedSets: 0,
          completed: false,
          tips: 'Не розгойдуйтесь, підйом за рахунок пресу.',
        },
        {
          id: 'ex-14',
          name: 'Інтервальний біг 8 раундів (HIIT)',
          targetMuscle: 'Кардіо, витривалість',
          sets: 8,
          reps: '30с / 60с',
          weightKg: 0,
          restSeconds: 60,
          completedSets: 0,
          completed: false,
          tips: 'Максимальний спринт 30 секунд.',
        },
      ],
    },
  ];
}

export function loadWorkouts(): WorkoutDay[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load workouts from localStorage:', err);
  }
  const initial = generateInitialWorkouts();
  saveWorkouts(initial);
  return initial;
}

export function saveWorkouts(workouts: WorkoutDay[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
  } catch (err) {
    console.error('Failed to save workouts to localStorage:', err);
  }
}

export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load profile:', err);
  }
  const initialProfile: UserProfile = {
    name: 'Андрій',
    email: 'andrejgoj37@gmail.com',
    goal: 'М’язова маса та рельєф',
    weightKg: 78.5,
    heightCm: 182,
    fitnessLevel: 'Середній',
    isPro: false,
    streakDays: 4,
    workoutsCompleted: 14,
    totalMinutesTrained: 820,
    totalVolumeKg: 18450,
  };
  saveProfile(initialProfile);
  return initialProfile;
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile:', err);
  }
}
