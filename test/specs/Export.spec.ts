import {expect, Page} from '@playwright/test';

import path from 'path';

import {test} from '../electron.fixture';
import {uploadFile} from '../helpers/diagramHelpers';

test.describe('scenario for export services spec files', () => {
  let page: Page;
  test.beforeAll(async ({page: appPage}) => {
    page = appPage;

    const filePath = path.join(
      __dirname,
      '../mocks/import-files/service_no_common_consume_topics_common_events_common_outgoing_topics_with_tags_1.json'
    );
    await uploadFile(page, [filePath]);
  });

  test('should be enabled export button if services selected', async () => {
    await page.locator('.ant-notification-notice-success').waitFor({state: 'visible'});

    await page.click('button:has-text("Export")');

    const drawer = page.locator('.ant-drawer');
    await expect(drawer).toBeVisible();

    const serviceItems = page.locator('.ant-checkbox-wrapper');
    await expect(serviceItems).not.toHaveCount(0);

    const exportBtn = page.locator('.ant-drawer button:has-text("Export")');
    await exportBtn.isDisabled();

    const firstCheckbox = page.locator('.ant-checkbox-input').first();

    await firstCheckbox.check();
    await exportBtn.isEnabled();
  });
});
