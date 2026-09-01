import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Images, Upload, Image as ImageIcon, X, Search, ChevronLeft, ChevronRight } from 'lucide-react';
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

  // Search & Pagination State
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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

  // Filter & Pagination Calculations
  const filteredGalleries = galleries.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      (item.description || '').toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredGalleries.length / itemsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const paginatedGalleries = filteredGalleries.slice(startIndex, startIndex + itemsPerPage);

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
              placeholder="Cari album kegiatan..."
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
          <span>Tambah Album Galeri</span>
        </button>
      </div>

      {/* Gallery Table */}
      <div className="glass-card rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-sm flex flex-col justify-between">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Memuat album galeri...</div>
        ) : filteredGalleries.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            {search ? 'Tidak ada album yang sesuai dengan pencarian.' : 'Belum ada dokumentasi galeri kegiatan.'}
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200/90 text-slate-600 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-3.5">Posisi</th>
                    <th className="px-6 py-3.5">Thumbnail</th>
                    <th className="px-6 py-3.5">Judul & Deskripsi Kegiatan</th>
                    <th className="px-6 py-3.5">Jumlah Foto</th>
                    <th className="px-6 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedGalleries.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-600">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-[11px]">
                          #{item.position || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-20 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center p-0.5">
                          {item.thumbnail?.url ? (
                            <img
                              src={getFullImageUrl(item.thumbnail.url)}
                              alt={item.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-md">
                        <h4 className="font-bold text-slate-900 leading-snug">{item.title}</h4>
                        <p className="text-slate-500 mt-1 line-clamp-2 leading-relaxed text-[11px]">
                          {item.description || 'Tidak ada keterangan.'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px]">
                          <Images className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{item.gallery?.length || 0} Foto</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-2 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Sunting Album"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Hapus Album"
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
                  {filteredGalleries.length === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredGalleries.length)}
                </span>{' '}
                dari <span className="font-bold text-slate-800">{filteredGalleries.length}</span> album
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
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                        validCurrentPage === pageNum
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

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingGallery ? 'Sunting Album Galeri' : 'Tambah Album Galeri Baru'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Judul Kegiatan *</label>
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

            <label className="w-full p-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/30 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all">
              <Upload className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-slate-700">
                {uploadingGallery ? 'Mengunggah Foto Album...' : 'Unggah Foto Album (Pilih Beberapa Foto Sekaligus)'}
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleGalleryFilesUpload}
                className="hidden"
              />
            </label>

            {galleryPhotos.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mt-3 max-h-36 overflow-y-auto p-1">
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
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/15 cursor-pointer"
            >
              Simpan Album
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
