import React, { useState, useEffect } from 'react';
import { Smartphone, Save, Upload, Trash2, Plus, Image as ImageIcon, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { api, UPLOAD_BASE } from '../api';

export interface AppSectionPageProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export interface IFeatureItem {
  id?: number;
  featureTitle: string;
  featureDescription: string;
  featureImage?: string;
}

export const AppSectionPage: React.FC<AppSectionPageProps> = ({ showToast }) => {
  const [loading, setLoading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  // Pagination for Features Table
  const [featurePage, setFeaturePage] = useState(1);
  const [featuresPerPage, setFeaturesPerPage] = useState(2);

  const [appData, setAppData] = useState({
    badge: 'Aplikasi Mobile Sekolah',
    title: 'Aplikasi Pendukung',
    titleHighlight: 'Nurtech Boarding School',
    description: '',
    appStoreLink: '',
    googlePlayLink: '',
    features: [
      {
        id: 1,
        featureTitle: 'Pantau Hafalan & Presensi',
        featureDescription: 'Laporan perkembangan santri dikirim langsung ke smartphone orang tua.',
        featureImage: ''
      }
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
            featureDescription: f.featureDescription || f.description || '',
            featureImage: f.featureImage || f.image || imagesUrls[idx] || ''
          }))
          : [
            {
              id: 1,
              featureTitle: 'Pantau Hafalan & Presensi',
              featureDescription: 'Laporan perkembangan santri dikirim langsung ke smartphone orang tua.',
              featureImage: imagesUrls[0] || ''
            }
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
    const newFeatures = [
      ...appData.features,
      {
        id: Date.now(),
        featureTitle: 'Fitur Aplikasi Baru',
        featureDescription: 'Deskripsi singkat fitur pendukung aplikasi.',
        featureImage: ''
      }
    ];
    setAppData(prev => ({
      ...prev,
      features: newFeatures
    }));
    // Jump to the last page where the new feature is added
    const newTotalPages = Math.ceil(newFeatures.length / featuresPerPage);
    setFeaturePage(newTotalPages);
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = appData.features.filter((_, i) => i !== index);
    setAppData(prev => ({
      ...prev,
      features: newFeatures
    }));
    const newTotalPages = Math.max(1, Math.ceil(newFeatures.length / featuresPerPage));
    if (featurePage > newTotalPages) {
      setFeaturePage(newTotalPages);
    }
  };

  const handleFeatureImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, featureIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingIndex(featureIndex);
      const url = await api.uploadFile(file);
      if (url) {
        setAppData(prev => {
          const newFeats = [...prev.features];
          newFeats[featureIndex] = { ...newFeats[featureIndex], featureImage: url };
          return { ...prev, features: newFeats };
        });
        showToast('Foto mockup HP fitur berhasil diunggah!', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal mengunggah foto mockup', 'error');
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleSaveApp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const allFeatureImages = appData.features.map(f => f.featureImage).filter(Boolean) as string[];
      const payload = {
        ...appData,
        images: allFeatureImages.length > 0 ? allFeatureImages : appData.images
      };

      await api.updateAppSection(payload);
      showToast('Pengaturan Aplikasi Boarding School berhasil disimpan!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan pengaturan aplikasi', 'error');
    }
  };

  const getFullImageUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${UPLOAD_BASE}${url}`;
  };

  // Pagination Calculations
  const totalFeaturePages = Math.max(1, Math.ceil(appData.features.length / featuresPerPage));
  const validFeaturePage = Math.min(featurePage, totalFeaturePages);

  const startFeatureIndex = (validFeaturePage - 1) * featuresPerPage;
  const paginatedFeatures = appData.features
    .map((feat, realIdx) => ({ feat, realIdx }))
    .slice(startFeatureIndex, startFeatureIndex + featuresPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalFeaturePages) {
      setFeaturePage(newPage);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-slate-500">Memuat konten aplikasi...</div>;
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <form onSubmit={handleSaveApp} className="space-y-5">
        {/* 2-Column Grid Layout (Side-by-Side) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

          {/* LEFT COLUMN: Informasi & Link Store (5 Cols) */}
          <div className="lg:col-span-5 glass-card rounded-2xl p-5 border border-slate-200/90 bg-white space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Informasi Utama & Link Store</h4>
            </div>

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

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Sub Judul Highlight</label>
              <input
                type="text"
                value={appData.titleHighlight}
                onChange={(e) => setAppData({ ...appData, titleHighlight: e.target.value })}
                placeholder="Contoh: Nurtech Boarding School"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-emerald-700 font-bold focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Deskripsi Ringkas</label>
              <textarea
                rows={3}
                value={appData.description}
                onChange={(e) => setAppData({ ...appData, description: e.target.value })}
                placeholder="Aplikasi khusus wali santri & siswa untuk memantau perkembangan hafalan, nilai, serta presensi secara real-time."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100">
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
          </div>

          {/* RIGHT COLUMN: Fitur & Foto Mockup HP (Tabel Input + Paginasi) */}
          <div className="lg:col-span-7 glass-card rounded-2xl p-5 border border-slate-200/90 bg-white space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Fitur Aplikasi & Foto Mockup HP</h4>
                <p className="text-[11px] text-slate-500">Tabel pasangan judul, deskripsi fitur, dan gambar mockup HP.</p>
              </div>

              <div className="flex items-center gap-2">
                {/* Items per page selector */}
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[11px] text-slate-400">Baris:</span>
                  <select
                    value={featuresPerPage}
                    onChange={(e) => {
                      setFeaturesPerPage(Number(e.target.value));
                      setFeaturePage(1);
                    }}
                    className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none"
                  >
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={5}>5</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Fitur</span>
                </button>
              </div>
            </div>

            {/* Table Container (No Vertical Scroll) */}
            <div className="border border-slate-200/90 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200/90 text-slate-600 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="px-3 py-3 w-10 text-center">#</th>
                      <th className="px-3 py-3 w-28">Mockup HP</th>
                      <th className="px-4 py-3">Judul & Deskripsi Fitur</th>
                      <th className="px-3 py-3 w-12 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {paginatedFeatures.map(({ feat, realIdx }) => (
                      <tr key={realIdx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-3 py-3 font-mono font-bold text-slate-500 text-center align-top pt-4">
                          #{realIdx + 1}
                        </td>
                        <td className="px-3 py-3 align-top">
                          <div className="space-y-1.5">
                            <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center p-1">
                              {feat.featureImage ? (
                                <img src={getFullImageUrl(feat.featureImage)} alt={feat.featureTitle} className="w-full h-full object-contain" />
                              ) : (
                                <ImageIcon className="w-6 h-6 text-slate-300" />
                              )}
                            </div>
                            <label className="px-2 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] font-semibold flex items-center justify-center gap-1 cursor-pointer w-24 shadow-sm">
                              <Upload className="w-3 h-3 text-emerald-600" />
                              <span>{uploadingIndex === realIdx ? '...' : 'Upload'}</span>
                              <input type="file" accept="image/*" onChange={(e) => handleFeatureImageUpload(e, realIdx)} className="hidden" />
                            </label>
                          </div>
                        </td>
                        <td className="px-4 py-3 space-y-2 align-top">
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Judul Fitur</label>
                            <input
                              type="text"
                              value={feat.featureTitle}
                              onChange={(e) => {
                                const newFeats = [...appData.features];
                                newFeats[realIdx].featureTitle = e.target.value;
                                setAppData({ ...appData, features: newFeats });
                              }}
                              placeholder="Judul Fitur (cth: Pantau Hafalan & Presensi)"
                              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Deskripsi Fitur</label>
                            <textarea
                              rows={2}
                              value={feat.featureDescription}
                              onChange={(e) => {
                                const newFeats = [...appData.features];
                                newFeats[realIdx].featureDescription = e.target.value;
                                setAppData({ ...appData, features: newFeats });
                              }}
                              placeholder="Laporan perkembangan santri dikirim langsung ke smartphone orang tua."
                              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:bg-white focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center align-top pt-4">
                          {appData.features.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveFeature(realIdx)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Hapus Fitur"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination Footer */}
              <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                <div className="text-slate-500 font-medium text-[11px]">
                  Menampilkan{' '}
                  <span className="font-bold text-slate-800">
                    {appData.features.length === 0 ? 0 : startFeatureIndex + 1} - {Math.min(startFeatureIndex + featuresPerPage, appData.features.length)}
                  </span>{' '}
                  dari <span className="font-bold text-slate-800">{appData.features.length}</span> fitur
                </div>

                {totalFeaturePages > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handlePageChange(validFeaturePage - 1)}
                      disabled={validFeaturePage === 1}
                      className="p-1 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>

                    {Array.from({ length: totalFeaturePages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                          validFeaturePage === pageNum
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => handlePageChange(validFeaturePage + 1)}
                      disabled={validFeaturePage === totalFeaturePages}
                      className="p-1 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Save Action Bar */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/15 transition-all"
          >
            <Save className="w-4 h-4 text-white" />
            <span>Simpan Pengaturan Aplikasi</span>
          </button>
        </div>
      </form>

    </div>
  );
};
