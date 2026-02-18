import path from 'path';

import { BrowserWindow, Notification, shell } from 'electron';

import type { TDownloadItem } from '@common/types';

export const handleDownload = async (event: Electron.IpcMainEvent, files: TDownloadItem[]) => {
  try {
    // Получаем или создаём ссылку на окно браузера
    let targetWindow = BrowserWindow.getFocusedWindow();

    if (!targetWindow) {
      const windows = BrowserWindow.getAllWindows();
      targetWindow = windows.length > 0 ? windows[0] : new BrowserWindow({ show: false });
    }

    const results: { savePath: string; filename: string }[] = [];

    for (const file of files) {
      const { filename, url } = file;

      try {
        const downloadOptions = {
          filename: filename || path.basename(url),
          saveAs: false, // Отключаем диалог сохранения для каждого файла
        };

        const { download } = await import('electron-dl');
        const dl = await download(targetWindow as BrowserWindow, url, downloadOptions);

        results.push({
          savePath: dl.getSavePath(),
          filename: downloadOptions.filename,
        });
      } catch (error) {
        console.error(`Failed to download ${url}:`, error);
        // Пропускаем неудачные загрузки, продолжаем со следующим файлом
      }
    }

    if (results.length === 0) {
      throw new Error('All downloads failed');
    }

    new Notification({
      title: 'Download Complete',
      body: results.length === 1 ? `Downloaded ${results[0].filename}` : `Downloaded ${results.length} files`,
    })
      .on('click', () => {
        if (results.length > 0) {
          // Открываем папку с файлом в проводнике
          shell.showItemInFolder(results[0].savePath);
        }
      })
      .show();

    event.sender.send('download-complete');
  } catch (error) {
    new Notification({
      title: 'Download Failed',
    }).show();
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during download.';
    event.sender.send('download-failed', errorMessage);
    throw error;
  }
};
