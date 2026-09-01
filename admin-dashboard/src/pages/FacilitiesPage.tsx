import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Building2, Trophy, Upload, Image as ImageIcon, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { api, UPLOAD_BASE } from '../api';
import { Modal } from '../components/Modal';
import { IFacility, IAchievement } from '../types';

export interface FacilitiesPageProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const FacilitiesPage: React.FC<FacilitiesPageProps> = ({ showToast }) => {
  const [activeSubTab, setActiveSubTab] = useState<'facilities' | 'achievements'>('facilities');
  const [facilities, setFacilities] = useState<IFacility[]>([]);
  const [achievements, setAchievements] = useState<IAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Pagination State
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IFacility | IAchievement | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', imageUrl: '', iconUrl: '', position: 0 });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [facRes, achRes] = await Promise.all([
        api.getFacilities(),
        api.getAchievements()
      ]);
      setFacilities(facRes?.data || []);
      setAchievements(achRes?.data || []);
    } catch (err: any) {
      showToast(err.message || 'Gagal memuat data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      iconUrl: '',
      position: (activeSubTab === 'facilities' ? facilities.length : achievements.length) + 1
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: IFacility | IAchievement) => {
    setEditingItem(item);
    const imgUrl = ('image' in item && item.image?.url) ? item.image.url : (item.icon?.url || '');
    setFormData({
      title: item.title,
      description: ('description' in item && item.description) ? item.description : '',
      imageUrl: imgUrl,
      iconUrl: item.icon?.url || '',
      position: item.position || 0
    });
    setIsFormOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await api.uploadFile(file);
      if (url) setFormData(prev => ({ ...prev, imageUrl: url, iconUrl: url }));
      showToast('Gambar berhasil diunggah!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal mengunggah gambar', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeSubTab === 'facilities') {
        const payload = {
          title: formData.title,
          imageUrl: formData.imageUrl,
          position: Number(formData.position)
        };
        if (editingItem) {
          await api.updateFacility(editingItem.id, payload);
          showToast('Fasilitas berhasil diperbarui!', 'success');
        } else {
          await api.createFacility(payload);
          showToast('Fasilitas baru berhasil ditambahkan!', 'success');
        }
      } else {
        const payload = {
          title: formData.title,
          description: formData.description,
          iconUrl: formData.iconUrl || formData.imageUrl,
          position: Number(formData.position)
        };
        if (editingItem) {
          await api.updateAchievement(editingItem.id, payload);
          showToast('Prestasi berhasil diperbarui!', 'success');
        } else {
          await api.createAchievement(payload);
          showToast('Prestasi baru berhasil ditambahkan!', 'success');
        }
      }
      setIsFormOpen(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan data', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Yakin ingin menghapus item ini?')) return;
    try {
      if (activeSubTab === 'facilities') {
        await api.deleteFacility(id);
        showToast('Fasilitas berhasil dihapus.', 'success');
      } else {
        await api.deleteAchievement(id);
        showToast('Prestasi berhasil dihapus.', 'success');
      }
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus data', 'error');
    }
  };

  const getFullImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${UPLOAD_BASE}${url}`;
  };

  const currentList = activeSubTab === 'facilities' ? facilities : achievements;

  // Filter & Pagination Calculations
  const filteredList = currentList.filter((item) => {
    const q = search.toLowerCase();
    const titleMatch = item.title.toLowerCase().includes(q);
    const descMatch = ('description' in item && item.description) ? item.description.toLowerCase().includes(q) : false;
    return titleMatch || descMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredList.length / itemsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const paginatedList = filteredList.slice(startIndex, startIndex + itemsPerPage);

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
              placeholder={`Cari ${activeSubTab === 'facilities' ? 'fasilitas sekolah' : 'prestasi'}...`}
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
          <span>Tambah {activeSubTab === 'facilities' ? 'Fasilitas' : 'Prestasi'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => {
            setActiveSubTab('facilities');
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'facilities'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className={`w-4 h-4 ${activeSubTab === 'facilities' ? 'text-emerald-600' : ''}`} />
          <span>Fasilitas Sekolah ({facilities.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('achievements');
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'achievements'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Trophy className={`w-4 h-4 ${activeSubTab === 'achievements' ? 'text-emerald-600' : ''}`} />
          <span>Prestasi ({achievements.length})</span>
        </button>
      </div>

      {/* Data Table */}
      <div className="glass-card rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-sm flex flex-col justify-between">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Memuat data...</div>
        ) : filteredList.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            {search
              ? `Tidak ada ${activeSubTab === 'facilities' ? 'fasilitas' : 'prestasi'} yang sesuai dengan pencarian.`
              : `Belum ada data ${activeSubTab === 'facilities' ? 'fasilitas sekolah' : 'prestasi'}.`}
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200/90 text-slate-600 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-3.5">Posisi</th>
                    <th className="px-6 py-3.5">Gambar / Ikon</th>
                    <th className="px-6 py-3.5">Nama & Keterangan</th>
                    <th className="px-6 py-3.5">Kategori</th>
                    <th className="px-6 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedList.map((item) => {
                    const img = ('image' in item && item.image?.url) ? item.image.url : item.icon?.url;
                    const desc = 'description' in item ? item.description : undefined;

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-slate-600">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-[11px]">
                            #{item.position || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-16 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center p-0.5">
                            {img ? (
                              <img
                                src={getFullImageUrl(img)}
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
                          {desc && (
                            <p className="text-slate-500 mt-1 line-clamp-2 leading-relaxed text-[11px]">
                              {desc}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold border ${
                            activeSubTab === 'facilities'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {activeSubTab === 'facilities' ? 'Fasilitas Sekolah' : 'Prestasi'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-2 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Sunting Data"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Hapus Data"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-slate-500 font-medium">
                Menampilkan{' '}
                <span className="font-bold text-slate-800">
                  {filteredList.length === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredList.length)}
                </span>{' '}
                dari <span className="font-bold text-slate-800">{filteredList.length}</span> {activeSubTab === 'facilities' ? 'fasilitas' : 'prestasi'}
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
        title={editingItem ? `Sunting ${activeSubTab === 'facilities' ? 'Fasilitas' : 'Prestasi'}` : `Tambah ${activeSubTab === 'facilities' ? 'Fasilitas' : 'Prestasi'}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Nama / Judul *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={activeSubTab === 'facilities' ? 'Lab Komputer & AI Cloud' : 'Juara 1 Lomba Robotika'}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Urutan Posisi</label>
            <input
              type="number"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: Number(e.target.value) })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Foto / Gambar</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value, iconUrl: e.target.value })}
                placeholder="URL Gambar atau pilih file"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
              <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 flex items-center gap-1.5 cursor-pointer shrink-0">
                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                <span>{uploading ? '...' : 'Upload'}</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
            {formData.imageUrl && (
              <div className="mt-2 w-28 h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                <img src={getFullImageUrl(formData.imageUrl)} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {activeSubTab === 'achievements' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Deskripsi Prestasi</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Keterangan prestasi..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

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
              Simpan Data
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
