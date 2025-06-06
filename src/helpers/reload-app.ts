/**
 * Перезагружает приложение через вызов метода `reloadApp` в electronAPI
 * @returns {void}
 */
export const reloadApp = (): void => {
  window.electronAPI.reloadApp();
};
