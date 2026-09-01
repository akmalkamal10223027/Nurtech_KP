import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, Plus, Trash2, Search, Edit2, X, Check } from 'lucide-react';
import { api } from '../api';
import { IFAQ } from '../types';
import { Modal } from '../components/Modal';

export interface FaqsPageProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const FaqsPage: React.FC<FaqsPageProps> = ({ showToast }) => {
  const [faqs, setFaqs] = useState<IFAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Form State (Add & Edit)
  const [editingFaq, setEditingFaq] = useState<IFAQ | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'Umum',
    order: 0
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<IFAQ | null>(null);

  const formRef = useRef<HTMLDivElement>(null);

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

  const handleStartEdit = (faq: IFAQ) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'Umum',
      order: faq.order || 0
    });
    // Scroll smoothly to form on mobile or small screens
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCancelEdit = () => {
    setEditingFaq(null);
    setFormData({
      question: '',
      answer: '',
      category: 'Umum',
      order: 0
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) {
      showToast('Pertanyaan dan jawaban wajib diisi', 'error');
      return;
    }

    try {
      setSubmitting(true);
      if (editingFaq) {
        // UPDATE FAQ
        await api.updateFAQ(editingFaq.id, {
          question: formData.question.trim(),
          answer: formData.answer.trim(),
          category: formData.category,
          order: Number(formData.order) || 0
        });
        showToast('FAQ berhasil diperbarui!', 'success');
        setEditingFaq(null);
      } else {
        // CREATE FAQ
        await api.createFAQ({
          question: formData.question.trim(),
          answer: formData.answer.trim(),
          category: formData.category,
          order: Number(formData.order) || (faqs.length + 1)
        });
        showToast('FAQ baru berhasil ditambahkan!', 'success');
      }

      setFormData({ question: '', answer: '', category: 'Umum', order: 0 });
      await fetchFaqs();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan FAQ', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFaq = async () => {
    if (!faqToDelete) return;
    try {
      await api.deleteFAQ(faqToDelete.id);
      showToast('Pertanyaan FAQ berhasil dihapus', 'success');
      setFaqs(prev => prev.filter(f => f.id !== faqToDelete.id));
      if (editingFaq?.id === faqToDelete.id) {
        handleCancelEdit();
      }
      setIsDeleteOpen(false);
      setFaqToDelete(null);
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Add / Edit FAQ (Left Column) */}
        <div className="lg:col-span-1" ref={formRef}>
          <form
            onSubmit={handleSubmit}
            className={`glass-card rounded-2xl p-6 border transition-all shadow-sm sticky top-24 space-y-4 ${
              editingFaq
                ? 'border-emerald-500/60 dark:border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/20 ring-1 ring-emerald-500/30'
                : 'border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                {editingFaq ? (
                  <>
                    <Edit2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Sunting FAQ</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Tambah FAQ Baru</span>
                  </>
                )}
              </h3>

              {editingFaq && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Batal</span>
                </button>
              )}
            </div>

            {editingFaq && (
              <div className="p-2.5 rounded-xl bg-emerald-100/60 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Sedang menyunting pertanyaan terpilih. Ubah teks lalu klik simpan.</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Pertanyaan FAQ
              </label>
              <input
                type="text"
                required
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="Contoh: Kapan pendaftaran gelombang 1 dibuka?"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Jawaban Lengkap
              </label>
              <textarea
                rows={5}
                required
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                placeholder="Tuliskan jawaban yang rinci, ramah, dan jelas..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Urutan Tampil
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                placeholder="0 (Urutan nomor)"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/15 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {editingFaq ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>{submitting ? 'Memperbarui...' : 'Simpan Perubahan FAQ'}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-white" />
                    <span>{submitting ? 'Menyimpan...' : 'Tambahkan FAQ'}</span>
                  </>
                )}
              </button>

              {editingFaq && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List of FAQs (Right Column) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search bar */}
          <div className="glass-card p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3 shadow-sm">
            <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari pertanyaan atau kata kunci FAQ..."
              className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400">
              Memuat data FAQ...
            </div>
          ) : filteredFaqs.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400 shadow-sm">
              <HelpCircle className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              <p className="font-semibold text-slate-700 dark:text-slate-200">Belum Ada Pertanyaan FAQ</p>
              <p className="mt-1">Gunakan formulir di sebelah kiri untuk menambah FAQ pertama.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq, idx) => {
                const isCurrentEdit = editingFaq?.id === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`glass-card rounded-2xl p-5 border transition-all group flex items-start justify-between gap-4 shadow-sm ${
                      isCurrentEdit
                        ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 ring-1 ring-emerald-500/40'
                        : 'border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex gap-3 flex-1">
                      <span className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {faq.question}
                          </h4>
                          {isCurrentEdit && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-[10px] font-bold">
                              Sedang Diedit
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                          {faq.answer}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 pt-0.5">
                      <button
                        onClick={() => handleStartEdit(faq)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isCurrentEdit
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                        title="Sunting FAQ"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setFaqToDelete(faq);
                          setIsDeleteOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Hapus Pertanyaan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Konfirmasi Hapus FAQ"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Apakah Anda yakin ingin menghapus pertanyaan FAQ{' '}
            <strong className="text-slate-900 dark:text-white">"{faqToDelete?.question}"</strong>?
          </p>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleDeleteFaq}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-500/20 cursor-pointer"
            >
              Ya, Hapus FAQ
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FaqsPage;
