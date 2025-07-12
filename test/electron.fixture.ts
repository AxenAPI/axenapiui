import {ElectronApplication, test as base} from '@playwright/test';

import {launchElectronApp, closeElectronApp} from './electron-test-utils';

export const test = base.extend<{page: ElectronApplication}>({
  // eslint-disable-next-line no-empty-pattern
  page: async ({}, use) => {
    let app: ElectronApplication | undefined;
    try {
      const {app: launchedApp, window} = await launchElectronApp();
      app = launchedApp;
      await use(window);
    } catch {
      if (app) {
        await closeElectronApp(app);
      }
    }
  },
});
