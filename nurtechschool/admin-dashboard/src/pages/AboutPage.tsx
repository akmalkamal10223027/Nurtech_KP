import React, { useState, useEffect } from 'react';
import { UserCheck, Target, Save, Upload, Heart } from 'lucide-react';
import { api, UPLOAD_BASE } from '../api';

export interface AboutPageProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ showToast }) => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ name: '', description: '', avatarUrl: '' });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [motto, setMotto] = useState({ title: '', body: '' });
  const [vision, setVision] = useState({ visi: '', misi: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profRes, aboutRes, visRes] = await Promise.all([
        api.getProfile().catch(() => ({ data: {} })),
        api.getAbout().catch(() => ({ data: {} })),
        api.getVisionMission().catch(() => ({ data: {} }))
      ]);

      if (profRes?.data) {
        setProfile({
          name: profRes.data.name || '',
          description: profRes.data.description || '',
          avatarUrl: profRes.data.avatar?.url || ''
        });
      }

      if (aboutRes?.data) {
        const quoteBlock = aboutRes.data.blocks?.find((b: any) => b.__component === 'shared.quote') || {};
        setMotto({
          title: quoteBlock.title || aboutRes.data.title || 'Motto Kami',
          body: quoteBlock.body || ''
        });
      }

      if (visRes?.data) {
        setVision({
          visi: visRes.data.visi || '',
          misi: visRes.data.misi || ''
        });
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal memuat profil & visi misi', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingAvatar(true);
      const url = await api.uploadFile(file);
      if (url) setProfile(prev => ({ ...prev, avatarUrl: url }));
      showToast('Foto Kepala Sekolah berhasil diunggah!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal mengunggah foto', 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateProfile(profile);
      showToast('Profil Kepala Sekolah berhasil disimpan!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan profil', 'error');
    }
  };

  const handleSaveMotto = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateAbout({
        title: motto.title,
        blocks: [
          {
            __component: 'shared.quote',
            title: motto.title,
            body: motto.body
          }
        ]
      });
      showToast('Motto Sekolah berhasil disimpan!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan motto', 'error');
    }
  };

  const handleSaveVision = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateVisionMission(vision);
      showToast('Visi & Misi berhasil disimpan!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan visi misi', 'error');
    }
  };

  const getFullImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${UPLOAD_BASE}${url}`;
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-slate-500">Memuat profil & visi misi...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Profil & Visi Misi Sekolah</h2>
        <p className="text-xs text-slate-500">Kelola profil pimpinan, motto utama, serta visi & misi sekolah</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Profile Section */}
        <form onSubmit={handleSaveProfile} className="glass-card rounded-2xl p-6 border border-slate-200/90 bg-white space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-700 border-b border-slate-100 pb-3">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Profil & Sambutan Kepala Sekolah</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
            <input
              type="text"
              required
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Contoh: Dr. Ahmad Dahlan, M.Pd."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Foto Kepala Sekolah (Unggah File / URL)</label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={profile.avatarUrl}
                onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                placeholder="URL Gambar atau unggah file"
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
              <label className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 flex items-center gap-2 cursor-pointer shrink-0">
                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                <span>{uploadingAvatar ? 'Mengunggah...' : 'Pilih File'}</span>
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>
            {profile.avatarUrl && (
              <div className="mt-2 w-24 h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <img src={getFullImageUrl(profile.avatarUrl)} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Sambutan Kepala Sekolah</label>
            <textarea
              rows={5}
              value={profile.description}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              placeholder="Tuliskan kata sambutan singkat..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button type="submit" className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/15">
            <Save className="w-4 h-4 text-white" />
            <span>Simpan Profil</span>
          </button>
        </form>

        {/* Motto & Vision Section */}
        <div className="space-y-6">
          {/* Motto Form */}
          <form onSubmit={handleSaveMotto} className="glass-card rounded-2xl p-6 border border-slate-200/90 bg-white space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-700 border-b border-slate-100 pb-3">
              <Heart className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Motto Utama Sekolah</h3>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Motto (Title)</label>
              <input
                type="text"
                required
                value={motto.title}
                onChange={(e) => setMotto({ ...motto, title: e.target.value })}
                placeholder="Contoh: Motto Kami"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kalimat Motto (Tagline)</label>
              <textarea
                rows={2}
                required
                value={motto.body}
                onChange={(e) => setMotto({ ...motto, body: e.target.value })}
                placeholder="Contoh: Mendidik dengan Hati, Menginspirasi dengan Prestasi"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/15">
              <Save className="w-4 h-4 text-white" />
              <span>Simpan Motto</span>
            </button>
          </form>

          {/* Vision & Mission Form */}
          <form onSubmit={handleSaveVision} className="glass-card rounded-2xl p-6 border border-slate-200/90 bg-white space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-700 border-b border-slate-100 pb-3">
              <Target className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Visi & Misi Sekolah</h3>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Visi Sekolah</label>
              <textarea
                rows={3}
                required
                value={vision.visi}
                onChange={(e) => setVision({ ...vision, visi: e.target.value })}
                placeholder="Visi sekolah..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Misi Sekolah</label>
              <textarea
                rows={5}
                required
                value={vision.misi}
                onChange={(e) => setVision({ ...vision, misi: e.target.value })}
                placeholder="Misi sekolah..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button type="submit" className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/15">
              <Save className="w-4 h-4 text-white" />
              <span>Simpan Visi & Misi</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
