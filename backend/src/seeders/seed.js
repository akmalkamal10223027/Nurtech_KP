require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Nurtech School database in MySQL Laragon...');

  // 1. Admin User
  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nurtechschool.id' },
    update: {},
    create: {
      name: 'Administrator Nurtech',
      email: 'admin@nurtechschool.id',
      password: passwordHash,
      role: 'superadmin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'
    }
  });
  console.log('Admin user created:', admin.email, '(password: admin123)');

  // 2. Categories
  const categoriesData = [
    { name: 'Akademik', slug: 'akademik', description: 'Informasi dan kegiatan akademik sekolah', position: 1 },
    { name: 'Prestasi', slug: 'prestasi', description: 'Kabar pencapaian siswa dan guru', position: 2 },
    { name: 'Kegiatan Siswa', slug: 'kegiatan-siswa', description: 'Dokumentasi aktivitas ekstrakurikuler & event', position: 3 },
    { name: 'Pengumuman', slug: 'pengumuman', description: 'Pengumuman resmi dari manajemen sekolah', position: 4 }
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat
    });
  }

  const defaultCategory = await prisma.category.findFirst({ where: { slug: 'akademik' } });

  // 3. Articles / News
  const articlesCount = await prisma.article.count();
  if (articlesCount === 0) {
    await prisma.article.createMany({
      data: [
        {
          title: 'Pembukaan Tahun Ajaran Baru Berbasis Kurikulum Digital 2026/2027',
          slug: 'pembukaan-tahun-ajaran-baru-2026',
          description: 'Nurtech School secara resmi memulai tahun ajaran baru dengan pengenalan kurikulum AI dan Robotika.',
          content: 'Nurtech School terus berkomitmen untuk memberikan pendidikan terbaik bagi generasi penerus bangsa. Dengan menggabungkan teknologi modern dan pendidikan karakter Islami, para siswa dipersiapkan untuk menghadapi era digital secara mandiri dan berintegritas.',
          position: 1,
          coverUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
          categoryId: defaultCategory?.id,
          authorId: admin.id
        },
        {
          title: 'Siswa Nurtech Raih Juara 1 Olimpiade Robotika Tingkat Nasional',
          slug: 'juara-olimpiade-robotika-2026',
          description: 'Tim Robotika Nurtech School berhasil mengharumkan nama sekolah dengan membawa pulang medali emas.',
          content: 'Prestasi membanggakan kembali diraih oleh kontingen Nurtech School pada ajang National Robotics Competition. Siswa berhasil merancang robot autonomous ramah lingkungan.',
          position: 2,
          coverUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800',
          categoryId: defaultCategory?.id,
          authorId: admin.id
        },
        {
          title: 'Kunjungan Edukasi Industri Teknologi ke Silicon Valley Bandung',
          slug: 'kunjungan-edukasi-industri-teknologi',
          description: 'Siswa kelas XII mendalami implementasi software development langsung bersama para praktisi industri.',
          content: 'Kunjungan industri ini bertujuan memberikan gambaran nyata kepada para siswa mengenai dunia kerja dan inovasi teknologi terkini.',
          position: 3,
          coverUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
          categoryId: defaultCategory?.id,
          authorId: admin.id
        }
      ]
    });
  }

  // 4. Banners
  const bannerCount = await prisma.banner.count();
  if (bannerCount === 0) {
    await prisma.banner.create({
      data: {
        title: 'Mewujudkan Generasi Unggul Berkarakter & Ahli Teknologi',
        description: 'Nurtech School menghadirkan pendidikan modern dengan fasilitas mutakhir, kurikulum adaptif masa depan, dan nilai-nilai luhur.',
        thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200',
        position: 1,
        buttonsJson: [
          { title: 'Daftar Sekarang', url: '/pendaftaran', icon: null },
          { title: 'Jelajahi Program', url: '/#program', icon: null }
        ]
      }
    });
  }

  // 5. Featured Programs
  const programCount = await prisma.featuredProgram.count();
  if (programCount === 0) {
    await prisma.featuredProgram.createMany({
      data: [
        {
          title: 'Software & AI Engineering',
          description: 'Pembelajaran intensif pemrograman web, mobile, dan kecerdasan buatan sejak dini.',
          iconUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200',
          position: 1
        },
        {
          title: 'Tahfizhul Quran & Karakter',
          description: 'Pembinaan hafalan Al-Quran dengan metode mutqin serta penanaman adab dan akhlak mulia.',
          iconUrl: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=200',
          position: 2
        },
        {
          title: 'Bilingual & Global Leadership',
          description: 'Pengantar bahasa Inggris aktif dan pembekalan keterampilan kepemimpinan publik.',
          iconUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=200',
          position: 3
        }
      ]
    });
  }

  // 6. Extracurriculars
  const ekskulCount = await prisma.extracurricular.count();
  if (ekskulCount === 0) {
    await prisma.extracurricular.createMany({
      data: [
        { title: 'Cyber Security Club', description: 'Belajar ethical hacking & keamanan siber', position: 1, iconUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200' },
        { title: 'Robotics & IoT Lab', description: 'Rancang bangun robot dan automasi pintar', position: 2, iconUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200' },
        { title: 'English Debate & Model UN', description: 'Pengasahan argumentasi dan diplomasi global', position: 3, iconUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=200' },
        { title: 'Panahan & Seni Bela Diri', description: 'Olahraga sunnah untuk melatih fokus dan kebugaran', position: 4, iconUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=200' }
      ]
    });
  }

  // 7. Facilities
  const facilityCount = await prisma.facility.count();
  if (facilityCount === 0) {
    await prisma.facility.createMany({
      data: [
        { title: 'Lab Komputer & AI Cloud', position: 1, imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600' },
        { title: 'Perpustakaan Digital Modern', position: 2, imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600' },
        { title: 'Masjid & Pusat Studi Islam', position: 3, imageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=600' },
        { title: 'Auditorium & Smart Classrooms', position: 4, imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600' }
      ]
    });
  }

  // 8. FAQs
  const faqCount = await prisma.fAQ.count();
  if (faqCount === 0) {
    await prisma.fAQ.createMany({
      data: [
        { question: 'Kapan gelombang pendaftaran siswa baru dibuka?', answer: 'Pendaftaran gelombang 1 dibuka mulai bulan Oktober hingga Desember setiap tahunnya.', order: 1, category: 'Pendaftaran' },
        { question: 'Apakah tersedia program beasiswa prestasi?', answer: 'Ya, Nurtech School menyediakan beasiswa penuh dan potongan SPP bagi siswa berprestasi di bidang akademik, tahfizh, dan teknologi.', order: 2, category: 'Beasiswa' },
        { question: 'Apakah kurikulum menggunakan kurikulum nasional?', answer: 'Kami memadukan Kurikulum Merdeka Nasional dengan kurikulum terapan teknologi industri dan penguatan tahfizh.', order: 3, category: 'Kurikulum' }
      ]
    });
  }

  // 9. Profile Headmaster & Vision Mission
  await prisma.profileHeadmaster.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Drs. H. Ahmad Fauzi, M.Pd',
      description: 'Pendidikan bukan sekadar transfer ilmu, melainkan proses membentuk peradaban dengan teknologi dan ketakwaan.',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400'
    }
  });

  await prisma.visionMission.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      visi: 'Menjadi lembaga pendidikan unggul berwawasan global yang mencetak generasi berkarakter, inovatif, dan berlandaskan iman.',
      misi: '1. Menyelenggarakan pendidikan berbasis digital terintegrasi.\n2. Mengembangkan potensi bakat siswa secara maksimal.\n3. Membangun akhlakul karimah dalam keseharian.'
    }
  });

  // 10. Registration Requirements & Costs
  const regReqCount = await prisma.registrationRequirement.count();
  if (regReqCount === 0) {
    await prisma.registrationRequirement.createMany({
      data: [
        { title: 'Mengisi Formulir Pendaftaran Online', position: 1 },
        { title: 'Fotokopi Akta Kelahiran dan Kartu Keluarga (2 Lembar)', position: 2 },
        { title: 'Pas Foto Terbaru Ukuran 3x4 (4 Lembar)', position: 3 },
        { title: 'Fotokopi Rapor 2 Semester Terakhir', position: 4 }
      ]
    });
  }

  await prisma.registrationCost.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: 'Rincian Biaya Pendaftaran 2026/2027',
      phone: '6282240386822',
      costJson: [
        { id: 1, label: 'Formulir Pendaftaran & Tes Masuk', cost: 250000 },
        { id: 2, label: 'Uang Pengembangan & Fasilitas Lab', cost: 4500000 },
        { id: 3, label: 'Seragam Sekolah Lengkap (5 Set)', cost: 950000 },
        { id: 4, label: 'SPP Bulan Pertama Termasuk Modul', cost: 500000 }
      ]
    }
  });

  // 11. Contact Us
  await prisma.contact.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      longitude: 106.827153,
      latitude: -6.175392,
      contactJson: [
        {
          id: 1,
          address: 'Jl. Teknologi Pendidikan No. 88, Kota Bandung, Jawa Barat 40123',
          social_media: '@nurtechschool.official',
          phone: 6282240386822
        }
      ]
    }
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
