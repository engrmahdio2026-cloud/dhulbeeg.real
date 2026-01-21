// ============================================
// DhulBeeg Backend Server - Production Ready
// ============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');

// Import database connection
const { pool, testConnection, initializeDatabase, createDefaultAdmin } = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');

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
    contentSecurityPolicy: false, // Disable for development
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
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
app.use(morgan('dev'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// ============================================
// DATABASE CONNECTION
// ============================================

const initializeApp = async() => {
    try {
        console.log('🔧 Initializing application...');

        // Test database connection
        const isConnected = await testConnection();
        if (!isConnected) {
            throw new Error('Failed to connect to MySQL database');
        }

        console.log('✅ MySQL database connected successfully');

        // Initialize tables (if they don't exist)
        await initializeDatabase();

        // Create default admin
        await createDefaultAdmin();

        console.log('✅ Application initialized successfully');
    } catch (error) {
        console.error('❌ Application initialization failed:', error.message);
        process.exit(1);
    }
};

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
        version: '1.0.0',
        database: 'MySQL'
    });
});

// Database connection test
app.get('/api/db-test', async(req, res) => {
    try {
        const [rows] = await pool.execute('SELECT 1 as connection_test');
        res.status(200).json({
            status: 'success',
            message: 'Database connection successful',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Database connection failed',
            error: error.message
        });
    }
});

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes example (uncomment when ready)
// app.get('/api/protected', authenticate, (req, res) => {
//     res.json({
//         status: 'success',
//         message: 'This is a protected route',
//         user: req.user
//     });
// });

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

// Start server after database initialization
const startServer = async() => {
    await initializeApp();

    const server = app.listen(PORT, () => {
        console.log(`
        ============================================
           DhulBeeg Real Estate & Legal Services
                      API Server
        ============================================
        📍 Environment: ${NODE_ENV}
        🌐 Server URL: http://localhost:${PORT}
        🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}
        🗄️  Database: MySQL (${process.env.DB_NAME})
        ✅ API Health: http://localhost:${PORT}/api/health
        ✅ DB Test: http://localhost:${PORT}/api/db-test
        ⏰ Started: ${new Date().toLocaleString()}
        ============================================
        `);
    });

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
};

startServer();

module.exports = app;