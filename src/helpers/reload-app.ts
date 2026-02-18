import { ElectronService } from '@shared/electron/api';

/**
 * Перезагружает приложение через вызов метода `reloadApp` в electronAPI
 * @returns {void}
 */
export const reloadApp = (): void => {
  ElectronService.reloadApp();
};
