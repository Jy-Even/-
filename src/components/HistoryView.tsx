import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Edit2, 
  Trash2,
  Calendar,
  Download
} from 'lucide-react';
import { MonthlySalary } from '../types';
import { cn, formatCurrency } from '../lib/utils';

interface HistoryViewProps {
  history: MonthlySalary[];
  onViewDetail?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

function getMonthName(month: string) {
  return `${month}月`;
}

export default function HistoryView({ history, onViewDetail, onEdit, onDelete }: HistoryViewProps) {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [expandedId, setExpandedId] = useState<string | null>('1');

  const annualTotal = history.reduce((acc, curr) => acc + curr.net, 0);

  const handleDownloadCSV = () => {
    const headers = ['月份', '基本工资', '奖金', '五险一金', '个人所得税', '实发工资'];
    const rows = history.map(item => [
      item.month,
      item.baseAmount,
      item.bonus,
      item.socialSecurity,
      item.tax,
      item.net
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Add BOM for Excel UTF-8 compatibility
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `薪资报表_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={CONTAINER_VARIANTS}
      className="flex flex-col gap-8 px-5 pb-32"
    >
      {/* Annual Summary - Redesigned with higher information density and better visual hierarchy */}
      <motion.section 
        variants={ITEM_VARIANTS}
        className="relative pt-2"
      >
        <div className="glass-elevated rounded-3xl p-5 flex flex-col items-center bg-linear-to-br from-white/90 to-white/60 shadow-xl relative overflow-hidden border-t-2 border-white">
          {/* Subtle Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
          
          <div className="flex items-center gap-2 mb-4 bg-zinc-100/50 px-4 py-1.5 rounded-full border border-zinc-200/20 shadow-inner">
            <Calendar className="w-4 h-4 text-zinc-400" />
            <span className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">{selectedYear} 年度汇总</span>
          </div>

          <div className="flex flex-col items-center gap-1 mb-5">
            <span className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest pl-1">累计实发总额</span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-primary/60">¥</span>
              <span className="text-3xl font-black tracking-tighter text-gradient tabular-nums">
                {annualTotal.toLocaleString('zh-CN')}
              </span>
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-4">
            <div className="bg-white/40 p-4 rounded-2xl flex flex-col items-center border border-white/50 backdrop-blur-sm">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">月均收入</span>
              <span className="text-lg font-black font-mono text-zinc-800">¥{(annualTotal / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="bg-white/40 p-4 rounded-2xl flex flex-col items-center border border-white/50 backdrop-blur-sm">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">年度增幅</span>
              <span className="text-lg font-black font-mono text-green-500">+12.5%</span>
            </div>
          </div>

          {/* Download Action */}
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownloadCSV}
            className="w-full mt-6 py-3.5 rounded-2xl border-2 border-dashed border-primary/20 flex items-center justify-center gap-2 text-primary font-bold text-sm transition-all hover:border-primary/40"
          >
            <Download className="w-4 h-4" />
            下载月度汇总报表 (CSV)
          </motion.button>
        </div>

        {/* Year Selector Floating */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-6 bg-zinc-100/80 backdrop-blur-md p-1.5 rounded-full border border-white shadow-sm">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedYear(prev => prev - 1)}
              className="p-2 rounded-full hover:bg-white transition-all text-zinc-400 hover:text-primary active:shadow-inner"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <span className="text-lg font-black tracking-tight px-2 text-zinc-800">{selectedYear}</span>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedYear(prev => prev + 1)}
              className="p-2 rounded-full hover:bg-white transition-all text-zinc-400 hover:text-primary active:shadow-inner"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* History Timeline - Tightened Proportions */}
      <motion.section 
        variants={{
          visible: { transition: { staggerChildren: 0.1 } }
        }}
        className="space-y-4"
      >
        {history.map((item, index) => {
          const month = item.month.split('-')[1];
          const isExpanded = expandedId === item.id;

          return (
            <motion.div 
              key={item.id} 
              variants={ITEM_VARIANTS}
              className="flex gap-4 relative group"
            >
              {/* Timeline Indicator - Arabic Numerals Optimized */}
              <div className="w-12 pt-2 flex flex-col items-center">
                <span className={cn(
                  "text-3xl font-black tracking-tighter transition-all duration-300 tabular-nums",
                  isExpanded ? "text-primary scale-110" : "text-zinc-300 group-hover:text-zinc-400"
                )}>
                  {month}
                </span>
                {!isLast(item, history) && (
                  <div className="w-[1.5px] flex-1 bg-zinc-200 group-hover:bg-primary/20 transition-colors mt-3 rounded-full" />
                )}
              </div>

              {/* Data Card */}
              <motion.div 
                layout
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className={cn(
                  "flex-1 rounded-[24px] p-5 transition-all cursor-pointer border",
                  isExpanded 
                    ? "glass-elevated border-primary/20 shadow-2xl scale-[1.01] z-10" 
                    : "bg-white/50 border-white/60 hover:bg-white/80 active:scale-95"
                )}
              >
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <h3 className={cn(
                      "font-bold text-[16px] tracking-tight transition-colors",
                      isExpanded ? "text-primary" : "text-zinc-600"
                    )}>
                      {getMonthName(month)}账单
                    </h3>
                    {!isExpanded && (
                       <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest mt-0.5">已发放</span>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={cn(
                      "font-black font-mono transition-all duration-300",
                      isExpanded ? "text-zinc-900 text-2xl" : "text-zinc-800 text-lg"
                    )}>
                      {formatCurrency(item.net)}
                    </span>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-5 space-y-3 pb-4 bg-zinc-50/50 p-4 rounded-3xl border border-zinc-100">
                        <DetailRow label="基本工资" value={formatCurrency(item.baseAmount)} />
                        <DetailRow label="绩效奖金" value={formatCurrency(item.bonus)} />
                        <DetailRow label="五险一金" value={`-${formatCurrency(item.socialSecurity)}`} color="text-red-500" />
                        <DetailRow border={false} label="个人所得税" value={`-${formatCurrency(item.tax)}`} color="text-red-500" />
                      </div>

                      <div className="flex gap-2 mt-5">
                        <ActionButton label="查看详情" onClick={() => onViewDetail?.(item.id)} />
                        <ActionButton label="更正" onClick={() => onEdit?.(item.id)} />
                        <ActionButton 
                          label="删除" 
                          variant="danger" 
                          onClick={() => {
                            if (window.confirm('确定要删除该月记录吗？')) {
                              onDelete?.(item.id);
                            }
                          }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.section>
    </motion.div>
  );
}

function DetailRow({ label, value, color, border = true }: { label: string, value: string, color?: string, border?: boolean }) {
  return (
    <div className={cn("flex justify-between items-center py-2", border && "border-b border-zinc-200/50")}>
      <span className="text-sm font-medium text-zinc-500">{label}</span>
      <span className={cn("font-bold font-mono", color || "text-zinc-900")}>{value}</span>
    </div>
  );
}

function ActionButton({ label, variant = 'default', onClick }: { label: string, variant?: 'default' | 'danger', onClick?: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "flex-1 flex justify-center items-center gap-1.5 py-2.5 rounded-full text-[13px] font-bold transition-colors",
        variant === 'danger' 
          ? "bg-red-50 text-red-600 hover:bg-red-100" 
          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
      )}
    >
      {label}
    </motion.button>
  );
}

function isLast(item: MonthlySalary, history: MonthlySalary[]) {
  return history[history.length - 1].id === item.id;
}

