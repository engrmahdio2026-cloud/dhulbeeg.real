// Contact Routes for DhulBeeg Firm
const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/contactController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateContact } = require('../middleware/validation');

// Public route for submitting contact inquiries
router.post('/', validateContact, ContactController.createContact);

// Protected routes (require authentication)
router.get('/', authenticate, ContactController.getAllContacts);
router.get('/statistics', authenticate, ContactController.getContactStatistics);
router.get('/department/:department', authenticate, ContactController.getContactsByDepartment);
router.get('/:id', authenticate, ContactController.getContactById);
router.patch('/:id/status', authenticate, authorize(['admin', 'agent', 'lawyer']), ContactController.updateContactStatus);
router.delete('/:id', authenticate, authorize(['admin']), ContactController.deleteContact);
router.post('/:id/spam', authenticate, authorize(['admin']), ContactController.markAsSpam);

module.exports = router;