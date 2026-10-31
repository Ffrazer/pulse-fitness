export interface WorkoutExercise {
  id: string;
  name: string;
  targetMuscle: string;
  sets: number;
  reps: string;
  weightKg?: number | string;
  restSeconds: number;
  completedSets?: number;
  completed?: boolean;
  notes?: string;
  tips?: string;
}

export interface WorkoutDay {
  id: string;
  date: string; // YYYY-MM-DD
  dayName: string;
  title: string;
  focus: string;
  timeScheduled: string; // "09:00"
  reminderEnabled: boolean;
  durationMinutes: number;
  status: 'planned' | 'in_progress' | 'completed' | 'skipped';
  color: 'emerald' | 'cyan' | 'indigo' | 'amber' | 'rose' | 'purple';
  exercises: WorkoutExercise[];
  completedAt?: string;
  notes?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  goal: string;
  weightKg: number;
  heightCm: number;
  fitnessLevel: 'Початківець' | 'Середній' | 'Просунутий';
  isPro: boolean;
  proExpiresAt?: string;
  streakDays: number;
  workoutsCompleted: number;
  totalMinutesTrained: number;
  totalVolumeKg: number;
}

export interface PlanAnalysisResult {
  score: number;
  assessment: string;
  strengths: string[];
  risks: string[];
  recommendations: string[];
}

export interface SessionReviewResult {
  congratulation: string;
  rpeEstimate: string;
  volumeAnalysis: string;
  nextStep: string;
}

export interface GeneratedPlan {
  title: string;
  description: string;
  weeklyGoal: string;
  estimatedCaloriesBurnedPerSession: number;
  days: {
    dayName: string;
    dayNumber: number;
    focus: string;
    durationMinutes: number;
    color: string;
    exercises: WorkoutExercise[];
  }[];
  coachTips: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  joinedAt: string;
  isLoggedIn: boolean;
}

