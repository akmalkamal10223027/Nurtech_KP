import React, { useState, useEffect } from 'react';
import {
  Eye,
  UserCheck,
  Download,
  MessageSquare,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { api } from '../api';

export interface DashboardOverviewProps {
  setActiveTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'today' | '7d' | '30d' | 'all'>('7d');

  useEffect(() => {
    fetchAnalytics(period, true);

    const interval = setInterval(() => {
      fetchAnalytics(period, false);
    }, 5000);

    return () => clearInterval(interval);
  }, [period]);

  const fetchAnalytics = async (p: string, showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      const data = await api.getAnalyticsSummary(p);
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const totals = analytics?.totals || {
    allTime: { pageViews: 0, registerClicks: 0, downloadClicks: 0, whatsappClicks: 0 },
    period: { pageViews: 0, registerClicks: 0, downloadClicks: 0, whatsappClicks: 0 }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-emerald-500/20">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Statistik Aktivitas Pengunjung Web
            </h1>
            <p className="text-sm text-emerald-100/80 leading-relaxed">
              Pantau jumlah calon pendaftar, unduhan brosur, pesan WhatsApp, dan kunjungan halaman web sekolah Nurtech secara akurat.
            </p>
          </div>

          {/* Period Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/40 backdrop-blur-md border border-white/10 shrink-0">
            {[
              { id: 'today', label: 'Hari Ini' },
              { id: '7d', label: '7 Hari' },
              { id: '30d', label: '30 Hari' },
              { id: 'all', label: 'Semua' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${period === p.id
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
              >
                {p.label}
              </button>
            ))}

            <button
              onClick={() => fetchAnalytics(period, true)}
              title="Refresh Data"
              className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors ml-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Page Views */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-emerald-300 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Eye className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              Web Visitors
            </span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black text-slate-900 tracking-tight">
              {loading ? '...' : totals.period?.pageViews?.toLocaleString() ?? 0}
            </p>
            <p className="text-xs font-bold text-slate-700 mt-1">Total Pengunjung Web</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Semua waktu: <span className="font-semibold text-slate-600">{totals.allTime?.pageViews?.toLocaleString() ?? 0}</span>
            </p>
          </div>
        </div>

        {/* Card 2: Klik Daftar Sekarang */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-amber-300 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <UserCheck className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
              Calon Pendaftar
            </span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black text-slate-900 tracking-tight">
              {loading ? '...' : totals.period?.registerClicks?.toLocaleString() ?? 0}
            </p>
            <p className="text-xs font-bold text-slate-700 mt-1">Klik "Daftar Sekarang"</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Semua waktu: <span className="font-semibold text-slate-600">{totals.allTime?.registerClicks?.toLocaleString() ?? 0}</span>
            </p>
          </div>
        </div>

        {/* Card 3: Klik Download App */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-indigo-300 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Download className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
              Unduh App
            </span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black text-slate-900 tracking-tight">
              {loading ? '...' : totals.period?.downloadClicks?.toLocaleString() ?? 0}
            </p>
            <p className="text-xs font-bold text-slate-700 mt-1">Klik "Download App"</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Semua waktu: <span className="font-semibold text-slate-600">{totals.allTime?.downloadClicks?.toLocaleString() ?? 0}</span>
            </p>
          </div>
        </div>


        {/* Card 4: Klik WhatsApp */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-rose-300 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <MessageSquare className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
              Pesan & Kontak
            </span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black text-slate-900 tracking-tight">
              {loading ? '...' : totals.period?.whatsappClicks?.toLocaleString() ?? 0}
            </p>
            <p className="text-xs font-bold text-slate-700 mt-1">Klik "Hubungi WhatsApp"</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Semua waktu: <span className="font-semibold text-slate-600">{totals.allTime?.whatsappClicks?.toLocaleString() ?? 0}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
