// Service Routes for DhulBeeg Firm
const express = require('express');
const router = express.Router();
const ServiceController = require('../controllers/serviceController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateService } = require('../middleware/validation');

// Public routes
router.get('/', ServiceController.getAllServices);
router.get('/type/:type', ServiceController.getServicesByType);
router.get('/search', ServiceController.searchServices);
router.get('/category/:category', ServiceController.getServicesByCategory);
router.get('/:id', ServiceController.getServiceById);

// Protected routes (require authentication)
router.post('/', authenticate, authorize(['admin']), validateService, ServiceController.createService);
router.put('/:id', authenticate, authorize(['admin']), validateService, ServiceController.updateService);
router.delete('/:id', authenticate, authorize(['admin']), ServiceController.deleteService);
router.patch('/:id/toggle', authenticate, authorize(['admin']), ServiceController.toggleServiceStatus);
router.get('/statistics', authenticate, ServiceController.getServiceStatistics);

module.exports = router;