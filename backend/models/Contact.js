// Contact Model for DhulBeeg Firm
const db = require('../config/database');

class Contact {
    // Create a new contact inquiry
    static async create(contactData) {
        try {
            const {
                name,
                email,
                phone,
                department = 'general',
                subject,
                message,
                status = 'new',
                assigned_to = null
            } = contactData;

            const sql = `
                INSERT INTO contacts 
                (name, email, phone, department, subject, message, status, assigned_to)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const result = await db.query(sql, [
                name,
                email,
                phone,
                department,
                subject,
                message,
                status,
                assigned_to
            ]);

            return { id: result.insertId, ...contactData };
        } catch (error) {
            throw error;
        }
    }

    // Get all contacts with optional filters
    static async findAll(filters = {}) {
        try {
            let sql = `
                SELECT c.*, 
                       u.name as assigned_to_name,
                       u.email as assigned_to_email
                FROM contacts c
                LEFT JOIN users u ON c.assigned_to = u.id
                WHERE 1=1
            `;

            const params = [];

            // Apply filters
            if (filters.status) {
                sql += ' AND c.status = ?';
                params.push(filters.status);
            }

            if (filters.department) {
                sql += ' AND c.department = ?';
                params.push(filters.department);
            }

            if (filters.assigned_to) {
                sql += ' AND c.assigned_to = ?';
                params.push(filters.assigned_to);
            }

            if (filters.start_date) {
                sql += ' AND DATE(c.created_at) >= ?';
                params.push(filters.start_date);
            }

            if (filters.end_date) {
                sql += ' AND DATE(c.created_at) <= ?';
                params.push(filters.end_date);
            }

            if (filters.search) {
                sql += ' AND (c.name LIKE ? OR c.email LIKE ? OR c.subject LIKE ?)';
                const searchPattern = `%${filters.search}%`;
                params.push(searchPattern, searchPattern, searchPattern);
            }

            // Sorting
            sql += ' ORDER BY 
            CASE c.status
            WHEN "new"
            THEN 1
            WHEN "in_progress"
            THEN 2
            WHEN "contacted"
            THEN 3
            WHEN "resolved"
            THEN 4
            WHEN "spam"
            THEN 5
            ELSE 6
            END,
            c.created_at DESC ';

            // Pagination
            if (filters.limit) {
                sql += ' LIMIT ?';
                params.push(parseInt(filters.limit));

                if (filters.offset) {
                    sql += ' OFFSET ?';
                    params.push(parseInt(filters.offset));
                }
            }

            const contacts = await db.query(sql, params);
            return contacts;
        } catch (error) {
            throw error;
        }
    }

    // Get contact by ID
    static async findById(id) {
        try {
            const sql = `
                SELECT c.*, 
                       u.name as assigned_to_name,
                       u.email as assigned_to_email,
                       u.phone as assigned_to_phone
                FROM contacts c
                LEFT JOIN users u ON c.assigned_to = u.id
                WHERE c.id = ?
            `;

            const [contact] = await db.query(sql, [id]);
            return contact || null;
        } catch (error) {
            throw error;
        }
    }

    // Update contact status
    static async updateStatus(id, statusData) {
        try {
            const { status, assigned_to = null, notes } = statusData;

            const validStatuses = ['new', 'contacted', 'in_progress', 'resolved', 'spam'];
            if (!validStatuses.includes(status)) {
                throw new Error('Invalid status');
            }

            const sql = `
                UPDATE contacts 
                SET status = ?, 
                    assigned_to = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `;

            await db.query(sql, [status, assigned_to, id]);

            // Add note if provided
            if (notes) {
                await this.addNote(id, `Status changed to ${status}: ${notes}`);
            }

            return await this.findById(id);
        } catch (error) {
            throw error;
        }
    }

    // Add note to contact
    static async addNote(id, note) {
        try {
            const contact = await this.findById(id);
            if (!contact) {
                throw new Error('Contact not found');
            }

            // If we had a notes field, we would update it
            // For now, we'll just log it
            console.log(`Note added to contact ${id}: ${note}`);
            return contact;
        } catch (error) {
            throw error;
        }
    }

    // Delete contact
    static async delete(id) {
        try {
            const sql = 'DELETE FROM contacts WHERE id = ?';
            const result = await db.query(sql, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Get contact statistics
    static async getStatistics() {
        try {
            const sql = `
                SELECT 
                    COUNT(*) as total_contacts,
                    SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_contacts,
                    SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) as contacted_contacts,
                    SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_contacts,
                    SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved_contacts,
                    SUM(CASE WHEN department = 'real_estate' THEN 1 ELSE 0 END) as real_estate_contacts,
                    SUM(CASE WHEN department = 'legal' THEN 1 ELSE 0 END) as legal_contacts,
                    SUM(CASE WHEN department = 'management' THEN 1 ELSE 0 END) as management_contacts,
                    DATE(created_at) as date,
                    COUNT(*) as daily_count
                FROM contacts
                WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
                GROUP BY DATE(created_at)
                ORDER BY date DESC
            `;

            const stats = await db.query(sql);
            return stats;
        } catch (error) {
            throw error;
        }
    }

    // Get contacts by department
    static async getByDepartment(department, limit = 50) {
        try {
            const sql = `
                SELECT c.*
                FROM contacts c
                WHERE c.department = ?
                ORDER BY 
                    CASE c.status
                        WHEN 'new' THEN 1
                        WHEN 'in_progress' THEN 2
                        ELSE 3
                    END,
                    c.created_at DESC
                LIMIT ?
            `;

            const contacts = await db.query(sql, [department, limit]);
            return contacts;
        } catch (error) {
            throw error;
        }
    }

    // Mark contact as spam
    static async markAsSpam(id) {
        try {
            const sql = 'UPDATE contacts SET status = "spam" WHERE id = ?';
            await db.query(sql, [id]);
            return await this.findById(id);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Contact;