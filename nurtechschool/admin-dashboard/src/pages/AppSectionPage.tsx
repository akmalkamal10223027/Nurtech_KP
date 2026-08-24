import React, { useState, useEffect } from 'react';
import { Smartphone, Save, Upload, Trash2, Plus } from 'lucide-react';
import { api, UPLOAD_BASE } from '../api';

export interface AppSectionPageProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export interface IFeatureItem {
  id?: number;
  featureTitle: string;
  featureDescription: string;
}

export const AppSectionPage: React.FC<AppSectionPageProps> = ({ showToast }) => {
  const [loading, setLoading] = useState(false);
  const [uploadingAppImage, setUploadingAppImage] = useState(false);
  const [appData, setAppData] = useState({
    badge: 'Aplikasi Mobile Sekolah',
    title: 'Aplikasi Pendukung',
    titleHighlight: 'Nurtech Boarding School',
    description: '',
    appStoreLink: '',
    googlePlayLink: '',
    features: [
      { id: 1, featureTitle: 'Pantau Hafalan & Presensi', featureDescription: 'Laporan perkembangan santri dikirim langsung ke smartphone orang tua.' }
    ] as IFeatureItem[],
    images: [] as string[]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const appRes = await api.getAppSection().catch(() => ({ data: [] }));
      if (appRes?.data && appRes.data.length > 0) {
        const item = appRes.data[0];
        const imagesUrls = Array.isArray(item.images) ? item.images.map((img: any) => typeof img === 'string' ? img : img.url) : [];
        const featList = item.features || item.Stakeholder?.[0]?.featureitem || [];
        const parsedFeatures = Array.isArray(featList) && featList.length > 0
          ? featList.map((f: any, idx: number) => ({
              id: f.id || idx + 1,
              featureTitle: f.featureTitle || f.title || '',
              featureDescription: f.featureDescription || f.description || ''
            }))
          : [
              { id: 1, featureTitle: 'Pantau Hafalan & Presensi', featureDescription: 'Laporan perkembangan santri dikirim langsung ke smartphone orang tua.' }
            ];

        setAppData({
          badge: item.badge || 'Aplikasi Mobile Sekolah',
          title: item.title || 'Aplikasi Pendukung',
          titleHighlight: item.titleHighlight || 'Nurtech Boarding School',
          description: item.description || '',
          appStoreLink: item.appStoreLink || '',
          googlePlayLink: item.googlePlayLink || '',
          features: parsedFeatures,
          images: imagesUrls
        });
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal memuat data aplikasi', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeature = () => {
    setAppData(prev => ({
      ...prev,
      features: [
        ...prev.features,
        { id: Date.now(), featureTitle: 'Fitur Aplikasi Baru', featureDescription: 'Deskripsi singkat fitur pendukung aplikasi.' }
      ]
    }));
  };

  const handleRemoveFeature = (index: number) => {
    setAppData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleAppImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    try {
      setUploadingAppImage(true);
      const uploadedUrls = await api.uploadMultipleFiles(files);
      setAppData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
      showToast(`${uploadedUrls.length} mockup aplikasi berhasil diunggah!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal mengunggah mockup aplikasi', 'error');
    } finally {
      setUploadingAppImage(false);
    }
  };

  const handleRemoveAppImage = (index: number) => {
    setAppData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSaveApp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateAppSection(appData);
      showToast('Pengaturan Aplikasi Boarding School berhasil disimpan!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan pengaturan aplikasi', 'error');
    }
  };

  const getFullImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${UPLOAD_BASE}${url}`;
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-slate-500">Memuat konten aplikasi...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <form onSubmit={handleSaveApp} className="glass-card rounded-2xl p-6 border border-slate-200/90 bg-white space-y-6 max-w-3xl shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Smartphone className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Aplikasi Mobile & Boarding School</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Badge Top Tag</label>
            <input
              type="text"
              value={appData.badge}
              onChange={(e) => setAppData({ ...appData, badge: e.target.value })}
              placeholder="Contoh: Aplikasi Mobile Sekolah"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Judul Utama</label>
            <input
              type="text"
              value={appData.title}
              onChange={(e) => setAppData({ ...appData, title: e.target.value })}
              placeholder="Contoh: Aplikasi Pendukung"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Sub Judul Highlight (Nurtech Boarding School)</label>
          <input
            type="text"
            value={appData.titleHighlight}
            onChange={(e) => setAppData({ ...appData, titleHighlight: e.target.value })}
            placeholder="Contoh: Nurtech Boarding School"
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-emerald-700 font-bold focus:bg-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Deskripsi Aplikasi</label>
          <textarea
            rows={3}
            value={appData.description}
            onChange={(e) => setAppData({ ...appData, description: e.target.value })}
            placeholder="Aplikasi khusus wali santri & siswa untuk memantau perkembangan hafalan, nilai, serta presensi secara real-time."
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Link App Store (iOS)</label>
            <input
              type="text"
              value={appData.appStoreLink}
              onChange={(e) => setAppData({ ...appData, appStoreLink: e.target.value })}
              placeholder="https://apps.apple.com/..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Link Google Play Store (Android)</label>
            <input
              type="text"
              value={appData.googlePlayLink}
              onChange={(e) => setAppData({ ...appData, googlePlayLink: e.target.value })}
              placeholder="https://play.google.com/..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Fitur Transisi Aplikasi (Orang Tua & Santri)</h4>
              <p className="text-[11px] text-slate-500">Tambahkan beberapa fitur yang akan berganti slide secara otomatis di situs publik</p>
            </div>
            <button
              type="button"
              onClick={handleAddFeature}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Fitur</span>
            </button>
          </div>

          <div className="space-y-3">
            {appData.features.map((feat, idx) => (
              <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-2 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Fitur #{idx + 1}</span>
                  {appData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-rose-600 hover:text-rose-700 text-xs font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Judul Fitur</label>
                  <input
                    type="text"
                    value={feat.featureTitle}
                    onChange={(e) => {
                      const newFeats = [...appData.features];
                      newFeats[idx].featureTitle = e.target.value;
                      setAppData({ ...appData, features: newFeats });
                    }}
                    placeholder="Contoh: Pantau Hafalan & Presensi"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Deskripsi Fitur</label>
                  <textarea
                    rows={2}
                    value={feat.featureDescription}
                    onChange={(e) => {
                      const newFeats = [...appData.features];
                      newFeats[idx].featureDescription = e.target.value;
                      setAppData({ ...appData, features: newFeats });
                    }}
                    placeholder="Laporan perkembangan santri dikirim langsung ke smartphone orang tua."
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Gambar Mockup Aplikasi (Tampilan HP)</label>
          <div className="flex items-center gap-3 mb-3">
            <label className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs border border-slate-300 flex items-center gap-2 cursor-pointer transition-all">
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>{uploadingAppImage ? 'Mengunggah...' : 'Unggah Mockup HP'}</span>
              <input type="file" accept="image/*" multiple onChange={handleAppImageUpload} className="hidden" />
            </label>
            <span className="text-[11px] text-slate-400">Pilih gambar mockup tampilan aplikasi (PNG / JPG)</span>
          </div>

          {appData.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {appData.images.map((imgUrl, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-[9/16] bg-slate-100">
                  <img src={getFullImageUrl(imgUrl)} alt={`Mockup ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveAppImage(idx)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100">
          <button type="submit" className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/15">
            <Save className="w-4 h-4 text-white" />
            <span>Simpan Pengaturan Aplikasi</span>
          </button>
        </div>
      </form>
    </div>
  );
};
