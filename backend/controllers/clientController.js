// Client Controller for DhulBeeg Firm
const Client = require('../models/Client');
const { validationResult } = require('express-validator');

class ClientController {
    // Get all clients
    static async getAllClients(req, res, next) {
        try {
            const filters = {
                client_type: req.query.type,
                assigned_to: req.query.assigned_to,
                search: req.query.search,
                limit: req.query.limit || 50,
                offset: req.query.offset || 0
            };

            const clients = await Client.findAll(filters);

            res.status(200).json({
                success: true,
                count: clients.length,
                data: clients
            });
        } catch (error) {
            next(error);
        }
    }

    // Get single client
    static async getClientById(req, res, next) {
        try {
            const client = await Client.findById(req.params.id);

            if (!client) {
                return res.status(404).json({
                    success: false,
                    message: 'Client not found'
                });
            }

            res.status(200).json({
                success: true,
                data: client
            });
        } catch (error) {
            next(error);
        }
    }

    // Create new client
    static async createClient(req, res, next) {
        try {
            // Check validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const clientData = {
                ...req.body,
                assigned_to: req.body.assigned_to || req.user ? .id
            };

            const client = await Client.create(clientData);

            res.status(201).json({
                success: true,
                message: 'Client created successfully',
                data: client
            });
        } catch (error) {
            next(error);
        }
    }

    // Update client
    static async updateClient(req, res, next) {
        try {
            // Check validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const client = await Client.update(req.params.id, req.body);

            if (!client) {
                return res.status(404).json({
                    success: false,
                    message: 'Client not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Client updated successfully',
                data: client
            });
        } catch (error) {
            next(error);
        }
    }

    // Delete client
    static async deleteClient(req, res, next) {
        try {
            const deleted = await Client.delete(req.params.id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Client not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Client deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    // Get client statistics
    static async getClientStatistics(req, res, next) {
        try {
            const statistics = await Client.getStatistics();

            res.status(200).json({
                success: true,
                data: statistics
            });
        } catch (error) {
            next(error);
        }
    }

    // Get clients by agent
    static async getClientsByAgent(req, res, next) {
        try {
            const agentId = req.params.agentId || req.user.id;
            const clients = await Client.getByAgent(agentId);

            res.status(200).json({
                success: true,
                count: clients.length,
                data: clients
            });
        } catch (error) {
            next(error);
        }
    }

    // Add note to client
    static async addClientNote(req, res, next) {
        try {
            const { note } = req.body;

            if (!note || note.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Note is required'
                });
            }

            const client = await Client.addNote(req.params.id, note.trim());

            if (!client) {
                return res.status(404).json({
                    success: false,
                    message: 'Client not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Note added successfully',
                data: client
            });
        } catch (error) {
            next(error);
        }
    }

    // Search clients
    static async searchClients(req, res, next) {
        try {
            const { q } = req.query;

            if (!q || q.trim().length < 2) {
                return res.status(400).json({
                    success: false,
                    message: 'Search term must be at least 2 characters'
                });
            }

            const filters = {
                search: q.trim()
            };

            const clients = await Client.findAll(filters);

            res.status(200).json({
                success: true,
                count: clients.length,
                data: clients
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ClientController;