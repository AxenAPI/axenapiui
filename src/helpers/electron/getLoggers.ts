import {createLogger} from './createLogger';

const coreLogger = createLogger('coreLogger', 'logs/core.log');
const appExitLogger = createLogger('appExitLogger', 'logs/app-exit.log');
const coreErrorLogger = createLogger('coreErrorLogger', 'logs/core-error.log');

export {coreLogger, appExitLogger, coreErrorLogger};
