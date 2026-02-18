/**
 * Извлекает путь к директории из полного пути к файлу.
 * Например: 'path/to/file.md' -> 'path/to'
 * @param filePath - Полный путь к файлу (может включать имя файла и расширение)
 * @returns Путь к директории без имени файла
 */
export const getDirectoryPath = (filePath: string): string => filePath.split('/').slice(0, -1).join('/');
