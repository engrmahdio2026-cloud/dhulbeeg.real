// Logger Utility for DhulBeeg Firm
const fs = require('fs');
const path = require('path');

class Logger {
    constructor() {
        this.logDir = path.join(__dirname, '../logs');
        this.createLogDirectory();
    }

    createLogDirectory() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    getLogFilePath() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return path.join(this.logDir, `${year}-${month}-${day}.log`);
    }

    formatLogEntry(level, message, meta = {}) {
        const timestamp = new Date().toISOString();
        const entry = {
            timestamp,
            level,
            message,
            ...meta
        };

        return JSON.stringify(entry);
    }

    writeToFile(entry) {
        const logFile = this.getLogFilePath();
        const formattedEntry = entry + '\n';

        fs.appendFileSync(logFile, formattedEntry, 'utf8');
    }

    log(level, message, meta = {}) {
        const entry = this.formatLogEntry(level, message, meta);

        // Write to file
        this.writeToFile(entry);

        // Also log to console in development
        if (process.env.NODE_ENV === 'development') {
            const consoleMessage = `[${new Date().toLocaleTimeString()}] [${level.toUpperCase()}] ${message}`;

            switch (level) {
                case 'error':
                    console.error(consoleMessage, meta);
                    break;
                case 'warn':
                    console.warn(consoleMessage, meta);
                    break;
                case 'info':
                    console.info(consoleMessage);
                    break;
                default:
                    console.log(consoleMessage);
            }
        }
    }

    // Convenience methods
    info(message, meta = {}) {
        this.log('info', message, meta);
    }

    warn(message, meta = {}) {
        this.log('warn', message, meta);
    }

    error(message, meta = {}) {
        this.log('error', message, meta);
    }

    debug(message, meta = {}) {
        if (process.env.NODE_ENV === 'development') {
            this.log('debug', message, meta);
        }
    }

    // Request logging middleware
    requestLogger() {
        return (req, res, next) => {
            const startTime = Date.now();

            // Log request
            this.info('Request received', {
                method: req.method,
                path: req.path,
                ip: req.ip,
                userAgent: req.get('user-agent'),
                userId: req.user ? .id
            });

            // Log response when finished
            res.on('finish', () => {
                const duration = Date.now() - startTime;

                this.info('Request completed', {
                    method: req.method,
                    path: req.path,
                    statusCode: res.statusCode,
                    duration: `${duration}ms`,
                    userId: req.user ? .id
                });
            });

            next();
        };
    }

    // Error logging
    logError(error, context = {}) {
        this.error(error.message, {
            stack: error.stack,
            ...context
        });
    }

    // Database query logging
    logQuery(sql, params, duration) {
        if (process.env.NODE_ENV === 'development') {
            this.debug('Database query', {
                sql: sql.substring(0, 200), // Log only first 200 chars
                params,
                duration: `${duration}ms`
            });
        }
    }

    // Get recent logs
    getRecentLogs(limit = 100) {
        try {
            const logFile = this.getLogFilePath();

            if (!fs.existsSync(logFile)) {
                return [];
            }

            const content = fs.readFileSync(logFile, 'utf8');
            const lines = content.trim().split('\n');

            // Parse JSON lines and limit
            const logs = lines.slice(-limit).map(line => {
                try {
                    return JSON.parse(line);
                } catch {
                    return { message: line };
                }
            });

            return logs.reverse(); // Return most recent first
        } catch (error) {
            console.error('Error reading logs:', error);
            return [];
        }
    }
}

module.exports = new Logger();