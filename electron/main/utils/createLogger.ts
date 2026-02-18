import path from 'path';

import { app } from 'electron';
import log from 'electron-log';

/**
 * Create logger with ID.
 *
 * @param {string} logId Logger id.
 * @param {string} logPath Where to save logs.
 */
export const createLogger = (logId: string, logPath: string) => {
  const logger = log.create({ logId });

  // Куда сохраняем файл
  const base = app.isPackaged ? app.getPath('userData') : path.join(__dirname, '../..');
  logger.transports.file.resolvePathFn = () => path.join(base, logPath);

  // Уровни логирования
  logger.transports.file.level = 'info'; // в файл пишем info+ ошибки
  logger.transports.console.level = 'debug'; // в консоль пишем debug+info+ошибки

  // Опционально: форматирование
  logger.transports.file.format = '{y}-{m}-{d} {h}:{i}:{s} [{level}] {text}';

  // Отключаем буферизацию для немедленной записи
  logger.transports.file.sync = true;

  return logger;
};
