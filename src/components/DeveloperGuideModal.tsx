import React, { useState } from 'react';
import {
  BookOpen,
  Code2,
  Smartphone,
  CreditCard,
  Rocket,
  Globe,
  CheckCircle2,
  Copy,
  ExternalLink,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';

export const DeveloperGuideModal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'android' | 'ios' | 'payments' | 'deploy'>('architecture');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold mb-3">
              <Code2 className="w-3.5 h-3.5" />
              <span>Повний інженерний та бізнес-посібник</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Як створити, скомпілювати та опублікувати FitFlow AI
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Відповіді на всі ваші запитання: де писати код, як працює бекенд, як зробити APK файл для Google Play Market, як додати в Apple App Store та як приймати реальні платежі за підписку.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-indigo-500/20">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'architecture'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>1. Архітектура коду</span>
          </button>

          <button
            onClick={() => setActiveTab('android')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'android'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>2. Google Play (Android)</span>
          </button>

          <button
            onClick={() => setActiveTab('ios')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'ios'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>3. App Store (iPhone)</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'payments'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>4. Платежі & Монетизація</span>
          </button>

          <button
            onClick={() => setActiveTab('deploy')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'deploy'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Rocket className="w-4 h-4" />
            <span>5. Деплой & Хостинг</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ARCHITECTURE */}
      {activeTab === 'architecture' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Як влаштована ваша програма FitFlow AI</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Цей проект побудований за принципом <strong>Full-Stack Responsive Web Application</strong>, яка одночасно працює у веб-браузері (ноутбук, планшет) та є <strong>PWA (Progressive Web App)</strong>, що встановлюється на телефон як нативний додаток.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
              <span className="text-emerald-400 font-bold text-sm block">1. Клієнтська частина (Frontend)</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>React 19 + TypeScript + Tailwind CSS</strong>.<br />
                Відповідає за інтерфейс календаря, таймер тренування, красиві переходи, збереження даних у пам'ять телефону (LocalStorage).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
              <span className="text-cyan-400 font-bold text-sm block">2. Серверна частина (Backend)</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Node.js + Express (файл `server.ts`)</strong>.<br />
                Працює на захищеному сервері, обробляє запити до ШІ, формує структуровані JSON плани та обробляє транзакції оплат.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
              <span className="text-amber-400 font-bold text-sm block">3. Мозок додатку (ШІ Gemini)</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Google Gen AI SDK (`@google/genai`)</strong>.<br />
                Модель <code>gemini-3.8-flash</code> аналізує розклади тренувань, контролює втому і генерує персональні програми.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Структура файлів вашого проекту:
            </span>
            <pre className="text-xs text-emerald-400 font-mono leading-relaxed overflow-x-auto p-2">
{`fitflow-ai/
├── server.ts              # Серверний бекенд з Express + Google Gemini API
├── index.html             # Точка входу в програму + налаштування для Android/iOS
├── package.json           # Всі бібліотеки проекту (React, Gemini SDK, Tailwind)
├── src/
│   ├── App.tsx            # Головний компонент із перемикачем екранів
│   ├── types/index.ts     # Типи даних (WorkoutDay, Exercise, Profile)
│   ├── utils/storage.ts   # Збереження тренувань в телефоні
│   ├── utils/audio.ts     # Звуковий синтезатор для таймера відпочинку
│   ├── hooks/usePWAInstall.ts # Підтримка встановлення на Android та iOS
│   └── components/
│       ├── CalendarView.tsx         # Календар тренувань (Google Calendar стиль)
│       ├── ActiveWorkoutModal.tsx   # Живий сеанс тренування з секундоміром
│       ├── AITrainerHub.tsx         # ШІ-Генератор та аналізатор планів
│       ├── StatsView.tsx            # Графіки тоннажу та рекорди
│       ├── ProModal.tsx             # Екран оплати підписки (Paywall)
│       └── LandingPageView.tsx      # Промо-сайт для залучення користувачів`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 2: ANDROID & PLAY STORE */}
      {activeTab === 'android' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              Як виставити FitFlow AI в Google Play Market
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Google офіційно підтримує два ідеальні способи перетворення сучасного веб-додатку на файл <strong>.AAB (Android App Bundle)</strong> для завантаження в Play Console:
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-xs font-bold">
                  Варіант 1 (Рекомендований): Capacitor
                </span>
                <span className="text-xs text-slate-400">Справжній нативний додаток з повним доступом</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Capacitor загортає ваш React-код у нативний Android-проект. Виконується лише 4 простими командами в терміналі:
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 space-y-1">
                <p># 1. Встановити Capacitor</p>
                <p>npm install @capacitor/core @capacitor/cli @capacitor/android</p>
                <p># 2. Ініціалізувати додаток</p>
                <p>npx cap init "FitFlow AI" "com.fitflow.app"</p>
                <p># 3. Збілдити React-код</p>
                <p>npm run build</p>
                <p># 4. Додати платформу Android та відкрити в Android Studio</p>
                <p>npx cap add android</p>
                <p>npx cap open android</p>
              </div>
              <p className="text-xs text-slate-300">
                В Android Studio ви просто натискаєте <strong>Build &gt; Generate Signed Bundle / APK</strong> і отримуєте файл для завантаження в Google Play Console!
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
              <span className="px-2 py-0.5 rounded bg-cyan-500 text-slate-950 text-xs font-bold">
                Варіант 2: Google Bubblewrap (TWA)
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Оскільки ми вже створили <code>manifest.json</code> та сервіс-воркер, інструмент <strong>Bubblewrap</strong> автоматично за 2 хвилини бере ваше готове посилання сайту та компілює з нього готовий APK/AAB файл!
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-400">
                npm i -g @bubblewrap/cli<br />
                bubblewrap init --manifest=https://your-domain.app/manifest.json<br />
                bubblewrap build
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700 text-xs text-slate-300 space-y-2">
              <span className="font-bold text-white block">Що потрібно для публікації в Play Market:</span>
              <ul className="list-disc pl-5 space-y-1 text-slate-300">
                <li>Акаунт розробника <strong>Google Play Console</strong> ($25 разовий платіж на все життя).</li>
                <li>Іконка додатку (512x512 PNG) та банер для магазину (1024x500 PNG).</li>
                <li>Політика конфіденційності (Privacy Policy).</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: IOS & APP STORE */}
      {activeTab === 'ios' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              Як запустити на iPhone та виставити в Apple App Store
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              На iOS користувачі можуть встановлювати додаток безпосередньо з браузера Safari без будь-яких комісій, або ви можете опублікувати його в офіційному Apple App Store.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-3">
              <h4 className="text-sm font-bold text-cyan-300">Спосіб 1: Миттєве встановлення (PWA)</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Користувач відкриває посилання вашого сайту в Safari, натискає кнопку <strong>«Поділитися» &gt; «На початковий екран»</strong>. Додаток з’являється серед усіх додатків на робочому столі iPhone, відкривається на повний екран без рядка браузера і зберігає всі дані!
              </p>
              <div className="p-2.5 rounded-xl bg-slate-900 text-[11px] text-emerald-400">
                ✓ Без комісії Apple (100% доходу вам)<br />
                ✓ Не треба проходити модерацію App Store
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-3">
              <h4 className="text-sm font-bold text-indigo-300">Спосіб 2: Apple App Store (через Xcode)</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Використовуючи Capacitor:
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-[11px] text-cyan-300">
                npm run build<br />
                npx cap add ios<br />
                npx cap open ios
              </div>
              <p className="text-xs text-slate-300">
                Команда відкриває проект у програмі <strong>Xcode</strong> на Mac. Ви обираєте свій Apple Developer Account ($99/рік) і відправляєте на перевірку в App Store.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PAYMENTS & MONETIZATION */}
      {activeTab === 'payments' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              Як підключити реальні платежі та заробляти на підписках
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Монетизація фітнес-додатків будується на передплаті (SaaS). Користувачі купують доступ на місяць ($6.99) або на рік ($59.99).
            </p>
          </div>

          {/* VISUAL FLOWCHART: Money Flow */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/30 space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 block">
              📊 СХЕМА РУХУ ГРОШЕЙ (ВІД КЛІЄНТА ДО ВАШОЇ КАРТКИ):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-cyan-400 font-bold block">Крок 1. Клієнт</span>
                <p className="text-slate-300">
                  Бачить екран PRO, натискає «Оплатити» через Apple Pay, Google Pay або картку Visa/Mastercard.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-indigo-400 font-bold block">Крок 2. Платіжна система</span>
                <p className="text-slate-300">
                  Google Play або Stripe списують кошти, миттєво відкривають клієнту всі PRO-функції.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold block">Крок 3. Комісія</span>
                <p className="text-slate-300">
                  Google Play бере 15% (за програмою зниженої комісії для першого $1M), Stripe бере ~2.9%.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-emerald-400 font-bold block">Крок 4. Ваша картка</span>
                <p className="text-slate-300">
                  Кожні 7-30 днів чисті гроші (85-97%) виплачуються вам на IBAN (Monobank, Приват, Payoneer, Wise).
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Earnings Calculator */}
          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                💰 Калькулятор вашого потенційного доходу:
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">Тариф: $6.99/міс</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">100 платних користувачів</span>
                <span className="text-xl font-black text-white font-mono">$699 / міс</span>
                <span className="text-xs text-emerald-400 block mt-1">~29,000 грн/місяць</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">500 платних користувачів</span>
                <span className="text-xl font-black text-amber-400 font-mono">$3,495 / міс</span>
                <span className="text-xs text-amber-300 block mt-1">~145,000 грн/місяць</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">2,000 платних користувачів</span>
                <span className="text-xl font-black text-emerald-400 font-mono">$13,980 / міс</span>
                <span className="text-xs text-emerald-300 block mt-1">~580,000 грн/місяць</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
              <span className="text-amber-300 font-bold text-sm block">1. Веб-платежі: Stripe / LiqPay / WayForPay</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Якщо користувач заходить на ваш сайт чи встановлює веб-версію, найпопулярнішим шлюзом у світі є <strong>Stripe Billing</strong>.
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-amber-300 space-y-1">
                <p>// На сервері server.ts створюється сесія Stripe:</p>
                <p>const session = await stripe.checkout.sessions.create(&#123;</p>
                <p>&nbsp;&nbsp;payment_method_types: ['card'],</p>
                <p>&nbsp;&nbsp;line_items: [&#123; price: 'price_pro_monthly', quantity: 1 &#125;],</p>
                <p>&nbsp;&nbsp;mode: 'subscription',</p>
                <p>&nbsp;&nbsp;success_url: 'https://your-app.com/success',</p>
                <p>&#125;);</p>
              </div>
              <p className="text-xs text-slate-400">
                Комісія Stripe складає лише ~2.9% + 30¢, що дає вам 97% чистого прибутку!
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
              <span className="text-white font-bold text-sm block">2. Мобільні платежі в додатку (In-App Purchases)</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Правило Google Play та App Store: якщо додаток встановлено з магазину, цифрові функції мають купуватися через <strong>Google Play Billing</strong> або <strong>Apple StoreKit</strong>.
              </p>
              <p className="text-xs text-slate-300">
                💡 <strong>Золотий стандарт індустрії:</strong> використання сервісу <strong>RevenueCat</strong> (безкоштовний до перших $2,500/міс). Він поєднує Google Play, App Store та Stripe в один єдиний SDK з кількома рядками коду!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DEPLOY */}
      {activeTab === 'deploy' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              Де розмістити код, щоб усе працювало 24/7 в інтернеті
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Вам не потрібен дорогий власний сервер. Для такого додатку ідеально підходять сучасні хмарні платформи:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
              <span className="text-emerald-400 font-bold text-sm block">Vercel / Render</span>
              <p className="text-xs text-slate-300">
                Найпростіший спосіб: підключаєте свій GitHub репозиторій, і Render або Vercel автоматично білдять додаток та видають вам посилання з безкоштовним SSL-сертифікатом (https).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
              <span className="text-cyan-400 font-bold text-sm block">Google Cloud Run</span>
              <p className="text-xs text-slate-300">
                Контейнерна платформа, на якій цей проект працює просто зараз в AI Studio. Масштабується до мільйонів користувачів автоматично.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
              <span className="text-indigo-400 font-bold text-sm block">Власний домен</span>
              <p className="text-xs text-slate-300">
                Купуєте домен (наприклад, <code>fitflow.app</code> або <code>fitflow-ai.com</code> за $10/рік) і прив’язуєте до вашого хостингу в налаштуваннях DNS.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 leading-relaxed">
            🚀 <strong>Підсумок:</strong> Ви вже маєте повністю готовий, протестований, працюючий продукт зі штучним інтелектом Gemini, трекером вправ, календарем та симуляцією білінгу. Ви можете запустити його у світ вже сьогодні!
          </div>
        </div>
      )}
    </div>
  );
};
