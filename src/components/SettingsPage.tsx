import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Globe,
  Volume2,
  Bell,
  User,
  Shield,
  Download,
  RotateCcw,
  Sparkles,
  Check,
  CheckCircle2,
  Trash2,
  Sliders,
  LogOut,
  Smartphone,
  Crown,
  BookOpen,
} from 'lucide-react';
import { UserProfile, AuthUser } from '../types';
import { sounds } from '../utils/audio';

interface SettingsPageProps {
  profile: UserProfile;
  authUser: AuthUser | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  onOpenAndroidStudioModal: () => void;
  onOpenProModal: () => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onResetWorkouts: () => void;
  onRestartOnboarding: () => void;
  language: 'ua' | 'en' | 'pl';
  setLanguage: (lang: 'ua' | 'en' | 'pl') => void;
  unitSystem: 'metric' | 'imperial';
  setUnitSystem: (system: 'metric' | 'imperial') => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  profile,
  authUser,
  onOpenAuthModal,
  onLogout,
  onOpenAndroidStudioModal,
  onOpenProModal,
  onUpdateProfile,
  onResetWorkouts,
  onRestartOnboarding,
  language,
  setLanguage,
  unitSystem,
  setUnitSystem,
  soundEnabled,
  setSoundEnabled,
}) => {
  const [name, setName] = useState(profile.name);
  const [goal, setGoal] = useState(profile.goal);
  const [weightKg, setWeightKg] = useState(profile.weightKg);
  const [heightCm, setHeightCm] = useState(profile.heightCm);
  const [fitnessLevel, setFitnessLevel] = useState(profile.fitnessLevel);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      goal,
      weightKg,
      heightCm,
      fitnessLevel,
    });
    setSavedSuccess(true);
    sounds.playTimerFinish();
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportData = () => {
    const workouts = localStorage.getItem('fitflow_workouts_v1') || '[]';
    const profileData = localStorage.getItem('fitflow_profile_v1') || '{}';
    const exportObj = {
      app: 'PULSE',
      exportedAt: new Date().toISOString(),
      profile: JSON.parse(profileData),
      workouts: JSON.parse(workouts),
    };

    const blob = new Blob([JSON.stringify(exportObj, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pulse_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto pb-20">
      {/* Settings Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Профіль & Налаштування</h2>
            <p className="text-xs text-slate-400">
              Акаунт, мова, одиниці вимірювання, Android Studio та звуки
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>Збережено!</span>
          </div>
        )}
      </div>

      {/* USER ACCOUNT CARD */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          {authUser?.avatarUrl ? (
            <img
              src={authUser.avatarUrl}
              alt={authUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-lg shadow-emerald-500/10"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg">
              {profile.name ? profile.name.charAt(0).toUpperCase() : 'P'}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h3 className="text-lg font-black text-white">
                {authUser?.isLoggedIn ? authUser.name : profile.name}
              </h3>
              {profile.isPro ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  PRO АКТИВНО
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                  Базовий
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {authUser?.isLoggedIn ? authUser.email : 'Локальний режим спортсмена'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {authUser?.isLoggedIn ? (
            <button
              onClick={onLogout}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition border border-slate-700"
            >
              <LogOut className="w-4 h-4 text-slate-400" />
              <span>Вийти з акаунту</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-emerald-500/20"
            >
              <User className="w-4 h-4" />
              <span>Увійти / Зареєструватися</span>
            </button>
          )}

          <button
            onClick={onOpenProModal}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-black hover:brightness-110 transition shadow shadow-amber-500/20"
          >
            <Crown className="w-4 h-4 fill-slate-950" />
            <span>{profile.isPro ? 'Підписка PRO' : 'Отримати PRO'}</span>
          </button>
        </div>
      </div>

      {/* QUICK LAUNCH TILES (ANDROID STUDIO & GOOGLE PLAY) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={onOpenAndroidStudioModal}
          className="p-5 rounded-3xl bg-slate-900 border border-teal-500/30 hover:border-teal-500/60 transition text-left space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <span className="text-xs text-teal-400 font-bold group-hover:underline">Відкрити інструкцію →</span>
          </div>
          <h4 className="text-base font-bold text-white">Android Studio & Google Play Експорт</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Як перетворити додаток на справжній .APK файл для телефону або .AAB для публікації в Play Market.
          </p>
        </button>

        <button
          onClick={onOpenProModal}
          className="p-5 rounded-3xl bg-slate-900 border border-amber-500/30 hover:border-amber-500/60 transition text-left space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Crown className="w-5 h-5 fill-amber-400" />
            </div>
            <span className="text-xs text-amber-400 font-bold group-hover:underline">Керувати →</span>
          </div>
          <h4 className="text-base font-bold text-white">PRO Підписка & Платежі</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Необмежений ШІ-тренер, персональні плани тренувань та детальна спортивна аналітика.
          </p>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SECTION 1: LANGUAGE & LOCALIZATION */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Мова додатку (Language)</span>
          </div>

          <p className="text-xs text-slate-400">
            Оберіть мову інтерфейсу для додатку та нативного перекладу:
          </p>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'ua', label: '🇺🇦 Українська' },
              { id: 'en', label: '🇬🇧 English' },
              { id: 'pl', label: '🇵🇱 Polski' },
            ].map((lang) => (
              <button
                key={lang.id}
                type="button"
                onClick={() => {
                  setLanguage(lang.id as any);
                  sounds.playTick();
                }}
                className={`py-3 px-2 rounded-2xl border text-xs font-bold transition text-center ${
                  language === lang.id
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-xs font-bold text-slate-300 block mb-2">Одиниці вимірювання:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setUnitSystem('metric')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition text-center ${
                  unitSystem === 'metric'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                Метрична (Кг, См)
              </button>
              <button
                type="button"
                onClick={() => setUnitSystem('imperial')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition text-center ${
                  unitSystem === 'imperial'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                Імперська (Lbs, In)
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 2: AUDIO & SOUND EFFECTS */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>Звуки та таймер</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/70 border border-slate-700">
              <div>
                <span className="font-bold text-white block">Звуки таймера відпочинку</span>
                <span className="text-[11px] text-slate-400">
                  Звуковий сигнал, коли таймер закінчується
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  sounds.playTick();
                }}
                className={`w-12 h-7 rounded-full p-1 transition ${
                  soundEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition transform ${
                    soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/70 border border-slate-700">
              <div>
                <span className="font-bold text-white block">Тестовий сигнал таймера</span>
                <span className="text-[11px] text-slate-400">Перевірити звук динаміка</span>
              </div>
              <button
                type="button"
                onClick={() => sounds.playTimerFinish()}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold border border-slate-700"
              >
                Тест 🔊
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/70 border border-slate-700">
              <div>
                <span className="font-bold text-white block">Сигнал нагадування</span>
                <span className="text-[11px] text-slate-400">Сповіщення про час тренування</span>
              </div>
              <button
                type="button"
                onClick={() => sounds.playReminderAlert()}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold border border-slate-700"
              >
                Тест 🔔
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 3: ATHLETE PROFILE FORM */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <User className="w-4 h-4 text-emerald-400" />
            <span>Параметри тіла та цілі</span>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ваше ім’я</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Поточна вага (кг)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Зріст (см)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Головна ціль</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="М’язова маса та гіпертрофія">М’язова маса та рельєф</option>
                  <option value="Спалювання жиру та сушка">Спалювання жиру та сушка</option>
                  <option value="Максимальна сила (Паверліфтинг)">Максимальна сила</option>
                  <option value="Тонус та здоров’я">Тонус та загальне здоров’я</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Рівень досвіду</label>
                <select
                  value={fitnessLevel}
                  onChange={(e) => setFitnessLevel(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="Початківець">Початківець</option>
                  <option value="Середній">Середній</option>
                  <option value="Просунутий">Просунутий</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow"
              >
                Зберегти параметри
              </button>
            </div>
          </form>
        </div>

        {/* SECTION 4: DATA MANAGEMENT & ONBOARDING RESTART */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Управління даними додатку</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={onRestartOnboarding}
              className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left transition space-y-1"
            >
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-white text-xs block">Пройти опитування знову</span>
              <span className="text-[11px] text-slate-400 block">
                Скинути параметри та заново налаштувати ШІ
              </span>
            </button>

            <button
              type="button"
              onClick={handleExportData}
              className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left transition space-y-1"
            >
              <Download className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-white text-xs block">Експорт резервної копії</span>
              <span className="text-[11px] text-slate-400 block">
                Завантажити всі тренування у JSON файл
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                onResetWorkouts();
                sounds.playTick();
              }}
              className="p-4 rounded-2xl bg-rose-950/20 hover:bg-rose-950/30 border border-rose-500/30 text-left transition space-y-1"
            >
              <Trash2 className="w-5 h-5 text-rose-400" />
              <span className="font-bold text-rose-300 text-xs block">Скинути розклад</span>
              <span className="text-[11px] text-slate-400 block">
                Відновити первинний тижневий спліт
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
