import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Building2, Trophy, Upload, Image as ImageIcon } from 'lucide-react';
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-black">Fasilitas & Prestasi Sekolah</h2>
          <p className="text-xs text-black/70">Kelola sarana prasarana dan rekam jejak prestasi siswa & sekolah</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md shadow-emerald-600/15 border border-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Tambah {activeSubTab === 'facilities' ? 'Fasilitas' : 'Prestasi'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('facilities')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeSubTab === 'facilities'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
        >
          <Building2 className={`w-4 h-4 ${activeSubTab === 'facilities' ? 'text-emerald-600' : ''}`} />
          <span>Fasilitas Sekolah ({facilities.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('achievements')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeSubTab === 'achievements'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
        >
          <Trophy className={`w-4 h-4 ${activeSubTab === 'achievements' ? 'text-emerald-600' : ''}`} />
          <span>Prestasi ({achievements.length})</span>
        </button>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? (
          <div className="col-span-4 py-12 text-center text-xs text-slate-500">Memuat data...</div>
        ) : (activeSubTab === 'facilities' ? facilities : achievements).length === 0 ? (
          <div className="col-span-4 glass-card rounded-2xl p-12 text-center border border-slate-200 bg-white text-xs text-slate-500 shadow-sm">
            Belum ada data {activeSubTab === 'facilities' ? 'fasilitas' : 'prestasi'}.
          </div>
        ) : (
          (activeSubTab === 'facilities' ? facilities : achievements).map((item) => {
            const img = ('image' in item && item.image?.url) ? item.image.url : item.icon?.url;
            const desc = 'description' in item ? item.description : undefined;

            return (
              <div key={item.id} className="glass-card rounded-2xl border border-slate-200/90 bg-white overflow-hidden flex flex-col justify-between group hover:border-slate-300 hover:shadow-md transition-all">
                <div className="h-40 bg-slate-100 relative overflow-hidden">
                  {img ? (
                    <img src={getFullImageUrl(img)} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-white/90 backdrop-blur-md text-[10px] font-mono text-emerald-700 border border-emerald-200 shadow-sm font-semibold">
                    #{item.position}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{item.title}</h4>
                    {desc && (
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{desc}</p>
                    )}
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
            );
          })
        )}
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingItem ? `Sunting ${activeSubTab === 'facilities' ? 'Fasilitas' : 'Prestasi'}` : `Tambah ${activeSubTab === 'facilities' ? 'Fasilitas' : 'Prestasi'}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Nama / Judul</label>
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
