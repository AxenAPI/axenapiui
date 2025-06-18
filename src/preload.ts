// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import ELK, {type ElkNode} from 'elkjs/lib/elk.bundled.js';

import {ipcRenderer, contextBridge} from 'electron';

import {TDownloadItem} from '@/types/common';

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
  getRepoTree: (repoPath: string) => ipcRenderer.invoke('get-repo-tree', repoPath),
  readFile: (path: string) => ipcRenderer.invoke('read-file', path),
  writeFile: (filePath: string, content: string) => ipcRenderer.invoke('write-file', filePath, content),
  sendSplashReady: () => ipcRenderer.send('splash-ready'),
  createFolder: (folderPath: string) => ipcRenderer.invoke('create-folder', folderPath),
  deleteFolder: (folderPath: string) => ipcRenderer.invoke('delete-folder', folderPath),
  createFile: (filePath: string, content: string) => ipcRenderer.invoke('create-file', filePath, content),
  deleteFile: (filePath: string) => ipcRenderer.invoke('delete-file', filePath),
  renameFile: (oldFileName: string, newFileName: string, directory: string) =>
    ipcRenderer.invoke('rename-file', oldFileName, newFileName, directory),
});

// При импорте возникает ошибка "require is not defined"
// Поэтому создание экземляра перенесено в preload.ts
const elk = new ELK();

contextBridge.exposeInMainWorld('elk', {
  layout: async (graph: ElkNode) => elk.layout(graph),
});
