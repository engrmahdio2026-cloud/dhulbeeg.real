// Client Routes for DhulBeeg Firm
const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/clientController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateClient } = require('../middleware/validation');

// Protected routes (require authentication)
router.get('/', authenticate, ClientController.getAllClients);
router.get('/search', authenticate, ClientController.searchClients);
router.get('/statistics', authenticate, ClientController.getClientStatistics);
router.get('/agent/:agentId?', authenticate, ClientController.getClientsByAgent);
router.get('/:id', authenticate, ClientController.getClientById);
router.post('/', authenticate, validateClient, ClientController.createClient);
router.put('/:id', authenticate, validateClient, ClientController.updateClient);
router.delete('/:id', authenticate, authorize(['admin']), ClientController.deleteClient);
router.post('/:id/notes', authenticate, ClientController.addClientNote);

module.exports = router;