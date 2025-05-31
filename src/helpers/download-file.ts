import {TDownloadItem} from '@/types/common';

// For single file download
export const downloadFile = (file: TDownloadItem) => {
  window.electronAPI.downloadFile(file);
};

// For multiple files download
export const downloadFiles = (files: TDownloadItem[]) => {
  window.electronAPI.downloadFiles(files);
};
