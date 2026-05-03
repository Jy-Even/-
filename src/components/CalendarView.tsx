import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  Briefcase
} from 'lucide-react';
import { cn } from '../lib/utils';

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1 } 
  }
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(new Date().getDate());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const days = daysInMonth(year, month);
  const firstDay = firstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

  const calendarDays = [];
  // Adjusted for Monday start if needed, but let's stick to Sunday for simplicity first or use standard 0-6
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-12" />);
  }

  for (let d = 1; d <= days; d++) {
    const isToday = d === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
    const isSelected = d === selectedDate;
    
    calendarDays.push(
      <motion.button
        key={d}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setSelectedDate(d)}
        className={cn(
          "h-12 w-full rounded-2xl flex items-center justify-center text-sm font-bold transition-all relative",
          isSelected ? "bg-primary text-pure-white shadow-lg shadow-primary/30" : "text-zinc-600 hover:bg-zinc-100",
          isToday && !isSelected && "text-primary border border-primary/20 bg-primary/5"
        )}
      >
        {d}
        {(d === 15 || d === 20) && !isSelected && (
          <div className="absolute bottom-1 w-1 h-1 bg-primary rounded-full" />
        )}
      </motion.button>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={CONTAINER_VARIANTS}
      className="flex flex-col gap-6 px-5 pb-32"
    >
      {/* Calendar Header */}
      <motion.section variants={ITEM_VARIANTS} className="glass rounded-[32px] p-6 shadow-xl space-y-6">
        <div className="flex justify-between items-center px-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{year}年</span>
            <h3 className="text-2xl font-black text-zinc-900">{monthNames[month]}</h3>
          </div>
          <div className="flex gap-2">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={prevMonth}
              className="p-2.5 rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={nextMonth}
              className="p-2.5 rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {["日", "一", "二", "三", "四", "五", "六"].map(d => (
            <div key={d} className="h-10 flex items-center justify-center text-[11px] font-black text-zinc-400 uppercase tracking-widest">
              {d}
            </div>
          ))}
          {calendarDays}
        </div>
      </motion.section>

      {/* Selected Day Details */}
      <motion.section variants={ITEM_VARIANTS} className="space-y-4">
        <h2 className="text-[14px] font-bold text-zinc-400 uppercase tracking-[0.2em] pl-2">
          当日详情 - {selectedDate}日
        </h2>
        
        <div className="space-y-3">
          <div className="glass rounded-3xl p-5 flex items-center gap-4 border border-white shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600">
              <Clock className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">打卡时间</p>
              <p className="text-lg font-black text-zinc-800">09:00 - 18:32</p>
            </div>
            <div className="bg-green-500/10 px-3 py-1 rounded-full">
              <span className="text-[10px] font-bold text-green-600">正常出勤</span>
            </div>
          </div>

          <div className="glass rounded-3xl p-5 flex items-center gap-4 border border-white shadow-sm opacity-60">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">加班记录</p>
              <p className="text-lg font-black text-zinc-800">无记录</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stats Summary */}
      <motion.section variants={ITEM_VARIANTS} className="grid grid-cols-2 gap-4">
        <div className="glass rounded-3xl p-4 border border-white shadow-sm flex flex-col items-center">
          <span className="text-2xl font-black text-primary mb-1">21</span>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">本月应出勤</span>
        </div>
        <div className="glass rounded-3xl p-4 border border-white shadow-sm flex flex-col items-center">
          <span className="text-2xl font-black text-orange-500 mb-1">18</span>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">本月已出勤</span>
        </div>
      </motion.section>
    </motion.div>
  );
}
