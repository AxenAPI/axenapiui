import {expect, Page} from '@playwright/test';

import path from 'path';

import {test} from '../electron.fixture';
import {getDiagramState, uploadFile} from '../helpers/diagramHelpers';

test.describe('scenario for deleting all elements', () => {
  let page: Page;
  test.beforeAll(async ({page: appPage}) => {
    page = appPage;

    const filePath = path.join(
      __dirname,
      '../mocks/import-files/service_no_common_consume_topics_common_events_common_outgoing_topics_with_tags_1.json'
    );
    await uploadFile(page, [filePath]);
  });

  test('should delete all elements from diagram', async () => {
    // Ожидаем успешного импорта
    await page.locator('.ant-notification-notice-success').waitFor({state: 'visible'});

    const {edgesCount, serviceNodeCount, topicNodeCount} = await getDiagramState(page);

    expect(edgesCount).toBeGreaterThan(0);
    expect(serviceNodeCount).toBeGreaterThan(0);
    expect(topicNodeCount).toBeGreaterThan(0);

    const buttonsWrapper = page.locator('.react-flow__controls');
    await buttonsWrapper.locator('button[data-testid="delete-all-btn"]').click();

    const deleteAllModal = page.getByRole('dialog');
    await deleteAllModal.waitFor();
    await expect(deleteAllModal).toBeInViewport();

    await page.locator('button', {hasText: 'Delete all'}).click();
    const {
      edgesCount: finalEdgesCount,
      serviceNodeCount: finalServiceNodeCount,
      topicNodeCount: finalTopicNodeCount,
    } = await getDiagramState(page);

    expect(finalEdgesCount).toBe(0);
    expect(finalServiceNodeCount).toBe(0);
    expect(finalTopicNodeCount).toBe(0);

    const successDeleteNotification = page.locator('.ant-notification-notice-success', {hasText: 'Deletion completed'});
    await expect(successDeleteNotification).toBeVisible();
  });
});
