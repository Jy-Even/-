import React from 'react';
import { motion } from 'motion/react';
import { 
  PlusCircle, 
  Clock, 
  Receipt, 
  Gift, 
  TrendingUp, 
  MinusCircle,
  ArrowUpRight
} from 'lucide-react';
import { SalarySettings, ViewType } from '../types';
import { cn, formatCurrency } from '../lib/utils';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, Cell } from 'recharts';

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
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

interface HomeViewProps {
  settings: SalarySettings;
  accumulated: number;
  perSecond: number;
  onAction?: (view: ViewType) => void;
}

const CHART_DATA = [
  { name: '周一', value: 40, color: 'rgba(0, 122, 255, 0.2)' },
  { name: '周二', value: 60, color: 'rgba(0, 122, 255, 0.4)' },
  { name: '周三', value: 50, color: 'rgba(0, 122, 255, 0.6)' },
  { name: '周四', value: 80, color: 'rgba(0, 122, 255, 0.8)', peak: true },
  { name: '周五', value: 100, color: 'rgba(0, 122, 255, 1.0)', active: true },
  { name: '周六', value: 20, color: 'rgba(118, 118, 128, 0.12)' },
  { name: '周日', value: 10, color: 'rgba(118, 118, 128, 0.12)' },
];

export default React.memo(function HomeView({ settings, accumulated, perSecond, onAction }: HomeViewProps) {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={CONTAINER_VARIANTS}
      className="flex flex-col gap-6 px-5"
    >
      {/* Main Dashboard Card - Redesigned with Enhanced Glassmorphism */}
      <motion.section 
        variants={ITEM_VARIANTS}
        whileHover={{ scale: 1.01, translateY: -2 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => onAction?.('realtimeSalary')}
        className="relative group cursor-pointer"
      >
        {/* Animated Mesh Gradient Background Layers */}
        <div className="absolute -inset-6 bg-radial from-primary/15 via-transparent to-transparent blur-[100px] opacity-40 group-hover:opacity-70 transition-opacity duration-1000 -z-10 animate-pulse" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32 -z-20 animate-slow-float" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -ml-32 -mb-32 -z-20 animate-slow-float-delayed" />

        <div className="glass-elevated rounded-[48px] p-8 sm:p-10 flex flex-col items-center text-center relative overflow-hidden shadow-[0_48px_100px_rgba(0,0,0,0.08)] border border-white/40">
          {/* Noise/Grain Texture Layer */}
          <div className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
          
          {/* Subtle Grid Accent */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, var(--color-primary) 0.8px, transparent 0.8px)', backgroundSize: '24px 24px' }} />
          
          <div className="relative z-10 flex flex-col items-center w-full">
            {/* Status Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 mb-8 px-4 py-2 rounded-full glass border border-zinc-200/20 shadow-xs backdrop-blur-2xl"
            >
              <div className="relative flex">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </div>
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] leading-none">实时计薪中</span>
            </motion.div>

            {/* Main Salary Display */}
            <div className="flex flex-col items-center mb-10 w-full">
              <div className="flex items-baseline relative">
                <span className="text-3xl font-black mr-2 text-zinc-300 drop-shadow-sm">¥</span>
                <div className="flex items-baseline">
                  <motion.span 
                    key={Math.floor(accumulated)}
                    initial={{ y: 8, opacity: 0, filter: 'blur(4px)' }}
                    animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                    className="text-7xl sm:text-8xl font-black tracking-tighter text-zinc-900 tabular-nums"
                  >
                    {Math.floor(accumulated).toLocaleString('zh-CN')}
                  </motion.span>
                  <span className="text-4xl font-black text-primary/60 tabular-nums ml-1">
                    .{(accumulated % 1).toFixed(2).split('.')[1]}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-zinc-400 mt-2 tracking-wide">本月累计预估收益</span>
            </div>

            {/* Metrics Dashboard Row */}
            <div className="w-full grid grid-cols-2 gap-4 mb-10">
              <div className="flex flex-col items-center p-4 rounded-3xl glass-elevated border border-white/20">
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">今日已赚</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-lg font-black text-emerald-600 tracking-tight tabular-nums">456.78</span>
                </div>
              </div>
              <div className="flex flex-col items-center p-4 rounded-3xl glass-elevated border border-white/20">
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">预估时薪</span>
                <span className="text-lg font-black text-zinc-800 tracking-tight tabular-nums">¥{(perSecond * 3600).toFixed(1)}</span>
              </div>
            </div>
            
            {/* Live Rate Module - Theme-Aware & Dynamic */}
            <div className="w-full relative px-6 py-5 rounded-[32px] glass-elevated border border-white/20 shadow-inner group/rate">
              {/* Dynamic Glow Effect */}
              <div className="absolute inset-0 bg-radial from-primary/5 to-transparent opacity-40 -z-10" />
              
              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-zinc-100 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex flex-col items-start leading-none gap-1.5">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">盈利速率</span>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-emerald-600/80">实时计算中</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-mono font-black text-zinc-900 tabular-nums">
                      ¥{perSecond.toFixed(4)}
                    </span>
                    <span className="text-[10px] font-black text-primary uppercase tracking-tighter">/ 秒</span>
                  </div>
                  <span className="text-[9px] font-bold text-zinc-400 italic">
                    ≈ ¥{(perSecond * 3600).toFixed(2)} / 小时
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Corner Geometry */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-primary/20 to-transparent rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none opacity-50" />
        </div>
      </motion.section>

      {/* Quick Actions */}
      <motion.section 
        variants={ITEM_VARIANTS}
        className="grid grid-cols-4 gap-4"
      >
        <ActionButton 
          icon={<PlusCircle className="text-primary" />} 
          label="加班" 
          color="bg-primary/10" 
          onClick={() => onAction?.('calculator')}
        />
        <ActionButton 
          icon={<Clock className="text-orange-500" />} 
          label="请假" 
          color="bg-orange-500/10" 
          onClick={() => onAction?.('calculator')}
        />
        <ActionButton 
          icon={<Receipt className="text-green-600" />} 
          label="工资" 
          color="bg-green-600/10" 
          onClick={() => onAction?.('history')}
        />
        <ActionButton 
          icon={<Gift className="text-purple-500" />} 
          label="奖金" 
          color="bg-purple-500/10" 
          onClick={() => {}}
        />
      </motion.section>

      {/* Monthly Overview Card */}
      <motion.section 
        variants={ITEM_VARIANTS}
        className="glass-elevated rounded-[40px] p-8 shadow-2xl overflow-hidden relative group"
        onClick={() => onAction?.('history')}
      >
        {/* Subtle Background Glow for the Card */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 blur-3xl -ml-16 -mb-16 pointer-events-none" />

        <div className="flex justify-between items-center mb-8 relative z-10">
          <div className="flex flex-col">
            <h3 className="text-xl font-black tracking-tighter text-zinc-900 leading-none mb-1">月度趋势</h3>
            <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em]">最近 7 日收益波势</span>
          </div>
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 45 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center cursor-pointer shadow-sm group-hover:bg-primary group-hover:border-primary transition-all duration-300"
          >
            <ArrowUpRight className="text-zinc-400 group-hover:text-white w-5 h-5 transition-colors" />
          </motion.div>
        </div>

        <div className="h-32 mb-8 -mx-4 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={CHART_DATA} 
              margin={{ top: 0, right: 15, left: 15, bottom: 20 }}
              accessibilityLayer={false}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={1} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#A1A1AA', fontWeight: 600 }}
                dy={10}
              />
              <Tooltip 
                cursor={false}
                content={() => null}
              />
              <Bar 
                dataKey="value" 
                radius={[6, 6, 6, 6]} 
                barSize={18}
                activeBar={false}
                isAnimationActive={true}
              >
                {CHART_DATA.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.active ? 'url(#barGradient)' : entry.color}
                    style={{ outline: 'none' }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 divide-x divide-zinc-200/50 py-4 glass rounded-[28px] shadow-sm relative z-10">
          <OverviewItem label="预估月薪" value={formatCurrency(settings.baseSalary).split('.')[0]} />
          <OverviewItem label="五险一金" value={formatCurrency(settings.baseSalary * 0.225).split('.')[0]} color="text-zinc-400" />
          <OverviewItem label="预估实发" value={formatCurrency(settings.baseSalary * 0.775).split('.')[0]} color="text-primary" />
        </div>
      </motion.section>
    </motion.div>
  );
});

function ActionButton({ icon, label, color, onClick }: { icon: React.ReactNode, label: string, color: string, onClick?: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="glass rounded-3xl p-4 flex flex-col items-center justify-center gap-2.5 active:bg-zinc-50 transition-all shadow-sm hover:shadow-md"
    >
      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center transition-transform", color)}>
        {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
      </div>
      <span className="text-[11px] font-bold text-center leading-snug text-zinc-600">{label}</span>
    </motion.button>
  );
}


function OverviewItem({ label, value, color }: { label: string, value: string, color?: string }) {
  return (
    <div className="flex flex-col items-center px-2">
      <span className="text-[11px] font-medium text-zinc-500 mb-1">{label}</span>
      <span className={cn("text-lg font-bold font-mono", color || "text-zinc-900")}>
        {value}
      </span>
    </div>
  );
}
