import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir: './test/specs',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 2,
  outputDir: './test/test-results',
  timeout: 120_000,
  use: {
    screenshot: 'off',
    video: 'off',
    trace: 'off',
    actionTimeout: 5000,
  },
});
