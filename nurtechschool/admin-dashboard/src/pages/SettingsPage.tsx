import React, { useState, useEffect } from 'react';
import { Lock, User, Save, ShieldCheck, Eye, EyeOff, Image as ImageIcon, Upload } from 'lucide-react';
import { api, UPLOAD_BASE, setUser } from '../api';

export interface SettingsPageProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ showToast }) => {
  const [activeSubTab, setActiveSubTab] = useState<'password' | 'logo' | 'profile'>('password');
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
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const meRes = await api.getMe().catch(() => null);

      if (meRes) {
        setProfile({
          name: meRes.name || '',
          email: meRes.email || '',
          avatar: meRes.avatar || '',
          role: meRes.role ? meRes.role.toUpperCase() : 'ADMINISTRATOR'
        });
      }
    } catch (err: any) {
      console.error('Failed to load profile data:', err);
    } finally {
      setLoading(false);
    }
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

  // Initial Load for Logo
  useEffect(() => {
    api.getGlobal().then((res) => {
      const dbLogo = res?.data?.logoUrl || res?.data?.logo?.url || res?.data?.logo;
      if (dbLogo && typeof dbLogo === 'string') {
        setLogoUrl(dbLogo);
        localStorage.setItem('admin_logo', dbLogo);
      }
    }).catch(() => { });
  }, []);

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

  const handleSaveLogo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logoUrl.trim()) {
      showToast('URL foto logo tidak boleh kosong', 'error');
      return;
    }

    try {
      const cleanUrl = logoUrl.trim();
      await api.updateGlobal({ logoUrl: cleanUrl });
      localStorage.setItem('admin_logo', cleanUrl);
      window.dispatchEvent(new Event('admin_logo_changed'));
      showToast('Logo dashboard admin berhasil disimpan secara permanen ke database!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan logo ke database', 'error');
    }
  };

  // Avatar Upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      const url = await api.uploadFile(file);
      if (url) {
        setProfile((prev) => ({ ...prev, avatar: url }));
        showToast('Foto avatar berhasil diunggah! Klik "Simpan Profil Admin" untuk menerapkan.', 'info');
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal mengunggah foto avatar', 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProfileLoading(true);
      const res = await api.updateMe({
        name: profile.name,
        email: profile.email,
        avatar: profile.avatar
      });
      if (res?.user) {
        setUser(res.user);
      }
      await api.updateProfile(profile).catch(() => { });
      showToast('Profil admin berhasil diperbarui!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal memperbarui profil', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const previewLogoSrc = logoUrl
    ? logoUrl.startsWith('http')
      ? logoUrl
      : `${UPLOAD_BASE}${logoUrl}`
    : null;

  const previewAvatarSrc = profile.avatar
    ? profile.avatar.startsWith('http')
      ? profile.avatar
      : profile.avatar.startsWith('/')
        ? `${UPLOAD_BASE}${profile.avatar}`
        : `${UPLOAD_BASE}/${profile.avatar}`
    : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Sub-Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('password')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeSubTab === 'password'
            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 shadow-sm'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
        >
          <Lock className="w-4 h-4" />
          <span>Ubah Sandi</span>
        </button>

        <button
          onClick={() => setActiveSubTab('logo')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeSubTab === 'logo'
            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 shadow-sm'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Ganti Logo Admin</span>
        </button>

        <button
          onClick={() => setActiveSubTab('profile')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeSubTab === 'profile'
            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 shadow-sm'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
        >
          <User className="w-4 h-4" />
          <span>Profil Admin</span>
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
                placeholder="••••••••"
                className="w-full px-3.5 py-2 pr-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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
                className="w-full px-3.5 py-2 pr-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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
            <span>{passLoading ? 'Menyimpan...' : 'Perbarui Kata Sandi'}</span>
          </button>
        </form>
      )}

      {/* Tab 2: Ganti Logo Admin Dashboard */}
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

          <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
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
        <form onSubmit={handleSaveProfile} className="glass-card rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-5 max-w-2xl shadow-sm">
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
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              File Avatar Profil
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={profile.avatar}
                onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
                placeholder="/uploads/avatar-admin.png atau URL foto avatar"
                className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
              />
              <label className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-700 shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingAvatar ? 'Mengunggah...' : 'Upload Avatar'}</span>
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>
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
    </div>
  );
};
