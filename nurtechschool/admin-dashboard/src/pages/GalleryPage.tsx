import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Images, Upload, Image as ImageIcon, X } from 'lucide-react';
import { api, UPLOAD_BASE } from '../api';
import { Modal } from '../components/Modal';
import { IGalleryActivity } from '../types';

export interface GalleryPageProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ showToast }) => {
  const [galleries, setGalleries] = useState<IGalleryActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<IGalleryActivity | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    position: 0
  });
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([]);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const res = await api.getGalleries();
      setGalleries(res?.data || []);
    } catch (err: any) {
      showToast(err.message || 'Gagal memuat galeri kegiatan', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingGallery(null);
    setFormData({
      title: '',
      description: '',
      thumbnail: '',
      position: galleries.length + 1
    });
    setGalleryPhotos([]);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: IGalleryActivity) => {
    setEditingGallery(item);
    const photos = (item.gallery || []).map(g => g.url).filter(Boolean);
    setFormData({
      title: item.title,
      description: item.description || '',
      thumbnail: item.thumbnail?.url || '',
      position: item.position || 0
    });
    setGalleryPhotos(photos);
    setIsFormOpen(true);
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingThumbnail(true);
      const url = await api.uploadFile(file);
      if (url) setFormData(prev => ({ ...prev, thumbnail: url }));
      showToast('Thumbnail galeri berhasil diunggah!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal mengunggah thumbnail', 'error');
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleGalleryFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingGallery(true);
      const uploadedUrls = await api.uploadMultipleFiles(files);
      if (uploadedUrls.length > 0) {
        setGalleryPhotos(prev => [...prev, ...uploadedUrls]);
        setFormData(prev => ({
          ...prev,
          thumbnail: prev.thumbnail || uploadedUrls[0]
        }));
        showToast(`${uploadedUrls.length} foto album berhasil diunggah!`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal mengunggah foto album', 'error');
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setGalleryPhotos(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        thumbnail: formData.thumbnail || galleryPhotos[0] || '',
        gallery: galleryPhotos,
        position: Number(formData.position)
      };

      if (editingGallery) {
        await api.updateGallery(editingGallery.id, payload);
        showToast('Galeri berhasil diperbarui!', 'success');
      } else {
        await api.createGallery(payload);
        showToast('Galeri kegiatan baru berhasil ditambahkan!', 'success');
      }
      setIsFormOpen(false);
      fetchGalleries();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan galeri', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Hapus album kegiatan ini?')) return;
    try {
      await api.deleteGallery(id);
      showToast('Galeri kegiatan berhasil dihapus.', 'success');
      fetchGalleries();
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus galeri', 'error');
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
          <h2 className="text-xl font-bold text-slate-900">Galeri Dokumentasi Kegiatan</h2>
          <p className="text-xs text-slate-500">Kelola album foto dan dokumentasi kegiatan siswa sekolah</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md shadow-emerald-600/15 border border-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Tambah Album Galeri</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-xs text-slate-500">Memuat album galeri...</div>
        ) : galleries.length === 0 ? (
          <div className="col-span-3 glass-card rounded-2xl p-12 text-center border border-slate-200 bg-white text-xs text-slate-500 shadow-sm">
            Belum ada dokumentasi galeri kegiatan.
          </div>
        ) : (
          galleries.map((item) => (
            <div key={item.id} className="glass-card rounded-2xl border border-slate-200/90 bg-white overflow-hidden flex flex-col justify-between group hover:border-slate-300 hover:shadow-md transition-all">
              <div className="h-48 bg-slate-100 relative overflow-hidden">
                {item.thumbnail?.url ? (
                  <img src={getFullImageUrl(item.thumbnail.url)} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-white/90 backdrop-blur-md text-[10px] text-emerald-700 border border-emerald-200 shadow-sm font-semibold flex items-center gap-1">
                  <Images className="w-3 h-3 text-emerald-600" />
                  <span>{item.gallery?.length || 0} Foto</span>
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description || 'Tidak ada keterangan.'}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-emerald-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingGallery ? 'Sunting Album Galeri' : 'Tambah Album Galeri Baru'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Judul Kegiatan</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Contoh: Kegiatan Outbound & Leadership Siswa 2026"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Thumbnail Utama Album</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                placeholder="URL Gambar Thumbnail (Otomatis terisi dari foto pertama)"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
              <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 flex items-center gap-1.5 cursor-pointer shrink-0">
                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                <span>{uploadingThumbnail ? '...' : 'Upload'}</span>
                <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Deskripsi Kegiatan</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Deskripsi dokumentasi kegiatan..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Foto Album Kegiatan ({galleryPhotos.length} Foto)
            </label>

            <label className="w-full p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/30 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all">
              <Upload className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-semibold text-slate-700">
                {uploadingGallery ? 'Mengunggah Foto Album...' : 'Unggah Foto Album (Pilih Beberapa Foto Sekaligus)'}
              </span>
              <span className="text-[11px] text-slate-400">Klik untuk memilih file foto langsung dari perangkat</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleGalleryFilesUpload}
                className="hidden"
              />
            </label>

            {galleryPhotos.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mt-3 max-h-48 overflow-y-auto p-1">
                {galleryPhotos.map((photoUrl, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                    <img src={getFullImageUrl(photoUrl)} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                      title="Hapus foto ini"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              Simpan Album
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
