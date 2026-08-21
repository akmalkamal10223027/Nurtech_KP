const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const authController = require('../controllers/authController');
const articleController = require('../controllers/articleController');
const categoryController = require('../controllers/categoryController');
const bannerController = require('../controllers/bannerController');
const programController = require('../controllers/programController');
const extracurricularController = require('../controllers/extracurricularController');
const achievementController = require('../controllers/achievementController');
const facilityController = require('../controllers/facilityController');
const galleryController = require('../controllers/galleryController');
const faqController = require('../controllers/faqController');
const singleTypeController = require('../controllers/singleTypeController');
const footerController = require('../controllers/footerController');
const uploadController = require('../controllers/uploadController');
const statsController = require('../controllers/dashboardStatsController');

// --- Auth Routes ---
router.post('/auth/local', authController.login);
router.post('/auth/login', authController.login);
router.post('/auth/sign-up/user', authController.register);
router.post('/auth/register', authController.register);
router.get('/auth/me', auth, authController.getMe);
router.put('/auth/me', auth, authController.updateMe);
router.put('/auth/change-password', auth, authController.changePassword);
router.post('/auth/send-otp', (req, res) => res.json({ message: 'OTP sent successfully' }));
router.post('/auth/check-otp', (req, res) => res.json({ message: 'OTP verified successfully' }));

// --- Dashboard Stats ---
router.get('/dashboard/stats', statsController.getDashboardStats);

// --- Articles & News ---
router.get('/articles', articleController.getArticles);
router.get('/articles/:slug', articleController.getArticleBySlugOrId);
router.post('/articles', auth, articleController.createArticle);
router.put('/articles/:id', auth, articleController.updateArticle);
router.delete('/articles/:id', auth, articleController.deleteArticle);

// --- Categories ---
router.get('/categories', categoryController.getCategories);
router.post('/categories', auth, categoryController.createCategory);
router.put('/categories/:id', auth, categoryController.updateCategory);
router.delete('/categories/:id', auth, categoryController.deleteCategory);

// --- Banners ---
router.get('/banners', bannerController.getBanners);
router.post('/banners', auth, bannerController.createBanner);
router.put('/banners/:id', auth, bannerController.updateBanner);
router.delete('/banners/:id', auth, bannerController.deleteBanner);

// --- Featured Programs ---
router.get('/featured-programs', programController.getPrograms);
router.post('/featured-programs', auth, programController.createProgram);
router.put('/featured-programs/:id', auth, programController.updateProgram);
router.delete('/featured-programs/:id', auth, programController.deleteProgram);

// --- Extracurriculars ---
router.get('/extracurricular-activities', extracurricularController.getExtracurriculars);
router.get('/extracurriculars', extracurricularController.getExtracurriculars);
router.post('/extracurricular-activities', auth, extracurricularController.createExtracurricular);
router.put('/extracurricular-activities/:id', auth, extracurricularController.updateExtracurricular);
router.delete('/extracurricular-activities/:id', auth, extracurricularController.deleteExtracurricular);

// --- Achievements ---
router.get('/achievements', achievementController.getAchievements);
router.post('/achievements', auth, achievementController.createAchievement);
router.put('/achievements/:id', auth, achievementController.updateAchievement);
router.delete('/achievements/:id', auth, achievementController.deleteAchievement);

// --- Facilities ---
router.get('/facilities', facilityController.getFacilities);
router.post('/facilities', auth, facilityController.createFacility);
router.put('/facilities/:id', auth, facilityController.updateFacility);
router.delete('/facilities/:id', auth, facilityController.deleteFacility);

// --- Gallery Activities ---
router.get('/gallery-activities', galleryController.getGalleries);
router.get('/gallery-activities/:id', galleryController.getGalleryById);
router.post('/gallery-activities', auth, galleryController.createGallery);
router.put('/gallery-activities/:id', auth, galleryController.updateGallery);
router.delete('/gallery-activities/:id', auth, galleryController.deleteGallery);

// --- FAQs ---
router.get('/faqs', faqController.getFAQs);
router.post('/faqs', auth, faqController.createFAQ);
router.put('/faqs/:id', auth, faqController.updateFAQ);
router.delete('/faqs/:id', auth, faqController.deleteFAQ);

// --- Single Types ---
// Profile / Headmaster
router.get('/profile', singleTypeController.getProfile);
router.put('/profile', auth, singleTypeController.updateProfile);

// Vision Mission
router.get('/vision-mision', singleTypeController.getVisionMission);
router.get('/vision-mission', singleTypeController.getVisionMission);
router.put('/vision-mision', auth, singleTypeController.updateVisionMission);
router.put('/vision-mission', auth, singleTypeController.updateVisionMission);

// About
router.get('/about', singleTypeController.getAbout);
router.put('/about', auth, singleTypeController.updateAbout);

// Registration Requirements
router.get('/registration-requirements', singleTypeController.getRegistrationRequirements);
router.post('/registration-requirements', auth, singleTypeController.createRegistrationRequirement);
router.put('/registration-requirements/:id', auth, singleTypeController.updateRegistrationRequirement);
router.delete('/registration-requirements/:id', auth, singleTypeController.deleteRegistrationRequirement);

// Registration Cost
router.get('/registration-cost', singleTypeController.getRegistrationCost);
router.put('/registration-cost', auth, singleTypeController.updateRegistrationCost);

// Contact Us
router.get('/contact-us', singleTypeController.getContactUs);
router.put('/contact-us', auth, singleTypeController.updateContactUs);

// Global Settings
router.get('/global', singleTypeController.getGlobal);
router.put('/global', auth, singleTypeController.updateGlobal);

// Activity Schedules
router.get('/activity-schedules', singleTypeController.getSchedules);
router.post('/activity-schedules', auth, singleTypeController.createSchedule);
router.put('/activity-schedules/:id', auth, singleTypeController.updateSchedule);
router.delete('/activity-schedules/:id', auth, singleTypeController.deleteSchedule);

// App Sections (Nurtech Boarding School Section)
router.get('/app-sections', singleTypeController.getAppSection);
router.put('/app-sections', auth, singleTypeController.updateAppSection);

// Footers
router.get('/footers', footerController.getFooters);
router.post('/footers', auth, footerController.createFooter);
router.put('/footers/:id', auth, footerController.updateFooter);
router.delete('/footers/:id', auth, footerController.deleteFooter);

router.get('/footer-sub-menus', footerController.getFooterSubMenus);
router.post('/footer-sub-menus', auth, footerController.createFooterSubMenu);
router.put('/footer-sub-menus/:id', auth, footerController.updateFooterSubMenu);
router.delete('/footer-sub-menus/:id', auth, footerController.deleteFooterSubMenu);

// --- Uploads ---
router.post('/upload', upload.single('files'), uploadController.uploadFile);
router.post('/upload/multiple', upload.array('files', 10), uploadController.uploadMultipleFiles);

module.exports = router;
