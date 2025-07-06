import fs from 'fs';

/**
 * Создает файл с указанным содержимым по абсолютному пути.
 * Если файл уже существует, перезапишет его.
 *
 * @param filePath Абсолютный путь к файлу
 * @param content Данные для записи (строка или буфер)
 */
export function createFile(filePath: string, content: string = 'Empty file'): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath.replaceAll('\\', '/'), content, err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}
