import React from 'react';
import {
  Zap,
  Crown,
  Flame,
  CheckCircle2,
  QrCode,
  Smartphone,
  LogOut,
  User,
  ExternalLink,
  BookOpen,
  Download,
} from 'lucide-react';

import { UserProfile, AuthUser } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  profile: UserProfile;
  authUser: AuthUser | null;
  onOpenAuthModal: () => void;
  onOpenProModal: () => void;
  onOpenPhoneModal: () => void;
  onOpenAndroidStudioModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  profile,
  authUser,
  onOpenAuthModal,
  onOpenProModal,
  onOpenPhoneModal,
  onOpenAndroidStudioModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 text-white w-full">
      <div className="w-full px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Brand Logo & Name */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => setActiveTab('calendar')}
          >
            <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 shadow-md shadow-emerald-500/20">
              <Zap className="w-5 h-5 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-white">
                  PULSE
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  FIT
                </span>
                {profile.isPro && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/40">
                    <Crown className="w-2.5 h-2.5 fill-amber-400" /> PRO
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions & Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Streak Counter */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 fill-orange-400" />
              <span>{profile.streakDays} дні</span>
            </div>

            {/* Download project ZIP for GitHub */}
            <a
              href="/download/pulse-fitness.zip"
              download="pulse-fitness.zip"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/35 text-purple-300 text-xs font-bold transition shadow-sm"
              title="Завантажити готовий ZIP-архів з кодом для GitHub"
            >
              <Download className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">ZIP для GitHub</span>
              <span className="sm:hidden">ZIP</span>
            </a>

            {/* Android Studio Export Shortcut */}

            <button
              onClick={onOpenAndroidStudioModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/35 text-teal-300 text-xs font-bold transition shadow-sm"
              title="Інструкція та файли для Android Studio та Google Play"
            >
              <Smartphone className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Android Studio (APK)</span>
              <span className="sm:hidden">APK</span>
            </button>

            {/* Phone QR Modal */}
            <button
              onClick={onOpenPhoneModal}
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
              title="Відкрити на смартфоні через QR"
            >
              <QrCode className="w-3.5 h-3.5 text-slate-400" />
              <span>QR</span>
            </button>

            {/* PRO Upgrade / Active Button */}
            {profile.isPro ? (
              <button
                onClick={onOpenProModal}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold transition"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">PRO</span>
              </button>
            ) : (
              <button
                onClick={onOpenProModal}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-black hover:brightness-110 transition shadow shadow-amber-500/20"
              >
                <Crown className="w-3.5 h-3.5 fill-slate-950" />
                <span>PRO</span>
              </button>
            )}

            {/* User Login / Profile Avatar */}
            {authUser?.isLoggedIn ? (
              <button
                onClick={() => setActiveTab('settings')}
                className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
                title={`Увійшли як: ${authUser.name}`}
              >
                {authUser.avatarUrl ? (
                  <img
                    src={authUser.avatarUrl}
                    alt={authUser.name}
                    className="w-6 h-6 rounded-full object-cover border border-emerald-500"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                    {authUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-medium text-slate-200 hidden sm:inline max-w-[100px] truncate">
                  {authUser.name}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-sm"
              >
                <User className="w-3.5 h-3.5" />
                <span>Увійти</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
