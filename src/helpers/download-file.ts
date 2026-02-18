import type { TDownloadItem } from '@common/types';

import { ElectronService } from '@shared/electron/api';

// For single file download
export const downloadFile = (file: TDownloadItem) => {
  ElectronService.downloadFile(file);
};

// For multiple files download
export const downloadFiles = (files: TDownloadItem[]) => {
  ElectronService.downloadFiles(files);
};
