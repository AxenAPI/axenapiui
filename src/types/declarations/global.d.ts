import {type ElkNode} from 'elkjs/lib/elk.bundled.js';

import {DocNodes, TDownloadItem} from '@/types/common';

declare global {
  interface Window {
    elk: {
      layout: (graph: ElkNode) => Promise<ElkNode>;
    };
    electronAPI: {
      downloadFile: (file: TDownloadItem) => void;
      downloadFiles: (files: TDownloadItem[]) => void;
      reloadApp: () => void;
      getRepoTree: (path: string) => Promise<DocNodes[]>;
      readFile: (path: string) => Promise<{
        success: boolean;
        content?: string;
        error?: string;
      }>;
      writeFile: (
        filePath: string,
        content: string
      ) => Promise<{
        success: boolean;
        error?: string;
      }>;
      createFile: (
        filePath: string,
        content: string
      ) => Promise<{
        success: boolean;
        error?: string;
      }>;
      deleteFile: (filePath: string) => Promise<{
        success: boolean;
        error?: string;
      }>;
      renameFile: (
        oldFileName: string,
        newFileName: string,
        directory: string
      ) => Promise<{
        success: boolean;
        error?: string;
      }>;
      createFolder: (folderPath: string) => Promise<{
        success: boolean;
        error?: string;
      }>;
      deleteFolder: (folderPath: string) => Promise<{
        success: boolean;
        error?: string;
      }>;
      sendSplashReady: () => void;
    };
  }
}
