// Client Model for DhulBeeg Firm
const db = require('../config/database');

class Client {
    // Create a new client
    static async create(clientData) {
        try {
            const {
                name,
                email,
                phone,
                address,
                client_type,
                notes = '',
                assigned_to = null
            } = clientData;

            // Check if client with email already exists
            const existingClient = await this.findByEmail(email);
            if (existingClient) {
                throw new Error('Client with this email already exists');
            }

            const sql = `
                INSERT INTO clients 
                (name, email, phone, address, client_type, notes, assigned_to)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            const result = await db.query(sql, [
                name,
                email,
                phone,
                address,
                client_type,
                notes,
                assigned_to
            ]);

            return { id: result.insertId, ...clientData };
        } catch (error) {
            throw error;
        }
    }

    // Get all clients with optional filters
    static async findAll(filters = {}) {
        try {
            let sql = `
                SELECT c.*, 
                       u.name as assigned_agent_name,
                       u.email as assigned_agent_email
                FROM clients c
                LEFT JOIN users u ON c.assigned_to = u.id
                WHERE 1=1
            `;

            const params = [];

            // Apply filters
            if (filters.client_type) {
                sql += ' AND c.client_type = ?';
                params.push(filters.client_type);
            }

            if (filters.assigned_to) {
                sql += ' AND c.assigned_to = ?';
                params.push(filters.assigned_to);
            }

            if (filters.search) {
                sql += ' AND (c.name LIKE ? OR c.email LIKE ? OR c.phone LIKE ?)';
                const searchPattern = `%${filters.search}%`;
                params.push(searchPattern, searchPattern, searchPattern);
            }

            // Sorting
            sql += ' ORDER BY c.created_at DESC';

            // Pagination
            if (filters.limit) {
                sql += ' LIMIT ?';
                params.push(parseInt(filters.limit));

                if (filters.offset) {
                    sql += ' OFFSET ?';
                    params.push(parseInt(filters.offset));
                }
            }

            const clients = await db.query(sql, params);
            return clients;
        } catch (error) {
            throw error;
        }
    }

    // Get client by ID
    static async findById(id) {
        try {
            const sql = `
                SELECT c.*, 
                       u.name as assigned_agent_name,
                       u.email as assigned_agent_email,
                       u.phone as assigned_agent_phone
                FROM clients c
                LEFT JOIN users u ON c.assigned_to = u.id
                WHERE c.id = ?
            `;

            const [client] = await db.query(sql, [id]);
            return client || null;
        } catch (error) {
            throw error;
        }
    }

    // Get client by email
    static async findByEmail(email) {
        try {
            const sql = 'SELECT * FROM clients WHERE email = ?';
            const [client] = await db.query(sql, [email]);
            return client || null;
        } catch (error) {
            throw error;
        }
    }

    // Update client
    static async update(id, clientData) {
        try {
            const currentClient = await this.findById(id);
            if (!currentClient) {
                throw new Error('Client not found');
            }

            // Check if email is being changed and already exists
            if (clientData.email && clientData.email !== currentClient.email) {
                const existingClient = await this.findByEmail(clientData.email);
                if (existingClient && existingClient.id !== id) {
                    throw new Error('Email already in use by another client');
                }
            }

            const updates = [];
            const params = [];

            // Build update query dynamically
            if (clientData.name !== undefined) {
                updates.push('name = ?');
                params.push(clientData.name);
            }

            if (clientData.email !== undefined) {
                updates.push('email = ?');
                params.push(clientData.email);
            }

            if (clientData.phone !== undefined) {
                updates.push('phone = ?');
                params.push(clientData.phone);
            }

            if (clientData.address !== undefined) {
                updates.push('address = ?');
                params.push(clientData.address);
            }

            if (clientData.client_type !== undefined) {
                updates.push('client_type = ?');
                params.push(clientData.client_type);
            }

            if (clientData.notes !== undefined) {
                updates.push('notes = ?');
                params.push(clientData.notes);
            }

            if (clientData.assigned_to !== undefined) {
                updates.push('assigned_to = ?');
                params.push(clientData.assigned_to);
            }

            if (updates.length === 0) {
                return currentClient; // No updates
            }

            params.push(id);

            const sql = `
                UPDATE clients 
                SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `;

            await db.query(sql, params);

            return await this.findById(id);
        } catch (error) {
            throw error;
        }
    }

    // Delete client
    static async delete(id) {
        try {
            const sql = 'DELETE FROM clients WHERE id = ?';
            const result = await db.query(sql, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Get client statistics
    static async getStatistics() {
        try {
            const sql = `
                SELECT 
                    COUNT(*) as total_clients,
                    COUNT(DISTINCT client_type) as client_types,
                    SUM(CASE WHEN client_type = 'buyer' THEN 1 ELSE 0 END) as buyers,
                    SUM(CASE WHEN client_type = 'seller' THEN 1 ELSE 0 END) as sellers,
                    SUM(CASE WHEN client_type = 'investor' THEN 1 ELSE 0 END) as investors,
                    SUM(CASE WHEN client_type = 'legal_client' THEN 1 ELSE 0 END) as legal_clients
                FROM clients
            `;

            const [stats] = await db.query(sql);
            return stats;
        } catch (error) {
            throw error;
        }
    }

    // Get clients by agent
    static async getByAgent(agentId) {
        try {
            const sql = `
                SELECT c.*,
                       COUNT(pi.id) as total_inquiries
                FROM clients c
                LEFT JOIN property_inquiries pi ON c.id = pi.client_id
                WHERE c.assigned_to = ?
                GROUP BY c.id
                ORDER BY c.created_at DESC
            `;

            const clients = await db.query(sql, [agentId]);
            return clients;
        } catch (error) {
            throw error;
        }
    }

    // Add note to client
    static async addNote(id, note) {
        try {
            const client = await this.findById(id);
            if (!client) {
                throw new Error('Client not found');
            }

            const updatedNotes = client.notes ?
                `${client.notes}\n${new Date().toISOString()}: ${note}` :
                `${new Date().toISOString()}: ${note}`;

            const sql = 'UPDATE clients SET notes = ? WHERE id = ?';
            await db.query(sql, [updatedNotes, id]);

            return await this.findById(id);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Client;