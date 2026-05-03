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

export default function HomeView({ settings, accumulated, perSecond, onAction }: HomeViewProps) {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={CONTAINER_VARIANTS}
      className="flex flex-col gap-6 px-5"
    >
      {/* Main Dashboard Card - Redesigned with Glassmorphism */}
      <motion.section 
        variants={ITEM_VARIANTS}
        whileHover={{ scale: 1.01, translateY: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onAction?.('realtimeSalary')}
        className="relative group cursor-pointer"
      >
        {/* Animated Glow Background Layers */}
        <div className="absolute -inset-4 bg-linear-to-r from-primary/10 via-transparent to-primary/5 blur-3xl opacity-50 group-hover:opacity-80 transition-opacity -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-radial from-primary/10 to-transparent blur-[120px] -z-10 animate-pulse" />

        <div className="glass-elevated rounded-[40px] p-10 flex flex-col items-center text-center relative overflow-hidden border border-white/60 shadow-[0_48px_100px_rgba(0,0,0,0.1)]">
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, var(--color-primary) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          
          <div className="relative z-10 flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/40 border border-white/60 backdrop-blur-md shadow-xs"
            >
              <div className="relative">
                <div className="absolute w-2 h-2 rounded-full bg-primary animate-ping" />
                <div className="relative w-2 h-2 rounded-full bg-primary" />
              </div>
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">实时累计工资</span>
            </motion.div>

            <div className="flex items-baseline mb-4 relative">
              <span className="text-3xl font-black mr-2 text-primary/30">¥</span>
              <div className="flex items-baseline">
                <motion.span 
                  key={Math.floor(accumulated)}
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-7xl font-black tracking-tighter text-zinc-900 tabular-nums drop-shadow-sm"
                >
                  {Math.floor(accumulated).toLocaleString('zh-CN')}
                </motion.span>
                <span className="text-3xl font-black text-primary/60 tabular-nums">
                  .{(accumulated % 1).toFixed(2).split('.')[1]}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6 mb-8">
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">今日收益</span>
                <span className="text-base font-black text-green-500 tracking-tight flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  ¥456.78
                </span>
              </div>
              <div className="w-[1px] h-6 bg-zinc-200" />
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">预估时薪</span>
                <span className="text-base font-black text-zinc-800 tracking-tight">¥{(perSecond * 3600).toFixed(1)}</span>
              </div>
            </div>
            
            <div className="inline-flex items-center gap-3 bg-zinc-900 px-6 py-3 rounded-full border border-zinc-800 shadow-lg shadow-zinc-200 transition-transform group-hover:scale-105 active:scale-95 overflow-hidden relative">
              {/* Scanline reflection animation */}
              <motion.div 
                animate={{ x: ['100%', '-100%'] }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -skew-x-20 pointer-events-none"
              />
              <span className="text-[11px] font-mono font-black text-white tracking-widest flex items-center gap-2">
                <span className="text-primary tracking-normal font-sans">收益速率:</span> 
                ¥{perSecond.toFixed(4)} <span className="text-zinc-500 font-normal">/ 秒</span>
              </span>
            </div>
          </div>

          {/* Decorative Corner Radii */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-primary/10 to-transparent blur-2xl -mr-12 -mt-12" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-linear-to-tl from-primary/10 to-transparent blur-2xl -ml-12 -mb-12" />
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
        className="glass-elevated rounded-[40px] p-8 shadow-2xl overflow-hidden relative group border border-white/60"
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
            className="w-10 h-10 rounded-full bg-white border border-zinc-100 flex items-center justify-center cursor-pointer shadow-sm group-hover:bg-primary group-hover:border-primary transition-all duration-300"
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

        <div className="grid grid-cols-3 divide-x divide-zinc-100 py-4 bg-white/40 backdrop-blur-sm rounded-[28px] border border-white shadow-sm relative z-10">
          <OverviewItem label="预估月薪" value={formatCurrency(settings.baseSalary).split('.')[0]} />
          <OverviewItem label="五险一金" value={formatCurrency(settings.baseSalary * 0.225).split('.')[0]} color="text-zinc-400" />
          <OverviewItem label="预估实发" value={formatCurrency(settings.baseSalary * 0.775).split('.')[0]} color="text-primary" />
        </div>
      </motion.section>
    </motion.div>
  );
}

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
