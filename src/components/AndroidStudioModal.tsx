import React, { useState } from 'react';
import { Smartphone, Terminal, CheckCircle2, Download, Copy, Play, Layers, ExternalLink, HelpCircle, AlertCircle } from 'lucide-react';

interface AndroidStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidStudioModal: React.FC<AndroidStudioModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const capacitorConfigJson = JSON.stringify(
    {
      appId: 'com.pulse.fitness',
      appName: 'PULSE',
      webDir: 'dist',
      bundledWebRuntime: false,
      server: {
        androidScheme: 'https',
      },
      android: {
        allowMixedContent: true,
        backgroundColor: '#020617',
      },
      plugins: {
        SplashScreen: {
          launchShowDuration: 1500,
          backgroundColor: '#020617',
        },
      },
    },
    null,
    2
  );

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const steps = [
    {
      title: '1. Скомпілювати веб-додаток',
      desc: 'Створює оптимізовану збірку у папку dist',
      cmd: 'npm run build',
    },
    {
      title: '2. Встановити Capacitor Android',
      desc: 'Генерує повноцінний проект Android Studio з файлами Java/Kotlin та AndroidManifest.xml',
      cmd: 'npm install @capacitor/core @capacitor/android @capacitor/cli && npx cap init "PULSE" "com.pulse.fitness" --web-dir dist && npx cap add android',
    },
    {
      title: '3. Відкрити в Android Studio',
      desc: 'Ця команда автоматично запускає встановлений у вас Android Studio з готовим проектом',
      cmd: 'npx cap open android',
    },
    {
      title: '4. Зібрати APK або AAB для Play Market',
      desc: 'В Android Studio виберіть: Build → Generate Signed Bundle / APK → Android App Bundle (.aab)',
      cmd: './gradlew bundleRelease',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-8 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Прямий експорт в Android Studio & Google Play
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Як отримати справжній .APK файл на телефон та .AAB для публікації в Play Market
            </p>
          </div>
        </div>

        {/* Why Cloud Run link gave 404 alert */}
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs sm:text-sm">
              <span className="font-bold text-amber-300 block">
                Чому посилання видавало "Page not found / The requested URL was not found on this server":
              </span>
              <p className="text-slate-300 leading-relaxed text-xs">
                Попередній перегляд AI Studio (посилання <code className="bg-slate-950 px-1 py-0.5 rounded text-amber-300">ais-pre-...</code>) захищений авторизацією Google Cloud. Коли ви скануєте QR-код звичайним телефоном, де в браузері ще немає входу під вашим робочим акаунтом Google (<strong className="text-white">andrejgoj37@gmail.com</strong>), Google блокує доступ з повідомленням "Page not found".
              </p>
              <p className="text-slate-300 leading-relaxed text-xs mt-1">
                <strong>Рішення:</strong> Увійдіть у браузері телефону в Google під акаунтом <strong className="text-white">andrejgoj37@gmail.com</strong>, АБО відкрийте проект в Android Studio нижче і встановіть реальний <strong className="text-emerald-400">.APK файл</strong> безпосередньо в пам'ять телефону!
              </p>
            </div>
          </div>
        </div>

        {/* Exact steps for Android Studio */}
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <Terminal className="w-4 h-4" /> 4 Кроки до готового додатку в Android Studio:
          </h3>

          {steps.map((s, idx) => (
            <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-bold text-white">{s.title}</span>
                <button
                  onClick={() => copyToClipboard(s.cmd, idx)}
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  {copiedIndex === idx ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Скопійовано!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Копіювати</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-400 mb-2">{s.desc}</p>
              <pre className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                {s.cmd}
              </pre>
            </div>
          ))}
        </div>

        {/* Download ready config files */}
        <div className="bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-400" /> Завантажити конфігурацію Capacitor
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Містить назву додатка "PULSE", пакет com.pulse.fitness та всі дозволи
            </p>
          </div>
          <button
            onClick={() => downloadFile(capacitorConfigJson, 'capacitor.config.json', 'application/json')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-emerald-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Завантажити capacitor.config.json</span>
          </button>
        </div>

        {/* Ready AndroidManifest preview */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4">
          <span className="text-xs font-bold text-slate-300 block mb-2">
            Вміст AndroidManifest.xml (вже налаштовано звуки, вібрацію, екран на повну ширину):
          </span>
          <pre className="text-[11px] font-mono text-slate-400 max-h-36 overflow-y-auto no-scrollbar p-2 bg-slate-900 rounded-lg">
{`<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.pulse.fitness">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="PULSE"
        android:theme="@style/AppTheme.NoActionBar"
        android:usesCleartextTraffic="true">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|keyboardHidden|screenSize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`}
          </pre>
        </div>

        {/* Bottom Close */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
          >
            Закрити вікно
          </button>
        </div>
      </div>
    </div>
  );
};
