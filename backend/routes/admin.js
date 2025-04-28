const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/auth');

// Auth
router.post('/login', adminController.login);

// Get all admin data in one endpoint
router.get('/data', adminController.getAdminData);

// About Me
router.put('/about_mobile', authMiddleware, adminController.updateAboutM);
router.put('/about_desktop', authMiddleware, adminController.updateAboutD);

// Doing
router.put('/doing', authMiddleware, adminController.updateDoing);

// Tools
router.put('/tools/software', authMiddleware, adminController.updateSoftwareTools);
router.put('/tools/hardware', authMiddleware, adminController.updateHardwareTools);

// Extras
router.put('/extras', authMiddleware, adminController.updateExtras);

// Bulk update endpoint (optional)
router.put('/data', authMiddleware, adminController.updateAdminData);

module.exports = router;