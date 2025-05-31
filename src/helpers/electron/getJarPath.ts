import isDev from 'electron-is-dev';

import path from 'path';

/**
 * Get jar-file actual path.
 */
export const getJarPath = () => {
  switch (true) {
    case isDev:
      return path.join(process.cwd(), 'jar-files', 'axenapi-web-1.0-SNAPSHOT.jar');

    case process.platform === 'darwin':
      return path.join(process.cwd(), 'Contents', 'Resources', 'jar-files', 'axenapi-web-1.0-SNAPSHOT.jar');

    default:
      return path.join(process.cwd(), 'resources', 'jar-files', 'axenapi-web-1.0-SNAPSHOT.jar');
  }
};
