import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Save } from 'lucide-react';
import { MonthlySalary } from '../types';
import { formatCurrency } from '../lib/utils';

interface SalaryEditViewProps {
  record: MonthlySalary;
  onSave: (record: MonthlySalary) => void;
  onBack: () => void;
}

export default function SalaryEditView({ record, onSave, onBack }: SalaryEditViewProps) {
  const [localRecord, setLocalRecord] = useState<MonthlySalary>({ ...record });

  const calculateTotal = (data: Partial<MonthlySalary>) => {
    setLocalRecord(prev => {
      const merged = { ...prev, ...data };
      const gross = (merged.baseAmount || 0) + (merged.bonus || 0);
      const net = gross - (merged.socialSecurity || 0) - (merged.tax || 0);
      return {
        ...merged,
        gross,
        net
      };
    });
  };

  const handleChange = (field: keyof MonthlySalary, value: string) => {
    const numValue = parseFloat(value) || 0;
    calculateTotal({ [field]: numValue });
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
        <h2 className="text-xl font-black">更正工资单</h2>
      </header>

      <div className="glass rounded-3xl p-6 flex justify-between items-center bg-zinc-50 border border-zinc-100 shadow-sm relative overflow-hidden">
         <div className="flex flex-col">
           <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1">重新计算后实发</span>
           <span className="text-3xl font-black text-primary tracking-tight font-mono">
             {formatCurrency(localRecord.net)}
           </span>
         </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-[13px] font-bold text-zinc-400 uppercase tracking-[0.2em] pl-2">收入项</h3>
        <div className="glass rounded-3xl p-5 space-y-4 shadow-sm">
          <InputRow label="基本工资" value={localRecord.baseAmount} onChange={(v) => handleChange('baseAmount', v)} />
          <InputRow label="绩效奖金" value={localRecord.bonus} onChange={(v) => handleChange('bonus', v)} />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-[13px] font-bold text-zinc-400 uppercase tracking-[0.2em] pl-2">扣除项</h3>
        <div className="glass rounded-3xl p-5 space-y-4 shadow-sm">
          <InputRow label="五险一金" value={localRecord.socialSecurity} onChange={(v) => handleChange('socialSecurity', v)} color="text-red-500" />
          <InputRow label="个人所得税" value={localRecord.tax} onChange={(v) => handleChange('tax', v)} color="text-red-500" />
        </div>
      </section>

      <motion.button
         whileHover={{ scale: 1.02 }}
         whileTap={{ scale: 0.98 }}
         onClick={() => onSave(localRecord)}
         className="w-full h-14 bg-primary text-pure-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-primary/25 mt-4"
      >
        保存更正
      </motion.button>
    </div>
  );
}

function InputRow({ label, value, onChange, color }: { label: string, value: number, onChange: (val: string) => void, color?: string }) {
  const [inputValue, setInputValue] = React.useState(value === 0 ? '' : value.toString());

  React.useEffect(() => {
    // Only update from parent if the numeric value actually deviates (e.g., reset)
    // This allows trailing dots like "1." to persist in local state
    if (parseFloat(inputValue) !== value && !(inputValue === '' && value === 0)) {
      setInputValue(value === 0 ? '' : value.toString());
    }
  }, [value, inputValue]);

  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-sm font-medium text-zinc-500">{label}</span>
      <div className="flex items-center bg-zinc-100/50 px-3 py-2 rounded-xl border border-zinc-200/50">
        <span className="text-zinc-400 font-bold mr-1">¥</span>
        <input 
          type="number"
          value={inputValue}
          placeholder="0.00"
          onChange={(e) => {
            setInputValue(e.target.value);
            onChange(e.target.value);
          }}
          className={`w-24 text-right bg-transparent border-none focus:ring-0 font-bold font-mono p-0 ${color ? color : 'text-zinc-900'}`}
        />
      </div>
    </div>
  );
}
