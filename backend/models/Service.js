// Service Model for DhulBeeg Firm
const db = require('../config/database');

class Service {
    // Create a new service
    static async create(serviceData) {
        try {
            const {
                title,
                description,
                service_type,
                category,
                duration,
                price_range,
                features = [],
                contact_email,
                is_active = true
            } = serviceData;

            const sql = `
                INSERT INTO services 
                (title, description, service_type, category, duration, price_range, features, contact_email, is_active)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const result = await db.query(sql, [
                title,
                description,
                service_type,
                category,
                duration,
                price_range,
                JSON.stringify(features),
                contact_email,
                is_active
            ]);

            return { id: result.insertId, ...serviceData };
        } catch (error) {
            throw error;
        }
    }

    // Get all services
    static async findAll(filters = {}) {
        try {
            let sql = 'SELECT * FROM services WHERE 1=1';
            const params = [];

            // Apply filters
            if (filters.service_type) {
                sql += ' AND service_type = ?';
                params.push(filters.service_type);
            }

            if (filters.category) {
                sql += ' AND category = ?';
                params.push(filters.category);
            }

            if (filters.is_active !== undefined) {
                sql += ' AND is_active = ?';
                params.push(filters.is_active);
            }

            // Sorting
            sql += ' ORDER BY service_type, category, title';

            const services = await db.query(sql, params);

            // Parse JSON fields
            return services.map(service => ({
                ...service,
                features: service.features ? JSON.parse(service.features) : []
            }));
        } catch (error) {
            throw error;
        }
    }

    // Get service by ID
    static async findById(id) {
        try {
            const sql = 'SELECT * FROM services WHERE id = ?';
            const [service] = await db.query(sql, [id]);

            if (!service) return null;

            return {
                ...service,
                features: service.features ? JSON.parse(service.features) : []
            };
        } catch (error) {
            throw error;
        }
    }

    // Get services by type
    static async findByType(serviceType) {
        try {
            const sql = 'SELECT * FROM services WHERE service_type = ? AND is_active = true ORDER BY category, title';
            const services = await db.query(sql, [serviceType]);

            return services.map(service => ({
                ...service,
                features: service.features ? JSON.parse(service.features) : []
            }));
        } catch (error) {
            throw error;
        }
    }

    // Update service
    static async update(id, serviceData) {
        try {
            const currentService = await this.findById(id);
            if (!currentService) {
                throw new Error('Service not found');
            }

            const updates = [];
            const params = [];

            // Build update query dynamically
            if (serviceData.title !== undefined) {
                updates.push('title = ?');
                params.push(serviceData.title);
            }

            if (serviceData.description !== undefined) {
                updates.push('description = ?');
                params.push(serviceData.description);
            }

            if (serviceData.service_type !== undefined) {
                updates.push('service_type = ?');
                params.push(serviceData.service_type);
            }

            if (serviceData.category !== undefined) {
                updates.push('category = ?');
                params.push(serviceData.category);
            }

            if (serviceData.duration !== undefined) {
                updates.push('duration = ?');
                params.push(serviceData.duration);
            }

            if (serviceData.price_range !== undefined) {
                updates.push('price_range = ?');
                params.push(serviceData.price_range);
            }

            if (serviceData.features !== undefined) {
                updates.push('features = ?');
                params.push(JSON.stringify(serviceData.features));
            }

            if (serviceData.contact_email !== undefined) {
                updates.push('contact_email = ?');
                params.push(serviceData.contact_email);
            }

            if (serviceData.is_active !== undefined) {
                updates.push('is_active = ?');
                params.push(serviceData.is_active);
            }

            if (updates.length === 0) {
                return currentService; // No updates
            }

            params.push(id);

            const sql = `
                UPDATE services 
                SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `;

            await db.query(sql, params);

            return await this.findById(id);
        } catch (error) {
            throw error;
        }
    }

    // Delete service
    static async delete(id) {
        try {
            const sql = 'DELETE FROM services WHERE id = ?';
            const result = await db.query(sql, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Toggle service active status
    static async toggleActive(id) {
        try {
            const service = await this.findById(id);
            if (!service) {
                throw new Error('Service not found');
            }

            const newStatus = !service.is_active;
            const sql = 'UPDATE services SET is_active = ? WHERE id = ?';
            await db.query(sql, [newStatus, id]);

            return {...service, is_active: newStatus };
        } catch (error) {
            throw error;
        }
    }

    // Get service statistics
    static async getStatistics() {
        try {
            const sql = `
                SELECT 
                    COUNT(*) as total_services,
                    SUM(CASE WHEN is_active = true THEN 1 ELSE 0 END) as active_services,
                    SUM(CASE WHEN service_type = 'real_estate' THEN 1 ELSE 0 END) as real_estate_services,
                    SUM(CASE WHEN service_type = 'legal' THEN 1 ELSE 0 END) as legal_services,
                    SUM(CASE WHEN service_type = 'management' THEN 1 ELSE 0 END) as management_services,
                    SUM(CASE WHEN service_type = 'consultation' THEN 1 ELSE 0 END) as consultation_services,
                    COUNT(DISTINCT category) as total_categories
                FROM services
            `;

            const [stats] = await db.query(sql);
            return stats;
        } catch (error) {
            throw error;
        }
    }

    // Get services by category
    static async getByCategory(category) {
        try {
            const sql = 'SELECT * FROM services WHERE category = ? AND is_active = true ORDER BY title';
            const services = await db.query(sql, [category]);

            return services.map(service => ({
                ...service,
                features: service.features ? JSON.parse(service.features) : []
            }));
        } catch (error) {
            throw error;
        }
    }

    // Search services
    static async search(searchTerm) {
        try {
            const sql = `
                SELECT * FROM services 
                WHERE (title LIKE ? OR description LIKE ? OR category LIKE ?)
                AND is_active = true
                ORDER BY service_type, category
                LIMIT 20
            `;

            const searchPattern = `%${searchTerm}%`;
            const services = await db.query(sql, [searchPattern, searchPattern, searchPattern]);

            return services.map(service => ({
                ...service,
                features: service.features ? JSON.parse(service.features) : []
            }));
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Service;