import {expect, Page} from '@playwright/test';

import {test} from '../electron.fixture';
import {addEvent, addHttpNode, addService, addTopic, getDiagramState} from '../helpers/diagramHelpers';
import {getSidebarMenuItems, getSidebarState} from '../helpers/sidebarHelpers';

test.describe('scenarios for deleting items by category', () => {
  const deleteAllTestFactory = (
    itemName: string,
    addItemAction: (page: Page) => Promise<void>,
    sidebarBlockKey: 'serviceBlock' | 'topicBlock' | 'httpBlock' | 'eventsBlock',
    nodeCountKey: 'serviceNodeCount' | 'topicNodeCount' | 'httpNodeCount',
    sidebarCountKey: 'serviceItemsCount' | 'topicItemsCount' | 'eventItemsCount' | 'httpItemsCount'
  ) => {
    test(`should delete all ${itemName} via sidebar`, async ({page}) => {
      await addItemAction(page);
      await addItemAction(page);

      const {[sidebarBlockKey]: block} = await getSidebarMenuItems(page);
      await block.getByText(itemName).click({button: 'right', force: true});

      const dropdownMenu = page.locator('.ant-dropdown-menu');
      await dropdownMenu.locator('.ant-dropdown-menu-item', {hasText: 'Delete all'}).click();

      const modal = page.locator('.ant-modal');
      await expect(modal).toBeVisible();
      await modal.locator('.ant-btn', {hasText: /^Delete object$/}).click();

      const successDeleteNotification = page.locator('.ant-notification-notice-success', {
        hasText: 'Deletion completed',
      });
      await expect(successDeleteNotification).toBeVisible();

      const {[sidebarCountKey]: sidebarCount} = await getSidebarState(page);
      const {[nodeCountKey]: diagramCount} = await getDiagramState(page);

      expect(sidebarCount).toBe(0);
      expect(diagramCount).toBe(0);
    });
  };

  // Генерация тест-кейсов
  deleteAllTestFactory('Services', addService, 'serviceBlock', 'serviceNodeCount', 'serviceItemsCount');
  deleteAllTestFactory('Topics', addTopic, 'topicBlock', 'topicNodeCount', 'topicItemsCount');
  deleteAllTestFactory('HTTP-nodes', addHttpNode, 'httpBlock', 'httpNodeCount', 'httpItemsCount');

  test('should delete all Events via sidebar', async ({page}) => {
    await addEvent(page);
    await addEvent(page);

    const {eventsBlock} = await getSidebarMenuItems(page);
    await eventsBlock.getByText('Events').click({button: 'right', force: true});

    const dropdownMenu = page.locator('.ant-dropdown-menu');
    await dropdownMenu.locator('.ant-dropdown-menu-item', {hasText: 'Delete all'}).click();

    const {eventItemsCount} = await getSidebarState(page);
    expect(eventItemsCount).toBe(0);
  });
});
