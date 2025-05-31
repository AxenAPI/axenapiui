import isDev from 'electron-is-dev';

import {app} from 'electron';
import path from 'path';

/**
 * Get in-app JDK actual path.
 */
export const getJDKPath = () => {
  switch (true) {
    case isDev:
      return path.join(process.cwd(), 'jar-files', 'jdk-21', 'bin', 'java.exe');

    case process.platform === 'darwin':
      return path.join(app.getAppPath(), 'Contents', 'Resources', 'jar-files', 'jdk-21', 'bin', 'java');

    default:
      return path.join(app.getAppPath(), '..', 'jar-files', 'jdk-21', 'bin', 'java.exe');
  }
};
