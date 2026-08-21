const prisma = require('../config/db');
const { formatMedia, sendResponse } = require('../utils/formatter');

const getFacilities = async (req, res, next) => {
  try {
    const items = await prisma.facility.findMany({
      orderBy: { position: 'asc' }
    });

    const formatted = items.map(item => ({
      id: item.id,
      documentId: item.documentId,
      title: item.title,
      position: item.position,
      locale: item.locale || 'id',
      icon: formatMedia(item.iconUrl),
      image: formatMedia(item.imageUrl),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      publishedAt: item.publishedAt.toISOString()
    }));

    return sendResponse(res, formatted);
  } catch (err) {
    next(err);
  }
};

const createFacility = async (req, res, next) => {
  try {
    const { title, iconUrl, imageUrl, position, locale } = req.body;
    const item = await prisma.facility.create({
      data: {
        title,
        iconUrl: iconUrl || null,
        imageUrl: imageUrl || null,
        position: Number(position) || 0,
        locale: locale || 'id'
      }
    });
    return res.status(201).json({ data: item });
  } catch (err) {
    next(err);
  }
};

const updateFacility = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { title, iconUrl, imageUrl, position, locale } = req.body;

    const dataToUpdate = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (iconUrl !== undefined) dataToUpdate.iconUrl = iconUrl;
    if (imageUrl !== undefined) dataToUpdate.imageUrl = imageUrl;
    if (position !== undefined) dataToUpdate.position = Number(position);
    if (locale !== undefined) dataToUpdate.locale = locale;

    const item = await prisma.facility.update({
      where: { id },
      data: dataToUpdate
    });
    return res.json({ data: item });
  } catch (err) {
    next(err);
  }
};

const deleteFacility = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.facility.delete({ where: { id } });
    return res.json({ message: 'Fasilitas berhasil dihapus.', id });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getFacilities,
  createFacility,
  updateFacility,
  deleteFacility
};
