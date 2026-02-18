import { FileSystemResponse, ReadFileResponse, TDownloadItem, TreeItemProps, YandexHeaders } from '@common/types';

/**
 * Сервис для взаимодействия с API Electron.
 * Является оберткой над `window.electronAPI` для изоляции зависимостей от Electron
 * и предоставления типизированного и документированного интерфейса для остального приложения.
 */
export class ElectronService {
  /**
   * Инициирует загрузку одного файла.
   * @param {TDownloadItem} file - Объект с информацией о файле для загрузки.
   */
  static downloadFile(file: TDownloadItem): void {
    return window.electronAPI.downloadFile(file);
  }

  /**
   * Инициирует загрузку нескольких файлов.
   * @param {TDownloadItem[]} files - Массив объектов с информацией о файлах для загрузки.
   */
  static downloadFiles(files: TDownloadItem[]): void {
    return window.electronAPI.downloadFiles(files);
  }

  /**
   * Перезагружает приложение Electron.
   */
  static reloadApp(): void {
    return window.electronAPI.reloadApp();
  }

  static openUrl(url: string): Promise<void> {
    return window.electronAPI.openUrl(url);
  }

  /**
   * Читает содержимое файла.
   * @param {string} path - Путь к файлу.
   * @returns {Promise<ReadFileResponse>} - Промис, который разрешается объектом с содержимым файла или ошибкой.
   */
  static readFile(path: string): Promise<ReadFileResponse> {
    return window.electronAPI.readFile(path);
  }

  /**
   * Записывает содержимое в файл.
   * @param {string} filePath - Путь к файлу.
   * @param {string} content - Содержимое для записи.
   * @returns {Promise<FileSystemResponse>} - Промис, который разрешается после завершения записи.
   */
  static writeFile(filePath: string, content: string): Promise<FileSystemResponse> {
    return window.electronAPI.writeFile(filePath, content);
  }

  /**
   * Отправляет сигнал о готовности splash-экрана.
   */
  static sendSplashReady(): void {
    return window.electronAPI.sendSplashReady();
  }

  /**
   * Загрузить следующий уровень дерева.
   * @param {string} id - Идентификатор папки.
   * @param {string} repoPath - Путь репозитория.
   * @returns {Promise<TreeItemProps[]>} - Промис, который разрешается после переименования.
   */
  static loadTreeNextLevel(id: string, repoPath: string): Promise<TreeItemProps[]> {
    return window.electronAPI.loadTreeNextLevel(id, repoPath);
  }

  /**
   * Инициирует импорт из Yandex Wiki.
   * @param {string} repoPath - Путь к репозиторию, куда будут сохранены файлы.
   * @param {string} yandexWikiUrl - URL страницы Yandex Wiki для импорта.
   * @param {YandexHeaders} yandexHeaders - Заголовки аутентификации Yandex Wiki.
   */
  static startYandexImport(repoPath: string, yandexWikiUrl: string, yandexHeaders: YandexHeaders): Promise<void> {
    return window.electronAPI.startYandexImport(repoPath, yandexWikiUrl, yandexHeaders);
  }

  /**
   * Подписывается на события от main-процесса Electron.
   * @param {string} channel - Имя канала для прослушивания.
   * @param {(...args: unknown) => void} callback - Функция обратного вызова.
   */
  static on<T extends unknown[]>(channel: string, callback: (...args: T) => void): void {
    return window.electronAPI.on(channel, callback as (...args: T) => void);
  }

  /**
   * Инициирует захват заголовков аутентификации Yandex Wiki для указанного webview.
   * @param {number} webContentsId - ID webContents webview, из которого нужно захватить заголовки.
   * @returns {Promise<YandexHeaders | null>} - Промис, который разрешается захваченными заголовками или null,
   * если захват не удался.
   */
  static captureWebviewHeaders(webContentsId: number): Promise<YandexHeaders | null> {
    return window.electronAPI.captureWebviewHeaders(webContentsId);
  }

  static onBackendReady(callback: () => void): void {
    return window.electronAPI.onBackendReady(callback);
  }
}
