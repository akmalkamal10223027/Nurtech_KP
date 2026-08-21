const prisma = require('../config/db');
const { formatMedia, sendResponse } = require('../utils/formatter');

const getExtracurriculars = async (req, res, next) => {
  try {
    const items = await prisma.extracurricular.findMany({
      orderBy: { position: 'asc' }
    });

    const formatted = items.map(item => ({
      id: item.id,
      documentId: item.documentId,
      title: item.title,
      description: item.description || '',
      position: item.position,
      locale: item.locale || 'id',
      icon: formatMedia(item.iconUrl),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      publishedAt: item.publishedAt.toISOString()
    }));

    return sendResponse(res, formatted);
  } catch (err) {
    next(err);
  }
};

const createExtracurricular = async (req, res, next) => {
  try {
    const { title, description, iconUrl, position, locale } = req.body;
    const item = await prisma.extracurricular.create({
      data: {
        title,
        description: description || '',
        iconUrl: iconUrl || null,
        position: Number(position) || 0,
        locale: locale || 'id'
      }
    });
    return res.status(201).json({ data: item });
  } catch (err) {
    next(err);
  }
};

const updateExtracurricular = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, iconUrl, position, locale } = req.body;

    const dataToUpdate = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (description !== undefined) dataToUpdate.description = description;
    if (iconUrl !== undefined) dataToUpdate.iconUrl = iconUrl;
    if (position !== undefined) dataToUpdate.position = Number(position);
    if (locale !== undefined) dataToUpdate.locale = locale;

    const item = await prisma.extracurricular.update({
      where: { id },
      data: dataToUpdate
    });
    return res.json({ data: item });
  } catch (err) {
    next(err);
  }
};

const deleteExtracurricular = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.extracurricular.delete({ where: { id } });
    return res.json({ message: 'Ekstrakurikuler berhasil dihapus.', id });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getExtracurriculars,
  createExtracurricular,
  updateExtracurricular,
  deleteExtracurricular
};
