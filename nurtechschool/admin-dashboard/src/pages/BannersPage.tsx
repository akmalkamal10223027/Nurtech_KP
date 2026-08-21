import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, Upload, Link2 } from 'lucide-react';
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Banner & Hero Section</h2>
          <p className="text-xs text-slate-500">Kelola slider banner utama di halaman beranda (Homepage)</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md shadow-emerald-600/15 border border-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Tambah Banner</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 py-12 text-center text-xs text-slate-500">Memuat banner...</div>
        ) : banners.length === 0 ? (
          <div className="col-span-2 glass-card rounded-2xl p-12 text-center border border-slate-200 bg-white text-xs text-slate-500 shadow-sm">
            Belum ada banner aktif.
          </div>
        ) : (
          banners.map((b) => (
            <div key={b.id} className="glass-card rounded-2xl border border-slate-200/90 bg-white overflow-hidden group hover:border-slate-300 hover:shadow-md transition-all">
              <div className="h-52 bg-slate-100 relative overflow-hidden">
                {b.thumbnail?.url ? (
                  <img
                    src={getFullImageUrl(b.thumbnail.url)}
                    alt={b.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                )}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-[11px] font-mono text-emerald-700 border border-emerald-200 shadow-sm font-semibold">
                  Posisi: #{b.position}
                </span>
              </div>

              <div className="p-5">
                <h4 className="text-sm font-bold text-slate-900 leading-snug">{b.title}</h4>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{b.description || '-'}</p>

                {b.button && b.button.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {b.button.map((btn, idx) => {
                      const iconUrl = typeof btn.icon === 'string' ? btn.icon : (btn.icon?.url || '');
                      return (
                        <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-[11px] text-emerald-700 border border-emerald-200 font-medium">
                          {iconUrl ? (
                            <img src={getFullImageUrl(iconUrl)} alt={btn.title} className="w-3.5 h-3.5 object-contain" />
                          ) : (
                            <Link2 className="w-3 h-3 text-emerald-600" />
                          )}
                          <span>{btn.title} ({btn.url})</span>
                        </span>
                      );
                    })}
                  </div>
                )}

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 flex items-center gap-1.5 cursor-pointer border border-slate-200"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-xs font-medium text-rose-600 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingBanner ? 'Sunting Banner' : 'Tambah Banner Baru'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Judul Banner</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Contoh: Mewujudkan Generasi Ahli Teknologi"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Gambar Banner (Thumbnail)</label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                placeholder="URL Gambar atau unggah file"
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
              <label className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 flex items-center gap-2 cursor-pointer shrink-0">
                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                <span>{uploadingField === 'thumbnail' ? 'Mengunggah...' : 'Pilih File'}</span>
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'thumbnail')} className="hidden" />
              </label>
            </div>
            {formData.thumbnail && (
              <div className="mt-2 h-24 w-44 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                <img src={getFullImageUrl(formData.thumbnail)} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Deskripsi Banner</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Deskripsi pendukung di hero section..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Buttons CTA */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Tombol Aksi (CTA)</p>

            {/* Tombol 1 */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-3">
              <span className="text-[11px] font-semibold text-slate-700">Tombol 1 (Contoh: Daftar Sekarang)</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Label Tombol</label>
                  <input
                    type="text"
                    value={formData.buttonTitle1}
                    onChange={(e) => setFormData({ ...formData, buttonTitle1: e.target.value })}
                    placeholder="Daftar Sekarang"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Link URL</label>
                  <input
                    type="text"
                    value={formData.buttonUrl1}
                    onChange={(e) => setFormData({ ...formData, buttonUrl1: e.target.value })}
                    placeholder="/pendaftaran"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Icon Tombol 1 (Opsional)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.buttonIcon1}
                    onChange={(e) => setFormData({ ...formData, buttonIcon1: e.target.value })}
                    placeholder="URL Icon atau upload file"
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                  <label className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 flex items-center gap-1.5 cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{uploadingField === 'buttonIcon1' ? 'Unggah...' : 'Upload Icon'}</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'buttonIcon1')} className="hidden" />
                  </label>
                </div>
                {formData.buttonIcon1 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 p-1 flex items-center justify-center">
                      <img src={getFullImageUrl(formData.buttonIcon1)} alt="Icon 1" className="w-full h-full object-contain" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, buttonIcon1: '' })}
                      className="text-[11px] text-rose-500 hover:underline"
                    >
                      Hapus Icon
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tombol 2 */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-3">
              <span className="text-[11px] font-semibold text-slate-700">Tombol 2 (Contoh: Hubungi Kami / Jelajahi Program)</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Label Tombol</label>
                  <input
                    type="text"
                    value={formData.buttonTitle2}
                    onChange={(e) => setFormData({ ...formData, buttonTitle2: e.target.value })}
                    placeholder="Hubungi Kami"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Link URL</label>
                  <input
                    type="text"
                    value={formData.buttonUrl2}
                    onChange={(e) => setFormData({ ...formData, buttonUrl2: e.target.value })}
                    placeholder="/#contact"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Icon Tombol 2 (Opsional)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.buttonIcon2}
                    onChange={(e) => setFormData({ ...formData, buttonIcon2: e.target.value })}
                    placeholder="URL Icon atau upload file"
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                  <label className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 flex items-center gap-1.5 cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{uploadingField === 'buttonIcon2' ? 'Unggah...' : 'Upload Icon'}</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'buttonIcon2')} className="hidden" />
                  </label>
                </div>
                {formData.buttonIcon2 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 p-1 flex items-center justify-center">
                      <img src={getFullImageUrl(formData.buttonIcon2)} alt="Icon 2" className="w-full h-full object-contain" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, buttonIcon2: '' })}
                      className="text-[11px] text-rose-500 hover:underline"
                    >
                      Hapus Icon
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/15 cursor-pointer"
            >
              Simpan Banner
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
