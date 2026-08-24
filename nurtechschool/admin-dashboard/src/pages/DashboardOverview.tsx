import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  Image,
  BookOpen,
  Building2,
  Images,
  HelpCircle,
  TrendingUp,
  Clock,
  Plus,
  ArrowUpRight,
  Sparkles,
  Settings,
  ArrowRight,
  FileText,
  BarChart2,
  PieChart,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { api, UPLOAD_BASE } from '../api';
import { IArticle } from '../types';

export interface DashboardOverviewProps {
  setActiveTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ setActiveTab }) => {
  const [stats, setStats] = useState<{ counts: Record<string, number>; recentArticles: IArticle[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeChartMode, setActiveChartMode] = useState<'bar' | 'donut' | 'breakdown'>('bar');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await api.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFullImageUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${UPLOAD_BASE}${url}`;
  };

  const statCards = [
    { title: 'Banner Homepage', count: stats?.counts?.banners ?? 0, icon: Image, color: 'from-amber-500 to-orange-600', tab: 'banners', subtitle: 'Slider Hero Utama' },
    { title: 'Galeri Dokumentasi', count: stats?.counts?.galleries ?? 0, icon: Images, color: 'from-rose-500 to-red-600', tab: 'gallery', subtitle: 'Album & Foto Kegiatan' },
    { title: 'Program & Ekskul', count: (stats?.counts?.programs ?? 0) + (stats?.counts?.extracurriculars ?? 0), icon: BookOpen, color: 'from-purple-500 to-indigo-600', tab: 'programs', subtitle: 'Studi & Pengembangan' },
    { title: 'Total Berita / Artikel', count: stats?.counts?.articles ?? 0, icon: Newspaper, color: 'from-emerald-500 to-teal-600', tab: 'articles', subtitle: 'Kabar & Publikasi' },
    { title: 'Aktivitas & Rutinitas', count: stats?.counts?.schedules ?? 0, icon: Clock, color: 'from-indigo-500 to-blue-600', tab: 'schedules', subtitle: 'Jadwal Agenda Harian' },
    { title: 'Fasilitas & Prestasi', count: (stats?.counts?.facilities ?? 0) + (stats?.counts?.achievements ?? 0), icon: Building2, color: 'from-cyan-500 to-blue-600', tab: 'facilities', subtitle: 'Sarana & Rekam Jejak' },
    { title: 'Tanya Jawab (FAQ)', count: stats?.counts?.faqs ?? 0, icon: HelpCircle, color: 'from-sky-500 to-teal-600', tab: 'faqs', subtitle: 'Informasi Pendaftaran' }
  ];

  const chartCategories = [
    { key: 'articles', label: 'Berita & Artikel', count: stats?.counts?.articles ?? 0, color: '#10b981', bgGradient: 'from-emerald-500 to-teal-600', tab: 'articles' },
    { key: 'galleries', label: 'Galeri Foto', count: stats?.counts?.galleries ?? 0, color: '#f43f5e', bgGradient: 'from-rose-500 to-red-600', tab: 'gallery' },
    { key: 'programs', label: 'Program & Ekskul', count: (stats?.counts?.programs ?? 0) + (stats?.counts?.extracurriculars ?? 0), color: '#a855f7', bgGradient: 'from-purple-500 to-indigo-600', tab: 'programs' },
    { key: 'facilities', label: 'Fasilitas & Prestasi', count: (stats?.counts?.facilities ?? 0) + (stats?.counts?.achievements ?? 0), color: '#06b6d4', bgGradient: 'from-cyan-500 to-blue-600', tab: 'facilities' },
    { key: 'banners', label: 'Banner Homepage', count: stats?.counts?.banners ?? 0, color: '#f59e0b', bgGradient: 'from-amber-500 to-orange-600', tab: 'banners' },
    { key: 'schedules', label: 'Agenda & Rutinitas', count: stats?.counts?.schedules ?? 0, color: '#6366f1', bgGradient: 'from-indigo-500 to-blue-600', tab: 'schedules' },
    { key: 'faqs', label: 'Pertanyaan FAQ', count: stats?.counts?.faqs ?? 0, color: '#0ea5e9', bgGradient: 'from-sky-500 to-teal-600', tab: 'faqs' }
  ];

  const totalContentItems = chartCategories.reduce((sum, item) => sum + item.count, 0);
  const maxCount = Math.max(...chartCategories.map(c => c.count), 1);

  const quickActions = [
    { title: 'Tulis Artikel Baru', desc: 'Publikasikan berita sekolah', icon: Plus, tab: 'articles', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
    { title: 'Kelola Banner Hero', desc: 'Atur slider & CTA halaman depan', icon: Image, tab: 'banners', color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
    { title: 'Tambah Galeri Foto', desc: 'Unggah momen kegiatan siswa', icon: Images, tab: 'gallery', color: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' },
    { title: 'Program & Ekskul', desc: 'Atur program keahlian & kegiatan', icon: BookOpen, tab: 'programs', color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' },
    { title: 'Fasilitas & Prestasi', desc: 'Kelola sarana & jejak juara', icon: Building2, tab: 'facilities', color: 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100' },
    { title: 'Pengaturan Sekolah', desc: 'Profil, visi misi, & kontak', icon: Settings, tab: 'settings', color: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200' }
  ];

  // Helper for Donut Chart SVG segments
  const renderDonutSegments = () => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    let accumulatedOffset = 0;

    if (totalContentItems === 0) {
      return (
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke="#e2e8f0"
          strokeWidth="14"
        />
      );
    }

    return chartCategories.map((item) => {
      const percentage = item.count / totalContentItems;
      const strokeDasharray = `${percentage * circumference} ${circumference}`;
      const strokeDashoffset = -accumulatedOffset;
      accumulatedOffset += percentage * circumference;

      const isHovered = hoveredCategory === item.key;

      return (
        <circle
          key={item.key}
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke={item.color}
          strokeWidth={isHovered ? 17 : 14}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          onMouseEnter={() => setHoveredCategory(item.key)}
          onMouseLeave={() => setHoveredCategory(null)}
          className="transition-all duration-300 cursor-pointer"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      );
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 p-8 text-white shadow-xl border border-emerald-500/30 flex flex-col items-center justify-center text-center">
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight text-center">
            Selamat Datang di Pusat Kendali Nurtech School
          </h1>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
      </div>

      {/* Metric Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Ringkasan Statistik Konten</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">Data Terkini</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4.5">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                onClick={() => setActiveTab(card.tab)}
                className="glass-card p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-black text-slate-900 tracking-tight">
                    {loading ? '...' : card.count}
                  </p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{card.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{card.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

