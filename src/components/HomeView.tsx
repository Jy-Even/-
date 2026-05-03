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
      className="flex flex-col gap-10 px-5"
    >
      {/* Main Dashboard Card */}
      <motion.section 
        variants={ITEM_VARIANTS}
        className="glass rounded-[32px] p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -ml-16 -mb-16"></div>

        <h2 className="text-[12px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4">
          实时累计工资
        </h2>
        <div className="flex items-baseline mb-3">
          <span className="text-3xl font-bold mr-2 text-primary opacity-80">¥</span>
          <span className="text-5xl leading-tight font-extrabold tracking-tighter tabular-nums">
            {accumulated.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="text-primary font-bold text-sm mb-6 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          今日已赚: ¥456.78
        </div>
        
        <div className="inline-flex items-center gap-2.5 bg-zinc-100/80 px-4 py-2 rounded-full backdrop-blur-md border border-white shadow-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-sm shadow-green-500/50"></div>
          <span className="text-xs font-mono font-bold text-zinc-600">
            ¥{perSecond.toFixed(4)} <span className="text-zinc-400 font-normal">/ 秒</span>
          </span>
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
          onClick={() => alert('更多功能即将上线')}
        />
      </motion.section>

      {/* Monthly Overview Card */}
      <motion.section 
        variants={ITEM_VARIANTS}
        className="glass rounded-[32px] p-6 shadow-xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold tracking-tight">本月概览</h3>
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 45 }}
            className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center cursor-pointer"
          >
            <ArrowUpRight className="text-zinc-600 w-4 h-4" />
          </motion.div>
        </div>

        <div className="h-40 mb-10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CHART_DATA} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
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
                tick={{ fontSize: 11, fill: '#A1A1AA', fontWeight: 600 }} 
                dy={12}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }} 
                content={() => null}
              />
              <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={28}>
                {CHART_DATA.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.active ? 'url(#barGradient)' : entry.color} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 divide-x divide-zinc-100 py-2 bg-zinc-50/50 rounded-3xl border border-zinc-100">
          <OverviewItem label="总额" value="¥15k" />
          <OverviewItem label="扣减" value="¥2.5k" color="text-red-500" />
          <OverviewItem label="实发" value="¥12.5k" color="text-green-600" />
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
