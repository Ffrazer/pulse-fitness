import React, { useState } from 'react';
import {
  Crown,
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  CreditCard,
  X,
  Lock,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';
import { sounds } from '../utils/audio';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpgradeSuccess: (plan: string) => void;
}

export const ProModal: React.FC<ProModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpgradeSuccess,
}) => {
  if (!isOpen) return null;

  const [billingCycle, setBillingCycle] = useState<'yearly' | 'monthly'>('yearly');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'google_pay'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<any>(null);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const plan = billingCycle === 'yearly' ? 'pro_yearly' : 'pro_monthly';
      const res = await fetch('/api/checkout/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          email: profile.email || 'user@example.com',
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (data.success) {
        sounds.playTimerFinish();
        try {
          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.5 },
          });
        } catch {}

        setSuccessReceipt(data);
        onUpgradeSuccess(plan);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Помилка під час симуляції транзакції.');
    } finally {
      setIsProcessing(false);
    }
  };

  const features = [
    { name: 'Необмежена генерація планів через Gemini 3.8 Flash', free: '1 план', pro: 'Безлімітно' },
    { name: 'Глибокий аналіз розкладу тренувань та ризику травм', free: 'Базовий', pro: 'Повний аудит' },
    { name: 'Живий сеанс тренування з таймером відпочинку та звуками', free: 'Обмежено', pro: 'Повний доступ' },
    { name: 'Миттєвий AI-розбір виконаного тренування та тоннажу', free: false, pro: true },
    { name: 'Цілодобовий чат із персональним ШІ-тренером', free: '3 питання/день', pro: 'Безлімітно' },
    { name: 'Синхронізація розкладу з нагадуваннями за годинами', free: true, pro: true },
    { name: 'Детальна аналітика тоннажу, PRs та м’язового балансу', free: false, pro: true },
    { name: 'Офлайн доступ до всіх тренувань без інтернету (PWA)', free: true, pro: true },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-amber-500/30 shadow-2xl text-white my-auto overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
              <Crown className="w-3.5 h-3.5 fill-amber-400" />
              <span>FitFlow PRO Преміум</span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white mt-3 tracking-tight">
            Розблокуйте повну силу ШІ-Тренера
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Необмежені програми, живий моніторинг кожного підходу та професійний аудит відновлення.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {successReceipt ? (
            /* Success confirmation screen */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <Crown className="w-8 h-8 fill-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Вітаємо у клубі FitFlow PRO!</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                  {successReceipt.message}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Номер замовлення:</span>
                  <span className="font-mono font-bold text-white">{successReceipt.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Тариф:</span>
                  <span className="font-bold text-amber-300">{successReceipt.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Сума до сплати:</span>
                  <span className="font-bold text-emerald-400">
                    ${successReceipt.amount} {successReceipt.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Діє до:</span>
                  <span className="text-white">
                    {new Date(successReceipt.expiresAt).toLocaleDateString('uk-UA')}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/20"
              >
                Почати тренування з PRO
              </button>
            </div>
          ) : (
            <>
              {/* Billing Cycle Switcher */}
              <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-slate-800/80 border border-slate-700">
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  className={`p-3 rounded-xl text-left transition relative ${
                    billingCycle === 'yearly'
                      ? 'bg-amber-500/20 border border-amber-500/50 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950">
                    Економія 40%
                  </span>
                  <span className="text-xs font-bold block text-white">Річний тариф</span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-lg font-black text-amber-400">$4.99</span>
                    <span className="text-[11px] text-slate-400">/ місяць</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">$59.99 на рік</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`p-3 rounded-xl text-left transition ${
                    billingCycle === 'monthly'
                      ? 'bg-amber-500/20 border border-amber-500/50 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-bold block text-white">Щомісячний</span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-lg font-black text-amber-400">$6.99</span>
                    <span className="text-[11px] text-slate-400">/ місяць</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Скасування в будь-який момент</span>
                </button>
              </div>

              {/* Feature comparison */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Порівняння планів:
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {features.map((f, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-slate-800/40 border border-slate-800"
                    >
                      <span className="text-slate-300 pr-2">{f.name}</span>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-slate-500 text-[11px] w-20 text-right">
                          {typeof f.free === 'boolean' ? (f.free ? '✓' : '—') : f.free}
                        </span>
                        <span className="font-bold text-amber-400 text-[11px] w-24 text-right">
                          {typeof f.pro === 'boolean' ? (f.pro ? '✓ Включено' : '—') : f.pro}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment simulation checkout form */}
              <form onSubmit={handleCheckout} className="space-y-4 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Оберіть метод оплати (Симуляція реального шлюзу Stripe):</span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" /> 256-bit SSL захист
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-semibold transition ${
                      paymentMethod === 'card'
                        ? 'border-emerald-500 bg-emerald-500/10 text-white'
                        : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" /> Картка
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-semibold transition ${
                      paymentMethod === 'apple_pay'
                        ? 'border-emerald-500 bg-emerald-500/10 text-white'
                        : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Apple Pay
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('google_pay')}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-semibold transition ${
                      paymentMethod === 'google_pay'
                        ? 'border-emerald-500 bg-emerald-500/10 text-white'
                        : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Google Pay
                  </button>
                </div>

                {paymentMethod === 'card' && (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Номер картки"
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="ММ/РР"
                        className="w-1/2 px-2 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white text-center focus:outline-none focus:border-amber-500 font-mono"
                      />
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="CVC"
                        className="w-1/2 px-2 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white text-center focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isProcessing
                      ? 'Обробка платежу через шлюз...'
                      : billingCycle === 'yearly'
                      ? 'Оформити PRO за $59.99/рік (7 днів безкоштовно)'
                      : 'Оформити PRO за $6.99/місяць'}
                  </span>
                </button>
                <p className="text-[10px] text-center text-slate-400">
                  Тестовий режим білінгу: гроші не списуються. Миттєво активує PRO-статус у вашому додатку.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
