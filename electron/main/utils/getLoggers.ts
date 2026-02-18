import { createLogger } from './createLogger';

const coreLogger = createLogger('coreLogger', 'logs/core.log');
const appExitLogger = createLogger('appExitLogger', 'logs/app-exit.log');
const coreErrorLogger = createLogger('coreErrorLogger', 'logs/core-error.log');

export { coreLogger, appExitLogger, coreErrorLogger };

// Дублируем в appExitLogger и консоль
export const logit = {
  error: (...params: unknown[]) => {
    console.error(...params);
    appExitLogger.error(params);
  },
  warn: (...params: unknown[]) => {
    console.warn(...params);
    appExitLogger.warn(params);
  },
  info: (...params: unknown[]) => {
    console.info(...params);
    appExitLogger.info(params);
  },
  verbose: (...params: unknown[]) => {
    console.log(...params);
    appExitLogger.verbose(params);
  },
  debug: (...params: unknown[]) => {
    console.debug(...params);
    appExitLogger.debug(params);
  },
  silly: (...params: unknown[]) => {
    console.log(...params);
    appExitLogger.silly(params);
  },
  log: (...params: unknown[]) => {
    console.log(...params);
    appExitLogger.log(params);
  },
};
