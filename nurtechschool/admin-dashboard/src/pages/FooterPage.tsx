import React, { useState, useEffect } from 'react';
import {
  LayoutList,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Upload,
  Image as ImageIcon,
  Phone,
  Globe,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Save,
  ExternalLink,
  MessageCircle,
  Compass,
  Building2,
  Sparkles
} from 'lucide-react';
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
  const [activeSection, setActiveSection] = useState<'info' | 'contact' | 'links' | 'header'>('info');
  const [loading, setLoading] = useState(false);
  const [footers, setFooters] = useState<IFooterMenu[]>([]);
  const [subMenus, setSubMenus] = useState<IFooterSubMenu[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State: Information Column
  const [infoForm, setInfoForm] = useState({
    id: 0,
    menu: 'INFORMATION',
    data: '',
    iconUrl: '',
    position: 1
  });

  // Form State: Header Footer (About)
  const [headerForm, setHeaderForm] = useState({
    id: 0,
    menu: 'SMP ISLAM NURTECH',
    data: 'Unggul, Islami, Berteknologi',
    iconUrl: '',
    position: 0
  });

  // Form State: Quick Links Parent
  const [linkParentForm, setLinkParentForm] = useState({
    id: 0,
    menu: 'QUICK LINKS',
    data: '',
    position: 3
  });

  // Modal State: Contact Item (Create / Edit)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<IFooterMenu | null>(null);
  const [contactForm, setContactForm] = useState({
    menu: '',
    data: '',
    position: 1,
    iconUrl: '',
    preset: 'phone'
  });

  // Modal State: Quick Link Sub-Item (Create / Edit)
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<IFooterSubMenu | null>(null);
  const [linkForm, setLinkForm] = useState({
    menu: '',
    data: '',
    isActive: true,
    position: 1,
    footerId: 0
  });

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

      const footersList: IFooterMenu[] = Array.isArray(fRes) ? fRes : fRes.data || [];
      const subMenusList: IFooterSubMenu[] = Array.isArray(smRes) ? smRes : smRes.data || [];

      setFooters(footersList);
      setSubMenus(subMenusList);

      // Populate Information Column
      const infoItem = footersList.find(f => f.type === 'information');
      if (infoItem) {
        setInfoForm({
          id: infoItem.id,
          menu: infoItem.menu || 'INFORMATION',
          data: infoItem.data || '',
          iconUrl: infoItem.iconUrl || infoItem.icon?.url || '',
          position: infoItem.position || 1
        });
      }

      // Populate Header/About Item
      const headerItem = footersList.find(f => f.type === 'about');
      if (headerItem) {
        setHeaderForm({
          id: headerItem.id,
          menu: headerItem.menu || 'SMP ISLAM NURTECH',
          data: headerItem.data || '',
          iconUrl: headerItem.iconUrl || headerItem.icon?.url || '',
          position: headerItem.position || 0
        });
      }

      // Populate Quick Links Parent
      const linkItem = footersList.find(f => f.type === 'link');
      if (linkItem) {
        setLinkParentForm({
          id: linkItem.id,
          menu: linkItem.menu || 'QUICK LINKS',
          data: linkItem.data || '',
          position: linkItem.position || 3
        });
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal memuat data menu footer', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Helper to resolve image URL
  const getFullImageUrl = (path?: string) => {
    if (!path) return '';
    return path.startsWith('http') ? path : `${UPLOAD_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  // Contact icon helper
  const getContactIcon = (title: string, link: string) => {
    const text = `${title} ${link}`.toLowerCase();
    if (text.includes('wa.me') || text.includes('whatsapp')) return <MessageCircle className="w-4 h-4 text-emerald-500" />;
    if (text.includes('tel:') || text.match(/\d{4,}/) || text.includes('telepon') || text.includes('phone')) return <Phone className="w-4 h-4 text-blue-500" />;
    if (text.includes('instagram')) return <Instagram className="w-4 h-4 text-pink-500" />;
    if (text.includes('facebook')) return <Facebook className="w-4 h-4 text-indigo-500" />;
    if (text.includes('mailto:') || text.includes('@') || text.includes('email')) return <Mail className="w-4 h-4 text-amber-500" />;
    if (text.includes('alamat') || text.includes('lokasi') || text.includes('maps')) return <MapPin className="w-4 h-4 text-red-500" />;
    return <Globe className="w-4 h-4 text-teal-500" />;
  };

  // --- Save Information Section ---
  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        menu: infoForm.menu.trim() || 'INFORMATION',
        type: 'information',
        data: infoForm.data.trim(),
        position: infoForm.position || 1,
        iconUrl: infoForm.iconUrl
      };

      if (infoForm.id) {
        await api.updateFooter(infoForm.id, payload);
        showToast('Kolom Informasi berhasil disimpan!', 'success');
      } else {
        const res = await api.createFooter(payload);
        setInfoForm(prev => ({ ...prev, id: res?.data?.id || res?.id || 0 }));
        showToast('Kolom Informasi baru berhasil dibuat!', 'success');
      }
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan kolom informasi', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // --- Save Header Footer (About) ---
  const handleSaveHeader = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        menu: headerForm.menu.trim() || 'SMP ISLAM NURTECH',
        type: 'about',
        data: headerForm.data.trim(),
        position: headerForm.position || 0,
        iconUrl: headerForm.iconUrl
      };

      if (headerForm.id) {
        await api.updateFooter(headerForm.id, payload);
        showToast('Header Footer berhasil disimpan!', 'success');
      } else {
        const res = await api.createFooter(payload);
        setHeaderForm(prev => ({ ...prev, id: res?.data?.id || res?.id || 0 }));
        showToast('Header Footer baru berhasil dibuat!', 'success');
      }
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan header footer', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // --- Save Quick Links Title ---
  const handleSaveLinkParent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        menu: linkParentForm.menu.trim() || 'QUICK LINKS',
        type: 'link',
        data: linkParentForm.data || '',
        position: linkParentForm.position || 3
      };

      if (linkParentForm.id) {
        await api.updateFooter(linkParentForm.id, payload);
        showToast('Judul Tautan Cepat berhasil disimpan!', 'success');
      } else {
        const res = await api.createFooter(payload);
        setLinkParentForm(prev => ({ ...prev, id: res?.data?.id || res?.id || 0 }));
        showToast('Kelompok Tautan Cepat berhasil dibuat!', 'success');
      }
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan judul tautan', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // --- Contact Handlers ---
  const contactList = footers.filter(f => f.type === 'contact');

  const handleOpenCreateContact = () => {
    setEditingContact(null);
    setContactForm({
      menu: '',
      data: '',
      position: contactList.length + 1,
      iconUrl: '',
      preset: 'phone'
    });
    setIsContactModalOpen(true);
  };

  const handleOpenEditContact = (item: IFooterMenu) => {
    setEditingContact(item);
    setContactForm({
      menu: item.menu,
      data: item.data || '',
      position: item.position || 1,
      iconUrl: item.iconUrl || item.icon?.url || '',
      preset: 'custom'
    });
    setIsContactModalOpen(true);
  };

  const handleApplyContactPreset = (preset: string) => {
    let defaultMenu = '';
    let defaultData = '';
    switch (preset) {
      case 'phone':
        defaultMenu = '+62 812 3456 7890';
        defaultData = 'tel:+6281234567890';
        break;
      case 'whatsapp':
        defaultMenu = 'WhatsApp Admin';
        defaultData = 'https://wa.me/6281234567890';
        break;
      case 'email':
        defaultMenu = 'info@nurtechschool.sch.id';
        defaultData = 'mailto:info@nurtechschool.sch.id';
        break;
      case 'instagram':
        defaultMenu = '@smpislamnurtech';
        defaultData = 'https://instagram.com/smpislamnurtech';
        break;
      case 'facebook':
        defaultMenu = 'SMP Islam Nurtech';
        defaultData = 'https://facebook.com/smpislamnurtech';
        break;
      case 'maps':
        defaultMenu = 'Jl. Pendidikan No. 123, Bandung';
        defaultData = 'https://maps.google.com';
        break;
    }
    setContactForm(prev => ({
      ...prev,
      preset,
      menu: prev.menu || defaultMenu,
      data: prev.data || defaultData
    }));
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.menu.trim()) {
      showToast('Label kontak wajib diisi', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        menu: contactForm.menu.trim(),
        type: 'contact',
        data: contactForm.data.trim(),
        position: Number(contactForm.position) || 1,
        iconUrl: contactForm.iconUrl
      };

      if (editingContact) {
        await api.updateFooter(editingContact.id, payload);
        showToast('Kontak berhasil diperbarui!', 'success');
      } else {
        await api.createFooter(payload);
        showToast('Kontak baru berhasil ditambahkan!', 'success');
      }
      setIsContactModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan kontak', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteContact = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus item kontak ini?')) return;
    try {
      await api.deleteFooter(id);
      showToast('Kontak berhasil dihapus!', 'success');
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus kontak', 'error');
    }
  };

  // --- Quick Links Sub-Menu Handlers ---
  const linkParent = footers.find(f => f.type === 'link');
  const quickLinksList = subMenus.filter(sm => {
    const parentId = sm.footerId || sm.footer_ids?.[0]?.id || sm.footer?.id;
    return linkParent ? parentId === linkParent.id : sm.type === 'link';
  });

  const handleOpenCreateLink = (presetTitle?: string, presetHref?: string) => {
    setEditingLink(null);
    setLinkForm({
      menu: presetTitle || '',
      data: presetHref || '',
      isActive: true,
      position: quickLinksList.length + 1,
      footerId: linkParent?.id || 0
    });
    setIsLinkModalOpen(true);
  };

  const handleOpenEditLink = (item: IFooterSubMenu) => {
    setEditingLink(item);
    setLinkForm({
      menu: item.menu,
      data: item.data || '',
      isActive: item.isActive !== undefined ? item.isActive : true,
      position: item.position || 1,
      footerId: item.footerId || item.footer_ids?.[0]?.id || linkParent?.id || 0
    });
    setIsLinkModalOpen(true);
  };

  const handleSaveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkForm.menu.trim()) {
      showToast('Nama tautan wajib diisi', 'error');
      return;
    }

    try {
      setSubmitting(true);

      // Ensure link parent exists
      let parentId = linkForm.footerId;
      if (!parentId) {
        if (linkParent?.id) {
          parentId = linkParent.id;
        } else {
          const newParent = await api.createFooter({
            menu: 'QUICK LINKS',
            type: 'link',
            position: 3
          });
          parentId = newParent?.data?.id || newParent?.id;
        }
      }

      const payload = {
        menu: linkForm.menu.trim(),
        type: 'link',
        data: linkForm.data.trim() || '#',
        isActive: linkForm.isActive,
        position: Number(linkForm.position) || 1,
        footerId: parentId
      };

      if (editingLink) {
        await api.updateFooterSubMenu(editingLink.id, payload);
        showToast('Tautan berhasil diperbarui!', 'success');
      } else {
        await api.createFooterSubMenu(payload);
        showToast('Tautan baru berhasil ditambahkan!', 'success');
      }
      setIsLinkModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan tautan', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLink = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus tautan ini?')) return;
    try {
      await api.deleteFooterSubMenu(id);
      showToast('Tautan berhasil dihapus!', 'success');
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus tautan', 'error');
    }
  };

  const handleToggleLinkActive = async (item: IFooterSubMenu) => {
    try {
      const updatedStatus = !item.isActive;
      await api.updateFooterSubMenu(item.id, { isActive: updatedStatus });
      showToast(`Tautan '${item.menu}' ${updatedStatus ? 'diaktifkan' : 'dinonaktifkan'}!`, 'info');
      setSubMenus(subMenus.map(sm => sm.id === item.id ? { ...sm, isActive: updatedStatus } : sm));
    } catch (err: any) {
      showToast(err.message || 'Gagal merubah status tautan', 'error');
    }
  };

  // Upload handler for Info Icon
  const handleUploadInfoIcon = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const url = await api.uploadFile(file);
      if (url) {
        setInfoForm(prev => ({ ...prev, iconUrl: url }));
        showToast('Foto icon informasi berhasil diunggah!', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal mengunggah foto', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  // Upload handler for Header Footer
  const handleUploadHeaderIcon = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const url = await api.uploadFile(file);
      if (url) {
        setHeaderForm(prev => ({ ...prev, iconUrl: url }));
        showToast('Logo header footer berhasil diunggah!', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal mengunggah logo', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Memuat data pengaturan footer...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Modern Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-100 dark:bg-slate-800/60 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
        <button
          onClick={() => setActiveSection('info')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${activeSection === 'info'
            ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200/60 dark:border-slate-800'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
        >
          <Building2 className="w-4 h-4" />
          <span> Informasi Profil</span>
        </button>

        <button
          onClick={() => setActiveSection('contact')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${activeSection === 'contact'
            ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200/60 dark:border-slate-800'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
        >
          <Phone className="w-4 h-4" />
          <span>Kontak & Medsos ({contactList.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('links')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${activeSection === 'links'
            ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200/60 dark:border-slate-800'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
        >
          <Compass className="w-4 h-4" />
          <span>Tautan Cepat ({quickLinksList.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('header')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${activeSection === 'header'
            ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200/60 dark:border-slate-800'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Header Footer </span>
        </button>
      </div>

      {/* SECTION 1: INFORMASI SEKOLAH */}
      {activeSection === 'info' && (
        <form
          onSubmit={handleSaveInfo}
          className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm max-w-3xl space-y-5"
        >
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Pengaturan Kolom Informasi</span>
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Judul Kolom
            </label>
            <input
              type="text"
              required
              value={infoForm.menu}
              onChange={(e) => setInfoForm({ ...infoForm, menu: e.target.value })}
              placeholder="Contoh: INFORMATION"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500 font-semibold uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Foto / Icon
            </label>
            <div className="flex items-center gap-3">
              {infoForm.iconUrl ? (
                <div className="w-14 h-14 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1 flex items-center justify-center shrink-0">
                  <img
                    src={getFullImageUrl(infoForm.iconUrl)}
                    alt="Icon Info"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 shrink-0">
                  <ImageIcon className="w-5 h-5" />
                </div>
              )}

              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={infoForm.iconUrl}
                  onChange={(e) => setInfoForm({ ...infoForm, iconUrl: e.target.value })}
                  placeholder="/uploads/... atau URL icon"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                />
                <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold cursor-pointer border border-slate-200 dark:border-slate-700 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingImage ? 'Mengunggah...' : 'Pilih File Icon'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadInfoIcon}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Deskripsi Singkat Profil Sekolah
              </label>
            </div>
            <textarea
              rows={4}
              value={infoForm.data}
              onChange={(e) => setInfoForm({ ...infoForm, data: e.target.value })}
              placeholder="Tuliskan deskripsi profil singkat, visi, atau pengantar sekolah..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/15 cursor-pointer disabled:opacity-50 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Menyimpan...' : 'Simpan Perubahan Informasi'}</span>
            </button>
          </div>
        </form>
      )}

      {/* SECTION 2: KONTAK & MEDIA SOSIAL */}
      {activeSection === 'contact' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Daftar Kontak & Media Sosial Footer ({contactList.length})</span>
              </h3>
            </div>

            <button
              onClick={handleOpenCreateContact}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/15 cursor-pointer transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contactList.map((contact, idx) => (
              <div
                key={contact.id}
                className="glass-card rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-3 hover:border-emerald-300 transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0">
                      {getContactIcon(contact.menu, contact.data)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 transition-colors">
                        {contact.menu}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono mt-0.5">
                        {contact.data || '-'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenEditContact(contact)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer transition-colors"
                      title="Edit Kontak"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                      title="Hapus Kontak"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Urutan: #{contact.position || idx + 1}</span>
                  {contact.data && (
                    <a
                      href={contact.data}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>Uji Tautan</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}

            {contactList.length === 0 && (
              <div className="col-span-full p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 text-xs">
                <Phone className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-semibold text-slate-700 dark:text-slate-300">Belum ada data kontak</p>
                <p className="mt-1">Klik tombol 'Tambah' untuk menambahkan nomor telepon, email, atau sosial media.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 3: TAUTAN CEPAT (QUICK LINKS) */}
      {activeSection === 'links' && (
        <div className="space-y-6">
          {/* Quick Links Parent Title Editor */}
          <form
            onSubmit={handleSaveLinkParent}
            className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Judul Header
              </label>
              <input
                type="text"
                value={linkParentForm.menu}
                onChange={(e) => setLinkParentForm({ ...linkParentForm, menu: e.target.value })}
                placeholder="Contoh: QUICK LINKS atau TAUTAN CEPAT"
                className="w-full max-w-md px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-bold uppercase focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer self-start sm:self-end disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Judul Kolom</span>
            </button>
          </form>

          {/* Quick Links Sub-Items */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-600" />
                  <span>Daftar Tautan Navigasi Footer ({quickLinksList.length})</span>
                </h3>
              </div>

              <button
                onClick={() => handleOpenCreateLink()}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/15 cursor-pointer transition-all self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Tautan Baru</span>
              </button>
            </div>

            {/* Table of Links */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 px-3">Nama Tautan</th>
                    <th className="pb-3 px-3">URL Link</th>
                    <th className="pb-3 px-3 text-center">Urutan</th>
                    <th className="pb-3 px-3 text-center">Status</th>
                    <th className="pb-3 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {quickLinksList.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span className="text-[#F4B942]">›</span>
                          <span>{item.menu}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                        {item.data || '#'}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-500">
                        #{item.position || idx + 1}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleLinkActive(item)}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border cursor-pointer transition-all ${item.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                            : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                            }`}
                        >
                          {item.isActive ? 'Aktif' : 'Non-Aktif'}
                        </button>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditLink(item)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer transition-colors"
                            title="Edit Tautan"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteLink(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                            title="Hapus Tautan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {quickLinksList.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        Belum ada tautan cepat. Klik tombol 'Tambah Tautan Baru' di atas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: HEADER FOOTER & BRAND */}
      {activeSection === 'header' && (
        <form
          onSubmit={handleSaveHeader}
          className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm max-w-2xl space-y-5"
        >
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Header Footer</span>
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Logo Sekolah
            </label>
            <div className="flex items-center gap-3">
              {headerForm.iconUrl ? (
                <div className="w-14 h-14 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1 flex items-center justify-center shrink-0">
                  <img
                    src={getFullImageUrl(headerForm.iconUrl)}
                    alt="Logo Header"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 shrink-0">
                  <ImageIcon className="w-5 h-5" />
                </div>
              )}

              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={headerForm.iconUrl}
                  onChange={(e) => setHeaderForm({ ...headerForm, iconUrl: e.target.value })}
                  placeholder="/uploads/logo.png atau URL logo"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-mono text-[11px]"
                />
                <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold cursor-pointer border border-slate-200 dark:border-slate-700 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingImage ? 'Mengunggah...' : 'Unggah Logo Baru'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadHeaderIcon}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Nama Sekolah / Brand Utama
            </label>
            <input
              type="text"
              required
              value={headerForm.menu}
              onChange={(e) => setHeaderForm({ ...headerForm, menu: e.target.value })}
              placeholder="Contoh: SMP ISLAM NURTECH"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Slogan / Sub-Judul Sekolah
            </label>
            <input
              type="text"
              value={headerForm.data}
              onChange={(e) => setHeaderForm({ ...headerForm, data: e.target.value })}
              placeholder="Contoh: Unggul, Islami, Berteknologi"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/15 cursor-pointer disabled:opacity-50 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Menyimpan...' : 'Simpan Header Footer'}</span>
            </button>
          </div>
        </form>
      )}

      {/* MODAL: Tambah / Edit Kontak */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveContact}
            className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {editingContact ? 'Edit Item Kontak' : 'Tambah'}
              </h3>
              <button
                type="button"
                onClick={() => setIsContactModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preset selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Pilih Jenis Kontak:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'phone', label: 'Telepon', icon: Phone },
                  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
                  { id: 'email', label: 'Email', icon: Mail },
                  { id: 'instagram', label: 'Instagram', icon: Instagram },
                  { id: 'facebook', label: 'Facebook', icon: Facebook },
                  { id: 'maps', label: 'Lokasi/Alamat', icon: MapPin },
                ].map(p => {
                  const IconComp = p.icon;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleApplyContactPreset(p.id)}
                      className={`p-2 rounded-xl text-[11px] font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${contactForm.preset === p.id
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                        }`}
                    >
                      <IconComp className="w-3.5 h-3.5" />
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Teks Label Kontak
              </label>
              <input
                type="text"
                required
                value={contactForm.menu}
                onChange={(e) => setContactForm({ ...contactForm, menu: e.target.value })}
                placeholder="Contoh: +62 812 3456 7890 atau @smpislamnurtech"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tautan / Link Aksi
              </label>
              <input
                type="text"
                value={contactForm.data}
                onChange={(e) => setContactForm({ ...contactForm, data: e.target.value })}
                placeholder="Contoh: tel:+6281234567890 atau https://wa.me/..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Urutan Tampilan
              </label>
              <input
                type="number"
                value={contactForm.position}
                onChange={(e) => setContactForm({ ...contactForm, position: Number(e.target.value) || 1 })}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsContactModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/15 cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Menyimpan...' : 'Simpan Kontak'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: Tambah / Edit Tautan Cepat */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveLink}
            className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {editingLink ? 'Edit Tautan Cepat' : 'Tambah Tautan Cepat'}
              </h3>
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Tautan
              </label>
              <input
                type="text"
                required
                value={linkForm.menu}
                onChange={(e) => setLinkForm({ ...linkForm, menu: e.target.value })}
                placeholder="Contoh: Beranda, Fasilitas, Program Unggulan"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                URL Link
              </label>
              <input
                type="text"
                required
                value={linkForm.data}
                onChange={(e) => setLinkForm({ ...linkForm, data: e.target.value })}
                placeholder="Contoh: #about, #facility, #program, /news"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Urutan Posisi
              </label>
              <input
                type="number"
                value={linkForm.position}
                onChange={(e) => setLinkForm({ ...linkForm, position: Number(e.target.value) || 1 })}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Status Tautan</span>
              <button
                type="button"
                onClick={() => setLinkForm({ ...linkForm, isActive: !linkForm.isActive })}
                className={`py-1.5 px-3 rounded-xl text-xs font-semibold border flex items-center gap-1.5 cursor-pointer transition-all ${linkForm.isActive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                  }`}
              >
                {linkForm.isActive ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                <span>{linkForm.isActive ? 'Aktif' : 'Non-Aktif'}</span>
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/15 cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Menyimpan...' : 'Simpan Tautan'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
