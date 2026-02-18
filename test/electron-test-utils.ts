import path from 'path';

import { _electron as electron, ElectronApplication, Page } from '@playwright/test';
import { BrowserWindow } from 'electron';

import { logger } from '@shared/lib/logger';

export async function launchElectronApp(): Promise<{ app: ElectronApplication; window: Page }> {
  const mainProcessPath = path.resolve(__dirname, '../.webpack/x64/main');

  logger.log(`Main process path: ${mainProcessPath}`);

  const app = await electron.launch({
    args: [mainProcessPath],
  });

  const window = await app.firstWindow();

  // Открываем DevTools
  const browserWindow = await app.browserWindow(window);
  await browserWindow.evaluate(async (electronApp: BrowserWindow) => {
    electronApp.webContents.openDevTools();
  });

  if (!window) {
    throw new Error('Failed to retrieve the first window of the Electron app.');
  }

  await window.waitForLoadState('domcontentloaded');
  logger.log(`App is fully loaded`);

  return { app, window };
}

export async function closeElectronApp(app: ElectronApplication) {
  logger.log('Closing Electron app...');
  await app.close();
}
