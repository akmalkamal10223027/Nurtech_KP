# Nurtech School - Fullstack Ecosystem

Aplikasi terpadu portal sekolah Nurtech School yang terdiri dari:
1. **Backend Express.js** (`backend/`) - REST API dengan MySQL (Laragon) & Prisma ORM.
2. **Admin Dashboard** (`nurtechschool/admin-dashboard/`) - Panel manajemen konten modern & responsif (React + Vite + Tailwind CSS).
3. **Public Website Frontend** (`nurtechschool/`) - Portal publik sekolah (Next.js App Router).

---

## 🚀 Panduan Menjalankan Sistem

### 1. Nyalakan Database Laragon
1. Buka aplikasi **Laragon** di komputer Anda.
2. Klik tombol **Start All** (memastikan Apache & MySQL pada port 3306 berjalan).

### 2. Setup Database & Jalankan Backend Express
Buka terminal pada folder `backend/`:
```bash
cd backend
npm run db:setup     # Otomatis membuat database MySQL 'nurtech_school_db', migrasi tabel & seeder
npm run dev          # Menjalankan server di http://localhost:1337
```

**Akun Default Admin:**
- **Email:** `admin@nurtechschool.id`
- **Password:** `admin123`

### 3. Jalankan Frontend Admin Dashboard
Buka terminal baru pada folder `nurtechschool/admin-dashboard/`:
```bash
cd nurtechschool/admin-dashboard
npm run dev          # Menjalankan Admin Dashboard di http://localhost:5173
```

### 4. Jalankan Website Publik (Landing Page)
Buka terminal baru pada folder `nurtechschool/`:
```bash
cd nurtechschool
npm run dev          # Menjalankan web publik di http://localhost:3000
```

---

## 📂 Fitur Dashboard Admin
- **Dashboard Overview**: Ringkasan statistik berita, kategori, banner, program, fasilitas, dan galeri.
- **Berita & Artikel**: Manajemen CRUD artikel berita, upload cover image, pencarian, filter kategori.
- **Kategori Berita**: Tambah, edit, dan urutkan rubrik kategori berita.
- **Banner & Hero**: Kelola slider beranda utama beserta tombol CTA.
- **Program & Ekskul**: Kelola jurusan / program unggulan dan kegiatan ekstrakurikuler.
- **Fasilitas & Prestasi**: Manajemen sarana prasarana sekolah dan penghargaan siswa.
- **Galeri Kegiatan**: Album dokumentasi kegiatan siswa.
- **Pengaturan Sekolah**:
  - Sambutan & Foto Kepala Sekolah
  - Visi & Misi Sekolah
  - Informasi & Rincian Biaya Pendaftaran
  - Alamat, No. WhatsApp, & Koordinat Maps
  - Tanya Jawab (FAQ)
  - Identitas Website & Pengaturan SEO
