const { pool } = require('../config/database');

exports.getAllProperties = async(req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM properties ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPropertyById = async(req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM properties WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Property not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createProperty = async(req, res) => {
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
            images = []
        } = req.body;

        // ✅ FIXED: Removed space in optional chaining operator
        const agent_id = req.user?.id || null;

        const [result] = await pool.execute(
            `INSERT INTO properties 
             (title, description, location, price, property_type, status, bedrooms, bathrooms, area, features, images, agent_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
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
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Property created successfully',
            propertyId: result.insertId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProperty = async(req, res) => {
    try {
        const propertyId = req.params.id;
        const updateData = req.body;

        // Build dynamic update query
        const fields = [];
        const values = [];

        Object.keys(updateData).forEach(key => {
            if (key === 'features' || key === 'images') {
                fields.push(`${key} = ?`);
                values.push(JSON.stringify(updateData[key]));
            } else {
                fields.push(`${key} = ?`);
                values.push(updateData[key]);
            }
        });

        if (fields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(propertyId);

        const query = `UPDATE properties SET ${fields.join(', ')} WHERE id = ?`;
        const [result] = await pool.execute(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Property not found' });
        }

        res.json({
            success: true,
            message: 'Property updated successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProperty = async(req, res) => {
    try {
        const [result] = await pool.execute('DELETE FROM properties WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Property not found' });
        }

        res.json({
            success: true,
            message: 'Property deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPropertyStats = async(req, res) => {
    try {
        const [stats] = await pool.execute(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available,
                SUM(CASE WHEN status = 'sold' THEN 1 ELSE 0 END) as sold,
                SUM(CASE WHEN status = 'rented' THEN 1 ELSE 0 END) as rented,
                AVG(price) as average_price,
                MAX(price) as max_price,
                MIN(price) as min_price
            FROM properties
        `);
        res.json(stats[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};