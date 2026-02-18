import { BeforeSendResponse, webContents } from 'electron';
import log from 'electron-log/main.js';

import type { YandexHeaders } from '@common/types';

export async function handleCaptureYandexHeaders(webContentsId: number): Promise<YandexHeaders | null> {
  const wc = webContents.fromId(webContentsId);

  if (!wc) {
    log.error(`[CaptureHelper] WebContents with ID ${webContentsId} not found.`);
    return null;
  }

  return new Promise<YandexHeaders | null>(resolve => {
    const latestCapturedHeaders: YandexHeaders = {
      'x-csrf-token': '',
      'x-org-id': '',
      'x-collab-org-id': '',
      'cookie': '',
    };

    let headersCaptured = false;

    const listener = (
      details: Electron.OnBeforeSendHeadersListenerDetails,
      callback: (response: BeforeSendResponse) => void
    ) => {
      const { requestHeaders, url } = details;

      if (
        !url.includes('wiki.yandex.ru/.gateway/root/wiki/getPageDetails') &&
        !url.includes('wiki.yandex.ru/.gateway/root/wiki/getPageBackgrounds') &&
        !url.includes('wiki.yandex.ru/.gateway/root/wiki/openNavigationTreeNode') &&
        !url.includes('wiki.yandex.ru/.gateway/root/notify/checkNew')
      ) {
        return callback({ cancel: false, requestHeaders });
      }

      const captured: YandexHeaders = {
        'x-csrf-token': requestHeaders['X-CSRF-Token'] || requestHeaders['x-csrf-token'] || '',
        'x-org-id': requestHeaders['x-org-id'] || '',
        'x-collab-org-id': requestHeaders['x-collab-org-id'] || '',
        'cookie': requestHeaders.Cookie || requestHeaders.cookie || '',
      };

      const missing = Object.entries(captured)
        .filter(entry => !entry[1])
        .map(entry => entry[0]);

      if (missing.length > 0) {
        log.warn('⚠️ Не все заголовки найдены:', missing);
      } else {
        log.info('✅ Все нужные заголовки найдены');
      }

      const safeLog = { ...captured, cookie: captured.cookie ? '[HIDDEN]' : undefined };

      log.info('📦 Headers (safe):', safeLog);

      Object.entries(captured).forEach(([key, value]) => {
        if (value !== '') {
          latestCapturedHeaders[key as keyof YandexHeaders] = value;
        }
      });

      if (
        latestCapturedHeaders['x-csrf-token'] &&
        latestCapturedHeaders['x-org-id'] &&
        latestCapturedHeaders['x-collab-org-id'] &&
        latestCapturedHeaders.cookie
      ) {
        if (!headersCaptured) {
          headersCaptured = true;
          log.info('✅ Headers captured.');

          wc.session.webRequest.onBeforeSendHeaders(null);
          resolve(latestCapturedHeaders);
        }
      }
      callback({ cancel: false, requestHeaders });
    };

    wc.session.webRequest.onBeforeSendHeaders(listener);

    wc.once('destroyed', () => {
      if (!headersCaptured) {
        log.warn(
          `[CaptureHelper] 🛑 WebContents ${webContentsId} destroyed before capturing headers. Resolving with null.`
        );
        resolve(null);
      }
    });
  });
}
