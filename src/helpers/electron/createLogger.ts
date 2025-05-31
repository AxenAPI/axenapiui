import log from 'electron-log/main';

import path from 'path';

/**
 * Create logger with ID.
 *
 * @param {string} logId Logger id.
 * @param {string} logPath Where to save logs.
 */
export const createLogger = (logId: string, logPath: string) => {
  log.initialize();

  const logger = log.create({logId});

  logger.transports.file.resolvePathFn = () => path.join(__dirname, '../..', logPath);

  return logger;
};
