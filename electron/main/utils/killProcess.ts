import kill from 'tree-kill';

import { logit } from './getLoggers';

/**
 * Kill process by pid.
 *
 * @param {number} pid Process ID.
 */
export const killProcess = (pid: number) => {
  logit.info('App exited');

  kill(pid);
};
