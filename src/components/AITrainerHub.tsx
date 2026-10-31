import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  BarChart2,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Send,
  Calendar,
  Dumbbell,
  Target,
  RefreshCw,
  Crown,
  HeartHandshake,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WorkoutDay, GeneratedPlan, PlanAnalysisResult, ChatMessage } from '../types';
import { formatDate, getDayNameUk } from '../utils/storage';
import { sounds } from '../utils/audio';

interface AITrainerHubProps {
  currentWorkouts: WorkoutDay[];
  onApplyGeneratedPlan: (workouts: WorkoutDay[]) => void;
  isPro: boolean;
  onOpenProModal: () => void;
}

export const AITrainerHub: React.FC<AITrainerHubProps> = ({
  currentWorkouts,
  onApplyGeneratedPlan,
  isPro,
  onOpenProModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'create' | 'analyze' | 'chat'>('create');

  // Generator form
  const [goal, setGoal] = useState('М’язова маса та гіпертрофія');
  const [fitnessLevel, setFitnessLevel] = useState('Середній');
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [equipment, setEquipment] = useState('Тренажерний зал (штанги, гантелі, тренажери)');
  const [notes, setNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(1);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [planApplied, setPlanApplied] = useState(false);

  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PlanAnalysisResult | null>(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: 'Привіт! Я твій персональний спортивний AI-коуч. Я бачу твої тренування та можу скласти новий план, підказати техніку вправ, порадити заміну вправ або розрахувати калорії. Що тебе цікавить?',
      timestamp: 'Щойно',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Quick Preset Templates for 1-click generation
  const handleQuickPreset = (presetGoal: string, days: number, presetEquip: string) => {
    setGoal(presetGoal);
    setDaysPerWeek(days);
    setEquipment(presetEquip);
    executePlanGeneration(presetGoal, fitnessLevel, days, durationMinutes, presetEquip, notes);
  };

  const executePlanGeneration = async (
    targetGoal: string,
    targetLevel: string,
    targetDays: number,
    targetDuration: number,
    targetEquip: string,
    targetNotes: string
  ) => {
    setIsGenerating(true);
    setPlanApplied(false);
    setGeneratedPlan(null);
    setGenerationStep(1);

    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => (prev < 3 ? prev + 1 : 3));
    }, 900);

    try {
      const response = await fetch('/api/ai/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: targetGoal,
          fitnessLevel: targetLevel,
          daysPerWeek: targetDays,
          durationMinutes: targetDuration,
          equipment: targetEquip,
          notes: targetNotes,
        }),
      });

      const data = await response.json();
      if (data.data) {
        setGeneratedPlan(data.data);
        sounds.playTimerFinish();
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch {}
      }
    } catch (err) {
      console.error('Error generating plan:', err);
    } finally {
      clearInterval(stepInterval);
      setIsGenerating(false);
    }
  };

  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();
    executePlanGeneration(goal, fitnessLevel, daysPerWeek, durationMinutes, equipment, notes);
  };

  // Handle Apply Plan to Calendar
  const handleApplyToCalendar = () => {
    if (!generatedPlan) return;

    const today = new Date();
    const newWorkouts: WorkoutDay[] = generatedPlan.days.map((dayPlan, idx) => {
      const d = new Date(today);
      d.setDate(today.getDate() + idx * 2); // schedule every 2 days
      const dateStr = formatDate(d);

      return {
        id: `ai-plan-${Date.now()}-${idx}`,
        date: dateStr,
        dayName: getDayNameUk(d),
        title: `${dayPlan.dayName}: ${dayPlan.focus}`,
        focus: dayPlan.focus,
        timeScheduled: '18:30',
        reminderEnabled: true,
        durationMinutes: dayPlan.durationMinutes || 60,
        status: 'planned',
        color: (dayPlan.color as any) || 'emerald',
        exercises: dayPlan.exercises.map((ex, eIdx) => ({
          ...ex,
          id: `ex-gen-${idx}-${eIdx}`,
          completedSets: 0,
          completed: false,
        })),
      };
    });

    onApplyGeneratedPlan(newWorkouts);
    setPlanApplied(true);
    sounds.playTimerFinish();
  };

  // Handle Analyze Plan
  const handleAnalyzePlan = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/analyze-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workouts: currentWorkouts.map((w) => ({
            title: w.title,
            focus: w.focus,
            timeScheduled: w.timeScheduled,
            durationMinutes: w.durationMinutes,
            exercises: w.exercises.map((e) => ({
              name: e.name,
              targetMuscle: e.targetMuscle,
              sets: e.sets,
              reps: e.reps,
              weightKg: e.weightKg,
            })),
          })),
        }),
      });

      const data = await response.json();
      if (data.data) {
        setAnalysisResult(data.data);
        sounds.playTimerFinish();
      }
    } catch (err) {
      console.error('Error analyzing workouts:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle Send Chat
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSendingMessage) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setIsSendingMessage(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          currentPlanContext: currentWorkouts.slice(0, 3).map((w) => `${w.title} (${w.focus})`),
        }),
      });

      const data = await response.json();
      const aiReply = data.reply || 'Дякую за питання! Намагайся тримати баланс і не перевтомлюватися.';

      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-ai-${Date.now()}`,
          sender: 'ai',
          text: aiReply,
          timestamp: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-ai-${Date.now()}`,
          sender: 'ai',
          text: 'Вибачте, виникла помилка зв’язку з сервером. Спробуйте ще раз.',
          timestamp: 'Помилка',
        },
      ]);
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Nike/Hevy Athletic Hub Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0d1322] via-[#111a2f] to-[#0d1322] border border-emerald-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ШІ Gemini 3.8 Flash • Персональний Тренер</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ШІ-Тренер: Створення та Аналіз Планів
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Штучний інтелект підбирає точну кількість сетів і повторень, перевіряє ваш розклад на відновлення та допомагає з технікою вправ.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col gap-2">
            <button
              onClick={() => setActiveSubTab('create')}
              className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition ${
                activeSubTab === 'create'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>1. Створити план</span>
            </button>

            <button
              onClick={() => {
                setActiveSubTab('analyze');
                handleAnalyzePlan();
              }}
              className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition ${
                activeSubTab === 'analyze'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>2. Проаналізувати мій план</span>
            </button>

            <button
              onClick={() => setActiveSubTab('chat')}
              className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition ${
                activeSubTab === 'chat'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>3. Чат з тренером</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick 1-Click Presets */}
      {activeSubTab === 'create' && (
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Швидкі готові шаблони від ШІ (натисніть для миттєвої генерації):
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                handleQuickPreset(
                  'М’язова маса та рельєф (Push Pull Legs)',
                  4,
                  'Тренажерний зал'
                )
              }
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500/20 hover:border-emerald-500/40 border border-slate-700 text-xs font-bold text-slate-200 hover:text-emerald-300 transition flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>⚡ Елітний 4-денний спліт (Push / Pull / Legs)</span>
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickPreset(
                  'Класичний Арнольд Спліт (Груди+Спина, Плечі+Руки, Ноги)',
                  5,
                  'Тренажерний зал'
                )
              }
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500/20 hover:border-cyan-500/40 border border-slate-700 text-xs font-bold text-slate-200 hover:text-cyan-300 transition flex items-center gap-1.5"
            >
              <Dumbbell className="w-3.5 h-3.5 text-cyan-400" />
              <span>🏋️‍♂️ Арнольд Спліт (5 днів на тиждень)</span>
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickPreset(
                  'Схуднення, тонус та рельєф (Full Body + HIIT)',
                  3,
                  'Гантелі вдома та власна вага'
                )
              }
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500/20 hover:border-amber-500/40 border border-slate-700 text-xs font-bold text-slate-200 hover:text-amber-300 transition flex items-center gap-1.5"
            >
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <span>🔥 Жироспалення & Рельєф (3 дні вдома)</span>
            </button>
          </div>
        </div>
      )}

      {/* SUBTAB 1: CREATE PERSONALIZED PLAN */}
      {activeSubTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Plan Parameters Form */}
          <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              Налаштувати параметри для ШІ
            </h3>

            <form onSubmit={handleGeneratePlan} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Головна ціль</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="М’язова маса та гіпертрофія">М’язова маса та рельєф (Гіпертрофія)</option>
                  <option value="Спалювання жиру та сушка">Спалювання жиру та рельєф (Fat Loss)</option>
                  <option value="Максимальна сила (Паверліфтинг)">Максимальна сила (Паверліфтинг)</option>
                  <option value="Витривалість та функціональний фітнес">Витривалість та кросфіт</option>
                  <option value="Тонус та постава для початківців">Тонус та постава для початківців</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Рівень досвіду</label>
                  <select
                    value={fitnessLevel}
                    onChange={(e) => setFitnessLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none"
                  >
                    <option value="Початківець">Початківець (&lt; 6 міс)</option>
                    <option value="Середній">Середній (1-3 роки)</option>
                    <option value="Просунутий">Просунутий (3+ роки)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Днів на тиждень</label>
                  <select
                    value={daysPerWeek}
                    onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none"
                  >
                    <option value={2}>2 дні (Full Body)</option>
                    <option value={3}>3 дні (Classic Split)</option>
                    <option value={4}>4 дні (Upper / Lower)</option>
                    <option value={5}>5 днів (Push Pull Legs)</option>
                    <option value={6}>6 днів (Advanced)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Тривалість сесії</label>
                  <select
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none"
                  >
                    <option value={45}>45 хв (Експрес)</option>
                    <option value={60}>60 хв (Оптимально)</option>
                    <option value={75}>75 хв</option>
                    <option value={90}>90 хв</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Обладнання</label>
                  <select
                    value={equipment}
                    onChange={(e) => setEquipment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none"
                  >
                    <option value="Тренажерний зал (штанги, гантелі, тренажери)">Тренажерний зал</option>
                    <option value="Гантелі та турнік вдома">Гантелі + турнік вдома</option>
                    <option value="Лише власна вага">Лише власна вага</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Особливі побажання
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Напр. без навантаження на коліна, більше вправ на спину"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-500 hover:brightness-110 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>
                      {generationStep === 1
                        ? '1/3 Аналіз параметрів...'
                        : generationStep === 2
                        ? '2/3 Підбір вправ та повторень...'
                        : '3/3 Розрахунок відновлення...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Згенерувати персональний план</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Generated Plan Output */}
          <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl">
            {generatedPlan ? (
              <div className="space-y-5 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 block">
                      ГОТОВИЙ ПЛАН ВІД ШІ
                    </span>
                    <h3 className="text-xl font-black text-white">{generatedPlan.title}</h3>
                    <p className="text-xs text-slate-300 mt-1">{generatedPlan.description}</p>
                  </div>
                  <button
                    onClick={handleApplyToCalendar}
                    className={`px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition whitespace-nowrap shadow-xl ${
                      planApplied
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30'
                    }`}
                  >
                    {planApplied ? <Check className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                    <span>{planApplied ? 'План додано в Календар!' : '✅ Додати цей план у Календар'}</span>
                  </button>
                </div>

                {/* Days List */}
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
                  {generatedPlan.days.map((day, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">
                          {day.dayName}: {day.focus}
                        </span>
                        <span className="text-xs text-emerald-400 font-semibold">{day.durationMinutes} хв</span>
                      </div>
                      <div className="space-y-1.5 pt-1">
                        {day.exercises.map((ex, eIdx) => (
                          <div
                            key={eIdx}
                            className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-slate-900/80 text-slate-200"
                          >
                            <span className="font-semibold">
                              {eIdx + 1}. {ex.name}
                            </span>
                            <span className="text-cyan-400 font-mono">
                              {ex.sets} сети × {ex.reps} ({ex.restSeconds}с відпочинок)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coach Tips */}
                {generatedPlan.coachTips && (
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-slate-300 space-y-1">
                    <span className="font-bold text-emerald-400 block mb-1">Поради щодо тренувань:</span>
                    {generatedPlan.coachTips.map((tip, idx) => (
                      <p key={idx}>• {tip}</p>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full min-h-[350px] flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-white">Тут з’явиться ваш згенерований план</h4>
                <p className="text-xs max-w-sm mt-1 text-slate-400">
                  Виберіть параметри зліва або натисніть один із готових шаблонів угорі. ШІ одразу складе детальне розбиття по днях!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: ANALYZE EXISTING SCHEDULE */}
      {activeSubTab === 'analyze' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-cyan-400" />
                Аудит та оптимізація вашого розкладу
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                ШІ перевіряє тренування у вашому календарі ({currentWorkouts.length} активностей) на відновлення та м’язовий баланс.
              </p>
            </div>
            <button
              onClick={handleAnalyzePlan}
              disabled={isAnalyzing}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>Повторити аналіз</span>
            </button>
          </div>

          {isAnalyzing ? (
            <div className="py-16 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-3" />
              <p className="text-sm font-medium text-white">ШІ оцінює навантаження на м’язи та суглоби...</p>
            </div>
          ) : analysisResult ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Score Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center gap-4">
                  <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
                    <span className="text-2xl font-black text-cyan-300 font-mono">
                      {analysisResult.score}
                    </span>
                    <span className="text-[10px] absolute bottom-1 text-slate-400">/100</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Індекс ефективності</span>
                    <span className="text-sm font-bold text-white">
                      {analysisResult.score >= 85 ? 'Відмінний спліт' : 'Потребує оптимізації'}
                    </span>
                  </div>
                </div>

                <div className="md:col-span-2 p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex items-center">
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    💡 {analysisResult.assessment}
                  </p>
                </div>
              </div>

              {/* Strengths & Risks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                  <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Сильні сторони програми
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {analysisResult.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
                  <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Потенційні ризики та зауваження
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {analysisResult.risks.map((risk, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommendations */}
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-cyan-400" />
                  Поради щодо покращення результатів
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {analysisResult.recommendations.map((rec, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                      <span className="font-bold text-cyan-400 block mb-1">Порада #{idx + 1}</span>
                      <p>{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* SUBTAB 3: COACH CHAT */}
      {activeSubTab === 'chat' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col h-[550px]">
          <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">ШІ-Тренер на зв’язку</h3>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Готовий до запитань про техніку, харчування, відновлення
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-500 text-slate-950 font-bold rounded-br-none shadow'
                      : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span
                    className={`text-[9px] block text-right mt-1 opacity-70 ${
                      msg.sender === 'user' ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            {isSendingMessage && (
              <div className="flex justify-start">
                <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 text-xs flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                  <span>Тренер друкує відповідь...</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 text-[11px]">
            {[
              'Чим замінити присідання зі штангою?',
              'Скільки відпочивати між підходами на масу?',
              'Як уникнути болю в плечах під час жиму?',
              'Скільки води пити на тренуванні?',
            ].map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInputMessage(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              >
                {q}
              </button>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Запитайте що завгодно про вправи або харчування..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isSendingMessage}
              className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
