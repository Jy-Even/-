import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  TrendingUp, 
  Clock, 
  Target, 
  Zap, 
  ArrowUpRight,
  Info
} from 'lucide-react';
import { SalarySettings } from '../types';
import { cn, formatCurrency } from '../lib/utils';

interface RealtimeSalaryViewProps {
  settings: SalarySettings;
  accumulatedValue: number;
  perSecond: number;
  onClose: () => void;
}

export default function RealtimeSalaryView({ settings, accumulatedValue, perSecond, onClose }: RealtimeSalaryViewProps) {
  // Use parent's accumulated value as base, but update more frequently (100ms) for smoothness
  const [displayValue, setDisplayValue] = useState(accumulatedValue);
  
  useEffect(() => {
    const startValue = accumulatedValue;
    const startTime = Date.now();
    
    const timer = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = (now - startTime) / 1000;
      setDisplayValue(startValue + elapsedSeconds * perSecond);
    }, 50);

    return () => clearInterval(timer);
  }, [accumulatedValue, perSecond]);

  const dailyBase = settings.baseSalary / 21.75;
  
  // Estimate today's earnings (from 9:00 AM)
  const [todayEarnings, setTodayEarnings] = useState(0);
  useEffect(() => {
    const updateToday = () => {
      const now = new Date();
      const todayStart = new Date();
      todayStart.setHours(9, 0, 0, 0);
      
      if (now.getTime() < todayStart.getTime()) {
        setTodayEarnings(0);
        return;
      }
      
      const secondsSinceStart = (now.getTime() - todayStart.getTime()) / 1000;
      const effectiveSeconds = Math.min(secondsSinceStart, settings.dailyHours * 3600);
      setTodayEarnings(effectiveSeconds * perSecond);
    };
    
    updateToday();
    const timer = setInterval(updateToday, 1000);
    return () => clearInterval(timer);
  }, [perSecond, settings.dailyHours]);

  const progress = dailyBase > 0 ? (todayEarnings / dailyBase) * 100 : 0;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] mesh-bg flex flex-col overflow-hidden"
    >
      {/* Immersive Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-500/5 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 pt-12 pb-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em] mb-1">
            实时数据
          </span>
          <h2 className="text-xl font-black text-zinc-900 tracking-tight">
            实时产值
          </h2>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="w-10 h-10 glass-elevated rounded-full flex items-center justify-center text-zinc-500 shadow-lg"
        >
          <X className="w-5 h-5" />
        </motion.button>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-6">
        {/* Futuristic Dashboard Card */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md relative group mt-4 px-2"
        >
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-primary/5 blur-[120px] -z-10 rounded-full scale-150 animate-pulse" />
          
          <div className="glass-elevated rounded-[48px] p-10 flex flex-col items-center justify-center relative overflow-hidden border border-white/60 shadow-[0_32px_80px_rgba(0,0,0,0.08)]">
            {/* Minimal Progress Gauge */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 p-8 opacity-20">
              <circle 
                cx="50%" cy="50%" r="46%" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1"
                className="text-zinc-200"
              />
              <motion.circle 
                cx="50%" cy="50%" r="46%" 
                fill="none" 
                stroke="var(--color-primary)" 
                strokeWidth="3"
                strokeDasharray="100 100"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progress / 100 }}
                transition={{ duration: 2, ease: "circOut" }}
                strokeLinecap="round"
              />
            </svg>

            {/* Top Indicator */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-10 px-4 py-1.5 rounded-full bg-linear-to-r from-primary/10 to-transparent border border-primary/10 backdrop-blur-md"
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute w-2 h-2 rounded-full bg-primary animate-ping" />
                <div className="relative w-2 h-2 rounded-full bg-primary" />
              </div>
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">实时计薪中</span>
            </motion.div>

            {/* Main Salary Readout */}
            <div className="relative mb-10 text-center">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl font-black text-primary/30">¥</span>
                <motion.span 
                  key={Math.floor(displayValue)}
                  initial={{ opacity: 0.5, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-8xl font-black tracking-tighter text-zinc-900 tabular-nums"
                >
                  {Math.floor(displayValue).toLocaleString('zh-CN')}
                </motion.span>
                <motion.span 
                  className="text-4xl font-black text-primary/60 tabular-nums"
                >
                  .{(displayValue % 1).toFixed(2).split('.')[1]}
                </motion.span>
              </div>
              
              <div className="mt-2 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                本月累计预估收益
              </div>

              {/* Particle Sparks */}
              <AnimatePresence>
                {[...Array(2)].map((_, i) => (
                  <motion.div 
                    key={`spark-${Math.floor(displayValue * 10)}-${i}`}
                    initial={{ opacity: 1, scale: 0, y: 0, x: 0 }}
                    animate={{ opacity: 0, scale: 1.5, y: -60, x: (i - 0.5) * 80 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute top-1/2 left-1/2 w-1 h-1 bg-primary/40 rounded-full blur-[1px]"
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Progress Label */}
            <div className="w-full flex justify-between items-center px-4">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">当日任务进度</span>
                <span className="text-xl font-black text-zinc-800">{progress.toFixed(1)}%</span>
              </div>
              <div className="h-10 w-[1px] bg-zinc-100" />
              <div className="flex flex-col text-right">
                <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">当日目标预估</span>
                <span className="text-xl font-black text-primary">¥{dailyBase.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-md mt-6">
          <StatCard 
            icon={<Zap className="w-4 h-4 text-primary" />}
            label="今日已赚"
            value={`¥${todayEarnings.toFixed(2)}`}
            delay={0.4}
            trending={true}
          />
          <StatCard 
            icon={<TrendingUp className="w-4 h-4 text-blue-500" />}
            label="实时流速"
            value={`¥${(perSecond * 3600).toFixed(2)}/h`}
            delay={0.5}
          />
          <StatCard 
            icon={<Target className="w-4 h-4 text-orange-500" />}
            label="今日偏差"
            value={`¥${(todayEarnings - dailyBase).toFixed(2)}`}
            delay={0.6}
            variant={todayEarnings >= dailyBase ? 'success' : 'neutral'}
          />
          <StatCard 
            icon={<Info className="w-4 h-4 text-zinc-400" />}
            label="下班剩余"
            value={`¥${Math.max(0, dailyBase - todayEarnings).toFixed(2)}`}
            delay={0.7}
          />
        </div>
      </main>


    </motion.div>
  );
}

function StatCard({ 
  icon, 
  label, 
  value, 
  delay, 
  trending = false,
  variant = 'neutral'
}: { 
  icon: React.ReactNode, 
  label: string, 
  value: string, 
  delay: number,
  trending?: boolean,
  variant?: 'success' | 'neutral'
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="glass rounded-[28px] p-5 border border-white/40 shadow-sm relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-primary/10 transition-colors" />
      
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2.5 rounded-[14px] bg-white shadow-xs">
          {icon}
        </div>
        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{label}</span>
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className={cn(
          "text-[19px] font-black tracking-tight tabular-nums",
          variant === 'success' ? 'text-green-500' : 'text-zinc-900'
        )}>
          {value}
        </span>
        {trending && (
          <motion.div 
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-green-500"
          />
        )}
      </div>
    </motion.div>
  );
}
