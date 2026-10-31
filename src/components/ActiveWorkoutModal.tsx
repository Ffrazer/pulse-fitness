import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Check,
  Clock,
  Dumbbell,
  Sparkles,
  Plus,
  Flame,
  Volume2,
  X,
  Award,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WorkoutDay, WorkoutExercise, SessionReviewResult } from '../types';
import { sounds } from '../utils/audio';

interface ActiveWorkoutModalProps {
  workout: WorkoutDay | null;
  onClose: () => void;
  onFinishWorkout: (workout: WorkoutDay, elapsedSeconds: number) => void;
  isPro: boolean;
}

interface SetLog {
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
}

export const ActiveWorkoutModal: React.FC<ActiveWorkoutModalProps> = ({
  workout,
  onClose,
  onFinishWorkout,
  isPro,
}) => {
  if (!workout) return null;

  // Running workout stopwatch
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Rest countdown stopwatch
  const [restSecondsLeft, setRestSecondsLeft] = useState<number | null>(null);
  const [restDuration, setRestDuration] = useState(60);

  // Detailed sets logging (Hevy / Strong app style table)
  const [exerciseLogs, setExerciseLogs] = useState<{
    [exerciseId: string]: SetLog[];
  }>(() => {
    const initial: { [id: string]: SetLog[] } = {};
    workout.exercises.forEach((ex, idx) => {
      const exId = ex.id || `ex-${idx}`;
      const defaultWeight = typeof ex.weightKg === 'number' ? ex.weightKg : 60;
      const defaultReps = parseInt(ex.reps) || 10;
      const count = ex.sets || 3;

      initial[exId] = Array.from({ length: count }, (_, sIdx) => ({
        setNumber: sIdx + 1,
        weight: defaultWeight,
        reps: defaultReps,
        completed: sIdx < (ex.completedSets || 0),
      }));
    });
    return initial;
  });

  const [workoutFinished, setWorkoutFinished] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [aiReview, setAiReview] = useState<SessionReviewResult | null>(null);

  // Master workout timer interval
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && !workoutFinished) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, workoutFinished]);

  // Rest timer countdown
  useEffect(() => {
    let restInterval: any = null;
    if (restSecondsLeft !== null && restSecondsLeft > 0) {
      restInterval = setInterval(() => {
        setRestSecondsLeft((prev) => {
          if (prev === null) return null;
          if (prev <= 4 && prev > 1) {
            sounds.playTick();
          }
          if (prev <= 1) {
            sounds.playTimerFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(restInterval);
  }, [restSecondsLeft]);

  // Format MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Toggle set checkbox (Hevy style)
  const handleToggleSet = (exId: string, setIdx: number, restSeconds: number) => {
    setExerciseLogs((prev) => {
      const sets = [...(prev[exId] || [])];
      const target = { ...sets[setIdx] };
      target.completed = !target.completed;
      sets[setIdx] = target;

      if (target.completed) {
        sounds.playTick();
        // Trigger rest timer
        setRestDuration(restSeconds || 60);
        setRestSecondsLeft(restSeconds || 60);
      }

      return { ...prev, [exId]: sets };
    });
  };

  // Update set weight
  const handleUpdateWeight = (exId: string, setIdx: number, weight: number) => {
    setExerciseLogs((prev) => {
      const sets = [...(prev[exId] || [])];
      sets[setIdx] = { ...sets[setIdx], weight };
      return { ...prev, [exId]: sets };
    });
  };

  // Update set reps
  const handleUpdateReps = (exId: string, setIdx: number, reps: number) => {
    setExerciseLogs((prev) => {
      const sets = [...(prev[exId] || [])];
      sets[setIdx] = { ...sets[setIdx], reps };
      return { ...prev, [exId]: sets };
    });
  };

  // Add new set to exercise
  const handleAddSet = (exId: string) => {
    setExerciseLogs((prev) => {
      const sets = [...(prev[exId] || [])];
      const lastSet = sets[sets.length - 1];
      const newSet: SetLog = {
        setNumber: sets.length + 1,
        weight: lastSet ? lastSet.weight : 50,
        reps: lastSet ? lastSet.reps : 10,
        completed: false,
      };
      return { ...prev, [exId]: [...sets, newSet] };
    });
  };

  // Complete workout & call AI
  const handleCompleteSession = async () => {
    setIsTimerRunning(false);
    setWorkoutFinished(true);
    sounds.playTimerFinish();

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {}

    // Prepare exercises summary
    const updatedExercises: WorkoutExercise[] = workout.exercises.map((ex, idx) => {
      const exId = ex.id || `ex-${idx}`;
      const sets = exerciseLogs[exId] || [];
      const completedCount = sets.filter((s) => s.completed).length;
      return {
        ...ex,
        sets: sets.length,
        completedSets: completedCount,
        completed: completedCount >= sets.length,
      };
    });

    setIsReviewing(true);
    try {
      const res = await fetch('/api/ai/review-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session: {
            title: workout.title,
            durationMinutes: Math.max(1, Math.round(elapsedSeconds / 60)),
            exercises: updatedExercises.map((e, idx) => {
              const exId = e.id || `ex-${idx}`;
              const sets = exerciseLogs[exId] || [];
              return {
                name: e.name,
                targetMuscle: e.targetMuscle,
                plannedSets: sets.length,
                completedSets: sets.filter((s) => s.completed).length,
                setsLog: sets,
              };
            }),
          },
        }),
      });

      const data = await res.json();
      if (data.data) {
        setAiReview(data.data);
      }
    } catch (err) {
      console.error('Error fetching review:', err);
    } finally {
      setIsReviewing(false);
    }

    const updatedWorkout: WorkoutDay = {
      ...workout,
      exercises: updatedExercises,
      status: 'completed',
      completedAt: new Date().toISOString(),
    };
    onFinishWorkout(updatedWorkout, elapsedSeconds);
  };

  // Compute stats
  let totalSets = 0;
  let completedSetsCount = 0;
  let totalTonnageKg = 0;

  Object.values(exerciseLogs).forEach((sets) => {
    sets.forEach((s) => {
      totalSets += 1;
      if (s.completed) {
        completedSetsCount += 1;
        totalTonnageKg += s.weight * s.reps;
      }
    });
  });

  const progressPercent = totalSets > 0 ? Math.round((completedSetsCount / totalSets) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-3xl bg-[#0d1322] border border-emerald-500/30 shadow-2xl text-white my-auto overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Active Bar: Nike/Hevy Athletic Header */}
        <div className="bg-gradient-to-r from-[#0d1322] via-[#111a2f] to-[#0d1322] p-4 sm:p-6 border-b border-slate-800">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs uppercase font-black tracking-wider text-emerald-400">
                ЖИВИЙ СЕАНС ТРЕНУВАННЯ
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Згорнути"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">{workout.title}</h2>
              <p className="text-xs sm:text-sm text-cyan-400 font-semibold">{workout.focus}</p>
            </div>

            {/* Big Stopwatch Display */}
            <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 shadow-inner">
              <Clock className="w-5 h-5 text-emerald-400" />
              <span className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-widest">
                {formatTime(elapsedSeconds)}
              </span>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition"
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>
            </div>
          </div>

          {/* Quick Metrics (Sets Done, Volume Lifted) */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-center">
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Виконано</span>
              <span className="text-sm font-black text-white font-mono">
                {completedSetsCount} / {totalSets} сетів
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Піднятий тоннаж</span>
              <span className="text-sm font-black text-emerald-400 font-mono">
                {totalTonnageKg.toLocaleString()} кг
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Прогрес сесії</span>
              <span className="text-sm font-black text-cyan-400 font-mono">{progressPercent}%</span>
            </div>
          </div>
        </div>

        {/* Floating Rest Countdown Banner */}
        {restSecondsLeft !== null && restSecondsLeft > 0 && (
          <div className="bg-gradient-to-r from-amber-500/20 via-amber-600/20 to-amber-500/20 border-b border-amber-500/40 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs animate-fadeIn">
            <div className="flex items-center gap-2.5 text-amber-300 font-bold">
              <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Таймер відпочинку:</span>
              <span className="font-mono font-black text-base text-white bg-slate-950 px-2.5 py-0.5 rounded-lg border border-amber-500/40">
                {restSecondsLeft}с
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRestSecondsLeft((prev) => (prev ? prev + 30 : 30))}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 font-bold text-xs transition"
              >
                +30с
              </button>
              <button
                onClick={() => setRestSecondsLeft(0)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
              >
                Пропустити
              </button>
            </div>
          </div>
        )}

        {/* Exercises Logging Table (Hevy / Strong style) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="text-xs text-slate-400 flex items-center gap-2 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <span>💡</span>
            <span>
              <strong>Як записувати:</strong> вписуйте вагу та повторення для кожного сету, потім натискайте зелену галочку <strong>[✓]</strong> після виконання!
            </span>
          </div>

          {workout.exercises.map((ex, exIdx) => {
            const exId = ex.id || `ex-${exIdx}`;
            const sets = exerciseLogs[exId] || [];

            return (
              <div
                key={exId}
                className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden shadow-lg"
              >
                {/* Exercise Title Bar */}
                <div className="p-4 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center font-mono">
                      {exIdx + 1}
                    </span>
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-white">{ex.name}</h3>
                      <p className="text-xs text-slate-400">{ex.targetMuscle}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {sets.filter((s) => s.completed).length} / {sets.length} сетів
                  </span>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-slate-950/40 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800/60 text-center">
                  <div className="col-span-2 text-left">СЕТ</div>
                  <div className="col-span-4">ВАГА (КГ)</div>
                  <div className="col-span-4">ПОВТОРЕННЯ</div>
                  <div className="col-span-2">СТАТУС</div>
                </div>

                {/* Set Rows */}
                <div className="divide-y divide-slate-800/60 p-2 space-y-1">
                  {sets.map((set, setIdx) => (
                    <div
                      key={setIdx}
                      className={`grid grid-cols-12 gap-2 p-2 rounded-xl items-center transition ${
                        set.completed
                          ? 'bg-emerald-950/30 text-emerald-300'
                          : 'hover:bg-slate-800/40 text-slate-200'
                      }`}
                    >
                      {/* Set Number */}
                      <div className="col-span-2 font-mono font-bold text-xs pl-1">
                        #{set.setNumber}
                      </div>

                      {/* Weight Input */}
                      <div className="col-span-4 flex items-center justify-center">
                        <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-700 w-full max-w-[110px]">
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={set.weight}
                            onChange={(e) =>
                              handleUpdateWeight(exId, setIdx, Number(e.target.value))
                            }
                            className="w-full bg-transparent text-white font-mono font-bold text-xs sm:text-sm text-center focus:outline-none"
                          />
                          <span className="text-[10px] text-slate-400">кг</span>
                        </div>
                      </div>

                      {/* Reps Input */}
                      <div className="col-span-4 flex items-center justify-center">
                        <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-700 w-full max-w-[100px]">
                          <input
                            type="number"
                            min="1"
                            value={set.reps}
                            onChange={(e) =>
                              handleUpdateReps(exId, setIdx, Number(e.target.value))
                            }
                            className="w-full bg-transparent text-white font-mono font-bold text-xs sm:text-sm text-center focus:outline-none"
                          />
                          <span className="text-[10px] text-slate-400">повт</span>
                        </div>
                      </div>

                      {/* Checkbox button */}
                      <div className="col-span-2 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => handleToggleSet(exId, setIdx, ex.restSeconds || 60)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
                            set.completed
                              ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700'
                          }`}
                          title={set.completed ? 'Підхід виконано!' : 'Позначити підхід виконаним'}
                        >
                          <Check className="w-5 h-5 stroke-[3]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add set button */}
                <div className="p-3 bg-slate-950/30 border-t border-slate-800/60 flex items-center justify-between">
                  {ex.tips && (
                    <span className="text-[11px] text-slate-400 line-clamp-1">
                      💡 {ex.tips}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleAddSet(exId)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 ml-auto"
                  >
                    <Plus className="w-3.5 h-3.5" /> Додати сет
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Coaching Review section if finished */}
        {workoutFinished && (
          <div className="p-6 bg-slate-950 border-t border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">ШІ-Аналіз щойно завершеного тренування</h3>
            </div>

            {isReviewing ? (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 text-xs">
                <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                <span>ШІ аналізує прогресивне перевантаження та тоннаж...</span>
              </div>
            ) : aiReview ? (
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-2">
                <p className="text-emerald-300 font-bold text-sm">{aiReview.congratulation}</p>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Інтенсивність RPE:</span>
                    <span className="text-white font-bold">{aiReview.rpeEstimate}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Оцінка об'єму:</span>
                    <span className="text-white font-bold">{aiReview.volumeAnalysis}</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
                  <span className="text-cyan-400 font-bold block mb-0.5">🎯 Порада на наступний раз:</span>
                  <p>{aiReview.nextStep}</p>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition"
          >
            {workoutFinished ? 'Закрити' : 'Згорнути сесію'}
          </button>

          {!workoutFinished ? (
            <button
              onClick={handleCompleteSession}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/25 transition"
            >
              <Award className="w-4 h-4" />
              <span>Завершити тренування ({completedSetsCount} сетів)</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm transition shadow"
            >
              Зберегти в щоденник
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
