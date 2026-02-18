import { contextBridge, ipcRenderer } from 'electron';

import { YANDEX_WEBVIEW } from '@common/constants';
import type { TDownloadItem, YandexHeaders } from '@common/types';

contextBridge.exposeInMainWorld('elk', {
  layout: (graph: unknown) => ipcRenderer.invoke('elk-layout', graph),
});

contextBridge.exposeInMainWorld('electronAPI', {
  downloadFile: (file: TDownloadItem) => {
    ipcRenderer.send('download', [file]);
  },
  downloadFiles: (files: TDownloadItem[]) => {
    ipcRenderer.send('download', files);
  },
  reloadApp: () => {
    ipcRenderer.send('reload-app');
  },
  readFile: (path: string) => ipcRenderer.invoke('read-file', path),
  writeFile: (filePath: string, content: string) => ipcRenderer.invoke('write-file', filePath, content),
  sendSplashReady: () => ipcRenderer.send('splash-ready'),
  openUrl: (url: string) => ipcRenderer.invoke('open-url', url),
  startYandexImport: (repoPath: string, yandexWikiUrl: string, yandexHeaders: YandexHeaders) => {
    ipcRenderer.send('start-yandex-import', { destination: repoPath, yandexWikiUrl, yandexHeaders });
  },
  on: <T extends unknown[]>(channel: string, callback: (...args: T) => void) => {
    ipcRenderer.on(channel, (event, ...args: T) => callback(...args));
  },
  captureWebviewHeaders: (webContentsId: number) => ipcRenderer.invoke(YANDEX_WEBVIEW.CAPTURE_HEADERS, webContentsId),
  onBackendReady: (callback: () => void) => ipcRenderer.on('backend-ready', callback),
});
