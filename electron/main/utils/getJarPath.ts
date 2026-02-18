import fs from 'fs';
import path from 'path';

import packageJson from '@packageJson';

import { logit } from './getLoggers';

const projectVersion = packageJson.version;

/**
 * Get actual path to the JAR file inside jar-files directory.
 * - Dev: process.cwd()/jar-files
 * - Prod: process.resourcesPath/jar-files
 */
export function getJarPath() {
  logit.info(`Default process.env.NODE_ENV is`, process.env.NODE_ENV, `process.env.PREVIEW is`, process.env.PREVIEW);
  const isDev = process.env.NODE_ENV === 'development' || process.env.PREVIEW === 'true';
  logit.info(`Setted process.env.NODE_ENV is`, process.env.NODE_ENV, `process.env.PREVIEW is`, process.env.PREVIEW);

  logit.info('process.cwd() is', process.cwd(), 'process.resourcesPath is', process.resourcesPath);
  const baseDir = isDev ? path.join(process.cwd(), 'jar-files') : path.join(process.resourcesPath, 'jar-files');

  logit.info('[JAR RESOLVER] Base directory:', baseDir);
  logit.info('[JAR RESOLVER] Project version:', projectVersion);

  if (!fs.existsSync(baseDir)) {
    logit.error('[JAR RESOLVER] Directory not found:', baseDir);
    throw new Error(`[JAR RESOLVER] Directory not found: ${baseDir}`);
  }

  const files = fs.readdirSync(baseDir);

  const exactRegex = new RegExp(`^axenapi-web-${projectVersion}.*\\.jar$`);
  let jarFile = files.find(f => exactRegex.test(f));

  if (!jarFile) {
    logit.warn(
      `[JAR RESOLVER] No JAR found for exact version ${projectVersion}. Trying to find any available version.`
    );
    const fallbackRegex = new RegExp(`^axenapi-web-.*\\.jar$`);
    jarFile = files.find(f => fallbackRegex.test(f));

    if (jarFile) {
      logit.warn(`[JAR RESOLVER] Found fallback JAR: ${jarFile}. Using this version.`);
    }
  }

  if (!jarFile) {
    logit.error('[JAR RESOLVER] No JAR found in directory:', baseDir);
    throw new Error(`[JAR RESOLVER] No JAR found in directory: ${baseDir}`);
  }

  const fullPath = path.join(baseDir, jarFile);

  return fullPath;
}
