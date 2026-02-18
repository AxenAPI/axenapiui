import fs from 'fs';
import path from 'path';

import { logit } from './getLoggers';

const getOsForJdk = () => {
  switch (process.platform) {
    case 'darwin':
      return 'mac';
    case 'win32':
      return 'win';
    case 'linux':
      return 'linux';
    default:
      return process.platform;
  }
};

/**
 * Get in-app JDK actual path.
 */
export const getJDKPath = () => {
  logit.info('[JDK PATH] Using JDK path calculation...');
  const isDev = process.env.NODE_ENV === 'development' || process.env.PREVIEW === 'true';
  const javaExecutable = process.platform === 'win32' ? 'java.exe' : 'java';

  let jdkBasePath;

  if (isDev) {
    const osSubDir = getOsForJdk();
    jdkBasePath = path.join(process.cwd(), 'jar-files', 'jdk', osSubDir, process.arch);
  } else {
    logit.info('[JDK PATH] Production mode detected.', process.resourcesPath);
    jdkBasePath = path.join(process.resourcesPath, 'jar-files', 'jdk');
  }

  let finalJdkPath = path.join(jdkBasePath, 'Contents', 'Home', 'bin', javaExecutable);

  if (!fs.existsSync(finalJdkPath)) {
    finalJdkPath = path.join(jdkBasePath, 'bin', javaExecutable);
  }

  logit.info('[JDK PATH] Using JDK path:', finalJdkPath);
  return { finalJdkPath, isDev };
};
