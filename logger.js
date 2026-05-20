const fs = require('fs');
const path = require('path');
const winston = require('winston');

// Ensure the logs directory exists
const logDir = './logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Create Winston logger
const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.File({ filename: path.join(logDir, 'bot.log') }),
        new winston.transports.Console()
    ]
});

// Export the logger so it can be used anywhere
module.exports = logger;
