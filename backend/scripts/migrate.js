const { initializeDatabase, createDefaultAdmin } = require('../config/database');

(async() => {
    try {
        console.log('🔄 Running database migrations...');
        await initializeDatabase();
        await createDefaultAdmin();
        console.log('✅ Database migration completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database migration failed:', error);
        process.exit(1);
    }
})();