import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Check,
  Dumbbell,
  Flame,
  Zap,
  Heart,
  ChevronRight,
  X,
  Target,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (answers: {
    name: string;
    goal: string;
    fitnessLevel: 'Початківець' | 'Середній' | 'Просунутий';
    daysPerWeek: number;
    weightKg: number;
    heightCm: number;
  }) => void;
  onSkip: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  onSkip,
}) => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [name, setName] = useState('Андрій');
  const [goal, setGoal] = useState('М’язова маса та гіпертрофія');
  const [fitnessLevel, setFitnessLevel] = useState<'Початківець' | 'Середній' | 'Просунутий'>('Середній');
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [weightKg, setWeightKg] = useState(78);
  const [heightCm, setHeightCm] = useState(180);

  if (!isOpen) return null;

  const handleFinish = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}

    onComplete({
      name: name.trim() || 'Спортсмен',
      goal,
      fitnessLevel,
      daysPerWeek,
      weightKg,
      heightCm,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-xl rounded-3xl bg-[#0d1322] border border-emerald-500/30 shadow-2xl text-white my-auto overflow-hidden">
        {/* Top Header with Progress and Skip */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#0d1322] via-[#131c33] to-[#0d1322] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-300">
              Налаштування профілю ({step} з {totalSteps})
            </span>
          </div>

          <button
            onClick={onSkip}
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-800 transition flex items-center gap-1 font-semibold"
          >
            <span>Пропустити</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Step Progress Line */}
        <div className="w-full h-1 bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* STEP 1: WELCOME & NAME */}
        {step === 1 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="relative rounded-2xl overflow-hidden h-44 shadow-lg border border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80"
                alt="Fitness Training"
                className="w-full h-full object-cover brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1322] via-[#0d1322]/40 to-transparent p-4 flex flex-col justify-end">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  FitFlow AI
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Твій персональний фітнес-щоденник нового покоління
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Як вас звати?
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Введіть ваше ім’я"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
              />
              <p className="text-xs text-slate-400">
                ШІ буде звертатися до вас на ім’я та адаптувати підказки.
              </p>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:brightness-110 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition"
            >
              <span>Продовжити</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: PRIMARY GOAL */}
        {step === 2 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Крок 2</span>
              <h3 className="text-xl font-black text-white mt-1">Яка ваша головна мета?</h3>
              <p className="text-xs text-slate-400 mt-1">ШІ налаштує обсяг повторень та вагу під цю ціль.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: 'М’язова маса та гіпертрофія',
                  title: 'М’язова маса та рельєф',
                  desc: '8-12 повторень, набір об’єму м’язів',
                  icon: <Dumbbell className="w-5 h-5 text-emerald-400" />,
                },
                {
                  id: 'Спалювання жиру та сушка',
                  title: 'Спалювання жиру (Сушка)',
                  desc: 'Висока інтенсивність, дефіцит калорій',
                  icon: <Flame className="w-5 h-5 text-amber-400" />,
                },
                {
                  id: 'Максимальна сила (Паверліфтинг)',
                  title: 'Максимальна сила',
                  desc: '3-6 повторень, ріст силових показників',
                  icon: <Zap className="w-5 h-5 text-cyan-400" />,
                },
                {
                  id: 'Тонус та здоров’я',
                  title: 'Тонус, постава та здоров’я',
                  desc: 'Функціональний фітнес без перевтоми',
                  icon: <Heart className="w-5 h-5 text-rose-400" />,
                },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setGoal(item.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                    goal === item.id
                      ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-3 rounded-2xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs"
              >
                Назад
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:brightness-110 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition"
              >
                <span>Продовжити</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: EXPERIENCE & FREQUENCY */}
        {step === 3 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Крок 3</span>
              <h3 className="text-xl font-black text-white mt-1">Досвід та регулярність</h3>
              <p className="text-xs text-slate-400 mt-1">Скільки ви тренуєтесь і скільки днів готові виділяти?</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Рівень підготовки:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Початківець', 'Середній', 'Просунутий'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFitnessLevel(lvl)}
                      className={`p-3 rounded-2xl border text-xs font-bold transition text-center ${
                        fitnessLevel === lvl
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Кількість тренувань на тиждень:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 3, 4, 5].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDaysPerWeek(d)}
                      className={`p-3 rounded-2xl border text-xs font-bold transition text-center ${
                        daysPerWeek === d
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {d} дні/тижд
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-3 rounded-2xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs"
              >
                Назад
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:brightness-110 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition"
              >
                <span>Продовжити</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: BODY METRICS & LAUNCH */}
        {step === 4 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Крок 4</span>
              <h3 className="text-xl font-black text-white mt-1">Параметри тіла</h3>
              <p className="text-xs text-slate-400 mt-1">Для розрахунку спалених калорій та прогресу.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 block">Поточна вага (кг)</span>
                <input
                  type="number"
                  min="40"
                  max="250"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full bg-slate-950 px-3 py-2 rounded-xl text-xl font-mono font-black text-white text-center focus:outline-none focus:border-emerald-500 border border-slate-800"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 block">Зріст (см)</span>
                <input
                  type="number"
                  min="120"
                  max="230"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full bg-slate-950 px-3 py-2 rounded-xl text-xl font-mono font-black text-white text-center focus:outline-none focus:border-emerald-500 border border-slate-800"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300">
              ✓ Все готово! Ми створимо для вас персональний щоденник з розкладом у Google Calendar стилі.
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setStep(3)}
                className="px-5 py-3 rounded-2xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs"
              >
                Назад
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-500 hover:brightness-110 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-2xl shadow-emerald-500/30 transition"
              >
                <Sparkles className="w-5 h-5 fill-slate-950" />
                <span>Запустити FitFlow AI</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
