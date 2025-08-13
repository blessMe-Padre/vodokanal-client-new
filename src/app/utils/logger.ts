import fs from 'fs';
import path from 'path';

const logsDir = path.join(process.cwd(), 'logs');
const logFile = path.join(logsDir, 'app.log');

if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const writeLog = (level: string, msg: string, details?: any) => {
    const timestamp = new Date().toISOString();
    const logEntry = JSON.stringify({ timestamp, level, msg, details }) + '\n';

    try {
        fs.appendFileSync(logFile, logEntry)
    } catch (error) {
        console.error('Failed to write log: ', error);
    }
}

export const logger = {
  info: (message: string, details?: any) => {
    writeLog('INFO', message, details);
    console.log(`[INFO] ${message}`, details || '');
  },
  error: (message: string, error: any) => {
    const errorDetails = {
      message: error.message,
      stack: error.stack
    };
    writeLog('ERROR', message, errorDetails);
    console.error(`[ERROR] ${message}`, errorDetails);
  },
  warn: (message: string, details?: any) => {
    writeLog('WARN', message, details);
    console.warn(`[WARN] ${message}`, details || '');
  }
};