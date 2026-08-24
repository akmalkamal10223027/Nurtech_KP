import React, { useState, useEffect } from 'react';
import { FileCheck2, Save, Plus, Trash2 } from 'lucide-react';
import { api } from '../api';

export interface RegistrationPageProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({ showToast }) => {
  const [loading, setLoading] = useState(false);
  const [cost, setCost] = useState<{ title: string; phone: string | number; items: { id: number; label: string; cost: number }[] }>({ title: '', phone: '', items: [] });
  const [reqs, setReqs] = useState<{ id: number; title: string; position: number }[]>([]);
  const [newReqTitle, setNewReqTitle] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [costRes, reqRes] = await Promise.all([
        api.getRegistrationCost().catch(() => ({ data: {} })),
        api.getRegistrationRequirements().catch(() => ({ data: [] }))
      ]);

      if (costRes?.data) {
        setCost({
          title: costRes.data.title || '',
          phone: costRes.data.phone || '',
          items: costRes.data.cost || []
        });
      }

      setReqs(reqRes?.data || []);
    } catch (err: any) {
      showToast(err.message || 'Gagal memuat info pendaftaran', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateRegistrationCost({
        title: cost.title,
        phone: cost.phone,
        cost: cost.items
      });
      showToast('Rincian Biaya berhasil disimpan!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan rincian biaya', 'error');
    }
  };

  const handleAddCostItem = () => {
    setCost(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now(), label: 'Komponen Biaya Baru', cost: 0 }]
    }));
  };

  const handleRemoveCostItem = (index: number) => {
    setCost(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleAddReq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReqTitle.trim()) return;
    try {
      await api.createRegistrationRequirement({ title: newReqTitle, position: reqs.length + 1 });
      setNewReqTitle('');
      showToast('Syarat pendaftaran ditambahkan!', 'success');
      const reqRes = await api.getRegistrationRequirements();
      setReqs(reqRes?.data || []);
    } catch (err: any) {
      showToast(err.message || 'Gagal menambah syarat', 'error');
    }
  };

  const handleDeleteReq = async (id: number) => {
    try {
      await api.deleteRegistrationRequirement(id);
      showToast('Syarat dihapus.', 'success');
      setReqs(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus syarat', 'error');
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-slate-500">Memuat info pendaftaran & biaya...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Rincian Biaya Form */}
        <form onSubmit={handleSaveCost} className="glass-card rounded-2xl p-6 border border-slate-200/90 bg-white space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileCheck2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Rincian Biaya Pendaftaran</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Seksi Biaya</label>
            <input
              type="text"
              required
              value={cost.title}
              onChange={(e) => setCost({ ...cost, title: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">No. WhatsApp/Kontak Info Biaya</label>
            <input
              type="text"
              value={cost.phone}
              onChange={(e) => setCost({ ...cost, phone: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Komponen Biaya</label>
              <button
                type="button"
                onClick={handleAddCostItem}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Komponen</span>
              </button>
            </div>

            {cost.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => {
                    const newItems = [...cost.items];
                    newItems[idx].label = e.target.value;
                    setCost({ ...cost, items: newItems });
                  }}
                  placeholder="Nama Komponen"
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="number"
                  value={item.cost}
                  onChange={(e) => {
                    const newItems = [...cost.items];
                    newItems[idx].cost = parseFloat(e.target.value) || 0;
                    setCost({ ...cost, items: newItems });
                  }}
                  placeholder="Biaya (Rp)"
                  className="w-32 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCostItem(idx)}
                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button type="submit" className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/15">
            <Save className="w-4 h-4 text-white" />
            <span>Simpan Biaya Pendaftaran</span>
          </button>
        </form>

        {/* Syarat Pendaftaran */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200/90 bg-white space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileCheck2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Syarat-Syarat Pendaftaran</h3>
          </div>

          <form onSubmit={handleAddReq} className="flex items-center gap-2">
            <input
              type="text"
              value={newReqTitle}
              onChange={(e) => setNewReqTitle(e.target.value)}
              placeholder="Tambah Syarat Pendaftaran Baru..."
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
            <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shrink-0 cursor-pointer">
              Tambah
            </button>
          </form>

          <div className="space-y-2 pt-2">
            {reqs.map((req) => (
              <div key={req.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-800 font-medium">{req.title}</span>
                <button onClick={() => handleDeleteReq(req.id)} className="text-rose-600 hover:text-rose-700 p-1 cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
