import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Save,
  CreditCard,
  Target,
  Clock,
  Briefcase,
  Info,
  X
} from 'lucide-react';
import { SalarySettings } from '../types';
import { cn, formatCurrency } from '../lib/utils';

interface SalarySettingsViewProps {
  settings: SalarySettings;
  onSave: (settings: SalarySettings) => void;
  onBack: () => void;
}

export default function SalarySettingsView({ settings, onSave, onBack }: SalarySettingsViewProps) {
  const [localSettings, setLocalSettings] = useState<SalarySettings>({ ...settings });
  const [showFormula, setShowFormula] = useState(false);

  const hourlyRate = localSettings.baseSalary / 21.75 / localSettings.dailyHours;

  const handleSave = () => {
    onSave(localSettings);
    onBack();
  };

  return (
    <div className="flex flex-col gap-6 px-5 pb-32 pt-10">
      <header className="flex items-center gap-4 py-2">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="p-2 rounded-full bg-zinc-100 text-zinc-600"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
        <h2 className="text-xl font-black">薪资设置</h2>
      </header>

      <section className="space-y-6">
        {/* Hourly Rate Display */}
        <button 
          onClick={() => setShowFormula(true)}
          className="w-full text-left glass rounded-3xl p-6 flex flex-col justify-center bg-linear-to-br from-primary/5 to-transparent relative overflow-hidden transition-all hover:bg-primary/10 active:scale-[0.98]"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="text-[13px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              当前计算时薪 <Info className="w-4 h-4 text-primary/60" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-primary opacity-80">¥</span>
            <div className="text-4xl font-black text-primary tracking-tighter">
              {hourlyRate.toFixed(2)}
            </div>
          </div>
          <div className="text-xs font-medium text-primary/60 mt-2 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            基于标准月计薪天数 21.75 天计算
          </div>
        </button>

        <div className="glass rounded-3xl p-5 space-y-8 shadow-sm">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-zinc-800 tracking-wide pl-1">基本薪资 (税前)</span>
              <span className="text-[12px] text-zinc-400 pl-1">作为加班费、请假扣除的计算基数</span>
            </div>
            <div className="flex items-center gap-3 bg-zinc-100 p-3 rounded-2xl inner-shadow">
               <span className="text-xl font-black text-zinc-400">¥</span>
               <input 
                 type="number" 
                 value={localSettings.baseSalary === 0 ? '' : localSettings.baseSalary}
                 onChange={(e) => setLocalSettings({...localSettings, baseSalary: Number(e.target.value)})}
                 className="bg-transparent border-none focus:ring-0 text-2xl font-black w-full p-0"
                 placeholder="0"
               />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-zinc-800 tracking-wide pl-1">结算周期</span>
              <span className="text-[12px] text-zinc-400 pl-1">选择薪资的发放周期模式</span>
            </div>
            <div className="bg-zinc-100 p-1 rounded-2xl flex gap-1">
              {['Monthly', 'Annual'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setLocalSettings({...localSettings, salaryMode: mode as 'Monthly' | 'Annual'})}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all",
                    localSettings.salaryMode === mode ? "bg-white shadow text-primary" : "text-zinc-500 hover:bg-zinc-200/50"
                  )}
                >
                  {mode === 'Monthly' ? '按月结算' : '按年结算'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-zinc-800 tracking-wide pl-1">工时制度</span>
              <span className="text-[12px] text-zinc-400 pl-1">影响加班定性和双休日天数计算</span>
            </div>
            <div className="bg-zinc-100 p-1 rounded-2xl flex gap-1">
              {['Double', 'Single', 'Big-Small'].map((type) => (
                <button
                  key={type}
                  onClick={() => setLocalSettings({...localSettings, scheduleType: type as any})}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all",
                    localSettings.scheduleType === type ? "bg-white shadow text-primary" : "text-zinc-500 hover:bg-zinc-200/50"
                  )}
                >
                  {type === 'Double' ? '双休制' : type === 'Single' ? '单休制' : '大小周'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
             <div className="flex justify-between px-1">
               <div className="flex flex-col gap-1">
                 <span className="text-[14px] font-bold text-zinc-800 tracking-wide flex items-center gap-2">
                    每日标准工时
                 </span>
                 <span className="text-[12px] text-zinc-400">用于计算精确的时薪和加班费</span>
               </div>
               <span className="text-lg font-black text-primary">{localSettings.dailyHours} 小时</span>
             </div>
             <div className="px-2 mt-2">
               <input 
                 type="range" 
                 min="4" max="12" step="0.5" 
                 value={localSettings.dailyHours}
                 onChange={(e) => setLocalSettings({...localSettings, dailyHours: parseFloat(e.target.value)})}
                 className="w-full h-1.5 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-primary"
               />
               <div className="flex justify-between mt-2">
                  <span className="text-[10px] font-bold text-zinc-400">4h</span>
                  <span className="text-[10px] font-bold text-zinc-400">8h</span>
                  <span className="text-[10px] font-bold text-zinc-400">12h</span>
               </div>
             </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="w-full h-14 bg-primary text-pure-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-primary/25"
        >
          保存配置
        </motion.button>
      </section>

      {/* Formula Modal */}
      {showFormula && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 p-4">
              <button onClick={() => setShowFormula(false)} className="p-2 bg-zinc-100 rounded-full text-zinc-500 hover:text-zinc-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <h3 className="text-lg font-black text-zinc-900 mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              时薪计算公式
            </h3>

            <div className="space-y-6">
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                <p className="font-mono text-sm font-bold text-zinc-800 text-center mb-2">时薪 = 月薪 ÷ 21.75 ÷ 日工时</p>
                <div className="h-px bg-zinc-200 my-4" />
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-zinc-500">基本月薪 (税前)</span>
                  <span className="font-bold font-mono">¥{localSettings.baseSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-zinc-500">月全勤计薪天数</span>
                  <span className="font-bold font-mono text-primary">21.75 天</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">每日标准工时</span>
                  <span className="font-bold font-mono">{localSettings.dailyHours} h</span>
                </div>
              </div>

              <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20">
                <p className="text-xs text-primary/80 font-medium leading-relaxed">
                  * 21.75天为国家规定的标准月计薪天数：<br/>
                  (365天 - 104天休息日) ÷ 12个月 ≈ 21.75天。该天数用于计算法定日工资及加班工资基数。
                </p>
              </div>
            </div>

            <button 
              onClick={() => setShowFormula(false)}
              className="w-full mt-6 py-3 bg-zinc-900 text-white rounded-xl font-bold text-sm hover:bg-zinc-800 transition-colors"
            >
              我知道了
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
