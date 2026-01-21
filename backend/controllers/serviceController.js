// Service Controller for DhulBeeg Firm
const Service = require('../models/Service');
const { validationResult } = require('express-validator');

class ServiceController {
    // Get all services
    static async getAllServices(req, res, next) {
        try {
            const filters = {
                service_type: req.query.type,
                category: req.query.category,
                is_active: req.query.active !== undefined ? req.query.active === 'true' : undefined
            };

            const services = await Service.findAll(filters);

            res.status(200).json({
                success: true,
                count: services.length,
                data: services
            });
        } catch (error) {
            next(error);
        }
    }

    // Get services by type
    static async getServicesByType(req, res, next) {
        try {
            const { type } = req.params;
            const services = await Service.findByType(type);

            res.status(200).json({
                success: true,
                count: services.length,
                data: services
            });
        } catch (error) {
            next(error);
        }
    }

    // Get single service
    static async getServiceById(req, res, next) {
        try {
            const service = await Service.findById(req.params.id);

            if (!service) {
                return res.status(404).json({
                    success: false,
                    message: 'Service not found'
                });
            }

            res.status(200).json({
                success: true,
                data: service
            });
        } catch (error) {
            next(error);
        }
    }

    // Create new service
    static async createService(req, res, next) {
        try {
            // Check validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const service = await Service.create(req.body);

            res.status(201).json({
                success: true,
                message: 'Service created successfully',
                data: service
            });
        } catch (error) {
            next(error);
        }
    }

    // Update service
    static async updateService(req, res, next) {
        try {
            // Check validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const service = await Service.update(req.params.id, req.body);

            if (!service) {
                return res.status(404).json({
                    success: false,
                    message: 'Service not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Service updated successfully',
                data: service
            });
        } catch (error) {
            next(error);
        }
    }

    // Delete service
    static async deleteService(req, res, next) {
        try {
            const deleted = await Service.delete(req.params.id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Service not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Service deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    // Toggle service active status
    static async toggleServiceStatus(req, res, next) {
        try {
            const service = await Service.toggleActive(req.params.id);

            if (!service) {
                return res.status(404).json({
                    success: false,
                    message: 'Service not found'
                });
            }

            res.status(200).json({
                success: true,
                message: `Service ${service.is_active ? 'activated' : 'deactivated'} successfully`,
                data: service
            });
        } catch (error) {
            next(error);
        }
    }

    // Get service statistics
    static async getServiceStatistics(req, res, next) {
        try {
            const statistics = await Service.getStatistics();

            res.status(200).json({
                success: true,
                data: statistics
            });
        } catch (error) {
            next(error);
        }
    }

    // Get services by category
    static async getServicesByCategory(req, res, next) {
        try {
            const { category } = req.params;
            const services = await Service.getByCategory(category);

            res.status(200).json({
                success: true,
                count: services.length,
                data: services
            });
        } catch (error) {
            next(error);
        }
    }

    // Search services
    static async searchServices(req, res, next) {
        try {
            const { q } = req.query;

            if (!q || q.trim().length < 2) {
                return res.status(400).json({
                    success: false,
                    message: 'Search term must be at least 2 characters'
                });
            }

            const services = await Service.search(q.trim());

            res.status(200).json({
                success: true,
                count: services.length,
                data: services
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ServiceController;