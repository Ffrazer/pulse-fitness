import React from 'react';
import { Calendar, Zap, Sparkles, BarChart3, User, Flame } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'calendar' | 'active-session' | 'ai-trainer' | 'stats' | 'landing' | 'guide' | 'settings';
  setActiveTab: (tab: 'calendar' | 'active-session' | 'ai-trainer' | 'stats' | 'landing' | 'guide' | 'settings') => void;
  hasActiveSession: boolean;
  streakDays: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  hasActiveSession,
  streakDays,
}) => {
  const tabs = [
    {
      id: 'calendar' as const,
      label: 'Календар',
      icon: Calendar,
    },
    {
      id: 'active-session' as const,
      label: 'Тренування',
      icon: Zap,
      badge: hasActiveSession,
    },
    {
      id: 'ai-trainer' as const,
      label: 'ШІ-Коуч',
      icon: Sparkles,
      highlight: true,
    },
    {
      id: 'stats' as const,
      label: 'Прогрес',
      icon: BarChart3,
    },
    {
      id: 'settings' as const,
      label: 'Профіль',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around shadow-2xl max-w-7xl mx-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-2xl transition-all relative ${
              isActive
                ? 'text-emerald-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform ${
                  isActive ? 'scale-110 text-emerald-400' : 'text-slate-400'
                } ${tab.highlight && !isActive ? 'text-cyan-400' : ''}`}
              />

              {/* Live workout pulse badge */}
              {tab.badge && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
              )}
            </div>

            <span className={`text-[10px] sm:text-xs mt-1 tracking-tight ${isActive ? 'font-black text-white' : 'font-medium'}`}>
              {tab.label}
            </span>

            {/* Active underline indicator */}
            {isActive && (
              <span className="absolute bottom-0 w-6 h-0.5 rounded-full bg-emerald-400" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
