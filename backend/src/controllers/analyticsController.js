const prisma = require('../config/db');

/**
 * Track an incoming user analytics event (pageview, button click, etc.)
 */
const trackEvent = async (req, res, next) => {
  try {
    const { eventType, pagePath, metadata } = req.body || {};

    if (!eventType) {
      return res.status(400).json({ error: { message: 'eventType is required' } });
    }

    const ipAddress = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.ip || '').toString().split(',')[0].trim();
    const userAgent = req.headers['user-agent'] || null;

    const event = await prisma.analyticsEvent.create({
      data: {
        eventType,
        pagePath: pagePath || '/',
        ipAddress,
        userAgent,
        metadata: metadata ? metadata : undefined
      }
    });

    return res.status(201).json({ success: true, data: event });
  } catch (err) {
    console.error('Analytics tracking error:', err);
    // Return status 200/202 silently to avoid breaking client UX if tracking fails
    return res.status(200).json({ success: false, message: err.message });
  }
};

/**
 * Fetch aggregated analytics data for Admin Dashboard
 */
const getAnalyticsSummary = async (req, res, next) => {
  try {
    const period = req.query.period || '7d'; // 'today', '7d', '30d', 'all'
    const now = new Date();
    let startDate = new Date();

    if (period === 'today') {
      startDate.setHours(0, 0, 0, 0);
    } else if (period === '30d') {
      startDate.setDate(now.getDate() - 30);
    } else if (period === 'all') {
      startDate = new Date(0); // beginning of time
    } else {
      // default 7d
      startDate.setDate(now.getDate() - 7);
    }

    // 1. Total counts overall (All time)
    const [
      totalViews,
      totalRegisterClicks,
      totalDownloadClicks,
      totalWhatsappClicks,
      totalAppClicks
    ] = await Promise.all([
      prisma.analyticsEvent.count({ where: { eventType: 'PAGE_VIEW' } }),
      prisma.analyticsEvent.count({ where: { eventType: 'CLICK_REGISTER' } }),
      prisma.analyticsEvent.count({ where: { eventType: 'CLICK_DOWNLOAD' } }),
      prisma.analyticsEvent.count({ where: { eventType: 'CLICK_WHATSAPP' } }),
      prisma.analyticsEvent.count({ where: { eventType: 'CLICK_APP' } })
    ]);

    // 2. Period counts
    const [
      periodViews,
      periodRegisterClicks,
      periodDownloadClicks,
      periodWhatsappClicks
    ] = await Promise.all([
      prisma.analyticsEvent.count({ where: { eventType: 'PAGE_VIEW', createdAt: { gte: startDate } } }),
      prisma.analyticsEvent.count({ where: { eventType: 'CLICK_REGISTER', createdAt: { gte: startDate } } }),
      prisma.analyticsEvent.count({ where: { eventType: 'CLICK_DOWNLOAD', createdAt: { gte: startDate } } }),
      prisma.analyticsEvent.count({ where: { eventType: 'CLICK_WHATSAPP', createdAt: { gte: startDate } } })
    ]);

    // 3. Fetch daily trend for chart (last 7 or 30 days)
    const chartDaysCount = period === '30d' ? 30 : 7;
    const chartStartDate = new Date();
    chartStartDate.setDate(now.getDate() - (chartDaysCount - 1));
    chartStartDate.setHours(0, 0, 0, 0);

    const rangeEvents = await prisma.analyticsEvent.findMany({
      where: {
        createdAt: { gte: chartStartDate }
      },
      select: {
        eventType: true,
        createdAt: true
      }
    });

    const formatDateKey = (dateObj) => {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Group by date YYYY-MM-DD
    const dateMap = {};
    for (let i = 0; i < chartDaysCount; i++) {
      const d = new Date(chartStartDate);
      d.setDate(chartStartDate.getDate() + i);
      const dateStr = formatDateKey(d);
      const displayLabel = `${d.getDate()}/${d.getMonth() + 1}`;
      dateMap[dateStr] = { date: dateStr, label: displayLabel, pageViews: 0, registerClicks: 0, downloadClicks: 0, whatsappClicks: 0 };
    }

    rangeEvents.forEach(e => {
      const dateStr = formatDateKey(new Date(e.createdAt));
      if (dateMap[dateStr]) {
        if (e.eventType === 'PAGE_VIEW') dateMap[dateStr].pageViews++;
        else if (e.eventType === 'CLICK_REGISTER') dateMap[dateStr].registerClicks++;
        else if (e.eventType === 'CLICK_DOWNLOAD') dateMap[dateStr].downloadClicks++;
        else if (e.eventType === 'CLICK_WHATSAPP') dateMap[dateStr].whatsappClicks++;
      }
    });


    const dailyTrend = Object.values(dateMap);

    // 4. Recent activity log
    const recentActivities = await prisma.analyticsEvent.findMany({
      take: 12,
      orderBy: { createdAt: 'desc' }
    });

    return res.json({
      period,
      totals: {
        allTime: {
          pageViews: totalViews,
          registerClicks: totalRegisterClicks,
          downloadClicks: totalDownloadClicks,
          whatsappClicks: totalWhatsappClicks,
          appClicks: totalAppClicks
        },
        period: {
          pageViews: periodViews,
          registerClicks: periodRegisterClicks,
          downloadClicks: periodDownloadClicks,
          whatsappClicks: periodWhatsappClicks
        }
      },
      dailyTrend,
      recentActivities
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  trackEvent,
  getAnalyticsSummary
};
