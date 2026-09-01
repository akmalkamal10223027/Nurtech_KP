import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Clock, Search, ChevronLeft, ChevronRight } from 'lucide-react';
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

  // Search & Pagination State
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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

  // Filter & Pagination Calculations
  const filteredSchedules = schedules.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      (item.time || '').toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredSchedules.length / itemsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const paginatedSchedules = filteredSchedules.slice(startIndex, startIndex + itemsPerPage);

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
              placeholder="Cari aktivitas atau waktu..."
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
          <span>Tambah Aktivitas</span>
        </button>
      </div>

      {/* Schedules Data Table */}
      <div className="glass-card rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-sm flex flex-col justify-between">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Memuat jadwal aktivitas...</div>
        ) : filteredSchedules.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            {search ? 'Tidak ada aktivitas yang sesuai dengan pencarian.' : 'Belum ada data jadwal aktivitas harian.'}
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200/90 text-slate-600 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-3.5 w-16">#</th>
                    <th className="px-6 py-3.5">Waktu Pelaksanaan</th>
                    <th className="px-6 py-3.5">Aktivitas</th>
                    <th className="px-6 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedSchedules.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-600">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-[11px]">
                          #{startIndex + idx + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{item.time || 'Waktu Belum Diatur'}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <h4 className="font-bold text-slate-900 text-xs leading-snug">{item.title}</h4>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-2 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Sunting Aktivitas"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Hapus Aktivitas"
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
                  {filteredSchedules.length === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredSchedules.length)}
                </span>{' '}
                dari <span className="font-bold text-slate-800">{filteredSchedules.length}</span> aktivitas
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

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingSchedule ? 'Sunting Aktivitas' : 'Tambah Aktivitas Baru'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Nama Aktivitas Siswa *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Contoh: Shalat Dhuha Berjamaah & Tilawah"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Waktu Pelaksanaan *</label>
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
