import {expect} from '@playwright/test';

import {test} from '../electron.fixture';

test.describe('/src/pages/ModelerPage.tsx', () => {
  test('should render all main page elements', async ({page}) => {
    const visualiserPage = page.locator('div[data-testid="modeler-page"]');
    const sidebar = page.locator('div[data-testid="sidebar"]');
    const header = page.locator('header[data-testid="header"]');
    const diagram = page.locator('div[data-testid="diagram"]');

    await expect(visualiserPage).toBeVisible();
    await expect(sidebar).toBeVisible();
    await expect(header).toBeVisible();
    await expect(diagram).toBeVisible();
  });
});
