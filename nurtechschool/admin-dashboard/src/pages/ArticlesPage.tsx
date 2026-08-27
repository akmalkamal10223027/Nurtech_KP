import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Calendar,
  Upload,
  Newspaper,
  BookOpen,
  Megaphone
} from 'lucide-react';
import { api, UPLOAD_BASE } from '../api';
import { Modal } from '../components/Modal';
import { IArticle, ICategory } from '../types';

export interface ArticlesPageProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  initialSubTab?: 'berita' | 'artikel' | 'pengumuman' | 'articles';
}

type TabType = 'berita' | 'artikel' | 'pengumuman';

export const ArticlesPage: React.FC<ArticlesPageProps> = ({ showToast, initialSubTab = 'berita' }) => {
  const getNormalizedTab = (tab: string): TabType => {
    if (tab === 'artikel') return 'artikel';
    if (tab === 'pengumuman') return 'pengumuman';
    return 'berita';
  };

  const [subTab, setSubTab] = useState<TabType>(getNormalizedTab(initialSubTab));
  const [allArticles, setAllArticles] = useState<IArticle[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<IArticle | null>(null);
  const [articleToDelete, setArticleToDelete] = useState<IArticle | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    categoryId: '',
    coverUrl: '',
    position: 0
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [search]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let query = `?pageSize=100`;
      if (search) query += `&search=${encodeURIComponent(search)}`;

      const [artRes, catRes] = await Promise.all([
        api.getArticles(query),
        api.getCategories()
      ]);

      setAllArticles(artRes?.data || []);
      setCategories(catRes?.data || []);
    } catch (err: any) {
      showToast(err.message || 'Gagal memuat daftar konten', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Helper to match category by slug or name
  const matchCategoryType = (art: IArticle, targetType: 'berita' | 'artikel' | 'pengumuman') => {
    const slug = (art.category?.slug || '').toLowerCase();
    const name = (art.category?.name || '').toLowerCase();

    if (targetType === 'berita') {
      return slug === 'berita' || name.includes('berita') || (!slug.includes('artikel') && !slug.includes('pengumuman') && slug !== 'akademik');
    }
    if (targetType === 'artikel') {
      return slug === 'artikel' || name.includes('artikel') || slug === 'akademik';
    }
    if (targetType === 'pengumuman') {
      return slug === 'pengumuman' || name.includes('pengumuman');
    }
    return false;
  };

  // Filter articles based on active subTab
  const displayedArticles = allArticles.filter((art) => matchCategoryType(art, subTab));

  // Calculate counts for each tab
  const counts = {
    berita: allArticles.filter(a => matchCategoryType(a, 'berita')).length,
    artikel: allArticles.filter(a => matchCategoryType(a, 'artikel')).length,
    pengumuman: allArticles.filter(a => matchCategoryType(a, 'pengumuman')).length
  };

  const getTargetCategoryForTab = (tab: TabType) => {
    const found = categories.find(c =>
      c.slug.toLowerCase() === tab.toLowerCase() ||
      c.name.toLowerCase().includes(tab.toLowerCase())
    );
    return found ? String(found.id) : (categories[0]?.id ? String(categories[0].id) : '');
  };

  const getTabLabel = (tab: TabType) => {
    if (tab === 'berita') return 'Berita';
    if (tab === 'artikel') return 'Artikel';
    if (tab === 'pengumuman') return 'Pengumuman';
    return 'Konten';
  };

  const handleOpenCreate = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      description: '',
      content: '',
      categoryId: getTargetCategoryForTab(subTab),
      coverUrl: '',
      position: 0
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (article: IArticle) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      description: article.description || '',
      content: article.content || '',
      categoryId: article.category?.id ? String(article.category.id) : getTargetCategoryForTab(subTab),
      coverUrl: article.cover?.url || '',
      position: article.position || 0
    });
    setIsFormOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await api.uploadFile(file);
      if (url) setFormData(prev => ({ ...prev, coverUrl: url }));
      showToast('Gambar cover berhasil diunggah!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal mengunggah gambar', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const typeName = getTabLabel(subTab);
      const payload = {
        ...formData,
        categoryId: formData.categoryId || getTargetCategoryForTab(subTab)
      };
      if (editingArticle) {
        await api.updateArticle(editingArticle.id, payload);
        showToast(`${typeName} berhasil diperbarui!`, 'success');
      } else {
        await api.createArticle(payload);
        showToast(`${typeName} baru berhasil dibuat!`, 'success');
      }
      setIsFormOpen(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan data', 'error');
    }
  };

  const handleDelete = async () => {
    if (!articleToDelete) return;
    try {
      await api.deleteArticle(articleToDelete.id);
      const typeName = getTabLabel(subTab);
      showToast(`${typeName} berhasil dihapus.`, 'success');
      setIsDeleteOpen(false);
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

  const currentTabName = getTabLabel(subTab);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 3 Main Navigation Tabs: Berita, Artikel, Pengumuman */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap">
        {/* Tab 1: Berita */}
        <button
          onClick={() => setSubTab('berita')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            subTab === 'berita'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Newspaper className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Berita</span>
          {counts.berita > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-[10px] font-bold">
              {counts.berita}
            </span>
          )}
        </button>

        {/* Tab 2: Artikel */}
        <button
          onClick={() => setSubTab('artikel')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            subTab === 'artikel'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Artikel</span>
          {counts.artikel > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-[10px] font-bold">
              {counts.artikel}
            </span>
          )}
        </button>

        {/* Tab 3: Pengumuman */}
        <button
          onClick={() => setSubTab('pengumuman')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            subTab === 'pengumuman'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Megaphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Pengumuman</span>
          {counts.pengumuman > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-[10px] font-bold">
              {counts.pengumuman}
            </span>
          )}
        </button>
      </div>

      {/* Action button & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Cari judul ${currentTabName.toLowerCase()}...`}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm"
          />
        </div>

        {/* Create Button */}
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/15 border border-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Tulis {currentTabName} Baru</span>
        </button>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500 dark:text-slate-400">
          Memuat data {currentTabName.toLowerCase()}...
        </div>
      ) : displayedArticles.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <ImageIcon className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Belum ada {currentTabName.toLowerCase()} ditemukan
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Klik tombol "Tulis {currentTabName} Baru" di atas untuk menambahkan {currentTabName.toLowerCase()} pertama.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedArticles.map((art) => (
            <div
              key={art.id}
              className="glass-card rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden flex flex-col hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all group"
            >
              {/* Cover Image */}
              <div className="h-44 w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                {art.cover?.url ? (
                  <img
                    src={getFullImageUrl(art.cover.url)}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
                {art.category && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shadow-sm">
                    {art.category.name}
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {art.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {art.description || 'Tidak ada deskripsi singkat.'}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>
                      {new Date(art.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(art)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title={`Edit ${currentTabName}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setArticleToDelete(art);
                        setIsDeleteOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title={`Hapus ${currentTabName}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingArticle ? `Sunting ${currentTabName}` : `Tulis ${currentTabName} Baru`}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Judul {currentTabName}
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={`Masukkan judul ${currentTabName.toLowerCase()}...`}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Urutan / Posisi Tampil
            </label>
            <input
              type="number"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: Number(e.target.value) })}
              placeholder="0 (Urutan default)"
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Gambar Cover
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={formData.coverUrl}
                onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                placeholder="https://... atau upload file"
                className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:border-emerald-500"
              />
              <label className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700 flex items-center gap-2 cursor-pointer shrink-0">
                <Upload className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{uploading ? 'Mengunggah...' : 'Pilih File'}</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
            {formData.coverUrl && (
              <div className="mt-2 h-28 w-48 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
                <img src={getFullImageUrl(formData.coverUrl)} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Ringkasan / Deskripsi Singkat
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={`Deskripsi singkat yang tampil pada kartu ${currentTabName.toLowerCase()}...`}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Konten Lengkap {currentTabName}
            </label>
            <textarea
              rows={8}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder={`Tulis isi ${currentTabName.toLowerCase()} secara lengkap di sini...`}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/15 cursor-pointer"
            >
              {editingArticle ? `Perbarui ${currentTabName}` : `Publikasikan ${currentTabName}`}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title={`Konfirmasi Hapus ${currentTabName}`}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Apakah Anda yakin ingin menghapus {currentTabName.toLowerCase()} <strong className="text-slate-900 dark:text-white">"{articleToDelete?.title}"</strong>? Data yang dihapus tidak dapat dikembalikan.
          </p>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-500/20 cursor-pointer"
            >
              Ya, Hapus {currentTabName}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
