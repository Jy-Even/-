import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  ShieldCheck, 
  Bell, 
  RefreshCcw, 
  Palette, 
  Info,
  ChevronRight,
  LogOut,
  Moon,
  Github
} from 'lucide-react';
import { SalarySettings, ViewType } from '../types';
import { cn } from '../lib/utils';

interface ProfileViewProps {
  settings: SalarySettings;
  setSettings: (settings: SalarySettings) => void;
  onNavigate: (view: ViewType) => void;
}

export default function ProfileView({ settings, setSettings, onNavigate }: ProfileViewProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [simulatedPush, setSimulatedPush] = useState(false);

  const handleToggleNotifications = (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    if (enabled) {
      setToastMessage("消息通知已开启");
      setTimeout(() => {
          setSimulatedPush(true);
          setTimeout(() => setSimulatedPush(false), 4000);
      }, 1000);
    } else {
      setToastMessage("消息通知已关闭");
    }
    
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex flex-col gap-8 px-5 pb-20">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-24 left-1/2 bg-zinc-800 text-white px-6 py-3 rounded-full shadow-2xl z-50 font-medium text-sm whitespace-nowrap"
          >
            {toastMessage}
          </motion.div>
        )}

        {simulatedPush && (
          <motion.div
            initial={{ opacity: 0, y: -100, x: '-50%' }}
            animate={{ opacity: 1, y: 16, x: '-50%' }}
            exit={{ opacity: 0, y: -100, x: '-50%' }}
            className="fixed top-0 left-1/2 w-[90%] max-w-sm bg-white/90 backdrop-blur-xl p-4 rounded-3xl shadow-2xl z-[100] border border-white/50 flex gap-4 items-center"
          >
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-zinc-900 text-sm">工资卡助手</span>
              <span className="text-zinc-500 text-xs mt-0.5">您的当月工资条已生成，点击查看！</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Profile Header */}
      <header className="flex flex-col items-center py-8 relative">
        <div className="absolute top-0 inset-x-0 h-40 bg-linear-to-b from-primary/10 to-transparent rounded-full blur-3xl -z-10"></div>
        
        <div className="relative mb-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-full p-1 glass-elevated shadow-xl relative z-10"
          >
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover"
            />
          </motion.div>
        </div>

        <div className="text-center mb-3">
          <h2 className="text-3xl font-black tracking-tight mb-1 text-zinc-900">Jay Yu</h2>
          <p className="text-zinc-500 font-medium text-sm">高级产品设计师</p>
        </div>
        <motion.p 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-100 px-3 py-1 rounded-full"
        >
          上海 · 2023年9月加入
        </motion.p>
      </header>

      {/* Settings Groups */}
      <div className="space-y-6">
        <h3 className="text-[13px] font-bold text-zinc-400 uppercase tracking-[0.2em] pl-2">个人设置</h3>
        <SettingsGroup>
          <SettingsItem 
            icon={<CreditCard className="text-primary w-6 h-6" strokeWidth={2.5} />} 
            label="薪资设置" 
            onClick={() => onNavigate('salarySettings')}
          />
          <SettingsItem 
            icon={<ShieldCheck className="text-primary w-6 h-6" strokeWidth={2.5} />} 
            label="社保公积金" 
            onClick={() => onNavigate('socialSecurity')}
            border={false} 
          />
        </SettingsGroup>

        <SettingsGroup>
          <SettingsItem icon={<Bell className="text-primary w-6 h-6" strokeWidth={2.5} />} label="消息通知">
            <Toggle active={notificationsEnabled} onChange={handleToggleNotifications} />
          </SettingsItem>
          <SettingsItem icon={<RefreshCcw className="text-primary w-6 h-6" strokeWidth={2.5} />} label="数据同步" />
          <SettingsItem icon={<Palette className="text-primary w-6 h-6" strokeWidth={2.5} />} label="外观设置" border={false}>
            <span className="text-sm font-bold text-zinc-400">跟随系统</span>
          </SettingsItem>
        </SettingsGroup>

        <SettingsGroup>
          <SettingsItem icon={<LogOut className="text-red-500 w-6 h-6" strokeWidth={2.5} />} label="退出账号" border={false} />
        </SettingsGroup>
      </div>
    </div>
  );
}


function SettingsGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass rounded-3xl overflow-hidden border border-white/50 shadow-sm">
      {children}
    </div>
  );
}

function SettingsItem({ icon, label, children, border = true, onClick }: { icon: React.ReactNode, label: string, children?: React.ReactNode, border?: boolean, onClick?: () => void }) {
  return (
    <motion.button
      whileTap={{ backgroundColor: "rgba(0,0,0,0.02)" }}
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between p-5 transition-colors",
        border && "border-b border-zinc-200/50"
      )}
    >
      <div className="flex items-center gap-4">
        <div className="w-6 h-6 flex items-center justify-center">
          {icon}
        </div>
        <span className="font-semibold text-zinc-800">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {children || <ChevronRight className="w-5 h-5 text-zinc-300" />}
      </div>
    </motion.button>
  );
}

function Toggle({ active, onChange }: { active: boolean, onChange: (val: boolean) => void }) {
  return (
    <div 
      className={cn("w-12 h-7 rounded-full relative flex items-center px-1 transition-colors cursor-pointer", active ? "bg-primary" : "bg-zinc-300")}
      onClick={(e) => { e.stopPropagation(); onChange(!active); }}
    >
      <motion.div 
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        className={cn("w-5 h-5 bg-white rounded-full shadow-sm", active ? "ml-auto" : "mr-auto")}
      ></motion.div>
    </div>
  );
}
