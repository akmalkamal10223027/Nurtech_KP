import React, { useState, useEffect } from 'react';
import { User, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UPLOAD_BASE } from '../api';

export interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const { user } = useAuth();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };

    checkDark();
    window.addEventListener('admin_theme_changed', checkDark);
    return () => window.removeEventListener('admin_theme_changed', checkDark);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    const newTheme = newDark ? 'dark' : 'light';
    localStorage.setItem('admin_theme', newTheme);

    if (newDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    window.dispatchEvent(new Event('admin_theme_changed'));
  };

  const avatarSrc = user?.avatar
    ? user.avatar.startsWith('http')
      ? user.avatar
      : user.avatar.startsWith('/')
        ? `${UPLOAD_BASE}${user.avatar}`
        : `${UPLOAD_BASE}/${user.avatar}`
    : null;

  return (
    <header className="h-16 px-8 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200/90 dark:border-slate-800/90 flex items-center justify-between sticky top-0 z-30 transition-colors">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Dark / Light Mode Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 hover:border-amber-400/50 transition-all cursor-pointer shadow-xs flex items-center justify-center"
          title={isDark ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
          aria-label="Toggle Dark/Light Mode"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 animate-in zoom-in-75 duration-200" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600 animate-in zoom-in-75 duration-200" />
          )}
        </button>

        {/* User profile pill */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-semibold text-xs shadow-sm overflow-hidden shrink-0">
            {avatarSrc ? (
              <img src={avatarSrc} alt={user?.name || 'Avatar'} className="w-full h-full object-cover" />
            ) : user?.name ? (
              user.name.charAt(0).toUpperCase()
            ) : (
              <User className="w-4 h-4" />
            )}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">{user?.name || 'Admin Nurtech'}</p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium capitalize">{user?.role || 'Admin'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

