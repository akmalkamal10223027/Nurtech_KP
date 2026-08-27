import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { Login } from './pages/Login';
import { DashboardOverview } from './pages/DashboardOverview';
import { ArticlesPage } from './pages/ArticlesPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { SchedulesPage } from './pages/SchedulesPage';
import { BannersPage } from './pages/BannersPage';
import { ProgramsPage } from './pages/ProgramsPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { GalleryPage } from './pages/GalleryPage';
import { FaqsPage } from './pages/FaqsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';
import { AppSectionPage } from './pages/AppSectionPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { ContactPage } from './pages/ContactPage';
import { FooterPage } from './pages/FooterPage';

export function App() {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('admin_theme') || 'light';
    let isDark = false;
    if (savedTheme === 'dark') {
      isDark = true;
    } else if (savedTheme === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
          <p className="text-xs font-medium">Memuat Sesi Admin...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Login showToast={showToast} />
        <Toast toast={toast} onClose={closeToast} />
      </>
    );
  }

  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard Overview', subtitle: 'Ringkasan performa dan statistik konten sekolah' },
    banners: { title: 'Banner & Hero Section', subtitle: 'Slider interaktif dan CTA halaman depan' },
    about: { title: 'Profil & Visi Misi Sekolah', subtitle: 'Sambutan Kepala Sekolah, Motto Utama, Visi & Misi' },
    gallery: { title: 'Galeri Dokumentasi', subtitle: 'Album foto dan momen kegiatan sekolah' },
    programs: { title: 'Program Unggulan & Ekskul', subtitle: 'Jurusan teknologi, tahfizh, dan ekstrakurikuler' },
    app_section: { title: 'Aplikasi Boarding School', subtitle: 'Fitur pendukung santri, wali murid, dan mockup mobile app' },
    schedules: { title: 'Aktivitas & Rutinitas Siswa', subtitle: 'Kelola jadwal agenda, rutinitas, dan kegiatan harian siswa' },
    articles: { title: 'Berita & Artikel', subtitle: 'Publikasi dan kelola konten artikel, kabar sekolah, dan kategori' },
    categories: { title: 'Kategori Berita', subtitle: 'Manajemen rubrik dan taksonomi konten' },
    facilities: { title: 'Fasilitas & Prestasi', subtitle: 'Sarana belajar dan pencapaian siswa' },
    registration: { title: 'Pendaftaran & Biaya PPDB', subtitle: 'Syarat-syarat pendaftaran dan rincian komponen biaya' },
    faqs: { title: 'Tanya Jawab (FAQ)', subtitle: 'Bantuan FAQ dan pertanyaan seputar sekolah' },
    contact: { title: 'Kontak & Alamat Sekolah', subtitle: 'Alamat fisik, nomor telepon/WA, sosmed, dan peta lokasi' },
    footers: { title: 'Pengaturan Menu Footer', subtitle: 'Kelola menu navigasi bawah, tautan kustom, dan sub-menu footer website' },
    settings: { title: 'Pengaturan Website & SEO', subtitle: 'Identitas website, nama sekolah, meta title & description' }
  };

  const currentMeta = tabTitles[activeTab] || tabTitles.dashboard;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 selection:bg-emerald-600 selection:text-white transition-colors duration-300">
      {/* Fixed Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area (Offset pl-64 for fixed sidebar) */}
      <div className="pl-64 flex-1 flex flex-col min-w-0 min-h-screen">
        <Header title={currentMeta.title} subtitle={currentMeta.subtitle} />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && <DashboardOverview setActiveTab={setActiveTab} />}
          {activeTab === 'banners' && <BannersPage showToast={showToast} />}
          {activeTab === 'about' && <AboutPage showToast={showToast} />}
          {activeTab === 'gallery' && <GalleryPage showToast={showToast} />}
          {activeTab === 'programs' && <ProgramsPage showToast={showToast} />}
          {activeTab === 'app_section' && <AppSectionPage showToast={showToast} />}
          {activeTab === 'schedules' && <SchedulesPage showToast={showToast} />}
          {activeTab === 'articles' && <ArticlesPage showToast={showToast} />}
          {activeTab === 'categories' && <ArticlesPage showToast={showToast} initialSubTab="berita" />}
          {activeTab === 'facilities' && <FacilitiesPage showToast={showToast} />}
          {activeTab === 'registration' && <RegistrationPage showToast={showToast} />}
          {activeTab === 'faqs' && <FaqsPage showToast={showToast} />}
          {activeTab === 'contact' && <ContactPage showToast={showToast} />}
          {activeTab === 'footers' && <FooterPage showToast={showToast} />}
          {activeTab === 'settings' && <SettingsPage showToast={showToast} />}
        </main>
      </div>

      {/* Toast Notification */}
      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}

export default App;
