import fs from 'fs';
import path from 'path';

const logsDir = path.join(process.cwd(), 'logs');
const logFile = path.join(logsDir, 'app.log');
const cronLogFile = path.join(logsDir, 'cron.log');

type ErrorDetails = {
  message: string;
  stack?: string;
};

type InfoDetails = Record<string, string | number | boolean | null | undefined>;

type LogDetails = ErrorDetails | InfoDetails | string | number | boolean | null;

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const writeLog = (level: string, msg: string, details?: LogDetails) => {
  const timestamp = new Date().toISOString();
  const logEntry = JSON.stringify({ timestamp, level, msg, details }) + '\n';

  try {
    fs.appendFileSync(logFile, logEntry);
  } catch (error) {
    console.error('Failed to write log: ', error);
  }
}

export const logger = {

  info: (message: string, details?: LogDetails) => {
    writeLog('INFO', message, details);
    console.log(`[INFO] ${message}`, details || '');
  },

  error: (message: string, error: ErrorDetails) => {
    const errorDetails: ErrorDetails = {
      message: error.message,
      stack: error instanceof Error ? error.stack : error.stack
    };
    writeLog('ERROR', message, errorDetails);
    console.error(`[ERROR] ${message}`, errorDetails);
  },

  warn: (message: string, details?: LogDetails) => {
    writeLog('WARN', message, details);
    console.warn(`[WARN] ${message}`, details || '');
  }
};

export const createCronLogger = () => {
  const writeCronLog = (level: string, msg: string, details?: LogDetails) => {
    const timestamp = new Date().toISOString();
    const logEntry = JSON.stringify({ timestamp, level, msg, details }) + '\n';

    try {
      fs.appendFileSync(cronLogFile, logEntry);
    } catch (error) {
      console.error('Failed to write cron log: ', error);
    }
  }

  return {
    info: (message: string, details?: LogDetails) => {
      writeCronLog('INFO', message, details);
      console.log(`[CRON INFO] ${message}`, details || '');
    },

    error: (message: string, error: ErrorDetails) => {
      const errorDetails: ErrorDetails = {
        message: error.message,
        stack: error instanceof Error ? error.stack : error.stack
      };
      writeCronLog('ERROR', message, errorDetails);
      console.error(`[CRON ERROR] ${message}`, errorDetails);
    },

    warn: (message: string, details?: LogDetails) => {
      writeCronLog('WARN', message, details);
      console.warn(`[CRON WARN] ${message}`, details || '');
    }
  };
};