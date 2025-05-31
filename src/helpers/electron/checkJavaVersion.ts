import {exec} from 'child_process';

import {REQUIRED_JAVA_VERSION} from '@/constants/electron';

/**
 * Checks Java version.
 */
export const checkJavaVersion = async () =>
  new Promise((resolve, reject) => {
    exec(
      'java -version',
      // @ts-ignore
      {stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8'},
      // @ts-ignore
      (error, _, stderr) => {
        if (error) return reject(new Error('Java needs to be installed.'));

        const versionMatch = stderr.match(/version "(\d+)\.(\d+)\.(\d+)_?(\d+)?/);

        if (!versionMatch) return reject(new Error('Unable to determine Java version.'));

        const majorVersion = parseInt(versionMatch[1], 10);
        const minorVersion = parseInt(versionMatch[2], 10);
        const patchVersion = parseInt(versionMatch[3], 10);

        if (majorVersion < REQUIRED_JAVA_VERSION) {
          return reject(new Error(`Requires Java ${REQUIRED_JAVA_VERSION} or higher.`));
        }

        resolve({majorVersion, minorVersion, patchVersion});
      }
    );
  });
