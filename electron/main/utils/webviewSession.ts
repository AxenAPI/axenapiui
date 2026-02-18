import { session } from 'electron';

export function setupYandexWebviewSession() {
  const yandexSession = session.fromPartition('persist:yandex');

  yandexSession.webRequest.onHeadersReceived((details, callback) => {
    const newHeaders = { ...details.responseHeaders };

    // Удаляем заголовки безопасности
    delete newHeaders['content-security-policy'];
    delete newHeaders['x-frame-options'];

    callback({ responseHeaders: newHeaders });
  });
}
