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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 p-8 text-white shadow-xl border border-emerald-500/30">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-spin" />
            <span>Nurtech Content Management Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Selamat Datang di Pusat Kendali Nurtech School
          </h1>
          <p className="text-sm text-emerald-50/90 mt-2 leading-relaxed font-medium">
            Kelola publikasi artikel berita, slider banner utama, program keahlian, hingga informasi pendaftaran secara terpusat dan efisien.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={() => setActiveTab('articles')}
              className="px-4 py-2.5 rounded-xl bg-white text-emerald-800 hover:bg-slate-100 font-bold text-xs shadow-lg shadow-black/10 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-700" />
              <span>Tulis Berita Baru</span>
            </button>
            <button
              onClick={() => setActiveTab('banners')}
              className="px-4 py-2.5 rounded-xl bg-emerald-800/60 hover:bg-emerald-800/80 text-white font-medium text-xs border border-white/20 flex items-center gap-2 transition-all cursor-pointer backdrop-blur-sm"
            >
              <Image className="w-4 h-4 text-emerald-300" />
              <span>Kelola Banner</span>
            </button>
          </div>
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

      {/* Main Chart Section: Visualisasi Grafik Konten Sekolah */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200/90 bg-white shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-emerald-600" />
              <span>Visualisasi Grafik Konten Sekolah</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Perbandingan distribusi data konten berdasarkan tipe publikasi di sistem
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80 shrink-0">
            <button
              onClick={() => setActiveChartMode('bar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeChartMode === 'bar'
                  ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/70'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Grafik Batang</span>
            </button>

            <button
              onClick={() => setActiveChartMode('donut')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeChartMode === 'donut'
                  ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/70'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>Donut Chart</span>
            </button>

            <button
              onClick={() => setActiveChartMode('breakdown')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeChartMode === 'breakdown'
                  ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/70'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Persentase</span>
            </button>
          </div>
        </div>

        {/* View Mode 1: Bar Chart */}
        {activeChartMode === 'bar' && (
          <div className="pt-2">
            {loading ? (
              <div className="h-64 flex items-center justify-center text-xs text-slate-400">
                Memuat grafik data...
              </div>
            ) : (
              <div className="space-y-4">
                {/* Bar Chart Container */}
                <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 px-2 sm:px-6 pt-8 pb-3 bg-slate-50/70 rounded-2xl border border-slate-200/60 relative">
                  {/* Background Y-Axis Lines */}
                  <div className="absolute inset-x-6 top-6 bottom-10 flex flex-col justify-between pointer-events-none">
                    <div className="border-b border-slate-200/60 w-full flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono font-medium">{maxCount}</span>
                    </div>
                    <div className="border-b border-slate-200/40 w-full flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono font-medium">{Math.round((maxCount * 2) / 3)}</span>
                    </div>
                    <div className="border-b border-slate-200/40 w-full flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono font-medium">{Math.round(maxCount / 3)}</span>
                    </div>
                    <div className="border-b border-slate-200/80 w-full flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono font-medium">0</span>
                    </div>
                  </div>

                  {/* Bars */}
                  {chartCategories.map((cat) => {
                    const heightPercent = maxCount > 0 ? (cat.count / maxCount) * 100 : 0;
                    const isHovered = hoveredCategory === cat.key;
                    const percentage = totalContentItems > 0 ? ((cat.count / totalContentItems) * 100).toFixed(1) : '0';

                    return (
                      <div
                        key={cat.key}
                        onClick={() => setActiveTab(cat.tab)}
                        onMouseEnter={() => setHoveredCategory(cat.key)}
                        onMouseLeave={() => setHoveredCategory(null)}
                        className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer z-10"
                      >
                        {/* Hover Tooltip Popup */}
                        <div
                          className={`absolute -top-10 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-bold shadow-lg transition-all pointer-events-none whitespace-nowrap z-30 ${
                            isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-1 scale-95'
                          }`}
                        >
                          {cat.label}: <span className="text-emerald-400">{cat.count} Data</span> ({percentage}%)
                        </div>

                        {/* Bar Pillar */}
                        <div className="w-full max-w-[48px] flex flex-col justify-end h-full">
                          <div
                            style={{ height: `${Math.max(heightPercent, 6)}%` }}
                            className={`w-full rounded-t-xl bg-gradient-to-t ${cat.bgGradient} transition-all duration-500 shadow-sm ${
                              isHovered ? 'brightness-110 scale-x-105 shadow-md' : 'opacity-90'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* X-Axis Labels */}
                <div className="grid grid-cols-7 gap-2 px-2 sm:px-6 text-center">
                  {chartCategories.map((cat) => (
                    <div
                      key={cat.key}
                      onClick={() => setActiveTab(cat.tab)}
                      className="cursor-pointer group flex flex-col items-center"
                    >
                      <p className="text-[11px] font-bold text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-1">
                        {cat.label}
                      </p>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold group-hover:bg-emerald-50 group-hover:text-emerald-700 border border-slate-200/60">
                        {cat.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* View Mode 2: Donut Chart */}
        {activeChartMode === 'donut' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
            <div className="flex justify-center relative">
              <svg viewBox="0 0 100 100" className="w-56 h-56 transform drop-shadow-md">
                {renderDonutSegments()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-slate-900 tracking-tight">{totalContentItems}</span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Konten</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Rincian Proporsi Konten
              </h4>
              {chartCategories.map((cat) => {
                const percentage = totalContentItems > 0 ? ((cat.count / totalContentItems) * 100).toFixed(1) : '0';
                return (
                  <div
                    key={cat.key}
                    onClick={() => setActiveTab(cat.tab)}
                    onMouseEnter={() => setHoveredCategory(cat.key)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    className="p-2.5 rounded-xl border border-slate-200/70 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: cat.color }} />
                      <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                        {cat.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-900">{cat.count}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 font-semibold">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* View Mode 3: Percentage Breakdown Progress Bars */}
        {activeChartMode === 'breakdown' && (
          <div className="space-y-4 pt-2">
            {chartCategories.map((cat) => {
              const percentage = totalContentItems > 0 ? ((cat.count / totalContentItems) * 100).toFixed(1) : '0';
              return (
                <div
                  key={cat.key}
                  onClick={() => setActiveTab(cat.tab)}
                  className="space-y-1.5 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      {cat.label}
                    </span>
                    <span className="font-semibold text-slate-600">
                      <strong className="text-slate-900">{cat.count}</strong> item ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200/60 p-0.5">
                    <div
                      style={{ width: `${Math.max(Number(percentage), 2)}%`, backgroundColor: cat.color }}
                      className="h-full rounded-full transition-all duration-500 shadow-xs"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Two Column Layout: Recent Articles & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Recent Articles List */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-200/90 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Publikasi Artikel Terbaru</span>
              </h3>
              <button
                onClick={() => setActiveTab('articles')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {stats?.recentArticles && stats.recentArticles.length > 0 ? (
                stats.recentArticles.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => setActiveTab('articles')}
                    className="py-3.5 flex items-center justify-between gap-4 group cursor-pointer hover:bg-slate-50/80 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      {art.cover?.url ? (
                        <img
                          src={getFullImageUrl(art.cover.url)}
                          alt={art.title}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-emerald-600 transition-colors">
                          {art.title}
                        </p>
                        <div className="flex items-center gap-2.5 mt-1 text-[11px] text-slate-500">
                          {art.category && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/70">
                              {art.category.name}
                            </span>
                          )}
                          <span>{new Date(art.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold shrink-0 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Terbit</span>
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-xs text-slate-500">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">Belum ada artikel dipublikasikan</p>
                  <p className="text-slate-400 mt-1">Klik 'Tulis Berita Baru' di atas untuk memulai penulisan.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Quick Navigation Grid */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200/90 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Akses Pintas Pengelolaan</span>
            </h3>

            <div className="space-y-2.5">
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(action.tab)}
                    className="w-full p-3 rounded-xl border border-slate-200/80 bg-slate-50/70 hover:bg-white hover:border-slate-300 hover:shadow-sm flex items-center justify-between text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${action.color} shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {action.title}
                        </p>
                        <p className="text-[10px] text-slate-500 line-clamp-1">{action.desc}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

