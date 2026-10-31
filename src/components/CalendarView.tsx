import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Bell,
  BellOff,
  CheckCircle,
  Play,
  Dumbbell,
  Sparkles,
  Flame,
  MoreVertical,
  Trash2,
  Copy,
  Layers,
} from 'lucide-react';
import { WorkoutDay, WorkoutExercise } from '../types';
import { formatDate, getDayNameUk } from '../utils/storage';
import { sounds } from '../utils/audio';

interface CalendarViewProps {
  workouts: WorkoutDay[];
  onAddWorkout: (workout: WorkoutDay) => void;
  onUpdateWorkout: (workout: WorkoutDay) => void;
  onDeleteWorkout: (id: string) => void;
  onStartSession: (workout: WorkoutDay) => void;
  onOpenAIGenerator: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  workouts,
  onAddWorkout,
  onUpdateWorkout,
  onDeleteWorkout,
  onStartSession,
  onOpenAIGenerator,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('week');
  const [selectedDateStr, setSelectedDateStr] = useState<string>(formatDate(new Date()));
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutDay | null>(null);

  // New Workout Form state
  const [formTitle, setFormTitle] = useState('Індивідуальне тренування');
  const [formFocus, setFormFocus] = useState('Груди + Трицепс');
  const [formDate, setFormDate] = useState(formatDate(new Date()));
  const [formTime, setFormTime] = useState('18:00');
  const [formDuration, setFormDuration] = useState(60);
  const [formReminder, setFormReminder] = useState(true);
  const [formColor, setFormColor] = useState<'emerald' | 'cyan' | 'indigo' | 'amber' | 'rose' | 'purple'>('emerald');
  const [formExercises, setFormExercises] = useState<WorkoutExercise[]>([
    {
      id: 'ex-new-1',
      name: 'Жим штанги лежачи',
      targetMuscle: 'Груди',
      sets: 4,
      reps: '8-10',
      weightKg: 70,
      restSeconds: 90,
      completedSets: 0,
    },
    {
      id: 'ex-new-2',
      name: 'Французький жим',
      targetMuscle: 'Трицепс',
      sets: 3,
      reps: '10-12',
      weightKg: 25,
      restSeconds: 60,
      completedSets: 0,
    },
  ]);

  // Navigate dates
  const handlePrev = () => {
    const next = new Date(currentDate);
    if (viewMode === 'month') {
      next.setMonth(next.getMonth() - 1);
    } else if (viewMode === 'week') {
      next.setDate(next.getDate() - 7);
    } else {
      next.setDate(next.getDate() - 1);
    }
    setCurrentDate(next);
  };

  const handleNext = () => {
    const next = new Date(currentDate);
    if (viewMode === 'month') {
      next.setMonth(next.getMonth() + 1);
    } else if (viewMode === 'week') {
      next.setDate(next.getDate() + 7);
    } else {
      next.setDate(next.getDate() + 1);
    }
    setCurrentDate(next);
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(formatDate(today));
  };

  // Days in current week (Monday to Sunday)
  const getWeekDays = (baseDate: Date) => {
    const current = new Date(baseDate);
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const monday = new Date(current.setDate(diff));

    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      week.push(d);
    }
    return week;
  };

  const weekDays = getWeekDays(currentDate);

  // Month days
  const getMonthDays = (baseDate: Date) => {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: (Date | null)[] = [];
    // Prefix blank days based on first day of month (Monday start)
    let startDayOfWeek = firstDay.getDay(); // 0 is Sun, 1 is Mon...
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const monthDays = getMonthDays(currentDate);

  // Open add modal for a specific date & time
  const handleSlotClick = (dateStr: string, time: string = '18:00') => {
    setSelectedDateStr(dateStr);
    setFormDate(dateStr);
    setFormTime(time);
    setFormTitle('Індивідуальне тренування');
    setEditingWorkout(null);
    setShowAddModal(true);
  };

  const handleSaveWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    const targetDate = new Date(formDate);

    const workoutData: WorkoutDay = {
      id: editingWorkout ? editingWorkout.id : `w-${Date.now()}`,
      date: formDate,
      dayName: getDayNameUk(targetDate),
      title: formTitle.trim() || 'Тренування',
      focus: formFocus.trim() || 'Загальна форма',
      timeScheduled: formTime,
      reminderEnabled: formReminder,
      durationMinutes: Number(formDuration) || 60,
      status: editingWorkout ? editingWorkout.status : 'planned',
      color: formColor,
      exercises: formExercises.filter((ex) => ex.name.trim() !== ''),
      completedAt: editingWorkout?.completedAt,
    };

    if (editingWorkout) {
      onUpdateWorkout(workoutData);
    } else {
      onAddWorkout(workoutData);
    }

    if (formReminder) {
      sounds.playTick();
    }

    setShowAddModal(false);
    setEditingWorkout(null);
  };

  const handleEditWorkout = (w: WorkoutDay) => {
    setEditingWorkout(w);
    setFormDate(w.date);
    setFormTime(w.timeScheduled);
    setFormTitle(w.title);
    setFormFocus(w.focus);
    setFormDuration(w.durationMinutes);
    setFormReminder(w.reminderEnabled);
    setFormColor(w.color || 'emerald');
    setFormExercises(
      w.exercises.length > 0
        ? w.exercises
        : [
            {
              id: 'ex-1',
              name: 'Базова вправа',
              targetMuscle: 'М’язи',
              sets: 3,
              reps: '10',
              restSeconds: 60,
              completedSets: 0,
            },
          ]
    );
    setShowAddModal(true);
  };

  const handleDuplicateToNextDay = (w: WorkoutDay) => {
    const cur = new Date(w.date);
    cur.setDate(cur.getDate() + 1);
    const newDateStr = formatDate(cur);

    const duplicated: WorkoutDay = {
      ...w,
      id: `w-${Date.now()}`,
      date: newDateStr,
      dayName: getDayNameUk(cur),
      status: 'planned',
      completedAt: undefined,
    };
    onAddWorkout(duplicated);
  };

  const handleShiftWorkout = (w: WorkoutDay, daysDelta: number) => {
    const d = new Date(w.date);
    d.setDate(d.getDate() + daysDelta);
    const newDateStr = formatDate(d);
    onUpdateWorkout({
      ...w,
      date: newDateStr,
      dayName: getDayNameUk(d),
    });
    sounds.playTick();
  };

  const handleQuickChangeTime = (w: WorkoutDay, newTime: string) => {
    onUpdateWorkout({
      ...w,
      timeScheduled: newTime,
    });
    sounds.playTick();
  };

  const handleDragStart = (e: React.DragEvent, workoutId: string) => {
    e.dataTransfer.setData('text/plain', workoutId);
  };

  const handleDropOnDate = (e: React.DragEvent, targetDateStr: string) => {
    e.preventDefault();
    const workoutId = e.dataTransfer.getData('text/plain');
    const target = workouts.find((w) => w.id === workoutId);
    if (target) {
      const d = new Date(targetDateStr);
      onUpdateWorkout({
        ...target,
        date: targetDateStr,
        dayName: getDayNameUk(d),
      });
      sounds.playTick();
    }
  };

  const getWorkoutPhoto = (focus: string): string => {
    const f = (focus || '').toLowerCase();
    if (f.includes('груди') || f.includes('push') || f.includes('трицепс') || f.includes('жим')) {
      return 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80';
    }
    if (f.includes('спина') || f.includes('pull') || f.includes('біцепс') || f.includes('тяга')) {
      return 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=400&q=80';
    }
    if (f.includes('ног') || f.includes('legs') || f.includes('присід') || f.includes('квадр')) {
      return 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=400&q=80';
    }
    if (f.includes('кор') || f.includes('прес') || f.includes('hiit') || f.includes('кардіо')) {
      return 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80';
    }
    return 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=400&q=80';
  };

  const handleAddExerciseRow = () => {
    setFormExercises([
      ...formExercises,
      {
        id: `ex-${Date.now()}`,
        name: '',
        targetMuscle: 'М’язи',
        sets: 3,
        reps: '10-12',
        weightKg: 20,
        restSeconds: 60,
        completedSets: 0,
      },
    ]);
  };

  const handleRemoveExerciseRow = (idx: number) => {
    setFormExercises(formExercises.filter((_, i) => i !== idx));
  };

  const colorClasses: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    emerald: {
      bg: 'bg-emerald-950/40 hover:bg-emerald-900/50',
      border: 'border-emerald-500/40',
      text: 'text-emerald-300',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    cyan: {
      bg: 'bg-cyan-950/40 hover:bg-cyan-900/50',
      border: 'border-cyan-500/40',
      text: 'text-cyan-300',
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    },
    indigo: {
      bg: 'bg-indigo-950/40 hover:bg-indigo-900/50',
      border: 'border-indigo-500/40',
      text: 'text-indigo-300',
      badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
    amber: {
      bg: 'bg-amber-950/40 hover:bg-amber-900/50',
      border: 'border-amber-500/40',
      text: 'text-amber-300',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    rose: {
      bg: 'bg-rose-950/40 hover:bg-rose-900/50',
      border: 'border-rose-500/40',
      text: 'text-rose-300',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
    purple: {
      bg: 'bg-purple-950/40 hover:bg-purple-900/50',
      border: 'border-purple-500/40',
      text: 'text-purple-300',
      badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
  };

  // Hours for timeline (from 07:00 to 22:00)
  const timelineHours = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '16:00', '18:00', '19:00', '20:00', '21:00'];

  const selectedDateWorkouts = workouts.filter((w) => w.date === selectedDateStr);

  return (
    <div className="space-y-6">
      {/* Top Calendar Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Розклад Тренувань
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                Google Calendar стиль
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {currentDate.toLocaleString('uk-UA', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Today Button & Navigation */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={handleToday}
              className="px-3 py-1 text-xs font-semibold text-slate-200 hover:text-white rounded-lg hover:bg-slate-700 transition"
            >
              Сьогодні
            </button>
            <div className="h-4 w-[1px] bg-slate-700 mx-1" />
            <button
              onClick={handlePrev}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* View Mode Buttons (Week / Month / Day) */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                viewMode === 'week' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Тиждень
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                viewMode === 'month' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Місяць
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                viewMode === 'day' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              День
            </button>
          </div>

          {/* AI Generator CTA */}
          <button
            onClick={onOpenAIGenerator}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white text-xs font-bold hover:brightness-110 transition shadow-lg shadow-cyan-900/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ШІ Створити План</span>
          </button>

          {/* Add workout */}
          <button
            onClick={() => handleSlotClick(selectedDateStr, '18:00')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Додати</span>
          </button>
        </div>
      </div>

      {/* VIEW: WEEK TIMELINE (Google Calendar style) */}
      {viewMode === 'week' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950/60 text-center">
            {weekDays.map((date, idx) => {
              const dStr = formatDate(date);
              const isToday = dStr === formatDate(new Date());
              const isSelected = dStr === selectedDateStr;
              const dayWorkouts = workouts.filter((w) => w.date === dStr);

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDateStr(dStr)}
                  className={`py-3 px-1 border-r border-slate-800/80 cursor-pointer transition ${
                    isSelected ? 'bg-slate-800/80' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    {date.toLocaleDateString('uk-UA', { weekday: 'short' })}
                  </p>
                  <div
                    className={`inline-flex items-center justify-center w-8 h-8 mt-1 rounded-full text-sm font-bold transition ${
                      isToday
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                        : isSelected
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-200'
                    }`}
                  >
                    {date.getDate()}
                  </div>
                  {dayWorkouts.length > 0 && (
                    <div className="flex justify-center gap-1 mt-1">
                      {dayWorkouts.map((w) => (
                        <span
                          key={w.id}
                          className={`w-1.5 h-1.5 rounded-full ${
                            w.status === 'completed' ? 'bg-emerald-400' : 'bg-cyan-400'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Week Grid Slots */}
          <div className="grid grid-cols-7 min-h-[500px] divide-x divide-slate-800">
            {weekDays.map((date, colIdx) => {
              const dStr = formatDate(date);
              const dayWorkouts = workouts.filter((w) => w.date === dStr);

              return (
                <div
                  key={colIdx}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDropOnDate(e, dStr)}
                  className="p-2 space-y-2 relative min-h-[320px] hover:bg-slate-800/30 transition group border-2 border-transparent hover:border-emerald-500/20 rounded-xl"
                  onClick={(e) => {
                    // Only open if clicking blank background
                    if (e.target === e.currentTarget) {
                      handleSlotClick(dStr, '18:00');
                    }
                  }}
                >
                  {/* Plus button on hover */}
                  <button
                    onClick={() => handleSlotClick(dStr, '18:00')}
                    className="opacity-0 group-hover:opacity-100 absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition z-10"
                    title="Додати тренування на цей день"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>

                  {dayWorkouts.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center p-3 opacity-30 group-hover:opacity-60 transition">
                      <span className="text-[11px] text-slate-500">День відпочинку</span>
                    </div>
                  ) : (
                    dayWorkouts.map((w) => {
                      const color = colorClasses[w.color] || colorClasses.emerald;
                      return (
                        <div
                          key={w.id}
                          draggable={true}
                          onDragStart={(e) => handleDragStart(e, w.id)}
                          className={`rounded-xl p-2.5 border transition cursor-grab active:cursor-grabbing shadow-sm relative overflow-hidden ${color.bg} ${color.border} hover:scale-[1.02]`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditWorkout(w);
                          }}
                        >
                          {/* Real Photo Header Banner */}
                          <div className="h-14 -mx-2.5 -mt-2.5 mb-2 relative overflow-hidden rounded-t-lg bg-slate-950">
                            <img
                              src={getWorkoutPhoto(w.focus)}
                              alt={w.title}
                              className="w-full h-full object-cover brightness-75"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                            <span className="absolute bottom-1 left-2 text-[10px] font-black text-white uppercase drop-shadow">
                              {w.timeScheduled} • {w.durationMinutes} хв
                            </span>
                          </div>

                          <div className="pl-0.5">
                            <div className="flex items-center justify-between gap-1 text-[11px] mb-1">
                              <h4 className="text-xs font-bold text-white line-clamp-1">{w.title}</h4>
                              {w.reminderEnabled ? (
                                <Bell className="w-3 h-3 text-amber-400 fill-amber-400/30 shrink-0" />
                              ) : (
                                <BellOff className="w-3 h-3 text-slate-500 shrink-0" />
                              )}
                            </div>

                            <p className="text-[10px] text-slate-400 line-clamp-1 mb-2">{w.focus}</p>

                            {/* Shift & Time Re-scheduler Toolbar */}
                            <div className="flex items-center justify-between gap-1 mb-2 pt-1 border-t border-slate-800/80 text-[10px]">
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleShiftWorkout(w, -1);
                                  }}
                                  title="Пересунути на вчора"
                                  className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                                >
                                  ◀
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleShiftWorkout(w, 1);
                                  }}
                                  title="Пересунути на завтра"
                                  className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                                >
                                  ▶
                                </button>
                              </div>

                              <select
                                value={w.timeScheduled}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleQuickChangeTime(w, e.target.value);
                                }}
                                className="bg-slate-900 text-slate-300 border border-slate-700 rounded px-1 py-0.5 text-[10px] font-mono focus:outline-none"
                              >
                                <option value="07:00">07:00</option>
                                <option value="09:00">09:00</option>
                                <option value="12:00">12:00</option>
                                <option value="16:00">16:00</option>
                                <option value="18:00">18:00</option>
                                <option value="18:30">18:30</option>
                                <option value="19:00">19:00</option>
                                <option value="20:00">20:00</option>
                              </select>
                            </div>

                            {/* Quick Start button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onStartSession(w);
                              }}
                              className="w-full py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-emerald-500/20"
                            >
                              <Play className="w-3.5 h-3.5 fill-slate-950" />
                              <span>{w.status === 'completed' ? 'Тренуватись знову' : 'Почати тренування'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: MONTH (Calendar Grid) */}
      {viewMode === 'month' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl">
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-400 mb-2">
            <div>Пн</div>
            <div>Вт</div>
            <div>Ср</div>
            <div>Чт</div>
            <div>Пт</div>
            <div>Сб</div>
            <div>Нд</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {monthDays.map((date, idx) => {
              if (!date) {
                return <div key={`empty-${idx}`} className="h-24 rounded-xl bg-slate-950/20" />;
              }
              const dStr = formatDate(date);
              const isToday = dStr === formatDate(new Date());
              const isSelected = dStr === selectedDateStr;
              const dayWorkouts = workouts.filter((w) => w.date === dStr);

              return (
                <div
                  key={dStr}
                  onClick={() => {
                    setSelectedDateStr(dStr);
                    if (dayWorkouts.length === 0) {
                      handleSlotClick(dStr);
                    }
                  }}
                  className={`h-24 p-2 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-500 bg-slate-800/90'
                      : 'border-slate-800 bg-slate-950/40 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday ? 'bg-emerald-500 text-slate-950' : 'text-slate-300'
                      }`}
                    >
                      {date.getDate()}
                    </span>
                    {dayWorkouts.length > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
                        {dayWorkouts.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 overflow-hidden">
                    {dayWorkouts.slice(0, 2).map((w) => (
                      <div
                        key={w.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditWorkout(w);
                        }}
                        className="text-[10px] truncate px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 hover:border-emerald-500 transition"
                      >
                        {w.timeScheduled} {w.title}
                      </div>
                    ))}
                    {dayWorkouts.length > 2 && (
                      <span className="text-[9px] text-slate-500 font-medium">+ще {dayWorkouts.length - 2}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: DAY TIMELINE */}
      {viewMode === 'day' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white">
                {new Date(selectedDateStr).toLocaleDateString('uk-UA', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </h3>
              <p className="text-xs text-slate-400">
                Заплановано тренувань: {selectedDateWorkouts.length}
              </p>
            </div>
            <button
              onClick={() => handleSlotClick(selectedDateStr, '18:00')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Додати тренування на цей день</span>
            </button>
          </div>

          {/* Timeline Hour slots */}
          <div className="space-y-3">
            {timelineHours.map((hour) => {
              const matchedWorkouts = selectedDateWorkouts.filter(
                (w) => w.timeScheduled.split(':')[0] === hour.split(':')[0]
              );

              return (
                <div
                  key={hour}
                  className="flex items-start gap-4 p-2 rounded-xl hover:bg-slate-800/30 transition group"
                >
                  <div className="w-14 text-xs font-semibold text-slate-400 pt-2 text-right">{hour}</div>
                  <div className="flex-1 min-h-[44px] border-l-2 border-slate-800 pl-4 space-y-2">
                    {matchedWorkouts.map((w) => (
                      <div
                        key={w.id}
                        className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{w.title}</h4>
                            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {w.timeScheduled} ({w.durationMinutes} хв)
                            </span>
                            {w.reminderEnabled && (
                              <span className="flex items-center gap-1 text-[11px] text-amber-400">
                                <Bell className="w-3 h-3 fill-amber-400/40" /> Нагадування
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{w.focus}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {w.exercises.length} вправ: {w.exercises.map((e) => e.name).join(', ')}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onStartSession(w)}
                            className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition flex items-center gap-1.5 shadow"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Почати зараз</span>
                          </button>
                          <button
                            onClick={() => handleEditWorkout(w)}
                            className="p-2 rounded-lg bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600 transition"
                            title="Редагувати"
                          >
                            <Layers className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicateToNextDay(w)}
                            className="p-2 rounded-lg bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600 transition"
                            title="Копіювати на завтра"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteWorkout(w.id)}
                            className="p-2 rounded-lg bg-slate-700 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition"
                            title="Видалити"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {matchedWorkouts.length === 0 && (
                      <button
                        onClick={() => handleSlotClick(selectedDateStr, hour)}
                        className="opacity-0 group-hover:opacity-100 text-xs text-slate-500 hover:text-emerald-400 transition flex items-center gap-1 py-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Додати тренування на {hour}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Day Quick Card (at bottom when viewing Week/Month) */}
      {viewMode !== 'day' && (
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Вибраний день:</span>
                <span className="text-emerald-400">
                  {new Date(selectedDateStr).toLocaleDateString('uk-UA', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {selectedDateWorkouts.length > 0
                  ? `Знайдено ${selectedDateWorkouts.length} запланованих активностей`
                  : 'На цей день ще немає запланованих тренувань'}
              </p>
            </div>
            <button
              onClick={() => handleSlotClick(selectedDateStr, '18:00')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold hover:border-emerald-500 hover:text-emerald-300 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Додати сюди</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedDateWorkouts.map((w) => {
              const color = colorClasses[w.color] || colorClasses.emerald;
              return (
                <div
                  key={w.id}
                  className={`p-4 rounded-xl border transition shadow-sm ${color.bg} ${color.border}`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {w.timeScheduled}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          onUpdateWorkout({ ...w, reminderEnabled: !w.reminderEnabled });
                          sounds.playTick();
                        }}
                        className={`p-1 rounded-lg ${
                          w.reminderEnabled ? 'text-amber-400 hover:bg-amber-500/20' : 'text-slate-500 hover:bg-slate-800'
                        }`}
                        title={w.reminderEnabled ? 'Нагадування увімкнено' : 'Увімкнути нагадування'}
                      >
                        {w.reminderEnabled ? <Bell className="w-4 h-4 fill-amber-400/40" /> : <BellOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleEditWorkout(w)}
                        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Налаштування"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h4 className="font-bold text-white text-sm mb-1">{w.title}</h4>
                  <p className="text-xs text-slate-400 mb-3">{w.focus}</p>

                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
                      {w.exercises.length} вправ
                    </span>
                    <span>{w.durationMinutes} хв</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onStartSession(w)}
                      className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{w.status === 'completed' ? 'Тренуватись знову' : 'Почати тренування'}</span>
                    </button>
                    <button
                      onClick={() => handleDuplicateToNextDay(w)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      title="Копіювати на наступний день"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ADD / EDIT WORKOUT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-white my-8">
            <div className="flex items-center justify-between mb-5 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-emerald-400" />
                {editingWorkout ? 'Редагувати тренування' : 'Створити нове тренування'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveWorkout} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Назва тренування</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:border-emerald-500 focus:outline-none"
                    placeholder="Напр. Спина + Біцепс"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Фокус / М’язові групи</label>
                  <input
                    type="text"
                    value={formFocus}
                    onChange={(e) => setFormFocus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:border-emerald-500 focus:outline-none"
                    placeholder="Напр. Верхня частина тіла"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Дата</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Час початку (Година)</label>
                  <input
                    type="time"
                    required
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Тривалість (хв)</label>
                  <input
                    type="number"
                    min="15"
                    max="180"
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Reminder toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-xs font-semibold text-white block">Нагадування про час тренування</span>
                    <span className="text-[11px] text-slate-400">
                      Звуковий сигнал та сповіщення о {formTime}
                    </span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formReminder}
                    onChange={(e) => setFormReminder(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {/* Exercises List Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300">Вправи у тренуванні ({formExercises.length})</label>
                  <button
                    type="button"
                    onClick={handleAddExerciseRow}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Додати вправу
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {formExercises.map((ex, idx) => (
                    <div key={ex.id || idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
                      <span className="text-slate-400 w-4 font-mono">{idx + 1}.</span>
                      <input
                        type="text"
                        placeholder="Назва вправи"
                        value={ex.name}
                        onChange={(e) => {
                          const updated = [...formExercises];
                          updated[idx].name = e.target.value;
                          setFormExercises(updated);
                        }}
                        className="flex-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Сети"
                        value={ex.sets}
                        onChange={(e) => {
                          const updated = [...formExercises];
                          updated[idx].sets = Number(e.target.value);
                          setFormExercises(updated);
                        }}
                        className="w-14 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none text-center"
                        title="Підходи"
                      />
                      <input
                        type="text"
                        placeholder="Повт"
                        value={ex.reps}
                        onChange={(e) => {
                          const updated = [...formExercises];
                          updated[idx].reps = e.target.value;
                          setFormExercises(updated);
                        }}
                        className="w-16 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none text-center"
                        title="Повторення"
                      />
                      <input
                        type="number"
                        placeholder="Вага"
                        value={ex.weightKg || ''}
                        onChange={(e) => {
                          const updated = [...formExercises];
                          updated[idx].weightKg = Number(e.target.value);
                          setFormExercises(updated);
                        }}
                        className="w-16 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none text-center"
                        title="Вага кг"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExerciseRow(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color tag picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Колір маркування</label>
                <div className="flex items-center gap-2">
                  {(['emerald', 'cyan', 'indigo', 'amber', 'rose', 'purple'] as const).map((colorKey) => (
                    <button
                      key={colorKey}
                      type="button"
                      onClick={() => setFormColor(colorKey)}
                      className={`w-7 h-7 rounded-full border-2 transition ${
                        colorKey === 'emerald'
                          ? 'bg-emerald-500'
                          : colorKey === 'cyan'
                          ? 'bg-cyan-500'
                          : colorKey === 'indigo'
                          ? 'bg-indigo-500'
                          : colorKey === 'amber'
                          ? 'bg-amber-500'
                          : colorKey === 'rose'
                          ? 'bg-rose-500'
                          : 'bg-purple-500'
                      } ${formColor === colorKey ? 'border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition shadow"
                >
                  {editingWorkout ? 'Зберегти зміни' : 'Створити розклад'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
