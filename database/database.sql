// Initialize database with ALL tables
const initializeDatabase = async() => {
    try {
        const connection = await pool.getConnection();

        // Create users table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                role ENUM('admin', 'user', 'agent', 'lawyer') DEFAULT 'user',
                department VARCHAR(100) DEFAULT 'general',
                phone VARCHAR(20),
                address TEXT,
                is_active BOOLEAN DEFAULT TRUE,
                profile_image VARCHAR(255),
                last_login TIMESTAMP NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Users table created/verified');

        // Create properties table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS properties (
                id INT PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                type ENUM('house', 'apartment', 'land', 'commercial') NOT NULL,
                price DECIMAL(12,2) NOT NULL,
                location VARCHAR(255),
                address TEXT,
                bedrooms INT,
                bathrooms INT,
                area_sqft DECIMAL(10,2),
                status ENUM('available', 'sold', 'rented', 'pending') DEFAULT 'available',
                owner_id INT,
                images TEXT,
                amenities TEXT,
                created_by INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
            )
        `);
        console.log('✅ Properties table created/verified');

        // Create appointments table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS appointments (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT NOT NULL,
                property_id INT,
                service_type VARCHAR(100),
                appointment_date DATETIME NOT NULL,
                purpose ENUM('viewing', 'consultation', 'meeting') DEFAULT 'viewing',
                status ENUM('scheduled', 'completed', 'cancelled', 'rescheduled') DEFAULT 'scheduled',
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL
            )
        `);
        console.log('✅ Appointments table created/verified');

        // Create transactions table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS transactions (
                id INT PRIMARY KEY AUTO_INCREMENT,
                property_id INT NOT NULL,
                buyer_id INT NOT NULL,
                seller_id INT NOT NULL,
                amount DECIMAL(12,2) NOT NULL,
                transaction_type ENUM('sale', 'rent', 'lease') DEFAULT 'sale',
                status ENUM('pending', 'completed', 'cancelled', 'failed') DEFAULT 'pending',
                payment_method VARCHAR(100),
                transaction_date DATETIME,
                contract_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
                FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Transactions table created/verified');

        connection.release();
    } catch (error) {
        console.error('❌ Error initializing database:', error.message);
        // Don't crash if tables already exist
        if (!error.message.includes('already exists')) {
            throw error;
        }
    }
};