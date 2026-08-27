const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany();
  console.log('--- Current Categories in DB ---');
  console.log(categories);

  // Ensure 'Berita', 'Artikel', 'Pengumuman' categories exist with proper slugs
  const defaultCats = [
    { name: 'Berita', slug: 'berita', description: 'Berita dan kabar terbaru seputar kegiatan sekolah', position: 1 },
    { name: 'Artikel', slug: 'artikel', description: 'Artikel edukasi, opini, dan wawasan teknologi', position: 2 },
    { name: 'Pengumuman', slug: 'pengumuman', description: 'Pengumuman resmi dari manajemen sekolah', position: 3 },
  ];

  for (const cat of defaultCats) {
    const existing = await prisma.category.findFirst({
      where: {
        OR: [
          { slug: cat.slug },
          { name: cat.name }
        ]
      }
    });

    if (!existing) {
      const created = await prisma.category.create({ data: cat });
      console.log('Created category:', created.name, `(${created.slug})`);
    } else {
      console.log('Category already exists:', existing.name, `(${existing.slug})`);
    }
  }

  // Check articles and their categories
  const articles = await prisma.article.findMany({ include: { category: true } });
  console.log(`\nTotal Articles in DB: ${articles.length}`);
  articles.forEach(a => console.log(`- [${a.category?.name || 'Tanpa Kategori'}] ${a.title}`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
