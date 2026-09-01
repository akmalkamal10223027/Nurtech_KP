import React, { useState, useEffect } from 'react';
import { GraduationCap, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api, UPLOAD_BASE } from '../api';

export interface LoginProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const Login: React.FC<LoginProps> = ({ showToast }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [adminLogo, setAdminLogo] = useState<string | null>(() => {
    return localStorage.getItem('admin_logo') || null;
  });

  useEffect(() => {
    const handleLogoChange = () => {
      setAdminLogo(localStorage.getItem('admin_logo') || null);
    };
    window.addEventListener('admin_logo_changed', handleLogoChange);

    api.getGlobal().then((res) => {
      const fetchedLogo = res?.data?.logoUrl || res?.data?.logo?.url || res?.data?.logo;
      if (fetchedLogo && typeof fetchedLogo === 'string') {
        localStorage.setItem('admin_logo', fetchedLogo);
        setAdminLogo(fetchedLogo);
      }
    }).catch(() => {});

    return () => window.removeEventListener('admin_logo_changed', handleLogoChange);
  }, []);

  const logoSrc = adminLogo
    ? adminLogo.startsWith('http')
      ? adminLogo
      : `${UPLOAD_BASE}${adminLogo}`
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    const cleanPassword = password;

    if (!cleanEmail || !cleanPassword) {
      setError('Email dan Kata Sandi wajib diisi.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await login(cleanEmail, cleanPassword);
      showToast('Berhasil masuk ke Dashboard!', 'success');
    } catch (err: any) {
      const msg = err.message || 'Gagal login. Pastikan email dan password sesuai.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/60 border border-slate-200/90 bg-white/95 backdrop-blur-2xl transition-all">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-600/25 mb-4 text-white overflow-hidden p-1.5">
              {logoSrc ? (
                <img src={logoSrc} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <GraduationCap className="w-8 h-8" />
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Nurtech School</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">Portal Admin & Manajemen Konten</p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-600 text-xs animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Email Admin
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  disabled={loading}
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=""
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memverifikasi Akun...</span>
                </div>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
