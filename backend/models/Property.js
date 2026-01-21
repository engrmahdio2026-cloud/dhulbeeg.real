// Property Model for DhulBeeg Firm
const db = require('../config/database');

class Property {
    // Create a new property
    static async create(propertyData) {
        try {
            const {
                title,
                description,
                location,
                price,
                property_type,
                status = 'available',
                bedrooms,
                bathrooms,
                area,
                features = [],
                images = [],
                agent_id = null
            } = propertyData;

            const sql = `
                INSERT INTO properties 
                (title, description, location, price, property_type, status, bedrooms, bathrooms, area, features, images, agent_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const result = await db.query(sql, [
                title,
                description,
                location,
                price,
                property_type,
                status,
                bedrooms,
                bathrooms,
                area,
                JSON.stringify(features),
                JSON.stringify(images),
                agent_id
            ]);

            return { id: result.insertId, ...propertyData };
        } catch (error) {
            throw error;
        }
    }

    // Get all properties with optional filters
    static async findAll(filters = {}) {
        try {
            let sql = `
                SELECT p.*, 
                       u.name as agent_name,
                       u.email as agent_email
                FROM properties p
                LEFT JOIN users u ON p.agent_id = u.id
                WHERE 1=1
            `;

            const params = [];

            // Apply filters
            if (filters.property_type) {
                sql += ' AND p.property_type = ?';
                params.push(filters.property_type);
            }

            if (filters.status) {
                sql += ' AND p.status = ?';
                params.push(filters.status);
            }

            if (filters.min_price) {
                sql += ' AND p.price >= ?';
                params.push(filters.min_price);
            }

            if (filters.max_price) {
                sql += ' AND p.price <= ?';
                params.push(filters.max_price);
            }

            if (filters.location) {
                sql += ' AND p.location LIKE ?';
                params.push(`%${filters.location}%`);
            }

            if (filters.bedrooms) {
                sql += ' AND p.bedrooms >= ?';
                params.push(filters.bedrooms);
            }

            // Sorting
            sql += ' ORDER BY p.created_at DESC';

            // Pagination
            if (filters.limit) {
                sql += ' LIMIT ?';
                params.push(parseInt(filters.limit));

                if (filters.offset) {
                    sql += ' OFFSET ?';
                    params.push(parseInt(filters.offset));
                }
            }

            const properties = await db.query(sql, params);

            // Parse JSON fields
            return properties.map(property => ({
                ...property,
                features: property.features ? JSON.parse(property.features) : [],
                images: property.images ? JSON.parse(property.images) : []
            }));
        } catch (error) {
            throw error;
        }
    }

    // Get property by ID
    static async findById(id) {
        try {
            const sql = `
                SELECT p.*, 
                       u.name as agent_name,
                       u.email as agent_email,
                       u.phone as agent_phone
                FROM properties p
                LEFT JOIN users u ON p.agent_id = u.id
                WHERE p.id = ?
            `;

            const [property] = await db.query(sql, [id]);

            if (!property) return null;

            // Parse JSON fields
            return {
                ...property,
                features: property.features ? JSON.parse(property.features) : [],
                images: property.images ? JSON.parse(property.images) : []
            };
        } catch (error) {
            throw error;
        }
    }

    // Update property
    static async update(id, propertyData) {
        try {
            const currentProperty = await this.findById(id);
            if (!currentProperty) {
                throw new Error('Property not found');
            }

            const updates = [];
            const params = [];

            // Build update query dynamically
            if (propertyData.title !== undefined) {
                updates.push('title = ?');
                params.push(propertyData.title);
            }

            if (propertyData.description !== undefined) {
                updates.push('description = ?');
                params.push(propertyData.description);
            }

            if (propertyData.location !== undefined) {
                updates.push('location = ?');
                params.push(propertyData.location);
            }

            if (propertyData.price !== undefined) {
                updates.push('price = ?');
                params.push(propertyData.price);
            }

            if (propertyData.property_type !== undefined) {
                updates.push('property_type = ?');
                params.push(propertyData.property_type);
            }

            if (propertyData.status !== undefined) {
                updates.push('status = ?');
                params.push(propertyData.status);
            }

            if (propertyData.bedrooms !== undefined) {
                updates.push('bedrooms = ?');
                params.push(propertyData.bedrooms);
            }

            if (propertyData.bathrooms !== undefined) {
                updates.push('bathrooms = ?');
                params.push(propertyData.bathrooms);
            }

            if (propertyData.area !== undefined) {
                updates.push('area = ?');
                params.push(propertyData.area);
            }

            if (propertyData.features !== undefined) {
                updates.push('features = ?');
                params.push(JSON.stringify(propertyData.features));
            }

            if (propertyData.images !== undefined) {
                updates.push('images = ?');
                params.push(JSON.stringify(propertyData.images));
            }

            if (propertyData.agent_id !== undefined) {
                updates.push('agent_id = ?');
                params.push(propertyData.agent_id);
            }

            if (updates.length === 0) {
                return currentProperty; // No updates
            }

            params.push(id);

            const sql = `
                UPDATE properties 
                SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `;

            await db.query(sql, params);

            return await this.findById(id);
        } catch (error) {
            throw error;
        }
    }

    // Delete property
    static async delete(id) {
        try {
            const sql = 'DELETE FROM properties WHERE id = ?';
            const result = await db.query(sql, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Search properties
    static async search(searchTerm) {
        try {
            const sql = `
                SELECT p.*, 
                       u.name as agent_name
                FROM properties p
                LEFT JOIN users u ON p.agent_id = u.id
                WHERE p.title LIKE ? 
                   OR p.description LIKE ? 
                   OR p.location LIKE ?
                   OR p.property_type LIKE ?
                AND p.status = 'available'
                ORDER BY p.created_at DESC
                LIMIT 20
            `;

            const searchPattern = `%${searchTerm}%`;
            const properties = await db.query(sql, [
                searchPattern, searchPattern, searchPattern, searchPattern
            ]);

            // Parse JSON fields
            return properties.map(property => ({
                ...property,
                features: property.features ? JSON.parse(property.features) : [],
                images: property.images ? JSON.parse(property.images) : []
            }));
        } catch (error) {
            throw error;
        }
    }

    // Get featured properties
    static async getFeatured(limit = 6) {
        try {
            const sql = `
                SELECT p.*, 
                       u.name as agent_name
                FROM properties p
                LEFT JOIN users u ON p.agent_id = u.id
                WHERE p.status = 'available'
                ORDER BY p.created_at DESC
                LIMIT ?
            `;

            const properties = await db.query(sql, [limit]);

            // Parse JSON fields
            return properties.map(property => ({
                ...property,
                features: property.features ? JSON.parse(property.features) : [],
                images: property.images ? JSON.parse(property.images) : []
            }));
        } catch (error) {
            throw error;
        }
    }

    // Get property statistics
    static async getStatistics() {
        try {
            const sql = `
                SELECT 
                    COUNT(*) as total_properties,
                    SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available_properties,
                    SUM(CASE WHEN status = 'sold' THEN 1 ELSE 0 END) as sold_properties,
                    SUM(CASE WHEN status = 'rented' THEN 1 ELSE 0 END) as rented_properties,
                    AVG(price) as average_price,
                    MIN(price) as min_price,
                    MAX(price) as max_price
                FROM properties
            `;

            const [stats] = await db.query(sql);
            return stats;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Property;