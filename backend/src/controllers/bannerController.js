const prisma = require('../config/db');
const { formatMedia, sendResponse } = require('../utils/formatter');

const getBanners = async (req, res, next) => {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { position: 'asc' }
    });

    const formatted = banners.map(b => {
      let buttons = [];
      try {
        buttons = typeof b.buttonsJson === 'string' ? JSON.parse(b.buttonsJson) : (b.buttonsJson || []);
      } catch (e) {
        buttons = [];
      }

      return {
        id: b.id,
        documentId: b.documentId,
        title: b.title,
        description: b.description || '',
        position: b.position,
        thumbnail: formatMedia(b.thumbnail),
        button: buttons.map((btn, idx) => ({
          id: idx + 1,
          title: btn.title || '',
          url: btn.url || '',
          icon: formatMedia(btn.icon)
        })),
        createdAt: b.createdAt.toISOString(),
        updatedAt: b.updatedAt.toISOString(),
        publishedAt: b.publishedAt.toISOString()
      };
    });

    return sendResponse(res, formatted);
  } catch (err) {
    next(err);
  }
};

const sanitizeButtons = (buttons) => {
  if (!Array.isArray(buttons)) return [];
  return buttons.map((btn) => {
    const iconUrl = typeof btn.icon === 'object' && btn.icon ? (btn.icon.url || '') : (btn.icon || '');
    return {
      title: btn.title || '',
      url: btn.url || '',
      icon: iconUrl || null
    };
  });
};

const createBanner = async (req, res, next) => {
  try {
    const { title, description, thumbnail, button, position } = req.body;
    const banner = await prisma.banner.create({
      data: {
        title: title || 'Banner Baru',
        description: description || '',
        thumbnail: thumbnail || null,
        buttonsJson: sanitizeButtons(button),
        position: Number(position) || 0
      }
    });
    return res.status(201).json({ data: banner });
  } catch (err) {
    next(err);
  }
};

const updateBanner = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, thumbnail, button, position } = req.body;

    const dataToUpdate = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (description !== undefined) dataToUpdate.description = description;
    if (thumbnail !== undefined) dataToUpdate.thumbnail = thumbnail;
    if (button !== undefined) dataToUpdate.buttonsJson = sanitizeButtons(button);
    if (position !== undefined) dataToUpdate.position = Number(position);

    const banner = await prisma.banner.update({
      where: { id },
      data: dataToUpdate
    });
    return res.json({ data: banner });
  } catch (err) {
    next(err);
  }
};

const deleteBanner = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.banner.delete({ where: { id } });
    return res.json({ message: 'Banner berhasil dihapus.', id });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner
};
