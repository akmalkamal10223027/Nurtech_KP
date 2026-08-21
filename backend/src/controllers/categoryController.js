const prisma = require('../config/db');
const slugify = require('slugify');
const { sendResponse } = require('../utils/formatter');

const defaultCategories = [
  { name: 'Berita', slug: 'berita', description: 'Seputar informasi dan berita terbaru sekolah', position: 1 },
  { name: 'Artikel', slug: 'artikel', description: 'Karya tulis, artikel edukasi, dan wawasan', position: 2 },
  { name: 'Pengumuman', slug: 'pengumuman', description: 'Pengumuman resmi dan imbauan penting sekolah', position: 3 }
];

const getCategories = async (req, res, next) => {
  try {
    let categories = await prisma.category.findMany({
      orderBy: { position: 'asc' },
      include: {
        _count: { select: { articles: true } }
      }
    });

    // Auto-seed default categories (Berita, Artikel, Pengumuman) if missing
    let needReFetch = false;
    for (const defCat of defaultCategories) {
      const exists = categories.some(
        c => c.slug === defCat.slug || c.name.toLowerCase() === defCat.name.toLowerCase()
      );
      if (!exists) {
        await prisma.category.create({ data: defCat }).catch(() => {});
        needReFetch = true;
      }
    }

    if (needReFetch) {
      categories = await prisma.category.findMany({
        orderBy: { position: 'asc' },
        include: { _count: { select: { articles: true } } }
      });
    }

    const formatted = categories.map(c => ({
      id: c.id,
      documentId: c.documentId,
      name: c.name,
      slug: c.slug,
      description: c.description || '',
      position: c.position,
      articlesCount: c._count ? c._count.articles : 0,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      publishedAt: c.publishedAt.toISOString()
    }));

    return sendResponse(res, formatted);
  } catch (err) {
    next(err);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, description, position } = req.body;
    if (!name) {
      return res.status(400).json({ error: { message: 'Nama kategori wajib diisi.' } });
    }

    const slug = slugify(name, { lower: true, strict: true }) + '-' + Date.now().toString().slice(-4);
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || '',
        position: Number(position) || 0
      }
    });

    return res.status(201).json({ data: category });
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description, position } = req.body;

    const dataToUpdate = {};
    if (name) {
      dataToUpdate.name = name;
      dataToUpdate.slug = slugify(name, { lower: true, strict: true });
    }
    if (description !== undefined) dataToUpdate.description = description;
    if (position !== undefined) dataToUpdate.position = Number(position);

    const category = await prisma.category.update({
      where: { id },
      data: dataToUpdate
    });

    return res.json({ data: category });
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.category.delete({ where: { id } });
    return res.json({ message: 'Kategori berhasil dihapus.', id });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
