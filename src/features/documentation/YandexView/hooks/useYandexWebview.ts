import { useUnit } from 'effector-react';
import { useEffect, useRef, useState } from 'react';

import { ElectronService } from '@shared/electron/api';
import { logger } from '@shared/lib/logger';

import { yandexViewModel } from '../model/yandexView.model';

export const useYandexWebview = () => {
  const model = useUnit({
    isOpened: yandexViewModel.stores.$isYandexViewDrawerOpen,
    close: yandexViewModel.events.closeYandexViewDrawer,
    urlChanged: yandexViewModel.events.urlChanged,
    isReadyForImport: yandexViewModel.stores.$isReadyForImport,
    importSelected: yandexViewModel.events.importSelected,
    cancelImport: yandexViewModel.events.cancelImport,
  });

  const webviewRef = useRef<Electron.WebviewTag>(null);
  const [isCapturingHeaders, setIsCapturingHeaders] = useState(false);

  useEffect(() => {
    if (!model.isOpened || !webviewRef.current) return;

    const webview = webviewRef.current;

    const handleDidStopLoading = () => {
      model.urlChanged(webview.getURL());
    };

    const handleDidFailLoad = (event: Electron.DidFailLoadEvent) => {
      logger.error('[Webview] Failed to load:', event.errorCode, event.errorDescription, event.validatedURL);
    };

    webview.addEventListener('did-stop-loading', handleDidStopLoading);
    webview.addEventListener('did-fail-load', handleDidFailLoad);

    return () => {
      webview.removeEventListener('did-stop-loading', handleDidStopLoading);
      webview.removeEventListener('did-fail-load', handleDidFailLoad);
    };
  }, [model]);

  const handleImportClick = async () => {
    if (!webviewRef.current) return;

    const currentUrl = webviewRef.current.getURL();
    const webContentsId = webviewRef.current.getWebContentsId();

    if (webContentsId) {
      setIsCapturingHeaders(true);
      webviewRef.current.reload();
      try {
        const capturedHeaders = await ElectronService.captureWebviewHeaders(webContentsId);
        if (capturedHeaders) {
          model.importSelected({ yandexWikiUrl: currentUrl, yandexHeaders: capturedHeaders });
        } else {
          logger.error('Failed to capture Yandex headers.');
        }
      } catch (error) {
        logger.error('Error during header capture:', error);
      } finally {
        setIsCapturingHeaders(false);
      }
    } else {
      logger.error('WebContents ID not available for webview.');
    }
  };

  return {
    ...model,
    webviewRef,
    handleImportClick,
    isCapturingHeaders,
  };
};
