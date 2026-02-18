/**
 * A simple logger wrapper that only logs messages in development mode.
 * In production, all methods are no-ops.
 */

// A simple object that mimics the Console API
interface ILogger {
  log: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  debug: (...args: unknown[]) => void;
}

// A no-op function that does nothing.
const noOp = () => {
  /* no-op */
};

// Create a logger that does nothing in production.
const createProductionLogger = (): ILogger => ({
  log: noOp,
  warn: noOp,
  error: noOp,
  info: noOp,
  debug: noOp,
});

// Create a logger that wraps the real console in development.
const createDevelopmentLogger = (): ILogger => ({
  log: (...args) => console.log('[LOG]', ...args),
  warn: (...args) => console.warn('[WARN]', ...args),
  error: (...args) => console.error('[ERROR]', ...args),
  info: (...args) => console.info('[INFO]', ...args),
  debug: (...args) => console.debug('[DEBUG]', ...args),
});

/**
 * The logger instance.
 * It will be a real logger in development and a no-op logger in production.
 */
export const logger: ILogger =
  process.env.NODE_ENV === 'development' ? createDevelopmentLogger() : createProductionLogger();
