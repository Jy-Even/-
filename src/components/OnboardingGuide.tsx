import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  Clock, 
  CreditCard, 
  ArrowRight, 
  Check,
  Zap,
  TrendingUp,
  Shield,
  Info
} from 'lucide-react';
import { SalarySettings, SalaryRecord } from '../types';

interface OnboardingGuideProps {
  onComplete: (settings: SalarySettings) => void;
  initialSettings: SalarySettings;
}

const STEPS = [
  {
    id: 'welcome',
    title: '欢迎使用 PayTrack',
    description: '一个能让你看到每一秒都在赚钱的效率神器。只需简单几步，即可开启实时计薪之旅。',
    icon: <Zap className="w-12 h-12 text-primary" />,
  },
  {
    id: 'base_salary',
    title: '你的月薪水平',
    description: '输入你的税前月薪（不含年终奖）。我们将以此为基准，实时计算你的价值产出。',
    icon: <CreditCard className="w-12 h-12 text-blue-500" />,
  },
  {
    id: 'work_hours',
    title: '工作强度',
    description: '合理的工时是获得准确计薪的关键。默认按 955 标准工时计算。',
    icon: <Clock className="w-12 h-12 text-orange-500" />,
  },
  {
    id: 'social_security',
    title: '五险一金',
    description: '最后，设置你的社保比例。我们将估算你的实得收益，让数据更真实。',
    icon: <Shield className="w-12 h-12 text-purple-500" />,
  },
  {
    id: 'ready',
    title: '准备就绪',
    description: '恭喜！设置已全部完成。现在开始感受价值增长的愉悦吧。',
    icon: <TrendingUp className="w-12 h-12 text-green-500" />,
  }
];

export default function OnboardingGuide({ onComplete, initialSettings }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [settings, setSettings] = useState<SalarySettings>(initialSettings);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(settings);
    }
  };

  const renderStepContent = () => {
    switch (STEPS[currentStep].id) {
      case 'base_salary':
        return (
          <div className="w-full space-y-6">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  税前月薪 (CNY)
                </label>
                <div className="group relative">
                  <Info className="w-3.5 h-3.5 text-zinc-300 cursor-help transition-colors hover:text-zinc-500" />
                  <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-zinc-800 text-[10px] text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-50">
                    税前薪资是计算社保、公积金及个税的基准。请填入合同约定的月固定薪额。
                  </div>
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-primary/30">¥</span>
                <input
                  type="number"
                  value={settings.baseSalary || ''}
                  onChange={(e) => setSettings({ ...settings, baseSalary: Number(e.target.value) })}
                  className="w-full glass-elevated py-6 pl-12 pr-6 rounded-[24px] text-3xl font-black text-zinc-900 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder="20000"
                  autoFocus
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setSettings({ ...settings, salaryMode: 'Monthly' })}
                className={`p-4 rounded-2xl border-2 transition-all ${settings.salaryMode === 'Monthly' ? 'border-primary bg-primary/5' : 'border-zinc-100 opacity-50'}`}
              >
                <span className="block font-bold">月薪制</span>
                <span className="text-[10px] text-zinc-400">常规工薪族</span>
              </button>
              <button 
                onClick={() => setSettings({ ...settings, salaryMode: 'Annual' })}
                className={`p-4 rounded-2xl border-2 transition-all ${settings.salaryMode === 'Annual' ? 'border-primary bg-primary/5' : 'border-zinc-100 opacity-50'}`}
              >
                <span className="block font-bold">年薪制</span>
                <span className="text-[10px] text-zinc-400">管理/技术序列</span>
              </button>
            </div>
          </div>
        );
      case 'work_hours':
        return (
          <div className="w-full space-y-6">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  日均工作时长 (小时)
                </label>
                <div className="group relative">
                  <Info className="w-3.5 h-3.5 text-zinc-300 cursor-help transition-colors hover:text-zinc-500" />
                  <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-zinc-800 text-[10px] text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-50">
                    标准工时通常为 8 小时。该数值将直接影响您的秒级薪资及时薪计算。
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="4"
                  max="16"
                  step="0.5"
                  value={settings.dailyHours}
                  onChange={(e) => setSettings({ ...settings, dailyHours: Number(e.target.value) })}
                  className="flex-1 accent-primary h-2 bg-zinc-100 rounded-full appearance-none"
                />
                <span className="text-2xl font-black w-16 text-right">{settings.dailyHours}h</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">
                每周工作天数
              </label>
              <div className="flex gap-2">
                {[5, 6, 7].map(days => (
                  <button 
                    key={days}
                    onClick={() => setSettings({ ...settings, daysPerWeek: days })}
                    className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${settings.daysPerWeek === days ? 'border-primary bg-primary/5 text-primary' : 'border-zinc-100 text-zinc-400'}`}
                  >
                    {days}天
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'social_security':
        return (
          <div className="w-full space-y-4">
            <div className="glass-elevated p-6 rounded-[28px] space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3">
                <div className="group relative">
                  <Info className="w-4 h-4 text-zinc-300" />
                  <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-zinc-800 text-[10px] text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl z-50 leading-relaxed">
                    <p className="font-bold border-b border-white/10 pb-1 mb-1">为什么要填这个？</p>
                    五险一金比例决定了您的税后到手收入。默认按标准比例设定，您可以后期在设置页面精确定制。
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-zinc-600">个人公积金比例</span>
                <span className="text-primary font-black">{settings.housingRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-zinc-600">医疗/养老/失业保险总计</span>
                <span className="text-primary font-black">{(settings.pensionRate + settings.medicalRate + settings.unemploymentRate).toFixed(1)}%</span>
              </div>
              <p className="text-[10px] text-zinc-400 leading-relaxed italic">
                * 默认基数为当前月薪，可在后期进行进阶设置。
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const step = STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Progress Dots */}
        <div className="flex gap-2 mb-12">
          {STEPS.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-500 ${i === currentStep ? 'w-8 bg-primary' : 'w-1.5 bg-zinc-100'}`} 
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center w-full"
          >
            <div className="mb-8 p-6 rounded-[32px] bg-zinc-50 border border-zinc-100/50 shadow-sm">
              {step.icon}
            </div>
            
            <h1 className="text-3xl font-black text-zinc-900 mb-4 tracking-tight">
              {step.title}
            </h1>
            <p className="text-zinc-500 font-medium leading-relaxed mb-10">
              {step.description}
            </p>

            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 w-full">
          <motion.button
            layout
            whileHover={{ scale: 1.02, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="w-full py-5 rounded-[24px] bg-zinc-900 text-white font-black flex items-center justify-center gap-3 shadow-xl shadow-zinc-200 transition-all hover:bg-black relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep === STEPS.length - 1 ? 'finish' : 'next'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3"
              >
                {currentStep === STEPS.length - 1 ? (
                  <>
                    <span>开始计薪</span>
                    <Check className="w-5 h-5 text-primary" />
                  </>
                ) : (
                  <>
                    <span>下一步</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>
          
          {currentStep > 0 && currentStep < STEPS.length - 1 && (
            <button 
              onClick={() => setCurrentStep(currentStep - 1)}
              className="w-full mt-4 py-2 text-zinc-400 font-bold text-sm"
            >
              返回上一步
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
