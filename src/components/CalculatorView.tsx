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

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

export default function CalculatorView({ settings, setSettings, onSave }: CalculatorViewProps) {
  const [activeMode, setActiveMode] = useState<'Monthly' | 'Annual'>(settings.salaryMode);
  const [activeSchedule, setActiveSchedule] = useState(settings.scheduleType);
  const [hours, setHours] = useState(settings.dailyHours);
  const [baseSalary, setBaseSalary] = useState(settings.baseSalary);
  const [isEditingSalary, setIsEditingSalary] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [showOvertimeForm, setShowOvertimeForm] = useState(false);
  const [overtimeStart, setOvertimeStart] = useState('18:00');
  const [overtimeEnd, setOvertimeEnd] = useState('21:00');
  const [overtimeType, setOvertimeType] = useState<'Workday' | 'Weekend' | 'Holiday'>('Workday');

  const dailyPay = baseSalary / 21.75;
  const hourlyPay = hours > 0 ? dailyPay / hours : 0;
  const socialSecurity = baseSalary * 0.225;
  const netSalary = Math.max(0, baseSalary - socialSecurity);

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
    triggerToast();
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSave = () => {
    if (baseSalary <= 0) return;
    onSave({
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      type: 'Overtime',
      subtype: 'Workday',
      duration: 8,
      estimatedPay: dailyPay
    });
    triggerToast();
  };

  const handleSalaryChange = (val: string) => {
    const num = parseFloat(val);
    if (val === '') {
      setBaseSalary(0);
    } else if (!isNaN(num)) {
      setBaseSalary(Math.max(0, num));
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={CONTAINER_VARIANTS}
      className="flex flex-col gap-8 px-5 pb-96"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-32 left-1/2 bg-zinc-800 text-pure-white px-6 py-3 rounded-full shadow-2xl z-[60] font-medium text-sm whitespace-nowrap flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            已成功保存至本月明细
          </motion.div>
        )}
      </AnimatePresence>

      {/* Salary Settings Section */}
      <motion.section variants={ITEM_VARIANTS} className="flex flex-col gap-3">
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
                  value={baseSalary === 0 ? '' : baseSalary}
                  onChange={(e) => handleSalaryChange(e.target.value)}
                  onBlur={() => {
                    setIsEditingSalary(false);
                    setSettings({ ...settings, baseSalary });
                  }}
                  className="text-4xl font-black tracking-tight text-zinc-900 tabular-nums w-48 bg-transparent border-none focus:ring-0 p-0 text-center"
                  placeholder="0"
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
      </motion.section>

      {/* Work System Section */}
      <motion.section variants={ITEM_VARIANTS} className="flex flex-col gap-3">
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
      </motion.section>

      {/* Attendance Picker */}
      <motion.section variants={ITEM_VARIANTS} className="flex flex-col gap-3">
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
      </motion.section>

      {/* Bottom Floating Result Panel */}
      <div className="fixed bottom-24 left-0 w-full px-5 z-40 pointer-events-none">
        <motion.div 
          initial={{ y: 80, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ 
            type: "spring",
            damping: 20,
            stiffness: 120,
            delay: 0.05
          }}
          className="max-w-lg mx-auto relative group pointer-events-auto"
        >
          {/* Subtle Glow Effect Behind */}
          <div className="absolute -inset-1 bg-linear-to-r from-primary/10 via-primary/5 to-primary/10 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
          
          <div className="relative glass-elevated rounded-[36px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-white/50 dark:border-white/10">
            <div className="p-6">
              {/* Top Summary Stats */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.08,
                      delayChildren: 0.2
                    }
                  }
                }}
                className="flex items-center justify-between px-2 mb-6"
              >
                <ResultItem label="日均收入" value={`¥${dailyPay.toFixed(2)}`} />
                <div className="w-[1px] h-6 bg-zinc-200/50 dark:bg-white/10" />
                <ResultItem label="每小时薪" value={`¥${hourlyPay.toFixed(2)}`} />
                <div className="w-[1px] h-6 bg-zinc-200/50 dark:bg-white/10" />
                <ResultItem label="扣除五险" value={`¥${socialSecurity.toFixed(0)}`} color="text-red-500" />
              </motion.div>

              {/* Central Result Display */}
              <div className="relative flex flex-col items-center justify-center py-3 mb-5">
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.25em] mb-2"
                >
                  预计税后净收入 (月)
                </motion.span>
                
                <div className="relative">
                  <AnimatePresence mode="wait">
                    <motion.span 
                      key={netSalary}
                      initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
                      transition={{ duration: 0.3, ease: "circOut" }}
                      className="text-5xl font-black tracking-tighter tabular-nums text-zinc-900 flex items-baseline gap-1"
                    >
                      <span className="text-2xl font-bold text-primary mr-0.5">¥</span>
                      {netSalary.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                    </motion.span>
                  </AnimatePresence>
                  
                  {/* Decorative indicator */}
                  <motion.div 
                    layoutId="active-nav-glow"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary/20 rounded-full blur-xs"
                  />
                </div>
              </div>

              {/* Action Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.01, backgroundColor: 'var(--color-primary-light)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="w-full h-15 bg-primary text-pure-white rounded-[24px] font-bold text-base flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(0,122,255,0.3)] transition-all relative overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                <Save className="w-5 h-5" />
                保存至本月记录
              </motion.button>
            </div>
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
    </motion.div>
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
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
      }}
      className="flex flex-col items-center text-center"
    >
      <span className="text-[11px] font-medium text-zinc-400 mb-1">{label}</span>
      <span className={cn("text-[15px] font-bold font-mono", color || "text-zinc-900")}>
        {value}
      </span>
    </motion.div>
  );
}
