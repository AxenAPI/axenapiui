import {download} from 'electron-dl';

import {BrowserWindow, Notification, shell} from 'electron';
import path from 'path';

import {TDownloadItem} from '@/types/common';

export const handleDownload = async (event: Electron.IpcMainEvent, files: TDownloadItem[]) => {
  try {
    // Получаем или создаём ссылку на окно браузера
    let targetWindow = BrowserWindow.getFocusedWindow();
    if (!targetWindow) {
      const windows = BrowserWindow.getAllWindows();
      targetWindow = windows.length > 0 ? windows[0] : new BrowserWindow({show: false});
    }

    // Обрабатываем загрузки последовательно, чтобы избежать проблем с окнами браузера
    const results = await files.reduce(async (accumulatorPromise, {filename, url}) => {
      const accumulator = await accumulatorPromise;

      try {
        const downloadOptions = {
          filename: filename || path.basename(url),
          saveAs: false, // Отключаем диалог сохранения для каждого файла
        };

        const dl = await download(targetWindow as BrowserWindow, url, downloadOptions);
        return [
          ...accumulator,
          {
            savePath: dl.getSavePath(),
            filename: downloadOptions.filename,
          },
        ];
      } catch (error) {
        console.error(`Failed to download ${url}:`, error);
        return accumulator; // Пропускаем неудачные загрузки
      }
    }, Promise.resolve([]));

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
    event.sender.send('download-failed', error.message);
    throw error;
  }
};
