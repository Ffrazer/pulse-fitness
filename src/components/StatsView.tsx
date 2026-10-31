import React from 'react';
import {
  Flame,
  Award,
  TrendingUp,
  Clock,
  Dumbbell,
  CheckCircle2,
  Calendar,
  Zap,
} from 'lucide-react';
import { UserProfile, WorkoutDay } from '../types';

interface StatsViewProps {
  profile: UserProfile;
  workouts: WorkoutDay[];
}

export const StatsView: React.FC<StatsViewProps> = ({ profile, workouts }) => {
  const completedWorkouts = workouts.filter((w) => w.status === 'completed');

  // Compute total volume lifted from completed workouts
  const computedVolume = completedWorkouts.reduce((sum, w) => {
    return (
      sum +
      w.exercises.reduce((exSum, ex) => {
        const weight = typeof ex.weightKg === 'number' ? ex.weightKg : 20;
        const setsDone = ex.completedSets || ex.sets;
        const reps = parseInt(ex.reps) || 10;
        return exSum + weight * setsDone * reps;
      }, 0)
    );
  }, profile.totalVolumeKg);

  // Muscle group frequency
  const muscleCounts: Record<string, number> = {};
  workouts.forEach((w) => {
    w.exercises.forEach((ex) => {
      const muscle = ex.targetMuscle || 'Інше';
      muscleCounts[muscle] = (muscleCounts[muscle] || 0) + 1;
    });
  });

  const muscleList = Object.entries(muscleCounts).sort((a, b) => b[1] - a[1]);
  const maxMuscleCount = muscleList.length > 0 ? muscleList[0][1] : 1;

  // Personal Records
  const personalRecords = [
    { name: 'Жим штанги лежачи', weight: '105 кг', date: '2 тижні тому', icon: '🏋️' },
    { name: 'Присідання зі штангою', weight: '130 кг', date: '1 місяць тому', icon: '🦵' },
    { name: 'Станова тяга', weight: '150 кг', date: '3 тижні тому', icon: '⚡' },
    { name: 'Підтягування з додатковою вагою', weight: '+22.5 кг', date: 'Цього тижня', icon: '🧗' },
  ];

  return (
    <div className="space-y-6">
      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Streak */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-orange-950/40 via-slate-900 to-slate-900 border border-orange-500/30 shadow-lg">
          <div className="flex items-center justify-between text-orange-400 mb-2">
            <span className="text-xs font-semibold text-slate-400">Серія тренувань</span>
            <Flame className="w-5 h-5 fill-orange-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {profile.streakDays} <span className="text-sm font-normal text-slate-400">днів</span>
          </div>
          <p className="text-[11px] text-orange-400 mt-1 font-medium">🔥 Регулярність 100%</p>
        </div>

        {/* Total Workouts Completed */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-lg">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-semibold text-slate-400">Завершено тренувань</span>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {profile.workoutsCompleted + completedWorkouts.length}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 font-medium">Всі цілі досягнуто</p>
        </div>

        {/* Total Time */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30 shadow-lg">
          <div className="flex items-center justify-between text-cyan-400 mb-2">
            <span className="text-xs font-semibold text-slate-400">Час у русі</span>
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {Math.round((profile.totalMinutesTrained + completedWorkouts.length * 55) / 60)}{' '}
            <span className="text-sm font-normal text-slate-400">годин</span>
          </div>
          <p className="text-[11px] text-cyan-400 mt-1 font-medium">
            ~{Math.round((profile.totalMinutesTrained + completedWorkouts.length * 55) * 6.5)} ккал спалено
          </p>
        </div>

        {/* Total Volume */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-lg">
          <div className="flex items-center justify-between text-indigo-400 mb-2">
            <span className="text-xs font-semibold text-slate-400">Піднятий тоннаж</span>
            <Dumbbell className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {(computedVolume / 1000).toFixed(1)}{' '}
            <span className="text-sm font-normal text-slate-400">тонн</span>
          </div>
          <p className="text-[11px] text-indigo-400 mt-1 font-medium">Прогресивне зростання</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Muscle group distribution chart */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Розподіл навантаження по групах м’язів
            </h3>
            <span className="text-xs text-slate-400">Вправ у плані</span>
          </div>

          <div className="space-y-3">
            {muscleList.slice(0, 7).map(([muscle, count]) => {
              const pct = Math.round((count / maxMuscleCount) * 100);
              return (
                <div key={muscle} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="font-semibold">{muscle}</span>
                    <span className="font-mono text-emerald-400">{count} вправ</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Personal Records (PR) */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Особисті Рекорди (1RM PR)
            </h3>
            <span className="text-xs text-amber-400 font-semibold">Вага</span>
          </div>

          <div className="space-y-3">
            {personalRecords.map((pr, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 hover:border-slate-600 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{pr.icon}</span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">{pr.name}</h4>
                    <span className="text-[10px] text-slate-400">{pr.date}</span>
                  </div>
                </div>
                <span className="text-sm sm:text-base font-black font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-500/20">
                  {pr.weight}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
