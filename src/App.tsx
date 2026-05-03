/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Calculator, 
  ReceiptText, 
  User, 
  Calendar, 
  Settings,
  PlusCircle,
  LogOut,
  ChevronRight,
  TrendingUp,
  Clock,
  Briefcase,
  History,
  Palette,
  Bell,
  RefreshCw,
  Info,
  CircleCheck,
  CircleAlert,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewType, SalarySettings, SalaryRecord, MonthlySalary } from './types';
import { cn, formatCurrency } from './lib/utils';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// --- Views ---
import HomeView from './components/HomeView';
import CalculatorView from './components/CalculatorView';
import HistoryView from './components/HistoryView';
import ProfileView from './components/ProfileView';
import CalendarView from './components/CalendarView';
import SalarySettingsView from './components/SalarySettingsView';
import SocialSecurityView from './components/SocialSecurityView';
import SalaryDetailView from './components/SalaryDetailView';
import SalaryEditView from './components/SalaryEditView';
import AppearanceSettingsView from './components/AppearanceSettingsView';
import RealtimeSalaryView from './components/RealtimeSalaryView';
import OnboardingGuide from './components/OnboardingGuide';

const INITIAL_SETTINGS: SalarySettings = {
  baseSalary: 15000,
  salaryMode: 'Monthly',
  scheduleType: 'Double',
  dailyHours: 8.0,
  pensionRate: 8,
  medicalRate: 2,
  unemploymentRate: 0.5,
  housingRate: 12,
};

const MOCK_RECORDS: SalaryRecord[] = [
  {
    id: '1',
    date: '2024-05-24',
    type: 'Overtime',
    subtype: 'Workday',
    duration: 4.5,
    estimatedPay: 3450.00
  }
];

const MOCK_HISTORY: MonthlySalary[] = [
  { id: '1', month: '2024-04', baseAmount: 10000, bonus: 6000, socialSecurity: 2150, tax: 1000, gross: 16000, net: 12850 },
  { id: '2', month: '2024-03', baseAmount: 10000, bonus: 5000, socialSecurity: 2150, tax: 0, gross: 15000, net: 12850 },
  { id: '3', month: '2024-02', baseAmount: 10000, bonus: 3700, socialSecurity: 2150, tax: 50, gross: 13700, net: 11500 },
  { id: '4', month: '2024-01', baseAmount: 10000, bonus: 5000, socialSecurity: 2150, tax: 0, gross: 15000, net: 12850 },
];

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('home');
  const [settings, setSettings] = useState<SalarySettings>(INITIAL_SETTINGS);
  const [records, setRecords] = useState<SalaryRecord[]>(MOCK_RECORDS);
  const [history, setHistory] = useState<MonthlySalary[]>(MOCK_HISTORY);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setSettings({
              ...INITIAL_SETTINGS,
              ...data,
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setIsInitialLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const completed = localStorage.getItem('onboarding-completed');
    if (!completed) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = (newSettings: SalarySettings) => {
    setSettings(newSettings);
    setShowOnboarding(false);
    localStorage.setItem('onboarding-completed', 'true');
  };

  const [theme, setTheme] = useState<'system'|'light'|'dark'|'midnight'|'oled'|'forest'|'cyberpunk'|'sepia'|'nord'>(() => {
    return (localStorage.getItem('app-theme') as any) || 'system';
  });

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'theme-midnight', 'theme-oled', 'theme-forest', 'theme-cyberpunk', 'theme-sepia', 'theme-nord');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else if (theme === 'midnight') {
      root.classList.add('dark', 'theme-midnight');
    } else if (theme === 'oled') {
      root.classList.add('dark', 'theme-oled');
    } else if (theme === 'forest') {
      root.classList.add('theme-forest');
    } else if (theme === 'cyberpunk') {
      root.classList.add('dark', 'theme-cyberpunk');
    } else if (theme === 'sepia') {
      root.classList.add('theme-sepia');
    } else if (theme === 'nord') {
      root.classList.add('dark', 'theme-nord');
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const selectedHistoryRecord = useMemo(() => {
    return history.find(h => h.id === selectedHistoryId);
  }, [history, selectedHistoryId]);

  const handleDeleteHistory = (id: string) => {
    setHistory(prev => prev.filter(r => r.id !== id));
  };

  // Real-time accumulator logic
  const [accumulated, setAccumulated] = useState(12456.78);
  const earningsPerSecond = useMemo(() => {
    // Basic calculation: monthly / (21.75 days * 8 hours * 3600 seconds)
    return settings.baseSalary / (21.75 * settings.dailyHours * 3600);
  }, [settings]);

  useEffect(() => {
    const timer = setInterval(() => {
      setAccumulated(prev => prev + earningsPerSecond);
    }, 1000);
    return () => clearInterval(timer);
  }, [earningsPerSecond]);

  const today = useMemo(() => {
    const date = new Date();
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return <HomeView settings={settings} accumulated={accumulated} perSecond={earningsPerSecond} onAction={setActiveView} />;
      case 'calculator':
        return <CalculatorView settings={settings} setSettings={setSettings} onSave={(rec) => setRecords(prev => [rec, ...prev])} />;
      case 'history':
        return <HistoryView 
          history={history} 
          onViewDetail={(id) => {
            setSelectedHistoryId(id);
            setActiveView('salaryDetail');
          }}
          onEdit={(id) => {
            setSelectedHistoryId(id);
            setActiveView('salaryEdit');
          }}
          onDelete={handleDeleteHistory}
        />;
      case 'profile':
        return <ProfileView settings={settings} setSettings={setSettings} onNavigate={setActiveView} theme={theme} />;
      case 'salarySettings':
        return <SalarySettingsView settings={settings} onSave={setSettings} onBack={() => setActiveView('profile')} />;
      case 'socialSecurity':
        return <SocialSecurityView settings={settings} setSettings={setSettings} onBack={() => setActiveView('profile')} />;
      case 'appearanceSettings':
        return <AppearanceSettingsView theme={theme} setTheme={setTheme} onBack={() => setActiveView('profile')} />;
      case 'realtimeSalary':
        return <RealtimeSalaryView settings={settings} accumulatedValue={accumulated} perSecond={earningsPerSecond} onClose={() => setActiveView('home')} />;
      case 'calendar':
        return <CalendarView />;
      case 'salaryDetail':
        return selectedHistoryRecord ? (
          <SalaryDetailView 
            record={selectedHistoryRecord} 
            onBack={() => setActiveView('history')} 
            onEdit={() => setActiveView('salaryEdit')}
          />
        ) : null;
      case 'salaryEdit':
        return selectedHistoryRecord ? (
          <SalaryEditView 
            record={selectedHistoryRecord} 
            onSave={(updatedRecord) => {
              setHistory(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
              setActiveView('history');
            }}
            onBack={() => setActiveView('history')} 
          />
        ) : null;
      default:
        return <HomeView settings={settings} accumulated={accumulated} perSecond={earningsPerSecond} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen mesh-bg">
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingGuide 
            initialSettings={settings} 
            onComplete={handleOnboardingComplete} 
          />
        )}
      </AnimatePresence>

      {/* Top App Bar */}
      {['home', 'calculator', 'calendar', 'history', 'profile'].includes(activeView) && activeView !== 'realtimeSalary' && (
        <header className="w-full pt-12 pb-2 px-6 flex justify-center items-center">
          <h1 className="font-bold text-[17px] text-zinc-900 tracking-tight">
            {activeView === 'home' ? today : 
             activeView === 'calculator' ? '薪资计算器' : 
             activeView === 'calendar' ? '考勤日历' :
             activeView === 'history' ? '明细记录' : '个人中心'}
          </h1>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-32 relative z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg mx-auto"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      {activeView !== 'realtimeSalary' && (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-50 glass shadow-2xl h-[72px] rounded-full flex justify-around items-center px-2">
          <NavButton 
            active={activeView === 'home'} 
            onClick={() => setActiveView('home')} 
            icon={<LayoutDashboard className="w-5 h-5" />} 
            label="首页" 
          />
          <NavButton 
            active={activeView === 'calendar'} 
            onClick={() => setActiveView('calendar')} 
            icon={<Calendar className="w-5 h-5" />} 
            label="日历" 
          />
          <NavButton 
            active={activeView === 'calculator'} 
            onClick={() => setActiveView('calculator')} 
            icon={<Calculator className="w-5 h-5" />} 
            label="计算器" 
          />
          <NavButton 
            active={['history', 'salaryDetail', 'salaryEdit'].includes(activeView)} 
            onClick={() => setActiveView('history')} 
            icon={<ReceiptText className="w-5 h-5" />} 
            label="明细" 
          />
          <NavButton 
            active={['profile', 'salarySettings', 'socialSecurity', 'appearanceSettings'].includes(activeView)} 
            onClick={() => setActiveView('profile')} 
            icon={<User className="w-5 h-5" />} 
            label="我的" 
          />
        </nav>
      )}
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      className={cn(
        "relative flex flex-col items-center justify-center gap-1 transition-all duration-300 w-[72px] h-full group z-10",
        active ? "text-primary" : "text-zinc-500 hover:text-zinc-700"
      )}
    >
      <div className="relative flex items-center justify-center w-12 h-12">
        {active && (
          <motion.div
            layoutId="nav-pill"
            className="absolute inset-0 bg-primary/10 rounded-full z-0"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        <div className="z-10 transition-transform duration-200 flex items-center justify-center">
          {React.cloneElement(icon as React.ReactElement, { className: cn((icon as any).props.className, "w-6 h-6", active ? "stroke-[2.5px]" : "stroke-2") })}
        </div>
      </div>
      <AnimatePresence>
        {!active && (
          <motion.span 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="text-[10px] font-medium z-10 absolute bottom-1"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

