// ============================================
// Authentication Routes
// ============================================

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validation');

// Public routes
router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.post('/verify-email/:token', authController.verifyEmail);

// Protected routes (require authentication)
const { authenticate } = require('../middleware/auth');
router.get('/me', authenticate, authController.getCurrentUser);
router.put('/me', authenticate, authController.updateProfile);
router.put('/change-password', authenticate, authController.changePassword);
router.post('/logout', authenticate, authController.logout);

// Social authentication
router.post('/social-login', authController.socialLogin);
router.get('/providers', authController.getAuthProviders);

module.exports = router;