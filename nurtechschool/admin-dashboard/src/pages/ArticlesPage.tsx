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
  Megaphone,
  ChevronLeft,
  ChevronRight
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

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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

  // Pagination Calculations
  const totalPages = Math.max(1, Math.ceil(displayedArticles.length / itemsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const paginatedArticles = displayedArticles.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
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
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={`Cari judul ${currentTabName.toLowerCase()}...`}
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

        {/* Create Button */}
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/15 border border-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Tulis {currentTabName} Baru</span>
        </button>
      </div>

      {/* 3 Main Navigation Tabs: Berita, Artikel, Pengumuman */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 flex-wrap">
        <button
          onClick={() => {
            setSubTab('berita');
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            subTab === 'berita'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Newspaper className="w-4 h-4 text-emerald-600" />
          <span>Berita</span>
          {counts.berita > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              {counts.berita}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setSubTab('artikel');
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            subTab === 'artikel'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>Artikel</span>
          {counts.artikel > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              {counts.artikel}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setSubTab('pengumuman');
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            subTab === 'pengumuman'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Megaphone className="w-4 h-4 text-emerald-600" />
          <span>Pengumuman</span>
          {counts.pengumuman > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              {counts.pengumuman}
            </span>
          )}
        </button>
      </div>

      {/* Articles Data Table */}
      <div className="glass-card rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-sm flex flex-col justify-between">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Memuat data {currentTabName.toLowerCase()}...</div>
        ) : displayedArticles.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            {search ? `Tidak ada ${currentTabName.toLowerCase()} yang sesuai dengan pencarian.` : `Belum ada ${currentTabName.toLowerCase()} yang dipublikasikan.`}
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200/90 text-slate-600 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-3.5">Tanggal</th>
                    <th className="px-6 py-3.5">Cover</th>
                    <th className="px-6 py-3.5">Judul & Deskripsi</th>
                    <th className="px-6 py-3.5">Kategori</th>
                    <th className="px-6 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedArticles.map((art) => (
                    <tr key={art.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-slate-600 text-[11px] font-medium">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>
                            {new Date(art.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-16 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center p-0.5">
                          {art.cover?.url ? (
                            <img
                              src={getFullImageUrl(art.cover.url)}
                              alt={art.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-md">
                        <h4 className="font-bold text-slate-900 leading-snug">{art.title}</h4>
                        <p className="text-slate-500 mt-1 line-clamp-2 leading-relaxed text-[11px]">
                          {art.description || 'Tidak ada deskripsi singkat.'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px]">
                          {art.category?.name || currentTabName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(art)}
                            className="p-2 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            title={`Sunting ${currentTabName}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setArticleToDelete(art);
                              setIsDeleteOpen(true);
                            }}
                            className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title={`Hapus ${currentTabName}`}
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
                  {displayedArticles.length === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + itemsPerPage, displayedArticles.length)}
                </span>{' '}
                dari <span className="font-bold text-slate-800">{displayedArticles.length}</span> {currentTabName.toLowerCase()}
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
        title={editingArticle ? `Sunting ${currentTabName}` : `Tulis ${currentTabName} Baru`}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Judul {currentTabName} *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={`Masukkan judul ${currentTabName.toLowerCase()}...`}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Urutan / Posisi Tampil
            </label>
            <input
              type="number"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: Number(e.target.value) })}
              placeholder="0 (Urutan default)"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Gambar Cover
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={formData.coverUrl}
                onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                placeholder="https://... atau upload file"
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
              <label className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 flex items-center gap-2 cursor-pointer shrink-0">
                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                <span>{uploading ? 'Mengunggah...' : 'Pilih File'}</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
            {formData.coverUrl && (
              <div className="mt-2 h-28 w-48 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                <img src={getFullImageUrl(formData.coverUrl)} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Ringkasan / Deskripsi Singkat
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={`Deskripsi singkat yang tampil pada ringkasan ${currentTabName.toLowerCase()}...`}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Konten Lengkap {currentTabName} *
            </label>
            <textarea
              rows={8}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder={`Tulis isi ${currentTabName.toLowerCase()} secara lengkap di sini...`}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 font-mono"
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
          <p className="text-xs text-slate-600">
            Apakah Anda yakin ingin menghapus {currentTabName.toLowerCase()} <strong className="text-slate-900">"{articleToDelete?.title}"</strong>? Data yang dihapus tidak dapat dikembalikan.
          </p>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
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
