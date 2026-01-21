IN BACKEND
1. / config / database.js: const mysql = require('mysql2/promise');
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

// Initialize database with tables
const initializeDatabase = async() => {
    try {
        const connection = await pool.getConnection();

        // Create tables if they don't exist (use the structure you provided)
        // ... (your table creation SQL code here)

        console.log('✅ Database tables created/verified');
        connection.release();
    } catch (error) {
        console.error('❌ Error initializing database:', error);
        throw error;
    }
};

// Insert default admin user
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
        }

        connection.release();
    } catch (error) {
        console.error('❌ Error creating default admin:', error);
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

2. / routes / authRoutes.js: // ============================================
    // ============================================
    // Authentication Routes
    // ============================================

    const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validation');

// Public routes
router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.post('/verify-email/:token', authController.verifyEmail);

// Protected routes (require authentication)
const { authenticate } = require('../middleware/auth');
const { serve } = require('swagger-ui-express');
router.get('/me', authenticate, authController.getCurrentUser);
router.put('/me', authenticate, authController.updateProfile);
router.put('/change-password', authenticate, authController.changePassword);
router.post('/logout', authenticate, authController.logout);

// Social authentication
router.post('/social-login', authController.socialLogin);
router.get('/providers', authController.getAuthProviders);

module.exports = router;

end routes / authRoutes.js



BACKEND
3..env

# Server Configuration
PORT = 5000
NODE_ENV = development
BASE_URL = http: //localhost:5000
    FRONTEND_URL = http: //localhost:3000

    #Database Configuration
DB_HOST = localhost
DB_PORT = 3306
DB_USER = root
DB_PASSWORD = mAhdioDowa @MYSQLM!5
DB_NAME = dhulbeeg_firm

# JWT Configuration
JWT_SECRET = your - super - secret - jwt - key - change - this - in -production
JWT_EXPIRE = 7 d

# Email Configuration
EMAIL_HOST = smtp.gmail.com
EMAIL_PORT = 587
EMAIL_USER = DhulBeeg.Reals @gmail.com
EMAIL_PASS = your - email - password
EMAIL_FROM = DhulBeeg Firm < noreply @dhulbeeg.com >

    #File Upload Configuration
MAX_FILE_SIZE = 5
UPLOAD_PATH = . / uploads

# Rate Limiting
RATE_LIMIT_WINDOW = 15
RATE_LIMIT_MAX = 100

end.env


BACKEND

4. server.js

// ============================================
// DhulBeeg Backend Server
// Express.js API Server for Real Estate & Legal Services
// ============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const serviceRoutes = require('./routes/services');
const userRoutes = require('./routes/users');
const appointmentRoutes = require('./routes/appointments');
const transactionRoutes = require('./routes/transactions');
const districtRoutes = require('./routes/districts');
const contactRoutes = require('./routes/contact');
const analyticsRoutes = require('./routes/analytics');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { authenticate } = require('./middleware/auth');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://maps.openstreetmap.org"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            connectSrc: ["'self'", "https://api.openstreetmap.org"]
        }
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        status: 429,
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});
app.use('/api/', limiter);

// ============================================
// APPLICATION MIDDLEWARE
// ============================================

// Logging
if (NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// ============================================
// DATABASE CONNECTION
// ============================================

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dhulbeeg';

mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    })
    .then(() => {
        console.log('✅ MongoDB connected successfully');

        // Create indexes
        mongoose.connection.db.collection('properties').createIndex({
            title: 'text',
            description: 'text',
            'location.address': 'text'
        });

        mongoose.connection.db.collection('properties').createIndex({
            'location.coordinates': '2dsphere'
        });

        console.log('✅ Database indexes created');
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    });

// ============================================
// API ROUTES
// ============================================

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'DhulBeeg API is running',
        timestamp: new Date().toISOString(),
        environment: NODE_ENV,
        version: '1.0.0'
    });
});

// Public routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/districts', districtRoutes);
app.use('/api/contact', contactRoutes);

// Protected routes (require authentication)
app.use('/api/users', authenticate, userRoutes);
app.use('/api/appointments', authenticate, appointmentRoutes);
app.use('/api/transactions', authenticate, transactionRoutes);
app.use('/api/analytics', authenticate, analyticsRoutes);

// File upload endpoint
app.post('/api/upload', authenticate, require('./controllers/uploadController').uploadFile);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// ============================================
// SERVER STARTUP
// ============================================

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated');
        process.exit(0);
    });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`
    ============================================
       DhulBeeg Real Estate & Legal Services
                  API Server
    ============================================
    📍 Environment: ${NODE_ENV}
    🌐 Server URL: http://localhost:${PORT}
    🗄️  Database: ${MONGODB_URI}
    ⏰ Started: ${new Date().toLocaleString()}
    ============================================
    `);
});

module.exports = app;