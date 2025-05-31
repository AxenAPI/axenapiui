import kill from 'tree-kill';

import {appExitLogger} from './getLoggers';

/**
 * Kill process by pid.
 *
 * @param {number} pid Process ID.
 */
export const killProcess = (pid: number) => {
  appExitLogger.info('App exited');
  appExitLogger.info('Core pid: ', pid);

  kill(pid);
};
