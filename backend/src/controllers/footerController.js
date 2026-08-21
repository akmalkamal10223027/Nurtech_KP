const prisma = require('../config/db');
const { formatMedia, sendResponse } = require('../utils/formatter');

const getFooters = async (req, res, next) => {
  try {
    const footers = await prisma.footer.findMany({
      orderBy: { position: 'asc' },
      include: {
        footerSubMenus: {
          orderBy: { position: 'asc' }
        }
      }
    });

    const formatted = footers.map(f => {
      const subMenusFormatted = f.footerSubMenus.map(sm => ({
        id: sm.id,
        documentId: sm.documentId,
        menu: sm.menu,
        type: sm.type,
        data: sm.data || '',
        isActive: sm.isActive,
        position: sm.position,
        icon: formatMedia(sm.iconUrl)
      }));

      return {
        id: f.id,
        documentId: f.documentId,
        menu: f.menu,
        type: f.type,
        data: f.data || '',
        position: f.position,
        icon: formatMedia(f.iconUrl),
        footer_sub_menus: subMenusFormatted,
        footerSubMenus: subMenusFormatted,
        createdAt: f.createdAt.toISOString(),
        updatedAt: f.updatedAt.toISOString(),
        publishedAt: f.publishedAt.toISOString()
      };
    });

    return sendResponse(res, formatted);
  } catch (err) {
    next(err);
  }
};

const getFooterSubMenus = async (req, res, next) => {
  try {
    const subMenus = await prisma.footerSubMenu.findMany({
      orderBy: { position: 'asc' },
      include: { footer: true }
    });

    const formatted = subMenus.map(sm => ({
      id: sm.id,
      documentId: sm.documentId,
      menu: sm.menu,
      type: sm.type,
      data: sm.data || '',
      isActive: sm.isActive,
      position: sm.position,
      icon: formatMedia(sm.iconUrl),
      footer_ids: sm.footer ? [{
        id: sm.footer.id,
        documentId: sm.footer.documentId,
        menu: sm.footer.menu
      }] : [],
      createdAt: sm.createdAt.toISOString(),
      updatedAt: sm.updatedAt.toISOString(),
      publishedAt: sm.publishedAt.toISOString()
    }));

    return sendResponse(res, formatted);
  } catch (err) {
    next(err);
  }
};

const createFooter = async (req, res, next) => {
  try {
    const { menu, type, data, position, iconUrl } = req.body;
    const footer = await prisma.footer.create({
      data: {
        menu,
        type: type || 'information',
        data: data || '',
        position: Number(position) || 0,
        iconUrl: iconUrl || null
      }
    });
    return res.status(201).json({ data: footer });
  } catch (err) {
    next(err);
  }
};

const updateFooter = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { menu, type, data, position, iconUrl } = req.body;

    const footer = await prisma.footer.update({
      where: { id },
      data: {
        ...(menu !== undefined && { menu }),
        ...(type !== undefined && { type }),
        ...(data !== undefined && { data }),
        ...(position !== undefined && { position: Number(position) }),
        ...(iconUrl !== undefined && { iconUrl })
      }
    });
    return res.json({ data: footer });
  } catch (err) {
    next(err);
  }
};

const deleteFooter = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.footer.delete({ where: { id } });
    return res.json({ message: 'Footer menu berhasil dihapus.', id });
  } catch (err) {
    next(err);
  }
};

const createFooterSubMenu = async (req, res, next) => {
  try {
    const { menu, type, data, isActive, position, iconUrl, footerId } = req.body;
    const subMenu = await prisma.footerSubMenu.create({
      data: {
        menu,
        type: type || 'link',
        data: data || '',
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        position: Number(position) || 0,
        iconUrl: iconUrl || null,
        footerId: footerId ? Number(footerId) : null
      }
    });
    return res.status(201).json({ data: subMenu });
  } catch (err) {
    next(err);
  }
};

const updateFooterSubMenu = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { menu, type, data, isActive, position, iconUrl, footerId } = req.body;
    const subMenu = await prisma.footerSubMenu.update({
      where: { id },
      data: {
        ...(menu !== undefined && { menu }),
        ...(type !== undefined && { type }),
        ...(data !== undefined && { data }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(position !== undefined && { position: Number(position) }),
        ...(iconUrl !== undefined && { iconUrl }),
        ...(footerId !== undefined && { footerId: footerId ? Number(footerId) : null })
      }
    });
    return res.json({ data: subMenu });
  } catch (err) {
    next(err);
  }
};

const deleteFooterSubMenu = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.footerSubMenu.delete({ where: { id } });
    return res.json({ message: 'Footer sub-menu berhasil dihapus.', id });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getFooters,
  getFooterSubMenus,
  createFooter,
  updateFooter,
  deleteFooter,
  createFooterSubMenu,
  updateFooterSubMenu,
  deleteFooterSubMenu
};
