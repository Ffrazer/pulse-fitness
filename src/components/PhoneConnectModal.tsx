import React, { useState } from 'react';
import {
  Smartphone,
  QrCode,
  Copy,
  Check,
  X,
  ExternalLink,
  Share2,
  AlertCircle,
  Sparkles,
  Download,
  Terminal,
} from 'lucide-react';

interface PhoneConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhoneConnectModal: React.FC<PhoneConnectModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'scan' | 'apk'>('scan');

  if (!isOpen) return null;

  const appUrl =
    typeof window !== 'undefined' && window.location.href.includes('europe-west2.run.app')
      ? 'https://ais-pre-nx6xct55dhcjrpjnvxpgc3-429572035215.europe-west2.run.app'
      : typeof window !== 'undefined'
      ? window.location.origin
      : 'https://ais-pre-nx6xct55dhcjrpjnvxpgc3-429572035215.europe-west2.run.app';

  // QR Code generator URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    appUrl
  )}&bgcolor=0d1322&color=10b981&margin=10`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadCapacitorConfig = () => {
    const config = {
      appId: 'com.fitflow.ai',
      appName: 'FitFlow AI',
      webDir: 'dist',
      bundledWebRuntime: false,
      server: {
        androidScheme: 'https',
      },
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'capacitor.config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-3xl bg-[#0d1322] border border-emerald-500/30 p-6 sm:p-8 shadow-2xl text-white my-auto space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Відкрити на телефоні та збілдити APK</h3>
              <p className="text-xs text-slate-400">Android, iPhone & Google Play Store</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: Scan QR vs Export APK */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('scan')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'scan'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>1. Сканувати QR-код</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('apk')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'apk'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>2. Збілдити APK / Play Market</span>
          </button>
        </div>

        {activeTab === 'scan' ? (
          <>
            {/* Warning about Google AI Studio IAM login */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300 block">Чому може писати помилку або вимагати вхід?</span>
                <p className="text-[11px] text-amber-200/90 leading-relaxed mt-0.5">
                  Посилання попереднього перегляду AI Studio захищені Google. На телефоні увійдіть у мобільному браузері (Safari або Chrome) під вашим Google акаунтом (<strong>andrejgoj37@gmail.com</strong>), і додаток миттєво відкриється!
                </p>
              </div>
            </div>

            {/* QR Code display */}
            <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <div className="bg-[#0d1322] p-2.5 rounded-2xl border border-emerald-500/30 shrink-0 shadow-lg shadow-emerald-500/10">
                <img
                  src={qrCodeUrl}
                  alt="QR Code для відкриття на телефоні"
                  className="w-40 h-40 rounded-xl object-contain"
                />
              </div>

              <div className="space-y-3 text-center sm:text-left">
                <h4 className="text-sm font-bold text-white">
                  Наведіть камеру смартфона на QR-код
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Камера відкриє додаток у Safari або Chrome.
                </p>
                <div className="text-[11px] text-emerald-400 font-semibold space-y-1">
                  <p>🍏 iPhone: «Поділитися» ➔ «На початковий екран»</p>
                  <p>🤖 Android: «Меню (3 крапки)» ➔ «Встановити»</p>
                </div>
              </div>
            </div>

            {/* Direct Link Copy Button */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={appUrl}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-emerald-400 font-mono focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shrink-0 shadow"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Скопійовано!' : 'Копіювати'}</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          /* APK & App Store Build Tab */
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
              <span className="font-bold text-cyan-300 block text-sm">
                Як отримати файл .APK або .AAB для Google Play Store:
              </span>
              <p className="text-slate-300 leading-relaxed">
                Додаток створено на React 19 та повністю підтримує <strong>Capacitor</strong>. Ви можете зібрати справжній нативний Android файл лише трьома командами:
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 space-y-1.5 overflow-x-auto">
              <p className="text-slate-500"># 1. Скомпілювати код:</p>
              <p>npm run build</p>
              <p className="text-slate-500"># 2. Додати платформу Android:</p>
              <p>npm i @capacitor/core @capacitor/cli @capacitor/android</p>
              <p>npx cap add android</p>
              <p className="text-slate-500"># 3. Відкрити в Android Studio для білду APK/AAB:</p>
              <p>npx cap open android</p>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <div>
                <span className="font-bold text-white block">Файл конфігурації Capacitor:</span>
                <span className="text-[11px] text-slate-400">capacitor.config.json (готовий для Android)</span>
              </div>
              <button
                type="button"
                onClick={handleDownloadCapacitorConfig}
                className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Завантажити</span>
              </button>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
        >
          Зрозуміло, закрити
        </button>
      </div>
    </div>
  );
};
