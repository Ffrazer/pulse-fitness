import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { CalendarView } from './components/CalendarView';
import { ActiveWorkoutModal } from './components/ActiveWorkoutModal';
import { AITrainerHub } from './components/AITrainerHub';
import { StatsView } from './components/StatsView';
import { ProModal } from './components/ProModal';
import { PhoneConnectModal } from './components/PhoneConnectModal';
import { AndroidStudioModal } from './components/AndroidStudioModal';
import { DeveloperGuideModal } from './components/DeveloperGuideModal';
import { LandingPageView } from './components/LandingPageView';
import { SettingsPage } from './components/SettingsPage';
import { OnboardingModal } from './components/OnboardingModal';
import { AuthModal } from './components/AuthModal';
import { WorkoutDay, UserProfile, AuthUser } from './types';
import {
  loadWorkouts,
  saveWorkouts,
  loadProfile,
  saveProfile,
  formatDate,
  generateInitialWorkouts,
} from './utils/storage';
import { sounds } from './utils/audio';
import { Bell, Zap } from 'lucide-react';

export default function App() {
  const [workouts, setWorkouts] = useState<WorkoutDay[]>(loadWorkouts);
  const [profile, setProfile] = useState<UserProfile>(loadProfile);

  // Authenticated user state
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('pulse_auth_user_v1');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<
    'calendar' | 'active-session' | 'ai-trainer' | 'stats' | 'landing' | 'guide' | 'settings'
  >('calendar');

  const [activeWorkout, setActiveWorkout] = useState<WorkoutDay | null>(null);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isAndroidStudioModalOpen, setIsAndroidStudioModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const [language, setLanguage] = useState<'ua' | 'en' | 'pl'>('ua');
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [reminderAlert, setReminderAlert] = useState<{ title: string; time: string } | null>(null);

  // Check auth & onboarding on first visit
  useEffect(() => {
    const storedUser = localStorage.getItem('pulse_auth_user_v1');
    if (!storedUser) {
      // First visit: open auth/login screen
      setIsAuthModalOpen(true);
    } else {
      const doneOnboarding = localStorage.getItem('fitflow_onboarding_v1');
      if (!doneOnboarding) {
        setIsOnboardingOpen(true);
      }
    }
  }, []);

  // Sync state to LocalStorage
  useEffect(() => {
    saveWorkouts(workouts);
  }, [workouts]);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  // Scheduled Reminder Alarm interval checker
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentFormattedDate = formatDate(now);
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMins = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMins}`;

      workouts.forEach((w) => {
        if (
          w.date === currentFormattedDate &&
          w.timeScheduled === currentTimeStr &&
          w.reminderEnabled &&
          w.status === 'planned'
        ) {
          sounds.playReminderAlert();
          setReminderAlert({ title: w.title, time: w.timeScheduled });
        }
      });
    };

    const interval = setInterval(checkReminders, 30000);
    return () => clearInterval(interval);
  }, [workouts]);

  // Handlers
  const handleAddWorkout = (newWorkout: WorkoutDay) => {
    setWorkouts((prev) => [newWorkout, ...prev]);
  };

  const handleUpdateWorkout = (updated: WorkoutDay) => {
    setWorkouts((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
  };

  const handleDeleteWorkout = (id: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  const handleStartSession = (workout: WorkoutDay) => {
    setActiveWorkout(workout);
    setActiveTab('active-session');
  };

  const handleFinishWorkout = (finishedWorkout: WorkoutDay, elapsedSeconds: number) => {
    handleUpdateWorkout(finishedWorkout);
    const minutes = Math.max(1, Math.round(elapsedSeconds / 60));
    setProfile((prev) => ({
      ...prev,
      workoutsCompleted: prev.workoutsCompleted + 1,
      totalMinutesTrained: prev.totalMinutesTrained + minutes,
      streakDays: prev.streakDays + 1,
    }));
  };

  const handleApplyGeneratedPlan = (generatedWorkouts: WorkoutDay[]) => {
    setWorkouts((prev) => [...generatedWorkouts, ...prev]);
    setActiveTab('calendar');
  };

  const handleUpgradeSuccess = (_plan: string) => {
    setProfile((prev) => ({
      ...prev,
      isPro: true,
      proExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    }));
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setAuthUser(user);
    setIsAuthModalOpen(false);
    setProfile((prev) => ({
      ...prev,
      name: user.name,
      email: user.email,
    }));

    // If onboarding wasn't done, open it now
    const done = localStorage.getItem('fitflow_onboarding_v1');
    if (!done) {
      setIsOnboardingOpen(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('pulse_auth_user_v1');
    setAuthUser(null);
    setIsAuthModalOpen(true);
  };

  // Full-width tab canvas
  const renderTabContent = () => {
    switch (activeTab) {
      case 'calendar':
        return (
          <CalendarView
            workouts={workouts}
            onAddWorkout={handleAddWorkout}
            onUpdateWorkout={handleUpdateWorkout}
            onDeleteWorkout={handleDeleteWorkout}
            onStartSession={handleStartSession}
            onOpenAIGenerator={() => setActiveTab('ai-trainer')}
          />
        );

      case 'active-session':
        return activeWorkout ? (
          <ActiveWorkoutModal
            workout={activeWorkout}
            onClose={() => {
              setActiveWorkout(null);
              setActiveTab('calendar');
            }}
            onFinishWorkout={handleFinishWorkout}
            isPro={profile.isPro}
          />
        ) : (
          <div className="w-full max-w-2xl mx-auto my-8 bg-slate-900/90 rounded-3xl border border-slate-800 p-8 sm:p-12 text-center space-y-5 shadow-2xl">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <Zap className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-white">Немає активного тренування</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Оберіть будь-яке тренування з Календаря та натисніть «Почати», щоб записувати підходи, робочу вагу, користуватися звуковим таймером відпочинку та отримати рецензію від ШІ!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => setActiveTab('calendar')}
                className="px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/20"
              >
                Відкрити Календар 📅
              </button>
              <button
                onClick={() => setActiveTab('ai-trainer')}
                className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-sm transition border border-slate-700"
              >
                Згенерувати новий план 🤖
              </button>
            </div>
          </div>
        );

      case 'ai-trainer':
        return (
          <AITrainerHub
            currentWorkouts={workouts}
            onApplyGeneratedPlan={handleApplyGeneratedPlan}
            isPro={profile.isPro}
            onOpenProModal={() => setIsProModalOpen(true)}
          />
        );

      case 'stats':
        return <StatsView profile={profile} workouts={workouts} />;

      case 'guide':
        return <DeveloperGuideModal />;

      case 'landing':
        return (
          <LandingPageView
            onOpenApp={() => setActiveTab('calendar')}
            onOpenPro={() => setIsProModalOpen(true)}
          />
        );

      case 'settings':
        return (
          <SettingsPage
            profile={profile}
            authUser={authUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onLogout={handleLogout}
            onOpenAndroidStudioModal={() => setIsAndroidStudioModalOpen(true)}
            onOpenProModal={() => setIsProModalOpen(true)}
            onUpdateProfile={(updated) => setProfile((prev) => ({ ...prev, ...updated }))}
            onResetWorkouts={() => {
              const initial = generateInitialWorkouts();
              setWorkouts(initial);
              saveWorkouts(initial);
            }}
            onRestartOnboarding={() => setIsOnboardingOpen(true)}
            language={language}
            setLanguage={setLanguage}
            unitSystem={unitSystem}
            setUnitSystem={setUnitSystem}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Reminder Notification Banner */}
      {reminderAlert && (
        <div className="fixed top-18 right-4 z-50 flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-2xl animate-bounce">
          <Bell className="w-6 h-6 fill-slate-950" />
          <div>
            <span className="text-[10px] uppercase tracking-wider block opacity-85">Нагадування про тренування!</span>
            <span className="text-sm">{reminderAlert.title} о {reminderAlert.time}</span>
          </div>
          <button
            onClick={() => setReminderAlert(null)}
            className="ml-2 text-xs bg-slate-950/20 px-2 py-1 rounded-lg hover:bg-slate-950/30"
          >
            ✕
          </button>
        </div>
      )}

      {/* Modern Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        authUser={authUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenProModal={() => setIsProModalOpen(true)}
        onOpenPhoneModal={() => setIsPhoneModalOpen(true)}
        onOpenAndroidStudioModal={() => setIsAndroidStudioModalOpen(true)}
      />

      {/* Floating active workout pill when user browses other tabs */}
      {activeWorkout && activeTab !== 'active-session' && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-0.5 rounded-2xl shadow-2xl">
          <div className="bg-slate-950 px-4 py-2.5 rounded-[14px] flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div className="text-left">
              <span className="text-[10px] text-emerald-400 uppercase font-bold block">Триває тренування:</span>
              <span className="text-xs font-black text-white">{activeWorkout.title}</span>
            </div>
            <button
              onClick={() => setActiveTab('active-session')}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow"
            >
              Відкрити ⚡
            </button>
          </div>
        </div>
      )}

      {/* Full-width Screen Main Content */}
      <main className="flex-1 w-full px-2 sm:px-6 py-4 pb-28 max-w-7xl mx-auto">
        {renderTabContent()}
      </main>

      {/* Fixed Mobile & Web Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasActiveSession={Boolean(activeWorkout)}
        streakDays={profile.streakDays}
      />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        allowClose={Boolean(authUser)}
      />

      <ProModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        profile={profile}
        onUpgradeSuccess={handleUpgradeSuccess}
      />

      <PhoneConnectModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
      />

      <AndroidStudioModal
        isOpen={isAndroidStudioModalOpen}
        onClose={() => setIsAndroidStudioModalOpen(false)}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={(answers) => {
          setProfile((prev) => ({
            ...prev,
            name: answers.name,
            goal: answers.goal,
            fitnessLevel: answers.fitnessLevel,
            weightKg: answers.weightKg,
            heightCm: answers.heightCm,
          }));
          localStorage.setItem('fitflow_onboarding_v1', 'true');
          setIsOnboardingOpen(false);
          sounds.playTimerFinish();
        }}
        onSkip={() => {
          localStorage.setItem('fitflow_onboarding_v1', 'true');
          setIsOnboardingOpen(false);
        }}
      />
    </div>
  );
}
