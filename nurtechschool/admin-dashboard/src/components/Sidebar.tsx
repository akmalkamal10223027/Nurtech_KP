import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Image,
  UserCheck,
  Images,
  BookOpen,
  Smartphone,
  Clock,
  Newspaper,
  Building2,
  FileCheck2,
  HelpCircle,
  PhoneCall,
  LayoutList,
  Settings,
  ExternalLink,
  LogOut,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api, UPLOAD_BASE } from '../api';

export interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { logout } = useAuth();
  const [adminLogo, setAdminLogo] = useState<string | null>(() => {
    return localStorage.getItem('admin_logo') || null;
  });

  useEffect(() => {
    const handleLogoChange = () => {
      setAdminLogo(localStorage.getItem('admin_logo') || null);
    };
    window.addEventListener('admin_logo_changed', handleLogoChange);

    api.getGlobal().then((res) => {
      const dbLogo = res?.data?.logoUrl || res?.data?.logo?.url || res?.data?.logo;
      if (dbLogo && typeof dbLogo === 'string') {
        setAdminLogo(dbLogo);
        localStorage.setItem('admin_logo', dbLogo);
      }
    }).catch(() => { });

    return () => window.removeEventListener('admin_logo_changed', handleLogoChange);
  }, []);

  const logoSrc = adminLogo
    ? adminLogo.startsWith('http')
      ? adminLogo
      : `${UPLOAD_BASE}${adminLogo}`
    : null;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'banners', label: 'Banner & Hero', icon: Image },
    { id: 'about', label: 'Profil & Visi Misi', icon: UserCheck },
    { id: 'gallery', label: 'Galeri Kegiatan', icon: Images },
    { id: 'programs', label: 'Program & Ekskul', icon: BookOpen },
    { id: 'app_section', label: 'Aplikasi Boarding School', icon: Smartphone },
    { id: 'schedules', label: 'Aktivitas & Rutinitas', icon: Clock },
    { id: 'articles', label: 'Berita & Artikel', icon: Newspaper },
    { id: 'facilities', label: 'Fasilitas & Prestasi', icon: Building2 },
    { id: 'registration', label: 'Pendaftaran & Biaya', icon: FileCheck2 },
    { id: 'faqs', label: 'FAQ', icon: HelpCircle },
    { id: 'contact', label: 'Kontak & Alamat', icon: PhoneCall },
    { id: 'footers', label: 'Menu Footer', icon: LayoutList },
    { id: 'settings', label: 'Pengaturan', icon: Settings }
  ];

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-64 bg-white/95 dark:bg-slate-900/95 border-r border-slate-200/90 dark:border-slate-800/90 backdrop-blur-xl flex flex-col shrink-0 h-screen z-40 transition-colors">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20 text-white overflow-hidden shrink-0">
          {logoSrc ? (
            <img src={logoSrc} alt="Logo" className="w-full h-full object-contain p-1" />
          ) : (
            <GraduationCap className="w-6 h-6" />
          )}
        </div>
        <div>
          <h1 className="font-bold text-base text-slate-900 dark:text-white tracking-tight">Nurtech Admin</h1>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Control Center</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <p className="px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Menu Utama</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70'
                }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Controls */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between w-full px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Lihat Website Utama
          </span>
        </a>

        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Dashboard</span>
        </button>
      </div>
    </aside>
  );
};
