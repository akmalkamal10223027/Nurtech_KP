import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, BookOpen, Compass, Upload, Image as ImageIcon } from 'lucide-react';
import { api, UPLOAD_BASE } from '../api';
import { Modal } from '../components/Modal';
import { IProgram, IExtracurricular } from '../types';

export interface ProgramsPageProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ProgramsPage: React.FC<ProgramsPageProps> = ({ showToast }) => {
  const [activeSubTab, setActiveSubTab] = useState<'programs' | 'ekskul'>('programs');
  const [programs, setPrograms] = useState<IProgram[]>([]);
  const [ekskuls, setEkskuls] = useState<IExtracurricular[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IProgram | IExtracurricular | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', iconUrl: '', position: 0 });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [progRes, ekskulRes] = await Promise.all([
        api.getPrograms(),
        api.getExtracurriculars()
      ]);
      setPrograms(progRes?.data || []);
      setEkskuls(ekskulRes?.data || []);
    } catch (err: any) {
      showToast(err.message || 'Gagal memuat data program & ekskul', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      iconUrl: '',
      position: (activeSubTab === 'programs' ? programs.length : ekskuls.length) + 1
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: IProgram | IExtracurricular) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
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
      if (url) setFormData(prev => ({ ...prev, iconUrl: url }));
      showToast('Ikon berhasil diunggah!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal mengunggah ikon', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeSubTab === 'programs') {
        if (editingItem) {
          await api.updateProgram(editingItem.id, formData);
          showToast('Program unggulan berhasil diperbarui!', 'success');
        } else {
          await api.createProgram(formData);
          showToast('Program unggulan baru berhasil ditambahkan!', 'success');
        }
      } else {
        if (editingItem) {
          await api.updateExtracurricular(editingItem.id, formData);
          showToast('Ekstrakurikuler berhasil diperbarui!', 'success');
        } else {
          await api.createExtracurricular(formData);
          showToast('Ekstrakurikuler baru berhasil ditambahkan!', 'success');
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
      if (activeSubTab === 'programs') {
        await api.deleteProgram(id);
        showToast('Program berhasil dihapus.', 'success');
      } else {
        await api.deleteExtracurricular(id);
        showToast('Ekstrakurikuler berhasil dihapus.', 'success');
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

  const currentList = activeSubTab === 'programs' ? programs : ekskuls;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-black">Program Unggulan & Ekstrakurikuler</h2>
          <p className="text-xs text-black/70">Kelola bidang studi keahlian dan kegiatan pengembangan diri siswa</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md shadow-emerald-600/15 border border-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Tambah {activeSubTab === 'programs' ? 'Program' : 'Ekstrakurikuler'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('programs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeSubTab === 'programs'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
        >
          <BookOpen className={`w-4 h-4 ${activeSubTab === 'programs' ? 'text-emerald-600' : ''}`} />
          <span>Program Unggulan ({programs.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ekskul')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeSubTab === 'ekskul'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
        >
          <Compass className={`w-4 h-4 ${activeSubTab === 'ekskul' ? 'text-emerald-600' : ''}`} />
          <span>Ekstrakurikuler ({ekskuls.length})</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-xs text-slate-500">Memuat data...</div>
        ) : currentList.length === 0 ? (
          <div className="col-span-3 glass-card rounded-2xl p-12 text-center border border-slate-200 bg-white text-xs text-slate-500 shadow-sm">
            Belum ada data {activeSubTab === 'programs' ? 'program' : 'ekstrakurikuler'}.
          </div>
        ) : (
          currentList.map((item) => (
            <div key={item.id} className="glass-card rounded-2xl border border-slate-200/90 bg-white p-5 flex flex-col justify-between group hover:border-slate-300 hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                    {item.icon?.url ? (
                      <img src={getFullImageUrl(item.icon.url)} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-emerald-600" />
                    )}
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                    Posisi: #{item.position}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-1.5">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{item.description || '-'}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-emerald-600" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingItem ? `Sunting ${activeSubTab === 'programs' ? 'Program' : 'Ekstrakurikuler'}` : `Tambah ${activeSubTab === 'programs' ? 'Program' : 'Ekstrakurikuler'}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Judul</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Contoh: Software & AI Engineering"
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

          {/* Icon Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Ikon / Gambar</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={formData.iconUrl}
                onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                placeholder="URL ikon atau upload"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
              <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 flex items-center gap-1.5 cursor-pointer shrink-0">
                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                <span>{uploading ? '...' : 'Upload'}</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
            {formData.iconUrl && (
              <div className="mt-2 w-14 h-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                <img src={getFullImageUrl(formData.iconUrl)} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Deskripsi</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Deskripsi singkat kegiatan..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
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
              Simpan Data
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
