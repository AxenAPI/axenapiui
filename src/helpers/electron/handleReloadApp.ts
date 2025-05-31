import {BrowserWindow} from 'electron';

/**
 * Перезагружает веб-содержимое указанного окна приложения.
 * @param {BrowserWindow} mainWindow - Основное окно браузера Electron, содержимое которого будет перезагружено.
 * @returns {void}
 */
export const handleReloadApp = (mainWindow: BrowserWindow): void => {
  mainWindow.webContents.reload();
};
