import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, Upload, Link2, Search, ChevronLeft, ChevronRight, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { api, UPLOAD_BASE } from '../api';
import { Modal } from '../components/Modal';
import { IBanner } from '../types';

export interface BannersPageProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const BannersPage: React.FC<BannersPageProps> = ({ showToast }) => {
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<IBanner | null>(null);
  const [formStep, setFormStep] = useState<1 | 2>(1);

  // Search & Pagination State
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    position: 0,
    buttonTitle1: '',
    buttonUrl1: '',
    buttonIcon1: '',
    buttonTitle2: '',
    buttonUrl2: '',
    buttonIcon2: ''
  });
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await api.getBanners();
      setBanners(res?.data || []);
    } catch (err: any) {
      showToast(err.message || 'Gagal memuat banner', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingBanner(null);
    setFormStep(1);
    setFormData({
      title: '',
      description: '',
      thumbnail: '',
      position: banners.length + 1,
      buttonTitle1: 'Daftar Sekarang',
      buttonUrl1: '/pendaftaran',
      buttonIcon1: '',
      buttonTitle2: 'Hubungi Kami',
      buttonUrl2: '/#contact',
      buttonIcon2: ''
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (banner: IBanner) => {
    setEditingBanner(banner);
    setFormStep(1);
    const btn1 = banner.button?.[0] || { title: '', url: '', icon: null };
    const btn2 = banner.button?.[1] || { title: '', url: '', icon: null };
    const icon1Url = typeof btn1.icon === 'string' ? btn1.icon : (btn1.icon?.url || '');
    const icon2Url = typeof btn2.icon === 'string' ? btn2.icon : (btn2.icon?.url || '');
    setFormData({
      title: banner.title,
      description: banner.description || '',
      thumbnail: banner.thumbnail?.url || '',
      position: banner.position || 0,
      buttonTitle1: btn1.title || '',
      buttonUrl1: btn1.url || '',
      buttonIcon1: icon1Url,
      buttonTitle2: btn2.title || '',
      buttonUrl2: btn2.url || '',
      buttonIcon2: icon2Url
    });
    setIsFormOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'thumbnail' | 'buttonIcon1' | 'buttonIcon2') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingField(targetField);
      const url = await api.uploadFile(file);
      if (url) setFormData(prev => ({ ...prev, [targetField]: url }));
      showToast('File berhasil diunggah!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal mengunggah file', 'error');
    } finally {
      setUploadingField(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setFormStep(1);
      showToast('Judul banner wajib diisi', 'error');
      return;
    }

    try {
      const button = [];
      if (formData.buttonTitle1) {
        button.push({
          title: formData.buttonTitle1,
          url: formData.buttonUrl1,
          icon: formData.buttonIcon1 || null
        });
      }
      if (formData.buttonTitle2) {
        button.push({
          title: formData.buttonTitle2,
          url: formData.buttonUrl2,
          icon: formData.buttonIcon2 || null
        });
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        thumbnail: formData.thumbnail,
        position: Number(formData.position),
        button
      };

      if (editingBanner) {
        await api.updateBanner(editingBanner.id, payload);
        showToast('Banner berhasil diperbarui!', 'success');
      } else {
        await api.createBanner(payload);
        showToast('Banner baru berhasil ditambahkan!', 'success');
      }
      setIsFormOpen(false);
      fetchBanners();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan banner', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Hapus banner ini?')) return;
    try {
      await api.deleteBanner(id);
      showToast('Banner berhasil dihapus.', 'success');
      fetchBanners();
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus banner', 'error');
    }
  };

  const getFullImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${UPLOAD_BASE}${url}`;
  };

  // Filter & Pagination Calculations
  const filteredBanners = banners.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      (b.description || '').toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredBanners.length / itemsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const paginatedBanners = filteredBanners.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari banner..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm"
            />
          </div>

          {/* Items Per Page Selector */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Tampil:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2.5 py-2 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:border-emerald-500 shadow-sm cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md shadow-emerald-600/15 border border-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Tambah Banner</span>
        </button>
      </div>

      {/* Banner Table */}
      <div className="glass-card rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-sm flex flex-col justify-between">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Memuat data banner...</div>
        ) : filteredBanners.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            {search ? 'Tidak ada banner yang sesuai dengan pencarian.' : 'Belum ada banner aktif.'}
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200/90 text-slate-600 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-3.5">Posisi</th>
                    <th className="px-6 py-3.5">Gambar</th>
                    <th className="px-6 py-3.5">Judul & Deskripsi</th>
                    <th className="px-6 py-3.5">Tombol Aksi (CTA)</th>
                    <th className="px-6 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedBanners.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-600">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-[11px]">
                          #{b.position}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center p-1">
                          {b.thumbnail?.url ? (
                            <img
                              src={getFullImageUrl(b.thumbnail.url)}
                              alt={b.title}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-slate-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-sm">
                        <h4 className="font-bold text-slate-900 leading-snug">{b.title}</h4>
                        <p className="text-slate-500 mt-1 line-clamp-2 leading-relaxed text-[11px]">
                          {b.description || '-'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {b.button && b.button.length > 0 ? (
                          <div className="flex flex-col gap-1.5">
                            {b.button.map((btn, idx) => {
                              const iconUrl = typeof btn.icon === 'string' ? btn.icon : (btn.icon?.url || '');
                              return (
                                <div key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-[11px] text-emerald-700 border border-emerald-200 font-medium w-fit">
                                  {iconUrl ? (
                                    <img src={getFullImageUrl(iconUrl)} alt={btn.title} className="w-3.5 h-3.5 object-contain" />
                                  ) : (
                                    <Link2 className="w-3 h-3 text-emerald-600" />
                                  )}
                                  <span>{btn.title} <span className="text-slate-400 font-mono text-[10px]">({btn.url})</span></span>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px]">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(b)}
                            className="p-2 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Sunting Banner"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(b.id)}
                            className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Hapus Banner"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-slate-500 font-medium">
                Menampilkan{' '}
                <span className="font-bold text-slate-800">
                  {filteredBanners.length === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredBanners.length)}
                </span>{' '}
                dari <span className="font-bold text-slate-800">{filteredBanners.length}</span> banner
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handlePageChange(validCurrentPage - 1)}
                    disabled={validCurrentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${validCurrentPage === pageNum
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(validCurrentPage + 1)}
                    disabled={validCurrentPage === totalPages}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2-Step Form Modal (No Scroll) */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingBanner ? 'Sunting Banner' : 'Tambah Banner Baru'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Stepper Header Badge */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[11px]">
                {formStep}
              </span>
              <span className="font-bold text-slate-800">
                {formStep === 1 ? 'Langkah 1 dari 2: Informasi Utama Banner' : 'Langkah 2 dari 2: Pengaturan Tombol Aksi (CTA)'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <div className={`h-2 rounded-full transition-all duration-300 ${formStep === 1 ? 'w-6 bg-emerald-600' : 'w-2 bg-slate-200'}`} />
              <div className={`h-2 rounded-full transition-all duration-300 ${formStep === 2 ? 'w-6 bg-emerald-600' : 'w-2 bg-slate-200'}`} />
            </div>
          </div>



          {/* STEP 1: Informasi Utama */}
          {formStep === 1 && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Judul Banner *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Contoh: Mewujudkan Generasi Ahli Teknologi"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Posisi</label>
                  <input
                    type="number"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Gambar Banner (Thumbnail)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="URL Gambar atau pilih file..."
                    className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                  <label className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 flex items-center gap-1.5 cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{uploadingField === 'thumbnail' ? 'Unggah...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'thumbnail')} className="hidden" />
                  </label>
                </div>
                {formData.thumbnail && (
                  <div className="mt-2 h-20 w-36 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center p-1">
                    <img src={getFullImageUrl(formData.thumbnail)} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Deskripsi Banner</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi singkat pendukung banner..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!formData.title.trim()) {
                      showToast('Judul banner wajib diisi terlebih dahulu', 'error');
                      return;
                    }
                    setFormStep(2);
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/15 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Lanjut</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 2: Tombol Aksi (CTA) */}
          {formStep === 2 && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              {/* Tombol 1 */}
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/90 space-y-2">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Tombol Utama (CTA 1)</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-600 mb-0.5">Label Tombol</label>
                    <input
                      type="text"
                      value={formData.buttonTitle1}
                      onChange={(e) => setFormData({ ...formData, buttonTitle1: e.target.value })}
                      placeholder="Daftar Sekarang"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-600 mb-0.5">Link URL Target</label>
                    <input
                      type="text"
                      value={formData.buttonUrl1}
                      onChange={(e) => setFormData({ ...formData, buttonUrl1: e.target.value })}
                      placeholder="/pendaftaran"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={formData.buttonIcon1}
                    onChange={(e) => setFormData({ ...formData, buttonIcon1: e.target.value })}
                    placeholder="URL Icon 1 (Opsional)"
                    className="flex-1 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                  <label className="px-2.5 py-1 rounded-lg bg-slate-200/70 hover:bg-slate-200 text-slate-700 text-[11px] font-medium border border-slate-300 flex items-center gap-1 cursor-pointer shrink-0">
                    <Upload className="w-3 h-3 text-emerald-600" />
                    <span>{uploadingField === 'buttonIcon1' ? '...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'buttonIcon1')} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Tombol 2 */}
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/90 space-y-2">
                <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">Tombol Kedua (CTA 2)</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-600 mb-0.5">Label Tombol</label>
                    <input
                      type="text"
                      value={formData.buttonTitle2}
                      onChange={(e) => setFormData({ ...formData, buttonTitle2: e.target.value })}
                      placeholder="Hubungi Kami"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-600 mb-0.5">Link URL Target</label>
                    <input
                      type="text"
                      value={formData.buttonUrl2}
                      onChange={(e) => setFormData({ ...formData, buttonUrl2: e.target.value })}
                      placeholder="/#contact"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={formData.buttonIcon2}
                    onChange={(e) => setFormData({ ...formData, buttonIcon2: e.target.value })}
                    placeholder="URL Icon 2 (Opsional)"
                    className="flex-1 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                  <label className="px-2.5 py-1 rounded-lg bg-slate-200/70 hover:bg-slate-200 text-slate-700 text-[11px] font-medium border border-slate-300 flex items-center gap-1 cursor-pointer shrink-0">
                    <Upload className="w-3 h-3 text-emerald-600" />
                    <span>{uploadingField === 'buttonIcon2' ? '...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'buttonIcon2')} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setFormStep(1)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali ke Tahap 1</span>
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/15 flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Simpan Banner</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};
