const prisma = require('../config/db');

const getDashboardStats = async (req, res, next) => {
  try {
    const [
      articlesCount,
      categoriesCount,
      bannersCount,
      programsCount,
      extracurricularsCount,
      achievementsCount,
      facilitiesCount,
      galleriesCount,
      faqsCount,
      schedulesCount,
      recentArticles
    ] = await Promise.all([
      prisma.article.count(),
      prisma.category.count(),
      prisma.banner.count(),
      prisma.featuredProgram.count(),
      prisma.extracurricular.count(),
      prisma.achievement.count(),
      prisma.facility.count(),
      prisma.galleryActivity.count(),
      prisma.fAQ.count(),
      prisma.activitySchedule.count(),
      prisma.article.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { category: true, author: true }
      })
    ]);

    return res.json({
      counts: {
        articles: articlesCount,
        categories: categoriesCount,
        banners: bannersCount,
        programs: programsCount,
        extracurriculars: extracurricularsCount,
        achievements: achievementsCount,
        facilities: facilitiesCount,
        galleries: galleriesCount,
        faqs: faqsCount,
        schedules: schedulesCount
      },
      recentArticles
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboardStats
};
