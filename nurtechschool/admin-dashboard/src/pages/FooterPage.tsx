import React, { useState, useEffect } from 'react';
import { LayoutList, Plus, Edit2, Trash2, Link as LinkIcon, Check, X, Layers, Upload, Image as ImageIcon } from 'lucide-react';
import { api, UPLOAD_BASE } from '../api';

export interface FooterPageProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export interface IFooterMenu {
  id: number;
  documentId?: string;
  menu: string;
  type: string;
  data: string;
  position: number;
  iconUrl?: string;
  icon?: { url: string };
  footerSubMenus?: IFooterSubMenu[];
  footer_sub_menus?: IFooterSubMenu[];
}

export interface IFooterSubMenu {
  id: number;
  documentId?: string;
  menu: string;
  type: string;
  data: string;
  isActive: boolean;
  position: number;
  iconUrl?: string;
  icon?: { url: string };
  footer_ids?: { id: number; menu: string }[];
  footerId?: number;
  footer?: { id: number; menu: string };
}

export const FooterPage: React.FC<FooterPageProps> = ({ showToast }) => {
  const [activeTab, setActiveTab] = useState<'menus' | 'submenus'>('menus');
  const [loading, setLoading] = useState(false);
  const [footers, setFooters] = useState<IFooterMenu[]>([]);
  const [subMenus, setSubMenus] = useState<IFooterSubMenu[]>([]);

  // Modal State for Main Footer Menu
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<IFooterMenu | null>(null);
  const [menuForm, setMenuForm] = useState({
    menu: '',
    type: 'information',
    data: '',
    position: 0,
    iconUrl: ''
  });

  // Modal State for Sub-Menu
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<IFooterSubMenu | null>(null);
  const [subForm, setSubForm] = useState({
    menu: '',
    type: 'information',
    data: '',
    isActive: true,
    position: 0,
    iconUrl: '',
    footerId: 0
  });

  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [subUploadingImage, setSubUploadingImage] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fRes, smRes] = await Promise.all([
        api.getFooters().catch(() => ({ data: [] })),
        api.getFooterSubMenus().catch(() => ({ data: [] }))
      ]);

      setFooters(Array.isArray(fRes) ? fRes : fRes.data || []);
      setSubMenus(Array.isArray(smRes) ? smRes : smRes.data || []);
    } catch (err: any) {
      showToast(err.message || 'Gagal memuat data menu footer', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Upload main menu icon
  const handleMenuImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const url = await api.uploadFile(file);
      if (url) {
        setMenuForm(prev => ({ ...prev, iconUrl: url }));
        showToast('Foto icon menu berhasil diunggah!', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal mengunggah foto', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  // Upload sub-menu icon
  const handleSubImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setSubUploadingImage(true);
      const url = await api.uploadFile(file);
      if (url) {
        setSubForm(prev => ({ ...prev, iconUrl: url }));
        showToast('Foto sub-menu berhasil diunggah!', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal mengunggah foto sub-menu', 'error');
    } finally {
      setSubUploadingImage(false);
    }
  };

  // --- Main Footer Menu Handlers ---
  const handleOpenCreateMenu = () => {
    setEditingMenu(null);
    setMenuForm({
      menu: '',
      type: 'information',
      data: '',
      position: footers.length + 1,
      iconUrl: ''
    });
    setIsMenuModalOpen(true);
  };

  const handleOpenEditMenu = (item: IFooterMenu) => {
    setEditingMenu(item);
    setMenuForm({
      menu: item.menu,
      type: item.type || 'information',
      data: item.data || '',
      position: item.position || 0,
      iconUrl: item.iconUrl || item.icon?.url || ''
    });
    setIsMenuModalOpen(true);
  };

  const handleSaveMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuForm.menu.trim()) {
      showToast('Nama menu footer wajib diisi', 'error');
      return;
    }

    try {
      setSubmitting(true);
      if (editingMenu) {
        await api.updateFooter(editingMenu.id, menuForm);
        showToast('Menu footer berhasil diperbarui!', 'success');
      } else {
        await api.createFooter(menuForm);
        showToast('Menu footer baru berhasil ditambahkan!', 'success');
      }
      setIsMenuModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan menu footer', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMenu = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus menu footer ini? Sub-menu di dalamnya juga akan terhapus.')) return;
    try {
      await api.deleteFooter(id);
      showToast('Menu footer berhasil dihapus!', 'success');
      setFooters(footers.filter(f => f.id !== id));
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus menu footer', 'error');
    }
  };

  // --- Sub-Menu Handlers ---
  const handleOpenCreateSub = (defaultFooterId?: number) => {
    setEditingSub(null);
    setSubForm({
      menu: '',
      type: 'information',
      data: '',
      isActive: true,
      position: subMenus.length + 1,
      iconUrl: '',
      footerId: defaultFooterId || (footers[0]?.id || 0)
    });
    setIsSubModalOpen(true);
  };

  const handleOpenEditSub = (item: IFooterSubMenu) => {
    setEditingSub(item);
    const parentId = item.footerId || item.footer_ids?.[0]?.id || 0;
    setSubForm({
      menu: item.menu,
      type: item.type || 'information',
      data: item.data || '',
      isActive: item.isActive !== undefined ? item.isActive : true,
      position: item.position || 0,
      iconUrl: item.iconUrl || item.icon?.url || '',
      footerId: parentId
    });
    setIsSubModalOpen(true);
  };

  const handleSaveSub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subForm.menu.trim()) {
      showToast('Judul sub-menu wajib diisi', 'error');
      return;
    }

    try {
      setSubmitting(true);
      if (editingSub) {
        await api.updateFooterSubMenu(editingSub.id, subForm);
        showToast('Sub-menu footer berhasil diperbarui!', 'success');
      } else {
        await api.createFooterSubMenu(subForm);
        showToast('Sub-menu footer baru berhasil ditambahkan!', 'success');
      }
      setIsSubModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan sub-menu footer', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSub = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus sub-menu footer ini?')) return;
    try {
      await api.deleteFooterSubMenu(id);
      showToast('Sub-menu footer berhasil dihapus!', 'success');
      setSubMenus(subMenus.filter(sm => sm.id !== id));
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus sub-menu', 'error');
    }
  };

  const handleToggleSubActive = async (sub: IFooterSubMenu) => {
    try {
      const updatedStatus = !sub.isActive;
      await api.updateFooterSubMenu(sub.id, { isActive: updatedStatus });
      showToast(`Sub-menu '${sub.menu}' ${updatedStatus ? 'diaktifkan' : 'dinonaktifkan'}!`, 'info');
      setSubMenus(subMenus.map(sm => sm.id === sub.id ? { ...sm, isActive: updatedStatus } : sm));
    } catch (err: any) {
      showToast(err.message || 'Gagal merubah status sub-menu', 'error');
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400">Memuat menu & tautan footer...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Pengaturan Menu & Sub-Menu Footer</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kelola kelompok menu utama serta item informasi & foto pendukung pada footer website
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenCreateMenu}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/15 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Menu Utama</span>
          </button>

          <button
            onClick={() => handleOpenCreateSub()}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm transition-all"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Tambah Sub-Menu</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('menus')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'menus'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <LayoutList className="w-4 h-4" />
          <span>Menu Utama Footer ({footers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('submenus')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'submenus'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Sub-Menu & Foto Informasi ({subMenus.length})</span>
        </button>
      </div>

      {/* Tab 1: Menu Utama Footer */}
      {activeTab === 'menus' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {footers.map((f, idx) => {
            const subItems = f.footerSubMenus || f.footer_sub_menus || [];
            return (
              <div
                key={f.id}
                className="glass-card rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shrink-0">
                        #{f.position || idx + 1}
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {f.menu}
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border border-slate-200 dark:border-slate-700 uppercase tracking-wider">
                          {f.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditMenu(f)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                        title="Edit Menu Utama"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMenu(f.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Hapus Menu"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {f.data && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800 font-mono text-[11px]">
                      {f.data}
                    </p>
                  )}

                  {/* Nested Sub-Menus Overview (Hanya untuk tipe non-information) */}
                  {f.type !== 'information' ? (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span>Sub-Menu ({subItems.length})</span>
                        <button
                          onClick={() => handleOpenCreateSub(f.id)}
                          className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Tambah Sub</span>
                        </button>
                      </div>

                      {subItems.length > 0 ? (
                        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                          {subItems.map(sm => {
                            const smIcon = sm.iconUrl || sm.icon?.url;
                            const smIconSrc = smIcon ? (smIcon.startsWith('http') ? smIcon : `${UPLOAD_BASE}${smIcon}`) : null;

                            return (
                              <div
                                key={sm.id}
                                className="px-2.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-2 text-xs"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  {smIconSrc && (
                                    <img src={smIconSrc} alt={sm.menu} className="w-5 h-5 object-contain rounded shrink-0 bg-white/10" />
                                  )}
                                  <div className="min-w-0">
                                    <p className="text-slate-800 dark:text-slate-200 font-bold truncate">{sm.menu}</p>
                                    {sm.data && <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{sm.data}</p>}
                                  </div>
                                </div>
                                <span className={`w-2 h-2 rounded-full shrink-0 ${sm.isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400 italic">Belum ada sub-menu di kelompok ini</p>
                      )}
                    </div>
                  ) : (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-[11px] text-slate-400 italic">
                        ℹ️ Tipe Information berupa deskripsi profil sekolah (tidak menggunakan sub-menu).
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {footers.length === 0 && (
            <div className="col-span-full glass-card rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-500 shadow-sm">
              <LayoutList className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">Belum Ada Menu Utama Footer</p>
              <p className="mt-1">Klik 'Tambah Menu Utama' di atas untuk membuat kelompok menu footer baru.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Sub-Menu Footer */}
      {activeTab === 'submenus' && (
        <div className="glass-card rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 px-3">Foto / Icon</th>
                  <th className="pb-3 px-3">Judul Sub-Menu</th>
                  <th className="pb-3 px-3">Parent Menu Footer</th>
                  <th className="pb-3 px-3">Keterangan / Tautan Data</th>
                  <th className="pb-3 px-3 text-center">Tipe</th>
                  <th className="pb-3 px-3 text-center">Status</th>
                  <th className="pb-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {subMenus.map((sm, idx) => {
                  const parentName = sm.footer?.menu || sm.footer_ids?.[0]?.menu || 'Independen';
                  const smIcon = sm.iconUrl || sm.icon?.url;
                  const smIconSrc = smIcon ? (smIcon.startsWith('http') ? smIcon : `${UPLOAD_BASE}${smIcon}`) : null;

                  return (
                    <tr key={sm.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3">
                        {smIconSrc ? (
                          <img src={smIconSrc} alt={sm.menu} className="w-8 h-8 object-contain rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-0.5" />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                        {sm.menu}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
                          {parentName}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                        {sm.data || '-'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 uppercase">
                          {sm.type || 'info'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleToggleSubActive(sm)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border cursor-pointer transition-all ${
                            sm.isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                              : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                          }`}
                        >
                          {sm.isActive ? 'Aktif' : 'Non-Aktif'}
                        </button>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditSub(sm)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSub(sm.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {subMenus.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 dark:text-slate-400">
                      Belum ada data sub-menu footer.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Form Menu Utama Footer */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveMenu}
            className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 max-w-md w-full space-y-4 shadow-xl animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {editingMenu ? 'Edit Menu Utama Footer' : 'Tambah Menu Utama Footer'}
              </h3>
              <button
                type="button"
                onClick={() => setIsMenuModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Judul / Label Menu</label>
              <input
                type="text"
                required
                value={menuForm.menu}
                onChange={(e) => setMenuForm({ ...menuForm, menu: e.target.value })}
                placeholder="Contoh: Informasi Publik, Kontak Info, Tautan Cepat"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tipe Kelompok</label>
                <select
                  value={menuForm.type}
                  onChange={(e) => setMenuForm({ ...menuForm, type: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500"
                >
                  <option value="information">Information</option>
                  <option value="contact">Contact</option>
                  <option value="link">Link</option>
                  <option value="about">About</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Urutan Posisi</label>
                <input
                  type="number"
                  value={menuForm.position}
                  onChange={(e) => setMenuForm({ ...menuForm, position: Number(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Foto / Icon Header (Upload / URL)</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={menuForm.iconUrl}
                  onChange={(e) => setMenuForm({ ...menuForm, iconUrl: e.target.value })}
                  placeholder="/uploads/logo.png atau URL foto"
                  className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                />
                <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700 shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingImage ? '...' : 'Upload'}</span>
                  <input type="file" accept="image/*" onChange={handleMenuImageUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Data / Deskripsi Singkat</label>
              <textarea
                rows={2}
                value={menuForm.data}
                onChange={(e) => setMenuForm({ ...menuForm, data: e.target.value })}
                placeholder="Deskripsi singkat, rincian data, atau URL target"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsMenuModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer shadow-md shadow-emerald-600/15 disabled:opacity-50"
              >
                {submitting ? 'Menyimpan...' : 'Simpan Menu'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Form Sub-Menu Footer */}
      {isSubModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveSub}
            className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 max-w-md w-full space-y-4 shadow-xl animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {editingSub ? 'Edit Sub-Menu Footer' : 'Tambah Sub-Menu Footer'}
              </h3>
              <button
                type="button"
                onClick={() => setIsSubModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Parent Menu Utama Footer</label>
              <select
                value={subForm.footerId}
                onChange={(e) => setSubForm({ ...subForm, footerId: Number(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500"
              >
                <option value={0}>-- Pilih Kelompok Menu Utama --</option>
                {footers.filter(f => f.type !== 'information').map(f => (
                  <option key={f.id} value={f.id}>{f.menu} ({f.type})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Judul Sub-Menu / Informasi</label>
              <input
                type="text"
                required
                value={subForm.menu}
                onChange={(e) => setSubForm({ ...subForm, menu: e.target.value })}
                placeholder="Contoh: Akreditasi A, Jam Operasional, Visi Singkat"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tipe Tampilan Sub-Menu</label>
                <select
                  value={subForm.type}
                  onChange={(e) => setSubForm({ ...subForm, type: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500"
                >
                  <option value="information">Informasi (Teks Biasa)</option>
                  <option value="link">Tautan Link (URL)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Urutan Posisi</label>
                <input
                  type="number"
                  value={subForm.position}
                  onChange={(e) => setSubForm({ ...subForm, position: Number(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Sub-Menu Image Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Foto / Icon Pendukung Sub-Menu (Upload / URL)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={subForm.iconUrl}
                  onChange={(e) => setSubForm({ ...subForm, iconUrl: e.target.value })}
                  placeholder="https://... atau URL foto"
                  className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                />
                <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700 shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{subUploadingImage ? '...' : 'Upload Foto'}</span>
                  <input type="file" accept="image/*" onChange={handleSubImageUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {subForm.type === 'information' ? 'Teks Keterangan Informasi' : 'Tautan / Target Link URL'}
              </label>
              <input
                type="text"
                value={subForm.data}
                onChange={(e) => setSubForm({ ...subForm, data: e.target.value })}
                placeholder={subForm.type === 'information' ? 'Terakreditasi BAN-SM / Jam 07.00 - 15.00' : 'https://... atau /#programs'}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Status Publikasi Sub-Menu</span>
              <button
                type="button"
                onClick={() => setSubForm({ ...subForm, isActive: !subForm.isActive })}
                className={`py-1.5 px-3 rounded-xl text-xs font-semibold border flex items-center gap-2 cursor-pointer transition-all ${
                  subForm.isActive
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                }`}
              >
                {subForm.isActive ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                <span>{subForm.isActive ? 'Status Aktif' : 'Non-Aktif'}</span>
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsSubModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer shadow-md shadow-emerald-600/15 disabled:opacity-50"
              >
                {submitting ? 'Menyimpan...' : 'Simpan Sub-Menu'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
