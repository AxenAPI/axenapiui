import fs from 'fs';

/**
 * Создает папку по абсолютному пути.
 * Если папка уже существует, ничего не делает.
 *
 * @param folderPath Абсолютный путь к папке
 */
export function createFolder(folderPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.mkdir(folderPath.replaceAll('\\', '/'), {recursive: true}, err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}
