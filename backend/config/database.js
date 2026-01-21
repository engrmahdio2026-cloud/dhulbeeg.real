const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Create connection pool for better performance
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'mAhdioDowa@MYSQLM!5',
    database: process.env.DB_NAME || 'dhulbeeg_firm',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

// Test database connection
const testConnection = async() => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Connected to MySQL database:', process.env.DB_NAME);
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
};

// Initialize database with tables - FIXED VERSION (only creates if doesn't exist)
const initializeDatabase = async() => {
    try {
        const connection = await pool.getConnection();

        // Check if tables exist and create only if they don't
        const [tables] = await connection.execute(`
            SELECT TABLE_NAME 
            FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = ? 
            AND TABLE_NAME IN ('users', 'properties', 'services', 'appointments', 'transactions')
        `, [process.env.DB_NAME]);

        const existingTables = tables.map(t => t.TABLE_NAME);

        // Create users table if it doesn't exist
        if (!existingTables.includes('users')) {
            await connection.execute(`
                CREATE TABLE users (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    name VARCHAR(255) NOT NULL,
                    role ENUM('admin', 'user', 'agent', 'lawyer') DEFAULT 'user',
                    department VARCHAR(100) DEFAULT 'general',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            `);
            console.log('✅ Created users table');
        } else {
            console.log('✅ Users table already exists');
        }

        // Create other tables as needed (commented out for now)
        // Add your other table creation SQL here

        connection.release();
    } catch (error) {
        console.error('❌ Error initializing database:', error.message);
        // Don't throw error if table already exists
        if (!error.message.includes('already exists')) {
            throw error;
        }
    }
};

// Insert default admin user - FIXED to avoid duplicate insertion
const createDefaultAdmin = async() => {
    try {
        const bcrypt = require('bcryptjs');
        const connection = await pool.getConnection();

        const [rows] = await connection.execute(
            'SELECT * FROM users WHERE email = ?', ['admin@dhulbeeg.com']
        );

        if (rows.length === 0) {
            const hashedPassword = await bcrypt.hash('Admin@123', 10);
            await connection.execute(
                `INSERT INTO users (email, password, name, role, department) 
                 VALUES (?, ?, ?, ?, ?)`, ['admin@dhulbeeg.com', hashedPassword, 'System Administrator', 'admin', 'management']
            );
            console.log('✅ Default admin user created');
        } else {
            console.log('✅ Default admin user already exists');
        }

        connection.release();
    } catch (error) {
        console.error('❌ Error creating default admin:', error.message);
    }
};

module.exports = {
    pool,
    testConnection,
    initializeDatabase,
    createDefaultAdmin,
    query: async(sql, params) => {
        try {
            const [rows] = await pool.execute(sql, params);
            return rows;
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    },
    transaction: async(callback) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const result = await callback(connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },
};