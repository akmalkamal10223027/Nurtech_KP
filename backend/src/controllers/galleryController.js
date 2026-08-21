const prisma = require('../config/db');
const { formatMedia, sendResponse } = require('../utils/formatter');

const getGalleries = async (req, res, next) => {
  try {
    const items = await prisma.galleryActivity.findMany({
      orderBy: { position: 'asc' }
    });

    const formatted = items.map(item => {
      let galleryList = [];
      try {
        galleryList = typeof item.galleryJson === 'string' ? JSON.parse(item.galleryJson) : (item.galleryJson || []);
      } catch (e) {
        galleryList = [];
      }

      return {
        id: item.id,
        documentId: item.documentId,
        title: item.title,
        description: item.description || '',
        position: item.position,
        thumbnail: formatMedia(item.thumbnail),
        gallery: galleryList.map(url => formatMedia(url)),
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
        publishedAt: item.publishedAt.toISOString()
      };
    });

    return sendResponse(res, formatted);
  } catch (err) {
    next(err);
  }
};

const getGalleryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isNumeric = !isNaN(id);

    const item = await prisma.galleryActivity.findFirst({
      where: isNumeric ? { id: parseInt(id) } : { documentId: id }
    });

    if (!item) {
      return res.status(404).json({ error: { message: 'Galeri kegiatan tidak ditemukan.' } });
    }

    let galleryList = [];
    try {
      galleryList = typeof item.galleryJson === 'string' ? JSON.parse(item.galleryJson) : (item.galleryJson || []);
    } catch (e) {
      galleryList = [];
    }

    const formatted = {
      id: item.id,
      documentId: item.documentId,
      title: item.title,
      description: item.description || '',
      position: item.position,
      thumbnail: formatMedia(item.thumbnail),
      gallery: galleryList.map(url => formatMedia(url)),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      publishedAt: item.publishedAt.toISOString()
    };

    return res.json({ data: formatted });
  } catch (err) {
    next(err);
  }
};

const createGallery = async (req, res, next) => {
  try {
    const { title, description, thumbnail, gallery, position } = req.body;
    const item = await prisma.galleryActivity.create({
      data: {
        title,
        description: description || '',
        thumbnail: thumbnail || null,
        galleryJson: gallery || [],
        position: Number(position) || 0
      }
    });
    return res.status(201).json({ data: item });
  } catch (err) {
    next(err);
  }
};

const updateGallery = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, thumbnail, gallery, position } = req.body;

    const dataToUpdate = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (description !== undefined) dataToUpdate.description = description;
    if (thumbnail !== undefined) dataToUpdate.thumbnail = thumbnail;
    if (gallery !== undefined) dataToUpdate.galleryJson = gallery;
    if (position !== undefined) dataToUpdate.position = Number(position);

    const item = await prisma.galleryActivity.update({
      where: { id },
      data: dataToUpdate
    });
    return res.json({ data: item });
  } catch (err) {
    next(err);
  }
};

const deleteGallery = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.galleryActivity.delete({ where: { id } });
    return res.json({ message: 'Galeri kegiatan berhasil dihapus.', id });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getGalleries,
  getGalleryById,
  createGallery,
  updateGallery,
  deleteGallery
};
