const prisma = require('../config/db');
const slugify = require('slugify');
const { formatMedia, sendResponse } = require('../utils/formatter');

const getArticles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    let categorySlug = req.query.category || req.query.categorySlug;
    if (!categorySlug) {
      for (const key of Object.keys(req.query)) {
        if (key.includes('category') && key.includes('slug')) {
          categorySlug = req.query[key];
          break;
        }
      }
    }
    if (!categorySlug && req.query.filters) {
      try {
        const f = typeof req.query.filters === 'string' ? JSON.parse(req.query.filters) : req.query.filters;
        categorySlug = f?.category?.slug?.$eq || f?.category?.slug || f?.category;
      } catch (e) {}
    }
    const search = req.query.search;

    const where = {};
    if (categorySlug && categorySlug !== 'all') {
      where.category = {
        OR: [
          { slug: { equals: categorySlug } },
          { slug: { contains: categorySlug.toLowerCase() } },
          { name: { contains: categorySlug } }
        ]
      };
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ];
    }

    const total = await prisma.article.count({ where });
    const articles = await prisma.article.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        author: {
          select: { id: true, name: true, email: true, avatar: true }
        }
      }
    });

    const formatted = articles.map(a => ({
      id: a.id,
      documentId: a.documentId,
      title: a.title,
      slug: a.slug,
      description: a.description || '',
      content: a.content || '',
      position: a.position,
      cover: formatMedia(a.coverUrl),
      category: a.category ? {
        id: a.category.id,
        documentId: a.category.documentId,
        name: a.category.name,
        slug: a.category.slug,
        description: a.category.description || '',
        position: a.category.position,
        createdAt: a.category.createdAt.toISOString(),
        updatedAt: a.category.updatedAt.toISOString(),
        publishedAt: a.category.publishedAt.toISOString()
      } : null,
      author: a.author ? {
        id: a.author.id,
        documentId: 'author-' + a.author.id,
        name: a.author.name,
        email: a.author.email,
        avatar: formatMedia(a.author.avatar)
      } : null,
      blocks: [
        {
          __component: 'shared.rich-text',
          id: 1,
          body: a.content || ''
        }
      ],
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
      publishedAt: a.publishedAt.toISOString()
    }));

    return sendResponse(res, formatted, { page, pageSize, total });
  } catch (err) {
    next(err);
  }
};

const getArticleBySlugOrId = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const isNumeric = !isNaN(slug);

    const article = await prisma.article.findFirst({
      where: isNumeric
        ? { OR: [{ id: parseInt(slug) }, { slug }, { documentId: slug }] }
        : { OR: [{ slug }, { documentId: slug }] },
      include: {
        category: true,
        author: {
          select: { id: true, name: true, email: true, avatar: true }
        }
      }
    });

    if (!article) {
      return res.status(404).json({ error: { message: 'Artikel tidak ditemukan.' } });
    }

    const formatted = {
      id: article.id,
      documentId: article.documentId,
      title: article.title,
      slug: article.slug,
      description: article.description || '',
      content: article.content || '',
      position: article.position,
      cover: formatMedia(article.coverUrl),
      category: article.category ? {
        id: article.category.id,
        documentId: article.category.documentId,
        name: article.category.name,
        slug: article.category.slug,
        description: article.category.description || '',
        position: article.category.position,
        createdAt: article.category.createdAt.toISOString(),
        updatedAt: article.category.updatedAt.toISOString(),
        publishedAt: article.category.publishedAt.toISOString()
      } : null,
      author: article.author ? {
        id: article.author.id,
        documentId: 'author-' + article.author.id,
        name: article.author.name,
        email: article.author.email,
        avatar: formatMedia(article.author.avatar)
      } : null,
      blocks: [
        {
          __component: 'shared.rich-text',
          id: 1,
          body: article.content || ''
        }
      ],
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
      publishedAt: article.publishedAt.toISOString()
    };

    return res.json({ data: formatted });
  } catch (err) {
    next(err);
  }
};

const createArticle = async (req, res, next) => {
  try {
    const { title, description, content, categoryId, coverUrl, position } = req.body;
    if (!title) {
      return res.status(400).json({ error: { message: 'Judul artikel wajib diisi.' } });
    }

    const slug = slugify(title, { lower: true, strict: true }) + '-' + Date.now().toString().slice(-4);
    const authorId = req.user?.id || null;

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        description: description || '',
        content: content || '',
        position: Number(position) || 0,
        coverUrl: coverUrl || null,
        categoryId: categoryId ? Number(categoryId) : null,
        authorId
      },
      include: {
        category: true,
        author: true
      }
    });

    return res.status(201).json({ data: article });
  } catch (err) {
    next(err);
  }
};

const updateArticle = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, content, categoryId, coverUrl, position } = req.body;

    const dataToUpdate = {};
    if (title) {
      dataToUpdate.title = title;
      dataToUpdate.slug = slugify(title, { lower: true, strict: true }) + '-' + id;
    }
    if (description !== undefined) dataToUpdate.description = description;
    if (content !== undefined) dataToUpdate.content = content;
    if (categoryId !== undefined) dataToUpdate.categoryId = categoryId ? Number(categoryId) : null;
    if (coverUrl !== undefined) dataToUpdate.coverUrl = coverUrl;
    if (position !== undefined) dataToUpdate.position = Number(position);

    const article = await prisma.article.update({
      where: { id },
      data: dataToUpdate,
      include: { category: true, author: true }
    });

    return res.json({ data: article });
  } catch (err) {
    next(err);
  }
};

const deleteArticle = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.article.delete({ where: { id } });
    return res.json({ message: 'Artikel berhasil dihapus.', id });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getArticles,
  getArticleBySlugOrId,
  createArticle,
  updateArticle,
  deleteArticle
};
