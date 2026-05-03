import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  RefreshCcw, 
  CircleCheck, 
  Clock, 
  CalendarOff, 
  Briefcase,
  Save,
  CheckCircle2
} from 'lucide-react';
import { SalarySettings, SalaryRecord } from '../types';
import { cn, formatCurrency } from '../lib/utils';

interface CalculatorViewProps {
  settings: SalarySettings;
  setSettings: (settings: SalarySettings) => void;
  onSave: (record: SalaryRecord) => void;
}

export default function CalculatorView({ settings, setSettings, onSave }: CalculatorViewProps) {
  const [activeMode, setActiveMode] = useState<'Monthly' | 'Annual'>(settings.salaryMode);
  const [activeSchedule, setActiveSchedule] = useState(settings.scheduleType);
  const [hours, setHours] = useState(settings.dailyHours);
  const [baseSalary, setBaseSalary] = useState(settings.baseSalary);
  const [isEditingSalary, setIsEditingSalary] = useState(false);

  const [showOvertimeForm, setShowOvertimeForm] = useState(false);
  const [overtimeStart, setOvertimeStart] = useState('18:00');
  const [overtimeEnd, setOvertimeEnd] = useState('21:00');
  const [overtimeType, setOvertimeType] = useState<'Workday' | 'Weekend' | 'Holiday'>('Workday');

  const dailyPay = baseSalary / 21.75;
  const hourlyPay = dailyPay / hours;
  const socialSecurity = baseSalary * 0.225;
  const netSalary = baseSalary - socialSecurity;

  const startDate = new Date(`2000-01-01T${overtimeStart}`);
  const endDate = new Date(`2000-01-01T${overtimeEnd}`);
  let duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
  if (duration < 0) duration += 24; // next day
  if (duration < 0 || isNaN(duration)) duration = 0;

  const multiplier = overtimeType === 'Workday' ? 1.5 : overtimeType === 'Weekend' ? 2 : 3;
  const overtimePay = hourlyPay * duration * multiplier;

  const handleSaveOvertime = () => {
    onSave({
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      type: 'Overtime',
      subtype: overtimeType,
      duration: duration,
      estimatedPay: overtimePay
    });
    setShowOvertimeForm(false);
  };

  const handleSave = () => {
    onSave({
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      type: 'Overtime',
      subtype: 'Workday',
      duration: 8,
      estimatedPay: dailyPay
    });
    alert('已成功保存至本月明细！');
  };

  return (
    <div className="flex flex-col gap-8 px-5 pb-96">
      {/* Salary Settings Section */}
      <section className="flex flex-col gap-3">
        <h2 className="text-[14px] font-bold text-zinc-400 uppercase tracking-widest pl-2">
          薪资设置
        </h2>
        <div className="glass rounded-[32px] p-6 flex flex-col gap-6 shadow-xl">
          <div className="flex flex-col items-center justify-center py-5 bg-zinc-50/50 rounded-[28px] border border-zinc-100">
            <span className="text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wide">基本薪资</span>
            <div className="flex items-baseline gap-1 cursor-pointer" onClick={() => setIsEditingSalary(true)}>
              <span className="text-2xl font-bold text-zinc-400">¥</span>
              {isEditingSalary ? (
                <input
                  autoFocus
                  type="number"
                  value={baseSalary}
                  onChange={(e) => setBaseSalary(Number(e.target.value))}
                  onBlur={() => {
                    setIsEditingSalary(false);
                    setSettings({ ...settings, baseSalary });
                  }}
                  className="text-4xl font-black tracking-tight text-zinc-900 tabular-nums w-48 bg-transparent border-none focus:ring-0 p-0 text-center"
                />
              ) : (
                <span className="text-5xl font-black tracking-tight text-zinc-900 tabular-nums">
                  {baseSalary.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          
          <div className="bg-zinc-100 p-1 rounded-2xl flex gap-1 inner-shadow">
            <ToggleOption 
              active={activeMode === 'Monthly'} 
              onClick={() => {
                setActiveMode('Monthly');
                setSettings({ ...settings, salaryMode: 'Monthly' });
              }} 
              label="月薪" 
            />
            <ToggleOption 
              active={activeMode === 'Annual'} 
              onClick={() => {
                setActiveMode('Annual');
                setSettings({ ...settings, salaryMode: 'Annual' });
              }} 
              label="年薪" 
            />
          </div>
        </div>
      </section>

      {/* Work System Section */}
      <section className="flex flex-col gap-3">
        <h2 className="text-[14px] font-bold text-zinc-400 uppercase tracking-widest pl-2">
          工时制度
        </h2>
        <div className="glass rounded-[32px] p-6 flex flex-col gap-6 shadow-xl">
          <div className="flex flex-col gap-3">
            <span className="text-sm font-bold text-zinc-500 pl-1 uppercase tracking-wide">排班类型</span>
            <div className="bg-zinc-100 p-1 rounded-2xl flex gap-1 inner-shadow">
              <ToggleOption active={activeSchedule === 'Double'} onClick={() => {
                setActiveSchedule('Double');
                setSettings({ ...settings, scheduleType: 'Double' });
              }} label="双休" />
              <ToggleOption active={activeSchedule === 'Single'} onClick={() => {
                setActiveSchedule('Single');
                setSettings({ ...settings, scheduleType: 'Single' });
              }} label="单休" />
              <ToggleOption active={activeSchedule === 'Big-Small'} onClick={() => {
                setActiveSchedule('Big-Small');
                setSettings({ ...settings, scheduleType: 'Big-Small' });
              }} label="大小周" />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-end px-1">
              <span className="text-sm font-bold text-zinc-500 uppercase tracking-wide">每日工时</span>
              <span className="text-2xl font-black font-mono text-primary">{hours.toFixed(1)}<span className="text-sm font-bold ml-1">小时</span></span>
            </div>
            <div className="px-2">
              <input 
                type="range" 
                min="4" 
                max="12" 
                step="0.5" 
                value={hours}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setHours(val);
                  setSettings({ ...settings, dailyHours: val });
                }}
              />
              <div className="flex justify-between mt-3 px-1">
                {[4, 6, 8, 10, 12].map(h => (
                  <span key={h} className="text-[10px] font-bold text-zinc-300">{h}h</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Attendance Picker */}
      <section className="flex flex-col gap-3">
        <h2 className="text-[14px] font-bold text-zinc-400 uppercase tracking-widest pl-2">
          考勤记录
        </h2>
        <div className="glass rounded-[32px] p-6 shadow-xl">
          <div className="grid grid-cols-2 gap-3">
            <AttendanceButton icon={<CheckCircle2 strokeWidth={2.5} className="w-8 h-8 text-green-500" />} label="正常出勤" />
            <AttendanceButton icon={<Clock strokeWidth={2.5} className="w-8 h-8 text-orange-500" />} label="迟到/早退" />
            <AttendanceButton icon={<CalendarOff strokeWidth={2.5} className="w-8 h-8 text-red-500" />} label="请假/缺勤" />
            <AttendanceButton icon={<Briefcase strokeWidth={2.5} className="w-8 h-8 text-primary" />} label="加班申请" onClick={() => setShowOvertimeForm(true)} />
          </div>
        </div>
      </section>

      {/* Bottom Floating Result Panel */}
      <div className="fixed bottom-24 left-0 w-full px-5 z-40 pointer-events-none">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-lg mx-auto glass-elevated rounded-[32px] shadow-2xl overflow-hidden pointer-events-auto border-t border-white"
        >
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <ResultItem label="日均" value={`¥${dailyPay.toFixed(2)}`} />
              <ResultItem label="时薪" value={`¥${hourlyPay.toFixed(2)}`} />
              <ResultItem label="五险一金" value={`-¥${socialSecurity.toFixed(0)}`} color="text-red-500" />
            </div>

            <div className="flex flex-col items-center justify-center py-2 mb-4">
              <span className="text-[12px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">预计税后收入</span>
              <span className="text-4xl font-black tracking-tighter text-gradient leading-none tabular-nums mt-1">
                {formatCurrency(netSalary)}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: 'var(--color-primary-light)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="w-full h-14 bg-primary text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-3 shadow-xl shadow-primary/25 transition-all"
            >
              保存至本月
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Overtime Modal */}
      <AnimatePresence>
        {showOvertimeForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-900/40 backdrop-blur-sm sm:items-center p-4 pb-24"
            onClick={() => setShowOvertimeForm(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white rounded-[32px] p-6 shadow-2xl flex flex-col gap-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-zinc-900">加班记录</h3>
                <button onClick={() => setShowOvertimeForm(false)} className="p-2 bg-zinc-100 rounded-full text-zinc-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-zinc-500">加班类型</label>
                  <div className="bg-zinc-100 p-1 rounded-2xl flex gap-1 inner-shadow">
                    <ToggleOption active={overtimeType === 'Workday'} onClick={() => setOvertimeType('Workday')} label="工作日" />
                    <ToggleOption active={overtimeType === 'Weekend'} onClick={() => setOvertimeType('Weekend')} label="周末" />
                    <ToggleOption active={overtimeType === 'Holiday'} onClick={() => setOvertimeType('Holiday')} label="节假日" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-zinc-500">开始时间</label>
                    <input 
                      type="time" 
                      value={overtimeStart} 
                      onChange={(e) => setOvertimeStart(e.target.value)}
                      className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-lg font-mono w-full focus:outline-none focus:ring-2 focus:ring-primary/50" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-zinc-500">结束时间</label>
                    <input 
                      type="time" 
                      value={overtimeEnd} 
                      onChange={(e) => setOvertimeEnd(e.target.value)}
                      className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-lg font-mono w-full focus:outline-none focus:ring-2 focus:ring-primary/50" 
                    />
                  </div>
                </div>

                <div className="bg-primary/5 rounded-2xl p-4 flex justify-between items-center mt-2 border border-primary/10">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-primary/70 mb-1">预计加班时长</span>
                    <span className="text-lg font-black text-primary">{duration.toFixed(1)} <span className="text-sm">小时</span></span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-bold text-primary/70 mb-1">预估加班费</span>
                    <span className="text-2xl font-black text-primary tabular-nums">+{formatCurrency(overtimePay)}</span>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveOvertime}
                  className="w-full h-14 bg-zinc-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center mt-2 shadow-xl shadow-zinc-900/20"
                >
                  保存记录
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


function ToggleOption({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300",
        active 
          ? "bg-white text-zinc-900 shadow-lg shadow-black/5" 
          : "text-zinc-500 hover:text-zinc-700"
      )}
    >
      {label}
    </button>
  );
}

function AttendanceButton({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="bg-white/40 border border-zinc-200/30 rounded-3xl p-5 flex flex-col items-center gap-3 hover:bg-white/80 transition-colors"
    >
      {icon}
      <span className="text-sm font-semibold text-zinc-900">{label}</span>
    </motion.button>
  );
}

function ResultItem({ label, value, color }: { label: string, value: string, color?: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="text-[11px] font-medium text-zinc-400 mb-1">{label}</span>
      <span className={cn("text-[15px] font-bold font-mono", color || "text-zinc-900")}>
        {value}
      </span>
    </div>
  );
}
