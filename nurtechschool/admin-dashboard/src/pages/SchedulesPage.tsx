import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Clock, Calendar } from 'lucide-react';
import { api } from '../api';
import { Modal } from '../components/Modal';

export interface SchedulesPageProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export interface ISchedule {
  id: number;
  documentId?: string;
  title: string;
  time: string;
  createdAt?: string;
}

export const SchedulesPage: React.FC<SchedulesPageProps> = ({ showToast }) => {
  const [schedules, setSchedules] = useState<ISchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ISchedule | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    time: ''
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const res = await api.getSchedules();
      setSchedules(res?.data || []);
    } catch (err: any) {
      showToast(err.message || 'Gagal memuat jadwal aktivitas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingSchedule(null);
    setFormData({
      title: '',
      time: '07.00 - 08.00 WIB'
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: ISchedule) => {
    setEditingSchedule(item);
    setFormData({
      title: item.title,
      time: item.time || ''
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSchedule) {
        await api.updateSchedule(editingSchedule.id, formData);
        showToast('Aktivitas berhasil diperbarui!', 'success');
      } else {
        await api.createSchedule(formData);
        showToast('Aktivitas baru berhasil ditambahkan!', 'success');
      }
      setIsFormOpen(false);
      fetchSchedules();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan aktivitas', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Hapus jadwal aktivitas ini?')) return;
    try {
      await api.deleteSchedule(id);
      showToast('Jadwal aktivitas berhasil dihapus.', 'success');
      fetchSchedules();
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus jadwal aktivitas', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-end">
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md shadow-emerald-600/15 border border-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Tambah Aktivitas</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-xs text-slate-500">Memuat jadwal aktivitas...</div>
        ) : schedules.length === 0 ? (
          <div className="col-span-3 glass-card rounded-2xl p-12 text-center border border-slate-200 bg-white text-xs text-slate-500 shadow-sm">
            Belum ada data jadwal aktivitas harian.
          </div>
        ) : (
          schedules.map((item) => (
            <div key={item.id} className="glass-card rounded-2xl border border-slate-200/90 bg-white p-5 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 w-fit px-2.5 py-1 rounded-lg border border-emerald-200 text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{item.time || 'Waktu Belum Diatur'}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h4>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 flex items-center gap-1.5 cursor-pointer border border-slate-200"
                >
                  <Edit2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-xs font-medium text-rose-600 flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
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
        title={editingSchedule ? 'Sunting Aktivitas' : 'Tambah Aktivitas Baru'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Nama Aktivitas / Rutinitas</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Contoh: Shalat Dhuha Berjamaah & Tilawah"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Waktu Pelaksanaan</label>
            <input
              type="text"
              required
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              placeholder="Contoh: 07.00 - 08.00 WIB"
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
              Simpan Aktivitas
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
