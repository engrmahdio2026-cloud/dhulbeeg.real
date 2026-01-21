// Property Routes for DhulBeeg Firm
const express = require('express');
const router = express.Router();
const PropertyController = require('../controllers/propertyController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateProperty } = require('../middleware/validation');
const upload = require('../utils/fileUpload');

// Public routes
router.get('/', PropertyController.getAllProperties);
router.get('/featured', PropertyController.getFeaturedProperties);
router.get('/search', PropertyController.searchProperties);
router.get('/statistics', PropertyController.getPropertyStatistics);
router.get('/:id', PropertyController.getPropertyById);

// Protected routes (require authentication)
router.post('/', authenticate, authorize(['admin', 'agent']), validateProperty, PropertyController.createProperty);
router.put('/:id', authenticate, authorize(['admin', 'agent']), validateProperty, PropertyController.updateProperty);
router.delete('/:id', authenticate, authorize(['admin']), PropertyController.deleteProperty);

// Image upload routes
router.post('/:id/images', authenticate, authorize(['admin', 'agent']), upload.array('images', 10), PropertyController.uploadImages);
router.delete('/:id/images', authenticate, authorize(['admin', 'agent']), PropertyController.removeImage);

module.exports = router;