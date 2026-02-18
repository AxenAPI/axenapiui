import { ElectronApplication, test as base } from '@playwright/test';

import { closeElectronApp, launchElectronApp } from './electron-test-utils';

export const test = base.extend<{ page: ElectronApplication }>({
  page: async ({}, use) => {
    let app: ElectronApplication | undefined;
    try {
      const { app: launchedApp, window } = await launchElectronApp();
      app = launchedApp;
      await use(window);
    } catch {
      if (app) {
        await closeElectronApp(app);
      }
    }
  },
});
