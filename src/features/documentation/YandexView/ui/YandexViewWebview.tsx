import { RefObject } from 'react';

import { YANDEX_VIEW_URL } from '@/constants/common';

interface YandexViewWebviewProps {
  webviewRef: RefObject<Electron.WebviewTag>;
}

export const YandexViewWebview = ({ webviewRef }: YandexViewWebviewProps) => (
  <webview
    ref={webviewRef}
    src={YANDEX_VIEW_URL}
    className="h-full flex-1 border-none"
    partition="persist:yandex"
    webpreferences="nodeIntegration=no, contextIsolation=yes, devTools=yes"
  />
);
