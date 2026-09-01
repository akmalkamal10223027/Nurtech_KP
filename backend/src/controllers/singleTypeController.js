const prisma = require('../config/db');
const { formatMedia, sendResponse } = require('../utils/formatter');

// Profile / Headmaster
const getProfile = async (req, res, next) => {
  try {
    let profile = await prisma.profileHeadmaster.findFirst();
    if (!profile) {
      profile = await prisma.profileHeadmaster.create({
        data: {
          name: 'Drs. H. Ahmad Fauzi, M.Pd',
          description: 'Selamat datang di Nurtech School, institusi pendidikan terdepan berbasis teknologi dan karakter Islami.',
          avatarUrl: null
        }
      });
    }

    const formatted = {
      id: profile.id,
      documentId: profile.documentId,
      name: profile.name,
      description: profile.description,
      avatar: formatMedia(profile.avatarUrl),
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
      publishedAt: profile.publishedAt.toISOString()
    };

    return res.json({ data: formatted, meta: {} });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, description, avatarUrl } = req.body;
    let profile = await prisma.profileHeadmaster.findFirst();

    if (!profile) {
      profile = await prisma.profileHeadmaster.create({
        data: { name: name || '', description: description || '', avatarUrl: avatarUrl || null }
      });
    } else {
      profile = await prisma.profileHeadmaster.update({
        where: { id: profile.id },
        data: {
          ...(name !== undefined && { name }),
          ...(description !== undefined && { description }),
          ...(avatarUrl !== undefined && { avatarUrl })
        }
      });
    }

    return res.json({ data: profile });
  } catch (err) {
    next(err);
  }
};

// Vision & Mission
const getVisionMission = async (req, res, next) => {
  try {
    let vm = await prisma.visionMission.findFirst();
    if (!vm) {
      vm = await prisma.visionMission.create({
        data: {
          visi: 'Menjadi lembaga pendidikan unggul berwawasan global yang mencetak generasi berkarakter, inovatif, dan berlandaskan iman.',
          misi: '1. Menyelenggarakan pendidikan berbasis digital terintegrasi.\n2. Mengembangkan potensi bakat siswa secara maksimal.\n3. Membangun akhlakul karimah dalam keseharian.'
        }
      });
    }

    const formatted = {
      id: vm.id,
      documentId: vm.documentId,
      visi: vm.visi,
      misi: vm.misi,
      createdAt: vm.createdAt.toISOString(),
      updatedAt: vm.updatedAt.toISOString(),
      publishedAt: vm.publishedAt.toISOString()
    };

    return res.json({ data: formatted, meta: {} });
  } catch (err) {
    next(err);
  }
};

const updateVisionMission = async (req, res, next) => {
  try {
    const { visi, misi } = req.body;
    let vm = await prisma.visionMission.findFirst();

    if (!vm) {
      vm = await prisma.visionMission.create({
        data: { visi: visi || '', misi: misi || '' }
      });
    } else {
      vm = await prisma.visionMission.update({
        where: { id: vm.id },
        data: {
          ...(visi !== undefined && { visi }),
          ...(misi !== undefined && { misi })
        }
      });
    }

    return res.json({ data: vm });
  } catch (err) {
    next(err);
  }
};

// About
const getAbout = async (req, res, next) => {
  try {
    let about = await prisma.about.findFirst();
    if (!about) {
      about = await prisma.about.create({
        data: {
          title: 'Tentang Nurtech School',
          blocksJson: [
            {
              __component: 'shared.quote',
              id: 1,
              title: 'Motto Kami',
              body: 'Mendidik dengan Hati, Menginspirasi dengan Prestasi'
            }
          ]
        }
      });
    }

    let blocks = [];
    try {
      blocks = typeof about.blocksJson === 'string' ? JSON.parse(about.blocksJson) : (about.blocksJson || []);
    } catch (e) {
      blocks = [];
    }

    const formatted = {
      id: about.id,
      documentId: about.documentId,
      title: about.title,
      blocks,
      createdAt: about.createdAt.toISOString(),
      updatedAt: about.updatedAt.toISOString(),
      publishedAt: about.publishedAt.toISOString()
    };

    return res.json({ data: formatted, meta: {} });
  } catch (err) {
    next(err);
  }
};

const updateAbout = async (req, res, next) => {
  try {
    const { title, blocks } = req.body;
    let about = await prisma.about.findFirst();

    if (!about) {
      about = await prisma.about.create({
        data: { title: title || '', blocksJson: blocks || [] }
      });
    } else {
      about = await prisma.about.update({
        where: { id: about.id },
        data: {
          ...(title !== undefined && { title }),
          ...(blocks !== undefined && { blocksJson: blocks })
        }
      });
    }

    return res.json({ data: about });
  } catch (err) {
    next(err);
  }
};

// Registration Requirements
const getRegistrationRequirements = async (req, res, next) => {
  try {
    const items = await prisma.registrationRequirement.findMany({
      orderBy: { position: 'asc' }
    });

    const formatted = items.map(item => ({
      id: item.id,
      documentId: item.documentId,
      title: item.title,
      position: item.position,
      locale: item.locale,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      publishedAt: item.publishedAt.toISOString()
    }));

    return sendResponse(res, formatted);
  } catch (err) {
    next(err);
  }
};

const createRegistrationRequirement = async (req, res, next) => {
  try {
    const { title, position, locale } = req.body;
    const item = await prisma.registrationRequirement.create({
      data: {
        title,
        position: Number(position) || 0,
        locale: locale || 'id'
      }
    });
    return res.status(201).json({ data: item });
  } catch (err) {
    next(err);
  }
};

const updateRegistrationRequirement = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { title, position, locale } = req.body;
    const item = await prisma.registrationRequirement.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(position !== undefined && { position: Number(position) }),
        ...(locale !== undefined && { locale })
      }
    });
    return res.json({ data: item });
  } catch (err) {
    next(err);
  }
};

const deleteRegistrationRequirement = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.registrationRequirement.delete({ where: { id } });
    return res.json({ message: 'Syarat pendaftaran berhasil dihapus.', id });
  } catch (err) {
    next(err);
  }
};

// Registration Cost
const getRegistrationCost = async (req, res, next) => {
  try {
    let cost = await prisma.registrationCost.findFirst();
    if (!cost) {
      cost = await prisma.registrationCost.create({
        data: {
          title: 'Rincian Biaya Masuk',
          phone: '6282240386822',
          costJson: [
            { id: 1, label: 'Formulir Pendaftaran', cost: 150000 },
            { id: 2, label: 'Uang Pangkal & Fasilitas', cost: 3500000 },
            { id: 3, label: 'Seragam (4 Set)', cost: 750000 },
            { id: 4, label: 'SPP Bulan Pertama', cost: 400000 }
          ]
        }
      });
    }

    let costs = [];
    try {
      costs = typeof cost.costJson === 'string' ? JSON.parse(cost.costJson) : (cost.costJson || []);
    } catch (e) {
      costs = [];
    }

    const formatted = {
      id: cost.id,
      documentId: cost.documentId,
      title: cost.title,
      phone: cost.phone ? parseInt(cost.phone) : 6282240386822,
      cost: costs,
      createdAt: cost.createdAt.toISOString(),
      updatedAt: cost.updatedAt.toISOString(),
      publishedAt: cost.publishedAt.toISOString()
    };

    return res.json({ data: formatted, meta: {} });
  } catch (err) {
    next(err);
  }
};

const updateRegistrationCost = async (req, res, next) => {
  try {
    const { title, phone, cost } = req.body;
    let regCost = await prisma.registrationCost.findFirst();

    if (!regCost) {
      regCost = await prisma.registrationCost.create({
        data: { title: title || '', phone: phone ? String(phone) : '', costJson: cost || [] }
      });
    } else {
      regCost = await prisma.registrationCost.update({
        where: { id: regCost.id },
        data: {
          ...(title !== undefined && { title }),
          ...(phone !== undefined && { phone: String(phone) }),
          ...(cost !== undefined && { costJson: cost })
        }
      });
    }

    return res.json({ data: regCost });
  } catch (err) {
    next(err);
  }
};

// Contact Us
const getContactUs = async (req, res, next) => {
  try {
    let contact = await prisma.contact.findFirst();
    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          longitude: 106.827153,
          latitude: -6.175392,
          contactJson: [
            {
              id: 1,
              address: 'Jl. Teknologi Pendidikan No. 88, Kota Bandung, Jawa Barat',
              social_media: '@nurtechschool',
              phone: 6282240386822
            }
          ]
        }
      });
    }

    let contactList = [];
    try {
      contactList = typeof contact.contactJson === 'string' ? JSON.parse(contact.contactJson) : (contact.contactJson || []);
    } catch (e) {
      contactList = [];
    }

    const formatted = {
      id: contact.id,
      documentId: contact.documentId,
      longitude: contact.longitude,
      Latitude: contact.latitude,
      contact: contactList,
      createdAt: contact.createdAt.toISOString(),
      updatedAt: contact.updatedAt.toISOString(),
      publishedAt: contact.publishedAt.toISOString()
    };

    return res.json({ data: formatted, meta: {} });
  } catch (err) {
    next(err);
  }
};

const updateContactUs = async (req, res, next) => {
  try {
    const { longitude, latitude, Latitude, contact } = req.body;
    let current = await prisma.contact.findFirst();

    const lat = latitude !== undefined ? Number(latitude) : (Latitude !== undefined ? Number(Latitude) : 0);
    const lng = longitude !== undefined ? Number(longitude) : 0;

    if (!current) {
      current = await prisma.contact.create({
        data: {
          longitude: lng,
          latitude: lat,
          contactJson: contact || []
        }
      });
    } else {
      current = await prisma.contact.update({
        where: { id: current.id },
        data: {
          ...(longitude !== undefined && { longitude: lng }),
          ...((latitude !== undefined || Latitude !== undefined) && { latitude: lat }),
          ...(contact !== undefined && { contactJson: contact })
        }
      });
    }

    return res.json({ data: current });
  } catch (err) {
    next(err);
  }
};

// Global Settings & SEO
const getGlobal = async (req, res, next) => {
  try {
    let global = await prisma.globalSetting.findFirst().catch(() => null);
    let logoUrlVal = global?.logoUrl || null;

    try {
      const rows = await prisma.$queryRawUnsafe('SELECT * FROM GlobalSetting LIMIT 1');
      if (rows && rows.length > 0) {
        logoUrlVal = rows[0].logoUrl || rows[0].logo_url || logoUrlVal;
      }
    } catch (e) {}

    if (!global) {
      global = await prisma.globalSetting.create({
        data: {
          siteName: 'Nurtech School',
          siteDescription: 'Sekolah Masa Depan Berbasis Teknologi & Karakter Unggul',
          metaTitle: 'Nurtech School - Portal Resmi',
          metaDescription: 'Portal Resmi Informasi Pendaftaran dan Kegiatan Nurtech School'
        }
      });
    }

    const formatted = {
      id: global.id,
      documentId: global.documentId,
      siteName: global.siteName,
      siteDescription: global.siteDescription || '',
      logoUrl: logoUrlVal,
      logo: formatMedia(logoUrlVal),
      favicon: formatMedia(global.faviconUrl),
      defaultSeo: {
        id: 1,
        documentId: 'seo-1',
        metaTitle: global.metaTitle || global.siteName,
        metaDescription: global.metaDescription || global.siteDescription || '',
        shareImage: formatMedia(global.shareImageUrl),
        createdAt: global.createdAt.toISOString(),
        updatedAt: global.updatedAt.toISOString(),
        publishedAt: global.publishedAt.toISOString()
      },
      createdAt: global.createdAt.toISOString(),
      updatedAt: global.updatedAt.toISOString(),
      publishedAt: global.publishedAt.toISOString()
    };

    return res.json({ data: formatted, meta: {} });
  } catch (err) {
    next(err);
  }
};

const updateGlobal = async (req, res, next) => {
  try {
    const { siteName, siteDescription, logoUrl, faviconUrl, metaTitle, metaDescription, shareImageUrl } = req.body;
    let global = await prisma.globalSetting.findFirst();

    if (!global) {
      global = await prisma.globalSetting.create({
        data: {
          siteName: siteName || 'Nurtech School',
          siteDescription: siteDescription || '',
          faviconUrl: faviconUrl || null,
          metaTitle: metaTitle || '',
          metaDescription: metaDescription || '',
          shareImageUrl: shareImageUrl || null
        }
      });
    } else {
      global = await prisma.globalSetting.update({
        where: { id: global.id },
        data: {
          ...(siteName !== undefined && { siteName }),
          ...(siteDescription !== undefined && { siteDescription }),
          ...(faviconUrl !== undefined && { faviconUrl }),
          ...(metaTitle !== undefined && { metaTitle }),
          ...(metaDescription !== undefined && { metaDescription }),
          ...(shareImageUrl !== undefined && { shareImageUrl })
        }
      });
    }

    if (logoUrl !== undefined) {
      try {
        await prisma.$executeRawUnsafe(
          `UPDATE GlobalSetting SET logoUrl=? WHERE id > 0`,
          logoUrl || null
        );
      } catch (e) {
        try {
          await prisma.$executeRawUnsafe(`ALTER TABLE GlobalSetting ADD COLUMN logoUrl TEXT`);
          await prisma.$executeRawUnsafe(
            `UPDATE GlobalSetting SET logoUrl=? WHERE id > 0`,
            logoUrl || null
          );
        } catch (err2) {}
      }
    }

    const updatedRows = await prisma.$queryRawUnsafe('SELECT * FROM GlobalSetting LIMIT 1').catch(() => null);
    const finalLogo = updatedRows && updatedRows[0] ? (updatedRows[0].logoUrl || updatedRows[0].logo_url) : logoUrl;

    return res.json({
      data: {
        ...global,
        logoUrl: finalLogo,
        logo: formatMedia(finalLogo)
      }
    });
  } catch (err) {
    next(err);
  }
};

// Activity Schedules
const getSchedules = async (req, res, next) => {
  try {
    const schedules = await prisma.activitySchedule.findMany({
      orderBy: { id: 'asc' }
    });

    const formatted = schedules.map(s => ({
      id: s.id,
      documentId: s.documentId,
      title: s.title,
      time: s.time,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
      publishedAt: s.publishedAt.toISOString()
    }));

    return sendResponse(res, formatted);
  } catch (err) {
    next(err);
  }
};

const createSchedule = async (req, res, next) => {
  try {
    const { title, time } = req.body;
    const item = await prisma.activitySchedule.create({
      data: { title, time }
    });
    return res.status(201).json({ data: item });
  } catch (err) {
    next(err);
  }
};

const updateSchedule = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { title, time } = req.body;
    const item = await prisma.activitySchedule.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(time !== undefined && { time })
      }
    });
    return res.json({ data: item });
  } catch (err) {
    next(err);
  }
};

const deleteSchedule = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.activitySchedule.delete({ where: { id } });
    return res.json({ message: 'Jadwal berhasil dihapus.', id });
  } catch (err) {
    next(err);
  }
};

const getAppSectionRecord = async () => {
  try {
    const rows = await prisma.$queryRawUnsafe('SELECT * FROM AppSection LIMIT 1');
    if (rows && rows.length > 0) return rows[0];
  } catch (e) {}

  if (prisma.appSection) {
    try {
      return await prisma.appSection.findFirst();
    } catch (e) {}
  }
  return null;
};

const saveAppSectionRecord = async (dataToSave) => {
  const { badge, title, titleHighlight, description, appStoreLink, googlePlayLink, imagesJson, featuresJson, featureTitle, featureDescription } = dataToSave;

  const standardData = {
    ...(badge !== undefined && { badge }),
    ...(title !== undefined && { title }),
    ...(titleHighlight !== undefined && { titleHighlight }),
    ...(description !== undefined && { description }),
    ...(appStoreLink !== undefined && { appStoreLink }),
    ...(googlePlayLink !== undefined && { googlePlayLink }),
    ...(imagesJson !== undefined && { imagesJson }),
    ...(featureTitle !== undefined && { featureTitle }),
    ...(featureDescription !== undefined && { featureDescription })
  };

  try {
    if (prisma.appSection) {
      const existing = await prisma.appSection.findFirst();
      if (!existing) {
        await prisma.appSection.create({ data: standardData });
      } else {
        await prisma.appSection.update({ where: { id: existing.id }, data: standardData });
      }
    }
  } catch (e) {}

  // Update featuresJson directly in database table to avoid Prisma Client cached schema validation error
  if (featuresJson !== undefined) {
    try {
      const jsonFeatures = JSON.stringify(featuresJson || []);
      await prisma.$executeRawUnsafe(
        `UPDATE AppSection SET featuresJson=? WHERE id > 0`,
        jsonFeatures
      );
    } catch (e) {
      try {
        await prisma.$executeRawUnsafe(`ALTER TABLE AppSection ADD COLUMN featuresJson JSON`);
        await prisma.$executeRawUnsafe(
          `UPDATE AppSection SET featuresJson=? WHERE id > 0`,
          JSON.stringify(featuresJson || [])
        );
      } catch (err2) {}
    }
  }

  // Ensure imagesJson is saved
  if (imagesJson !== undefined) {
    try {
      await prisma.$executeRawUnsafe(
        `UPDATE AppSection SET imagesJson=? WHERE id > 0`,
        JSON.stringify(imagesJson || [])
      );
    } catch (e) {}
  }

  const updatedRows = await prisma.$queryRawUnsafe('SELECT * FROM AppSection LIMIT 1');
  return updatedRows ? updatedRows[0] : null;
};

const getAppSection = async (req, res, next) => {
  try {
    let item = await getAppSectionRecord();
    if (!item) {
      item = await saveAppSectionRecord({
        badge: 'Aplikasi Mobile Sekolah',
        title: 'Aplikasi Pendukung',
        titleHighlight: 'Nurtech Boarding School',
        description: 'Aplikasi khusus wali santri & siswa untuk memantau perkembangan hafalan, nilai, serta presensi secara real-time.',
        appStoreLink: '#',
        googlePlayLink: '#',
        featureTitle: 'Pantau Hafalan & Presensi',
        featureDescription: 'Laporan perkembangan santri dikirim langsung ke smartphone orang tua.'
      });
    }

    let imagesList = [];
    try {
      const rawImg = item.imagesJson || item.images_json;
      imagesList = typeof rawImg === 'string' ? JSON.parse(rawImg) : (rawImg || []);
    } catch (e) {
      imagesList = [];
    }

    let featuresList = [];
    try {
      const rawFeat = item.featuresJson || item.features_json;
      featuresList = typeof rawFeat === 'string' ? JSON.parse(rawFeat) : (rawFeat || []);
    } catch (e) {
      featuresList = [];
    }

    if (!Array.isArray(featuresList) || featuresList.length === 0) {
      featuresList = [
        {
          id: 1,
          featureTitle: item.featureTitle || item.feature_title || 'Pantau Hafalan & Presensi',
          featureDescription: item.featureDescription || item.feature_description || 'Laporan perkembangan santri dikirim langsung ke smartphone orang tua.'
        }
      ];
    }

    const cleanLink = (url) => {
      if (!url) return '#';
      let cleaned = String(url).trim().replace(/^#+/, '');
      if (!cleaned || cleaned === '#') return '#';
      if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) return cleaned;
      return `https://${cleaned}`;
    };

    const formatted = {
      id: item.id || 1,
      documentId: item.documentId || item.document_id || 'app-section-1',
      badge: item.badge || 'Aplikasi Mobile Sekolah',
      title: item.title || 'Aplikasi Pendukung',
      titleHighlight: item.titleHighlight || item.title_highlight || 'Nurtech Boarding School',
      description: item.description || '',
      appStoreLink: cleanLink(item.appStoreLink || item.app_store_link),
      googlePlayLink: cleanLink(item.googlePlayLink || item.google_play_link || 'https://play.google.com/store/apps/details?id=id.oxinos.nurtech'),
      images: imagesList.map((url, idx) => ({ id: idx + 1, url })),
      features: featuresList,
      Stakeholder: [
        {
          id: 1,
          stakeholderName: 'Orang Tua',
          icon: '📱',
          featureitem: featuresList.map((f, idx) => ({
            id: f.id || idx + 1,
            featureTitle: f.featureTitle || f.title || '',
            featureDescription: f.featureDescription || f.description || ''
          }))
        }
      ]
    };

    return res.json({ data: [formatted] });
  } catch (err) {
    next(err);
  }
};

const updateAppSection = async (req, res, next) => {
  try {
    const { badge, title, titleHighlight, description, appStoreLink, googlePlayLink, images, features, featureTitle, featureDescription } = req.body;

    const dataToSave = {
      ...(badge !== undefined && { badge }),
      ...(title !== undefined && { title }),
      ...(titleHighlight !== undefined && { titleHighlight }),
      ...(description !== undefined && { description }),
      ...(appStoreLink !== undefined && { appStoreLink }),
      ...(googlePlayLink !== undefined && { googlePlayLink }),
      ...(images !== undefined && { imagesJson: images }),
      ...(features !== undefined && { featuresJson: features }),
      ...(featureTitle !== undefined && { featureTitle }),
      ...(featureDescription !== undefined && { featureDescription })
    };

    const item = await saveAppSectionRecord(dataToSave);
    return res.json({ data: item });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getVisionMission,
  updateVisionMission,
  getAbout,
  updateAbout,
  getRegistrationRequirements,
  createRegistrationRequirement,
  updateRegistrationRequirement,
  deleteRegistrationRequirement,
  getRegistrationCost,
  updateRegistrationCost,
  getContactUs,
  updateContactUs,
  getGlobal,
  updateGlobal,
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getAppSection,
  updateAppSection
};
