import React, { useState, useEffect } from 'react';
import { HelpCircle, Plus, Trash2, Search } from 'lucide-react';
import { api } from '../api';
import { IFAQ } from '../types';

export interface FaqsPageProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const FaqsPage: React.FC<FaqsPageProps> = ({ showToast }) => {
  const [faqs, setFaqs] = useState<IFAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [newFaq, setNewFaq] = useState({ question: '', answer: '', category: 'Umum' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await api.getFAQs();
      setFaqs(res?.data || []);
    } catch (err: any) {
      showToast(err.message || 'Gagal memuat daftar FAQ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaq.question.trim() || !newFaq.answer.trim()) {
      showToast('Pertanyaan dan jawaban wajib diisi', 'error');
      return;
    }

    try {
      setSubmitting(true);
      await api.createFAQ({ ...newFaq, order: faqs.length + 1 });
      setNewFaq({ question: '', answer: '', category: 'Umum' });
      showToast('FAQ baru berhasil ditambahkan!', 'success');
      await fetchFaqs();
    } catch (err: any) {
      showToast(err.message || 'Gagal menambahkan FAQ baru', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFaq = async (id: number) => {
    try {
      await api.deleteFAQ(id);
      showToast('Pertanyaan FAQ berhasil dihapus', 'success');
      setFaqs(prev => prev.filter(f => f.id !== id));
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus FAQ', 'error');
    }
  };

  const filteredFaqs = faqs.filter(
    f =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Tanya Jawab & Bantuan (FAQ)</h2>
          <p className="text-xs text-slate-500">Kelola daftar pertanyaan yang sering diajukan calon siswa dan orang tua murid</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Add New FAQ */}
        <div className="lg:col-span-1">
          <form onSubmit={handleAddFaq} className="glass-card rounded-2xl p-6 border border-slate-200/90 bg-white space-y-4 shadow-sm sticky top-24">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Tambah FAQ Baru</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Pertanyaan</label>
              <input
                type="text"
                required
                value={newFaq.question}
                onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                placeholder="Contoh: Kapan pendaftaran gelombang 1 dibuka?"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Jawaban Lengkap</label>
              <textarea
                rows={4}
                required
                value={newFaq.answer}
                onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                placeholder="Tuliskan jawaban yang rinci dan jelas..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/15 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>{submitting ? 'Menyimpan...' : 'Tambahkan FAQ'}</span>
            </button>
          </form>
        </div>

        {/* List of FAQs */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search bar */}
          <div className="glass-card p-3.5 rounded-2xl border border-slate-200/90 bg-white flex items-center gap-3 shadow-sm">
            <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari pertanyaan atau kata kunci FAQ..."
              className="w-full bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
            />
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500">Memuat data FAQ...</div>
          ) : filteredFaqs.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center border border-slate-200 bg-white text-xs text-slate-500 shadow-sm">
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">Belum Ada Pertanyaan FAQ</p>
              <p className="mt-1">Gunakan formulir di sebelah kiri untuk menambah FAQ pertama.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq, idx) => (
                <div key={faq.id} className="glass-card rounded-2xl p-5 border border-slate-200/90 bg-white flex items-start justify-between gap-4 shadow-sm hover:border-slate-300 transition-all group">
                  <div className="flex gap-3">
                    <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center border border-emerald-200 shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {faq.question}
                      </h4>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 shrink-0 cursor-pointer transition-colors"
                    title="Hapus Pertanyaan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaqsPage;
