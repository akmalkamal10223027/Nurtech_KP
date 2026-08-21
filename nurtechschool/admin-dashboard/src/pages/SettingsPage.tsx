import React, { useState, useEffect } from 'react';
import { Globe, Lock, Sun, Moon, Monitor, User, Save, ShieldCheck, Check, Eye, EyeOff, Image as ImageIcon, Upload, RefreshCw } from 'lucide-react';
import { api, UPLOAD_BASE } from '../api';

export interface SettingsPageProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ showToast }) => {
  const [activeSubTab, setActiveSubTab] = useState<'password' | 'theme' | 'logo' | 'profile' | 'seo'>('password');
  const [loading, setLoading] = useState(false);

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  // Theme state
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('admin_theme') as 'light' | 'dark' | 'system') || 'light';
  });

  // Logo state
  const [logoUrl, setLogoUrl] = useState<string>(() => {
    return localStorage.getItem('admin_logo') || '';
  });
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    avatar: '',
    role: 'Administrator'
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Global SEO state
  const [global, setGlobal] = useState({
    siteName: '',
    siteDescription: '',
    metaTitle: '',
    metaDescription: ''
  });
  const [globalLoading, setGlobalLoading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [globRes, meRes] = await Promise.all([
        api.getGlobal().catch(() => ({ data: {} })),
        api.getMe().catch(() => null)
      ]);

      if (globRes?.data) {
        setGlobal({
          siteName: globRes.data.siteName || '',
          siteDescription: globRes.data.siteDescription || '',
          metaTitle: globRes.data.defaultSeo?.metaTitle || globRes.data.metaTitle || '',
          metaDescription: globRes.data.defaultSeo?.metaDescription || globRes.data.metaDescription || ''
        });
      }

      if (meRes) {
        setProfile({
          name: meRes.name || '',
          email: meRes.email || '',
          avatar: meRes.avatar || '',
          role: meRes.role ? meRes.role.toUpperCase() : 'ADMINISTRATOR'
        });
      }
    } catch (err: any) {
      console.error('Failed to load settings data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Apply Theme Mode
  const applyTheme = (mode: 'light' | 'dark' | 'system') => {
    setThemeMode(mode);
    localStorage.setItem('admin_theme', mode);

    let isDark = false;
    if (mode === 'dark') {
      isDark = true;
    } else if (mode === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    showToast(`Mode tampilan diubah ke ${mode === 'dark' ? 'Mode Gelap' : mode === 'light' ? 'Mode Terang' : 'Sistem'}`, 'success');
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordData.currentPassword) {
      showToast('Kata sandi saat ini wajib diisi', 'error');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showToast('Kata sandi baru minimal 6 karakter', 'error');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('Konfirmasi kata sandi baru tidak cocok', 'error');
      return;
    }

    try {
      setPassLoading(true);
      await api.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        passwordConfirmation: passwordData.confirmPassword
      });
      showToast('Kata sandi berhasil diperbarui!', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      showToast(err.message || 'Gagal mengubah kata sandi', 'error');
    } finally {
      setPassLoading(false);
    }
  };

  // Logo Upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      const url = await api.uploadFile(file);
      if (url) {
        setLogoUrl(url);
        showToast('Foto logo berhasil diunggah! Klik "Simpan Logo" untuk menerapkan.', 'info');
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal mengunggah foto logo', 'error');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSaveLogo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logoUrl.trim()) {
      showToast('URL foto logo tidak boleh kosong', 'error');
      return;
    }

    localStorage.setItem('admin_logo', logoUrl.trim());
    window.dispatchEvent(new Event('admin_logo_changed'));
    showToast('Logo dashboard admin berhasil diperbarui!', 'success');
  };

  const handleResetLogo = () => {
    localStorage.removeItem('admin_logo');
    setLogoUrl('');
    window.dispatchEvent(new Event('admin_logo_changed'));
    showToast('Logo dashboard direset ke tampilan ikon standar!', 'info');
  };

  // Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProfileLoading(true);
      await api.updateProfile(profile);
      showToast('Profil admin berhasil diperbarui!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyegarkan profil', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  // Save Global & SEO
  const handleSaveGlobal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setGlobalLoading(true);
      await api.updateGlobal({
        siteName: global.siteName,
        siteDescription: global.siteDescription,
        defaultSeo: {
          metaTitle: global.metaTitle,
          metaDescription: global.metaDescription
        }
      });
      showToast('Pengaturan SEO & Identitas Website disimpan!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan SEO website', 'error');
    } finally {
      setGlobalLoading(false);
    }
  };

  const previewLogoSrc = logoUrl
    ? logoUrl.startsWith('http')
      ? logoUrl
      : `${UPLOAD_BASE}${logoUrl}`
    : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Pengaturan Dashboard & Website</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Kelola kata sandi admin, tema antarmuka, logo sekolah, serta identitas website
        </p>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('password')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'password'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Ubah Sandi</span>
        </button>

        <button
          onClick={() => setActiveSubTab('theme')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'theme'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sun className="w-4 h-4" />
          <span>Mode Gelap / Terang</span>
        </button>

        <button
          onClick={() => setActiveSubTab('logo')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'logo'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Ganti Logo Admin</span>
        </button>

        <button
          onClick={() => setActiveSubTab('profile')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'profile'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profil Admin</span>
        </button>

        <button
          onClick={() => setActiveSubTab('seo')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'seo'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Identitas & SEO</span>
        </button>
      </div>

      {/* Tab 1: Ubah Sandi */}
      {activeSubTab === 'password' && (
        <form onSubmit={handleChangePassword} className="glass-card rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 max-w-xl shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Perbarui Kata Sandi</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Ganti kata sandi login admin untuk menjaga keamanan akses</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Kata Sandi Saat Ini</label>
            <div className="relative">
              <input
                type={showCurrentPass ? 'text' : 'password'}
                required
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="Masukkan kata sandi lama..."
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Kata Sandi Baru</label>
            <div className="relative">
              <input
                type={showNewPass ? 'text' : 'password'}
                required
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Minimal 6 karakter..."
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Konfirmasi Kata Sandi Baru</label>
            <input
              type="password"
              required
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              placeholder="Ulangi kata sandi baru..."
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={passLoading}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/15 disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-white" />
            <span>{passLoading ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}</span>
          </button>
        </form>
      )}

      {/* Tab 2: Mode Gelap / Terang */}
      {activeSubTab === 'theme' && (
        <div className="glass-card rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-5 max-w-2xl shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Sun className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Mode Tampilan Dashboard</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Pilih skema warna antarmuka yang nyaman untuk aktivitas Anda</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Light Mode Card */}
            <div
              onClick={() => applyTheme('light')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-between text-center gap-3 relative ${
                themeMode === 'light'
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-sm ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300'
              }`}
            >
              {themeMode === 'light' && (
                <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </span>
              )}
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-xs">
                <Sun className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Mode Terang (Light)</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Tampilan cerah & bersih</p>
              </div>
            </div>

            {/* Dark Mode Card */}
            <div
              onClick={() => applyTheme('dark')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-between text-center gap-3 relative ${
                themeMode === 'dark'
                  ? 'border-emerald-500 bg-slate-800 text-white shadow-sm ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300'
              }`}
            >
              {themeMode === 'dark' && (
                <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </span>
              )}
              <div className="w-12 h-12 rounded-xl bg-indigo-900 text-indigo-300 flex items-center justify-center shadow-xs">
                <Moon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Mode Gelap (Dark)</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Nyaman untuk mata malam hari</p>
              </div>
            </div>

            {/* System Preference */}
            <div
              onClick={() => applyTheme('system')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-between text-center gap-3 relative ${
                themeMode === 'system'
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-sm ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300'
              }`}
            >
              {themeMode === 'system' && (
                <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </span>
              )}
              <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 flex items-center justify-center shadow-xs">
                <Monitor className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Sistem (Otomatis)</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Mengikuti tema OS Anda</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Ganti Logo Admin Dashboard */}
      {activeSubTab === 'logo' && (
        <form onSubmit={handleSaveLogo} className="glass-card rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-5 max-w-2xl shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <ImageIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Pengaturan Logo Dashboard Admin</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Unggah foto/logo instansi untuk ditampilkan pada header sidebar admin</p>
            </div>
          </div>

          {/* Logo Preview Section */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-emerald-600 p-2 flex items-center justify-center shadow-lg shadow-emerald-600/20 text-white shrink-0 overflow-hidden">
              {previewLogoSrc ? (
                <img src={previewLogoSrc} alt="Preview Logo" className="w-full h-full object-contain" />
              ) : (
                <span className="text-xs font-bold uppercase text-center">Belum Ada Logo</span>
              )}
            </div>

            <div className="space-y-1.5 text-center sm:text-left">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Pratinjau Logo Aktif</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Logo ini akan ditampilkan secara langsung pada pojok kiri atas antarmuka Admin Control Center.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Foto / File Logo (Upload / URL)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="/uploads/logo-sekolah.png atau URL foto logo"
                className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
              />
              <label className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-700 shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingLogo ? 'Mengunggah...' : 'Upload Logo'}</span>
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleResetLogo}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Standar</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/15"
            >
              <Save className="w-4 h-4 text-white" />
              <span>Simpan Logo Dashboard</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: Profil Akun Admin */}
      {activeSubTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="glass-card rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 max-w-2xl shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Profil Akun Administrator</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Atur nama pengguna, email kontak, dan foto profil admin</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap Admin</label>
            <input
              type="text"
              required
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Nama Administrator..."
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Login Admin</label>
            <input
              type="email"
              required
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              placeholder="admin@nurtech.sch.id"
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">URL Avatar Foto Profil</label>
            <input
              type="text"
              value={profile.avatar}
              onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
              placeholder="https://images.unsplash.com/... atau URL foto avatar"
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={profileLoading}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/15 disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-white" />
            <span>{profileLoading ? 'Menyimpan Profil...' : 'Simpan Profil Admin'}</span>
          </button>
        </form>
      )}

      {/* Tab 5: Identitas Website & SEO Meta */}
      {activeSubTab === 'seo' && (
        <form onSubmit={handleSaveGlobal} className="glass-card rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 max-w-2xl shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Identitas Website & Optimasi SEO</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Atur nama instansi, deskripsi publikasi, serta meta tags untuk mesin pencari Google</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Website / Sekolah</label>
            <input
              type="text"
              required
              value={global.siteName}
              onChange={(e) => setGlobal({ ...global, siteName: e.target.value })}
              placeholder="Nurtech School"
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Deskripsi Umum Website</label>
            <textarea
              rows={3}
              value={global.siteDescription}
              onChange={(e) => setGlobal({ ...global, siteDescription: e.target.value })}
              placeholder="Deskripsi singkat seputar sekolah..."
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Meta Title (SEO Google)</label>
              <input
                type="text"
                value={global.metaTitle}
                onChange={(e) => setGlobal({ ...global, metaTitle: e.target.value })}
                placeholder="Nurtech School - Islamic Tech Boarding School"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Meta Description (SEO Google)</label>
              <textarea
                rows={3}
                value={global.metaDescription}
                onChange={(e) => setGlobal({ ...global, metaDescription: e.target.value })}
                placeholder="Deskripsi pencarian di mesin pencari Google..."
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={globalLoading}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/15 disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-white" />
            <span>{globalLoading ? 'Menyimpan Identitas...' : 'Simpan Pengaturan SEO'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
