import fs from 'fs';

/**
 * Удаляет папку по абсолютному пути.
 * Если папка не пуста, удаляет её рекурсивно.
 *
 * @param folderPath Абсолютный путь к папке
 */
export function deleteFolder(folderPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.rm(folderPath.replaceAll('\\', '/'), {recursive: true, force: true}, err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}
