import React, { useState } from 'react';
import { ChevronLeft, Monitor, Moon, Sun, MoonStar, Zap, Trees, Rocket, Coffee, ThermometerSnowflake } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface AppearanceSettingsViewProps {
  theme: 'system'|'light'|'dark'|'midnight'|'oled'|'forest'|'cyberpunk'|'sepia'|'nord';
  setTheme: (theme: 'system'|'light'|'dark'|'midnight'|'oled'|'forest'|'cyberpunk'|'sepia'|'nord') => void;
  onBack: () => void;
}

export default function AppearanceSettingsView({ theme, setTheme, onBack }: AppearanceSettingsViewProps) {
  return (
    <div className="flex flex-col gap-6 px-5 pb-32 pt-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-zinc-600" />
        </button>
        <h2 className="text-xl font-black tracking-tighter text-zinc-900 leading-none">外观设置</h2>
      </div>

      <div className="glass rounded-[32px] p-2 space-y-2 shadow-xl border border-white/20">
        <div className="flex flex-col gap-1 px-4 pt-4 pb-2">
          <h3 className="font-black text-zinc-900 text-lg tracking-tight">视觉风格</h3>
          <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">个性化您的记薪体验</p>
        </div>

        <div className="flex flex-col gap-1.5 p-1.5">
          <ThemeOption 
            icon={<Monitor className="w-5 h-5" />}
            label="跟随系统"
            description="自动同步系统深浅色设置"
            active={theme === 'system'}
            onClick={() => setTheme('system')}
          />
          <ThemeOption 
            icon={<Sun className="w-5 h-5" />}
            label="经典浅色"
            description="明亮通透的简约白色质感"
            active={theme === 'light'}
            onClick={() => setTheme('light')}
          />
          <ThemeOption 
            icon={<Moon className="w-5 h-5" />}
            label="深色模式"
            description="专为夜间工作的低对比度方案"
            active={theme === 'dark'}
            onClick={() => setTheme('dark')}
          />
          <ThemeOption 
            icon={<MoonStar className="w-5 h-5" />}
            label="午夜蓝"
            description="深邃且安静的星空视觉"
            active={theme === 'midnight'}
            onClick={() => setTheme('midnight')}
          />
          <ThemeOption 
            icon={<Zap className="w-5 h-5" />}
            label="OLED 极黑"
            description="极致纯黑，完美契合 OLED 屏"
            active={theme === 'oled'}
            onClick={() => setTheme('oled')}
          />
          <ThemeOption 
            icon={<Trees className="w-5 h-5" />}
            label="自然之森"
            description="灵感源自大地的护眼绿调"
            active={theme === 'forest'}
            onClick={() => setTheme('forest')}
          />
          <ThemeOption 
            icon={<Rocket className="w-5 h-5" />}
            label="赛博朋克"
            description="霓虹交织的未来科幻感"
            active={theme === 'cyberpunk'}
            onClick={() => setTheme('cyberpunk')}
          />
          <ThemeOption 
            icon={<Coffee className="w-5 h-5" />}
            label="复古羊皮"
            description="温暖沉稳的羊皮纸色调"
            active={theme === 'sepia'}
            onClick={() => setTheme('sepia')}
          />
          <ThemeOption 
            icon={<ThermometerSnowflake className="w-5 h-5" />}
            label="北欧之冬"
            description="极简冷峻的冰川工业色系"
            active={theme === 'nord'}
            onClick={() => setTheme('nord')}
          />
        </div>
      </div>
    </div>
  );
}

interface ThemeOptionProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  active: boolean;
  onClick: () => void;
}

function ThemeOption({ icon, label, description, active, onClick }: ThemeOptionProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-4 p-3 rounded-[24px] w-full text-left transition-all border-2",
        active 
          ? "bg-primary/5 border-primary/40 shadow-sm" 
          : "bg-white/5 border-transparent hover:bg-white/40"
      )}
    >
      <div className={cn(
        "w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all",
        active ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110" : "bg-zinc-100 text-zinc-500"
      )}>
        {icon}
      </div>
      <div className="flex flex-col flex-1">
        <span className={cn(
          "font-black text-sm transition-colors tracking-tight",
          active ? "text-primary" : "text-zinc-800"
        )}>
          {label}
        </span>
        <span className="text-[10px] font-medium text-zinc-400 mt-0.5 leading-none">{description}</span>
      </div>
      <div className={cn(
        "w-5 h-5 flex items-center justify-center rounded-full border-2 transition-all",
        active ? "border-primary scale-110" : "border-zinc-200"
      )}>
        {active && <motion.div layoutId="theme-active-dot" className="w-2.5 h-2.5 rounded-full bg-primary" />}
      </div>
    </motion.button>
  );
}
