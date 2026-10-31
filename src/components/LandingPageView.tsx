import React from 'react';
import {
  Zap,
  Sparkles,
  Calendar,
  CheckCircle2,
  Smartphone,
  Laptop,
  ArrowRight,
  Shield,
  Download,
  Flame,
  Star,
  Users,
  Award,
} from 'lucide-react';

interface LandingPageViewProps {
  onOpenApp: () => void;
  onOpenPro: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onOpenApp,
  onOpenPro,
}) => {
  return (
    <div className="space-y-16 text-white pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-12 lg:p-16 shadow-2xl">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Революція у фітнесі з Gemini 3.8 Flash</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
            Твій елітний ШІ-тренер та розумний щоденник тренувань
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Створюйте розклад на кожен день як у Google Календарі, отримуйте миттєвий аналіз балансу м’язів від штучного інтелекту та фіксуйте кожен підхід прямо під час тренування.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenApp}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-500 hover:brightness-110 text-slate-950 font-black text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-emerald-500/25 transition transform active:scale-95"
            >
              <Zap className="w-5 h-5 fill-slate-950" />
              <span>Запустити веб-додаток зараз</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenPro}
              className="px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm sm:text-base transition"
            >
              Тарифи підписки
            </button>
          </div>

          {/* App Store & Google Play Mock Badges */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Доступно для:</span>

            {/* Google Play Badge */}
            <div
              onClick={onOpenApp}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 cursor-pointer hover:border-slate-500 transition"
            >
              <div className="w-5 h-5 flex items-center justify-center text-emerald-400 font-bold">▶</div>
              <div className="text-left">
                <span className="text-[9px] text-slate-400 block uppercase">Завантажити з</span>
                <span className="text-xs font-bold text-white block -mt-0.5">Google Play</span>
              </div>
            </div>

            {/* App Store Badge */}
            <div
              onClick={onOpenApp}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 cursor-pointer hover:border-slate-500 transition"
            >
              <div className="w-5 h-5 flex items-center justify-center text-cyan-400 font-bold"></div>
              <div className="text-left">
                <span className="text-[9px] text-slate-400 block uppercase">Доступно в</span>
                <span className="text-xs font-bold text-white block -mt-0.5">App Store</span>
              </div>
            </div>

            {/* PWA Web Badge */}
            <div
              onClick={onOpenApp}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 cursor-pointer hover:border-slate-500 transition"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <div className="text-left">
                <span className="text-[9px] text-slate-400 block uppercase">Встановлюється на</span>
                <span className="text-xs font-bold text-white block -mt-0.5">Будь-який смартфон (PWA)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Value Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden space-y-3 hover:border-slate-700 transition shadow-xl flex flex-col">
          <div className="h-44 relative overflow-hidden bg-slate-950">
            <img
              src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=700&q=80"
              alt="Google Calendar Style Workout Schedule"
              className="w-full h-full object-cover hover:scale-105 transition duration-500 brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500 text-slate-950 font-bold">
                <Calendar className="w-4 h-4" />
              </span>
              <span className="text-xs font-black uppercase text-white drop-shadow">Розклад & Нагадування</span>
            </div>
          </div>
          <div className="p-6 pt-0 space-y-2 flex-1">
            <h3 className="text-lg font-bold text-white">Календар у стилі Google</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Плануйте конкретні години тренувань, встановлюйте нагадування та контролюйте регулярність за тижнями й місяцями.
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden space-y-3 hover:border-slate-700 transition shadow-xl flex flex-col">
          <div className="h-44 relative overflow-hidden bg-slate-950">
            <img
              src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=700&q=80"
              alt="AI Trainer & Smart Analytics"
              className="w-full h-full object-cover hover:scale-105 transition duration-500 brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-500 text-slate-950 font-bold">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-xs font-black uppercase text-white drop-shadow">ШІ Gemini 3.8 Flash</span>
            </div>
          </div>
          <div className="p-6 pt-0 space-y-2 flex-1">
            <h3 className="text-lg font-bold text-white">ШІ-Тренер та Аналітика</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Штучний інтелект Gemini бачить ваш розклад, попереджає про перетренованість та генерує індивідуальні спліти під вашу мету.
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden space-y-3 hover:border-slate-700 transition shadow-xl flex flex-col">
          <div className="h-44 relative overflow-hidden bg-slate-950">
            <img
              src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=700&q=80"
              alt="Live Workout Set Logger & Timer"
              className="w-full h-full object-cover hover:scale-105 transition duration-500 brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500 text-slate-950 font-bold">
                <Zap className="w-4 h-4 fill-slate-950" />
              </span>
              <span className="text-xs font-black uppercase text-white drop-shadow">Живий сеанс тренування</span>
            </div>
          </div>
          <div className="p-6 pt-0 space-y-2 flex-1">
            <h3 className="text-lg font-bold text-white">Живий логер та таймер</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Записуйте вагу та повторення прямо під час виконання підходу. Вбудований таймер відпочинку зі звуковими сигналами.
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof & Trust */}
      <section className="rounded-3xl bg-slate-900/60 border border-slate-800 p-8 text-center space-y-4">
        <div className="flex justify-center gap-1 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-amber-400" />
          ))}
        </div>
        <blockquote className="text-base sm:text-xl font-medium text-slate-200 max-w-2xl mx-auto italic">
          «FitFlow AI повністю замінив мені паперовий блокнот та персонального тренера. ШІ підказав правильну зміну вправ, коли боліло плече, і прогрес у жимі зріс на 15 кг!»
        </blockquote>
        <div className="text-xs text-slate-400">
          <span className="font-bold text-white">Максим К.</span> — користувач FitFlow PRO
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="rounded-3xl bg-gradient-to-r from-emerald-600 to-cyan-600 p-8 sm:p-12 text-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xl">
        <div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
            Готові вивести свої тренування на новий рівень?
          </h3>
          <p className="text-sm font-medium text-slate-900/90 mt-1">
            Відкрийте додаток просто зараз — без необхідності завантажувати важкі файли.
          </p>
        </div>
        <button
          onClick={onOpenApp}
          className="px-8 py-3.5 rounded-2xl bg-slate-950 text-white font-black text-sm hover:bg-slate-900 transition shadow-xl shrink-0"
        >
          Відкрити FitFlow AI
        </button>
      </section>
    </div>
  );
};
