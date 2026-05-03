import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Save,
  ShieldCheck,
  Building,
  HeartPulse,
  Briefcase,
  LineChart,
  Info
} from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';

interface SocialSecurityViewProps {
  baseSalary: number;
  onBack: () => void;
}

export default function SocialSecurityView({ baseSalary, onBack }: SocialSecurityViewProps) {
  const [pensionRate, setPensionRate] = useState(8);
  const [medicalRate, setMedicalRate] = useState(2);
  const [unemploymentRate, setUnemploymentRate] = useState(0.5);
  const [housingRate, setHousingRate] = useState(7);

  const calculate = (rate: number) => (baseSalary * rate) / 100;

  const totalDeduction = calculate(pensionRate) + calculate(medicalRate) + calculate(unemploymentRate) + calculate(housingRate);

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
        <h2 className="text-xl font-black">社保公积金</h2>
      </header>

      <section className="glass rounded-3xl p-6 flex flex-col items-center bg-linear-to-br from-primary/5 to-transparent relative overflow-hidden">
        <div className="text-[13px] font-bold text-zinc-400 uppercase tracking-widest mb-2">预计每月扣除总额</div>
        <div className="text-4xl font-black text-red-500 tracking-tighter mb-4">
          -{formatCurrency(totalDeduction)}
        </div>
        <div className="text-xs font-medium text-zinc-400">基于基本薪资 ¥{baseSalary.toLocaleString()} 计算</div>
      </section>

      <section className="space-y-4">
        <h3 className="text-[13px] font-bold text-zinc-400 uppercase tracking-[0.2em] pl-2">详细扣费比例</h3>
        
        <div className="glass rounded-3xl p-5 space-y-6 shadow-sm">
          <RateSlider label="养老保险" icon={<Building className="w-5 h-5" />} value={pensionRate} onChange={setPensionRate} amount={calculate(pensionRate)} tooltip="为退休后的生活提供基本保障，按缴费基数 8% 计入个人账户。" />
          <RateSlider label="医疗保险" icon={<HeartPulse className="w-5 h-5" />} value={medicalRate} onChange={setMedicalRate} amount={calculate(medicalRate)} tooltip="用于门诊医疗费用报销和住院统筹。个人缴纳部分通常进入个人医保卡账户。" />
          <RateSlider label="失业保险" icon={<Briefcase className="w-5 h-5" />} value={unemploymentRate} onChange={setUnemploymentRate} amount={calculate(unemploymentRate)} tooltip="非本人意愿中断就业时，可申领失业保险金，通常个人缴纳比例较低。" />
          <RateSlider label="住房公积金" icon={<LineChart className="w-5 h-5" />} value={housingRate} onChange={setHousingRate} amount={calculate(housingRate)} color="text-primary" tooltip="长期住房储金，可用于购房贷款优惠、租房支取等，个人与公司等额缴纳。" />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="w-full h-14 bg-primary text-pure-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-primary/25 mt-4"
        >
          确认配置
        </motion.button>
      </section>
    </div>
  );
}

function RateSlider({ label, icon, value, onChange, amount, color = "text-red-500", tooltip }: { 
  label: string, 
  icon: React.ReactNode, 
  value: number, 
  onChange: (v: number) => void, 
  amount: number,
  color?: string,
  tooltip?: string
}) {
  const [inputValue, setInputValue] = useState(value.toString());

  React.useEffect(() => {
    if (parseFloat(inputValue) !== value && !isNaN(value)) {
      setInputValue(value.toString());
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed >= 0) {
      onChange(parsed);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-500 italic">
            {icon}
          </div>
          <div className="flex flex-col group relative">
            <span className="text-sm font-bold text-zinc-700 flex items-center gap-1">
              {label}
              <Info className="w-3 h-3 text-zinc-300" />
            </span>
            <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-zinc-800 text-[10px] text-white rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              {tooltip}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={cn("text-sm font-black font-mono flex items-center gap-1.5", color)}>
            -{formatCurrency(amount)}
            <span className="text-[10px] opacity-50 font-bold bg-zinc-100/50 px-1.5 py-0.5 rounded-full border border-zinc-200/40 tracking-tighter">
              ({value.toFixed(1).replace(/\.0$/, '')}%)
            </span>
          </span>
          <div className="flex items-center bg-zinc-50 px-2 py-0.5 rounded-md border border-zinc-200/60 shadow-inner">
            <input 
              type="number" 
              min="0" max="100" step="0.01" 
              value={inputValue}
              onChange={handleInputChange}
              onBlur={() => {
                const parsed = parseFloat(inputValue);
                if (isNaN(parsed) || parsed < 0) {
                  setInputValue(value.toString());
                } else {
                  setInputValue(parsed.toFixed(2).replace(/\.?0+$/, ''));
                }
              }}
              className="w-12 text-right bg-transparent border-none focus:ring-0 text-[11px] font-bold text-zinc-500 font-mono p-0 h-4"
            />
            <span className="text-[10px] font-bold text-zinc-400 ml-0.5">%</span>
          </div>
        </div>
      </div>
      <input 
        type="range" 
        min="0" max="30" step="0.01" 
        value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value))} 
        className="w-full h-1 bg-zinc-100 rounded-full appearance-none cursor-pointer accent-primary"
      />
    </div>
  );
}
