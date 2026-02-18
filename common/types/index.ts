export type TDownloadItem = {
  filename: string;
  url: string;
};

export interface YandexHeaders {
  'x-csrf-token': string;
  'x-org-id': string;
  'x-collab-org-id': string;
  'cookie': string;
}

/**
 * Определяет интерфейс для ответа от файловых операций Electron.
 */
export interface FileSystemResponse {
  success: boolean;
  error?: string;
}

/**
 * Определяет интерфейс для ответа от операции чтения файла.
 */
export interface ReadFileResponse extends FileSystemResponse {
  content?: string;
}

export interface TreeItemProps {
  id: string;
  title: string;
  url?: string;
  children?: TreeItemProps[];
  contentPath?: string;
  level?: number;
  onItemClick?: (id: string, url?: string) => void;
  hasLazyChildren?: boolean;
  repoPath: string;
}

/**
 * Интерфейс для Electron API, доступного через `window.electronAPI`.
 * Определен здесь для изоляции типов и обеспечения строгой типизации.
 */
export interface ElectronApi {
  downloadFile: (file: TDownloadItem) => void;
  downloadFiles: (files: TDownloadItem[]) => void;
  reloadApp: () => void;
  readFile: (path: string) => Promise<ReadFileResponse>;
  writeFile: (filePath: string, content: string) => Promise<FileSystemResponse>;
  sendSplashReady: () => void;
  openUrl: (url: string) => Promise<void>;
  loadTreeNextLevel: (id: string, repoPath: string) => Promise<TreeItemProps[]>;
  startYandexImport: (repoPath: string, yandexWikiUrl: string, yandexHeaders: YandexHeaders) => Promise<void>;
  on: <T extends unknown[]>(channel: string, callback: (...args: T) => void) => void;
  captureWebviewHeaders: (webContentsId: number) => Promise<YandexHeaders | null>;
  onBackendReady: (callback: () => void) => void;
}
