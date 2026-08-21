const prisma = require('../config/db');
const { formatMedia, sendResponse } = require('../utils/formatter');

const getAchievements = async (req, res, next) => {
  try {
    const items = await prisma.achievement.findMany({
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

const createAchievement = async (req, res, next) => {
  try {
    const { title, description, iconUrl, position, locale } = req.body;
    const item = await prisma.achievement.create({
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

const updateAchievement = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, iconUrl, position, locale } = req.body;

    const dataToUpdate = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (description !== undefined) dataToUpdate.description = description;
    if (iconUrl !== undefined) dataToUpdate.iconUrl = iconUrl;
    if (position !== undefined) dataToUpdate.position = Number(position);
    if (locale !== undefined) dataToUpdate.locale = locale;

    const item = await prisma.achievement.update({
      where: { id },
      data: dataToUpdate
    });
    return res.json({ data: item });
  } catch (err) {
    next(err);
  }
};

const deleteAchievement = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.achievement.delete({ where: { id } });
    return res.json({ message: 'Prestasi berhasil dihapus.', id });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement
};
