import {REQUIRED_JAVA_VERSION} from '@/constants/electron';

/**
 * Get Java error message.
 *
 * @param {{code?: string; message?: string}} error Error info.
 */
export const getJavaErrorMessage = (error: {code?: string; message?: string}) =>
  error.code === 'ENOENT'
    ? `Java is not installed. Please install Java ${REQUIRED_JAVA_VERSION} or higher.\nWant to restart?`
    : `An error occurred while checking Java version: ${error.message}.\nWant to restart?`;
