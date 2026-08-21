const prisma = require('../config/db');
const { formatMedia, sendResponse } = require('../utils/formatter');

const getPrograms = async (req, res, next) => {
  try {
    const programs = await prisma.featuredProgram.findMany({
      orderBy: { position: 'asc' }
    });

    const formatted = programs.map(p => ({
      id: p.id,
      documentId: p.documentId,
      title: p.title,
      description: p.description || '',
      position: p.position,
      icon: formatMedia(p.iconUrl),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      publishedAt: p.publishedAt.toISOString()
    }));

    return sendResponse(res, formatted);
  } catch (err) {
    next(err);
  }
};

const createProgram = async (req, res, next) => {
  try {
    const { title, description, iconUrl, position } = req.body;
    const program = await prisma.featuredProgram.create({
      data: {
        title,
        description: description || '',
        iconUrl: iconUrl || null,
        position: Number(position) || 0
      }
    });
    return res.status(201).json({ data: program });
  } catch (err) {
    next(err);
  }
};

const updateProgram = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, iconUrl, position } = req.body;

    const dataToUpdate = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (description !== undefined) dataToUpdate.description = description;
    if (iconUrl !== undefined) dataToUpdate.iconUrl = iconUrl;
    if (position !== undefined) dataToUpdate.position = Number(position);

    const program = await prisma.featuredProgram.update({
      where: { id },
      data: dataToUpdate
    });
    return res.json({ data: program });
  } catch (err) {
    next(err);
  }
};

const deleteProgram = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.featuredProgram.delete({ where: { id } });
    return res.json({ message: 'Program unggulan berhasil dihapus.', id });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram
};
