import React from 'react';
import { User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 px-8 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200/90 dark:border-slate-800/90 flex items-center justify-between sticky top-0 z-30 transition-colors">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* User profile pill */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-semibold text-xs shadow-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">{user?.name || 'Administrator'}</p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium capitalize">{user?.role || 'Admin'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
