import React, { useState, useEffect } from 'react';
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
  Github,
  LogIn
} from 'lucide-react';
import { SalarySettings, ViewType } from '../types';
import { cn } from '../lib/utils';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface ProfileViewProps {
  settings: SalarySettings;
  setSettings: (settings: SalarySettings) => void;
  onNavigate: (view: ViewType) => void;
  theme: 'system'|'light'|'dark'|'midnight'|'oled'|'forest'|'cyberpunk'|'sepia'|'nord';
}

const themeLabels = {
  system: '跟随系统',
  light: '浅色模式',
  dark: '深色模式',
  midnight: '午夜蓝',
  oled: 'OLED 极黑',
  forest: '自然之森',
  cyberpunk: '赛博朋克',
  sepia: '复古羊皮',
  nord: '北欧之冬',
};

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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

export default function ProfileView({ settings, setSettings, onNavigate, theme }: ProfileViewProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [simulatedPush, setSimulatedPush] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

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

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    if (!user) {
      setToastMessage("请先登录以同步数据");
      return;
    }

    setIsSyncing(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...settings,
        updatedAt: serverTimestamp()
      }, { merge: true });
      setToastMessage("数据已成功同步至云端");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
      setToastMessage("同步失败，请重试");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setToastMessage("登录成功");
    } catch (error) {
      console.error("Login failed:", error);
      setToastMessage("登录失败");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setToastMessage("已退出登录");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={CONTAINER_VARIANTS}
        className="flex flex-col gap-6 px-5 pb-24 pt-4"
      >
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 20, x: '-50%' }}
              className="fixed bottom-24 left-1/2 bg-zinc-900/90 backdrop-blur-xl text-white px-6 py-3 rounded-full shadow-2xl z-50 font-bold text-xs whitespace-nowrap border border-white/10"
            >
              {toastMessage}
            </motion.div>
          )}

          {isSyncing && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 12, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className="fixed top-12 left-1/2 bg-primary text-white px-5 py-2 rounded-full shadow-lg z-50 font-black text-[10px] flex items-center gap-2 tracking-wider"
            >
              <RefreshCcw className="w-3 h-3 animate-spin" />
              同步数据中
            </motion.div>
          )}

          {simulatedPush && (
          <motion.div
            initial={{ opacity: 0, y: -100, x: '-50%' }}
            animate={{ opacity: 1, y: 16, x: '-50%' }}
            exit={{ opacity: 0, y: -100, x: '-50%' }}
            className="fixed top-0 left-1/2 w-[90%] max-w-sm glass-elevated p-4 rounded-3xl shadow-2xl z-[100] flex gap-4 items-center border border-white/20"
          >
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-zinc-900 text-sm tracking-tight">PayTrack 助手</span>
              <span className="text-zinc-500 font-medium text-xs mt-0.5 leading-tight">您的当月预估薪资条已就绪</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Profile Header - More Compact */}
      <motion.header variants={ITEM_VARIANTS} className="flex flex-row items-center gap-4 py-1 relative">
        <div className="absolute -top-10 inset-x-0 h-40 bg-radial from-primary/10 to-transparent blur-3xl -z-10 opacity-60"></div>
        
        <div className="relative">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-12 h-12 rounded-full p-0.5 glass-elevated shadow-xl relative z-10 overflow-hidden border-2 border-white/40"
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="w-full h-full rounded-full bg-primary/5 flex items-center justify-center">
                 <span className="text-sm font-black text-primary">{user?.displayName?.[0] || 'G'}</span>
              </div>
            )}
          </motion.div>
        </div>

        <div className="flex flex-col flex-1">
          <h2 className="text-lg font-black tracking-tighter text-zinc-900 leading-none mb-1">
            {user?.displayName || '访客用户'}
          </h2>
          <div className="flex items-center gap-1.5">
            <div className={cn("w-1.5 h-1.5 rounded-full", user ? "bg-emerald-500 animate-pulse" : "bg-zinc-300")} />
            <p className="text-zinc-400 font-black text-[9px] uppercase tracking-[0.15em]">
              {user ? '已开启云端同步' : '本地离线模式'}
            </p>
          </div>
        </div>
      </motion.header>

      {/* Settings Groups - Balanced Spacing */}
      <div className="space-y-5">
        <div className="space-y-3">
          <motion.h3 variants={ITEM_VARIANTS} className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.25em] pl-3 opacity-80">个人偏好</motion.h3>
          <motion.div variants={ITEM_VARIANTS}>
            <SettingsGroup>
              <SettingsItem 
                icon={<CreditCard className="text-zinc-800 w-5 h-5" strokeWidth={2.5} />} 
                label="薪资设置" 
                onClick={() => onNavigate('salarySettings')}
              />
              <SettingsItem 
                icon={<ShieldCheck className="text-zinc-800 w-5 h-5" strokeWidth={2.5} />} 
                label="社保公积金" 
                onClick={() => onNavigate('socialSecurity')}
                border={false} 
              />
            </SettingsGroup>
          </motion.div>
        </div>

        <div className="space-y-3">
          <motion.h3 variants={ITEM_VARIANTS} className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.25em] pl-3 opacity-80">系统工具</motion.h3>
          <motion.div variants={ITEM_VARIANTS}>
            <SettingsGroup>
              <SettingsItem icon={<Bell className="text-zinc-800 w-5 h-5 drop-shadow-xs" strokeWidth={2.5} />} label="消息推送">
                <Toggle active={notificationsEnabled} onChange={handleToggleNotifications} />
              </SettingsItem>
              <SettingsItem 
                icon={<RefreshCcw className={cn("text-zinc-800 w-5 h-5", isSyncing && "animate-spin")} strokeWidth={2.5} />} 
                label="手动云同步" 
                onClick={handleSync}
              >
                {isSyncing && <span className="text-[10px] font-black text-primary mr-1 animate-pulse">SYNCING</span>}
              </SettingsItem>
              <SettingsItem 
                icon={<Palette className="text-zinc-800 w-5 h-5" strokeWidth={2.5} />} 
                label="外观主题" 
                border={false}
                onClick={() => onNavigate('appearanceSettings')}
              >
                <div className="flex items-center gap-2 group cursor-pointer">
                  <span className="text-xs font-black text-zinc-400 transition-colors group-hover:text-primary">
                    {themeLabels[theme] || '系统'}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <ChevronRight className="w-3 h-3 text-zinc-400" />
                  </div>
                </div>
              </SettingsItem>
            </SettingsGroup>
          </motion.div>
        </div>

        <motion.div variants={ITEM_VARIANTS} className="pt-2">
          <SettingsGroup>
            {user ? (
              <SettingsItem 
                icon={<LogOut className="text-red-500 w-5 h-5" strokeWidth={2.5} />} 
                label="退出当前账号" 
                border={false} 
                onClick={handleLogout}
              />
            ) : (
              <SettingsItem 
                icon={<LogIn className="text-emerald-600 w-5 h-5" strokeWidth={2.5} />} 
                label="绑定 Google 账号" 
                border={false} 
                onClick={handleLogin}
              />
            )}
          </SettingsGroup>
        </motion.div>
      </div>
    </motion.div>
  );
}


function SettingsGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass rounded-3xl overflow-hidden shadow-sm">
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
      className={cn("w-12 h-7 rounded-full relative flex items-center px-1 transition-colors cursor-pointer", active ? "bg-primary" : "bg-zinc-200")}
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
