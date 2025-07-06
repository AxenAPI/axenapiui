import {healthGetFx} from '@/models/MainModel';

const INTERVAL = 5000;

/**
 * Функция проверки готовности сборки бека
 */
export async function checkServiceHealth() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const res = await healthGetFx();
      if (res.status === 200) {
        window.electronAPI.sendSplashReady();
        return;
      }
    } catch (error) {
      console.error('Health check error:', error);
      // Можно делать лог или retry
    }
    // eslint-disable-next-line no-await-in-loop
    await new Promise(resolve => {
      setTimeout(resolve, INTERVAL);
    });
  }
}
