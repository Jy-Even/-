import React, { useState } from 'react';
import { ChevronLeft, Monitor, Moon, Sun, MoonStar } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface AppearanceSettingsViewProps {
  theme: 'system'|'light'|'dark'|'midnight';
  setTheme: (theme: 'system'|'light'|'dark'|'midnight') => void;
  onBack: () => void;
}

export default function AppearanceSettingsView({ theme, setTheme, onBack }: AppearanceSettingsViewProps) {
  return (
    <div className="flex flex-col gap-6 px-5 pb-32">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 bg-white/50 rounded-full hover:bg-white/80 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-zinc-700" />
        </button>
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">外观设置</h2>
      </div>

      <div className="glass rounded-[32px] p-6 space-y-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 px-2">
            <h3 className="font-bold text-zinc-800 text-base">主题模式</h3>
            <p className="text-sm text-zinc-500">选择您喜欢的外观主题</p>
          </div>

          <div className="flex flex-col gap-3">
            <ThemeOption 
              icon={<Monitor className="w-5 h-5" />}
              label="跟随系统"
              description="自动应用系统的亮色或暗色模式"
              active={theme === 'system'}
              onClick={() => setTheme('system')}
            />
            <ThemeOption 
              icon={<Sun className="w-5 h-5" />}
              label="浅色模式"
              description="始终使用浅色主题"
              active={theme === 'light'}
              onClick={() => setTheme('light')}
            />
            <ThemeOption 
              icon={<Moon className="w-5 h-5" />}
              label="深色模式"
              description="始终使用深色主题"
              active={theme === 'dark'}
              onClick={() => setTheme('dark')}
            />
            <ThemeOption 
              icon={<MoonStar className="w-5 h-5" />}
              label="午夜蓝 (Midnight Blue)"
              description="深邃且安静的蓝色主题"
              active={theme === 'midnight'}
              onClick={() => setTheme('midnight')}
            />
          </div>
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
        "relative flex items-center gap-4 p-4 rounded-2xl w-full text-left transition-all border-2",
        active 
          ? "bg-primary/5 border-primary shadow-md" 
          : "bg-white/40 border-transparent hover:bg-white/60"
      )}
    >
      <div className={cn(
        "p-3 rounded-full flex-shrink-0 transition-colors",
        active ? "bg-primary text-pure-white shadow-sm" : "bg-zinc-100 text-zinc-500"
      )}>
        {icon}
      </div>
      <div className="flex flex-col flex-1">
        <span className={cn(
          "font-bold text-[15px] transition-colors",
          active ? "text-primary" : "text-zinc-800"
        )}>
          {label}
        </span>
        <span className="text-xs text-zinc-400 mt-0.5">{description}</span>
      </div>
      <div className={cn(
        "w-6 h-6 flex items-center justify-center rounded-full border-2 transition-colors",
        active ? "border-primary" : "border-zinc-300"
      )}>
        {active && <motion.div layoutId="theme-active-dot" className="w-3 h-3 rounded-full bg-primary" />}
      </div>
    </motion.button>
  );
}
