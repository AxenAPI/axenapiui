import fs from 'fs';

/**
 * Удаляет файл по абсолютному пути.
 *
 * @param filePath Абсолютный путь к файлу
 */
export function deleteFile(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath.replaceAll('\\', '/'), err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}
