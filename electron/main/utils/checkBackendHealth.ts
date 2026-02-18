import { net } from 'electron';

import { logit } from './getLoggers';

export const checkBackendHealth = (url: string, retries = 3, delay = 1000): Promise<boolean> =>
  new Promise(resolve => {
    const attempt = (remainingRetries: number) => {
      logit.info(`Checking backend health at ${url}. Retries left: ${remainingRetries}`);
      const request = net.request(url);

      request.on('response', response => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          logit.info('Backend health check successful.');
          resolve(true);
        } else {
          logit.warn(`Backend health check returned status code: ${response.statusCode}`);
          handleRetry(remainingRetries - 1);
        }
      });

      request.on('error', error => {
        logit.error(`Backend health check failed: ${error.message}`);
        handleRetry(remainingRetries - 1);
      });

      request.end();
    };

    const handleRetry = (remainingRetries: number) => {
      if (remainingRetries > 0) {
        setTimeout(() => attempt(remainingRetries), delay);
      } else {
        logit.error('Backend health check failed after all retries.');
        resolve(false);
      }
    };

    attempt(retries);
  });
