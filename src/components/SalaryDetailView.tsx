import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Edit2, Share } from 'lucide-react';
import { MonthlySalary } from '../types';
import { formatCurrency, cn } from '../lib/utils';

interface SalaryDetailViewProps {
  record: MonthlySalary;
  onBack: () => void;
  onEdit: () => void;
}

export default function SalaryDetailView({ record, onBack, onEdit }: SalaryDetailViewProps) {
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  const monthDisplay = monthNames[parseInt(record.month.split('-')[1]) - 1];
  const yearDisplay = record.month.split('-')[0];

  return (
    <div className="flex flex-col gap-6 px-5 pb-32 pt-10">
      <header className="flex items-center justify-between py-2">
        <div className="flex items-center gap-4">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="p-2 rounded-full bg-zinc-100 text-zinc-600"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          <h2 className="text-xl font-black">工资单详情</h2>
        </div>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: '工资单详情',
                text: `${yearDisplay}年${monthDisplay}实发工资: ¥${record.net}`,
              }).catch(console.error);
            } else {
              alert('分享功能即将在您的设备上线');
            }
          }}
          className="p-2 rounded-full bg-primary/10 text-primary"
        >
          <Share className="w-5 h-5" />
        </motion.button>
      </header>

      <section className="glass rounded-3xl p-6 flex flex-col items-center shadow-xl border-t border-white relative overflow-hidden">
        <div className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{yearDisplay}年 {monthDisplay}实发工资</div>
        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-3xl font-bold text-primary opacity-80">¥</span>
          <div className="text-5xl font-black text-primary tracking-tighter">
            {formatCurrency(record.net).replace('¥', '')}
          </div>
        </div>
        <div className="flex items-center gap-2 bg-green-50 px-4 py-1.5 rounded-full border border-green-200">
           <span className="w-2 h-2 rounded-full bg-green-500" />
           <span className="text-[11px] font-bold text-green-600 uppercase tracking-widest">已发放至工资卡</span>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-[13px] font-bold text-zinc-400 uppercase tracking-[0.2em] pl-2">收入明细</h3>
        <div className="glass rounded-3xl p-5 space-y-4 shadow-sm">
          <DetailRow label="基本工资" value={record.baseAmount} />
          <DetailRow label="绩效奖金" value={record.bonus} />
          <div className="pt-4 border-t border-zinc-200/50 mt-4 flex justify-between items-center">
            <span className="text-[12px] font-bold text-zinc-400">应发合计</span>
            <span className="text-lg font-black font-mono">¥{formatCurrency(record.gross).replace('¥', '')}</span>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-[13px] font-bold text-zinc-400 uppercase tracking-[0.2em] pl-2">扣除明细</h3>
        <div className="glass rounded-3xl p-5 space-y-4 shadow-sm">
          <DetailRow label="五险一金" value={record.socialSecurity} isDeduction />
          <DetailRow label="个人所得税" value={record.tax} isDeduction />
          <div className="pt-4 border-t border-zinc-200/50 mt-4 flex justify-between items-center">
            <span className="text-[12px] font-bold text-zinc-400">扣除合计</span>
            <span className="text-lg font-black font-mono text-red-500">-¥{formatCurrency(record.socialSecurity + record.tax).replace('¥', '')}</span>
          </div>
        </div>
      </section>

      <motion.button
         whileHover={{ scale: 1.02 }}
         whileTap={{ scale: 0.98 }}
         onClick={onEdit}
         className="w-full h-14 bg-zinc-100 text-zinc-700 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors mt-2"
      >
        更正数据
      </motion.button>
    </div>
  );
}

function DetailRow({ label, value, isDeduction }: { label: string, value: number, isDeduction?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[14px] font-medium text-zinc-500">{label}</span>
      <span className={cn("font-bold font-mono text-[15px]", isDeduction && "text-red-500")}>
        {isDeduction ? '-' : ''}¥{formatCurrency(value).replace('¥', '')}
      </span>
    </div>
  );
}
