import {expect, Locator, Page} from '@playwright/test';

import path from 'path';

import {test} from '../electron.fixture';
import {getDiagramState, getPanelDeleteButton, uploadFile} from '../helpers/diagramHelpers';
import {getSidebarState} from '../helpers/sidebarHelpers';

const getDeletingElements = async (diagramNodes: Locator, sidebarItems: Locator, type: 'service' | 'topic') => {
  // Находим первый узел и берем его имя
  const deletingNode = diagramNodes.first();
  const deletingNodeName = await deletingNode.getByTestId(`${type}NodeName`).textContent();
  // По имени находим элемент этого узла в левой панели
  const deletingSidebarItem = sidebarItems.getByText(deletingNodeName);

  return {deletingNode, deletingSidebarItem, deletingNodeName};
};

const validateStateAfterNodeDelete = async (
  page: Page,
  itemsCount: number,
  nodeCount: number,
  edgesCount: number,
  isDeletingOnlyNode: boolean = true,
  type: 'service' | 'topic' = 'service'
) => {
  // Финальное состояние диаграммы
  const {serviceItems: finalServiceItems, topicItems: finalTopicItems} = await getSidebarState(page);
  const {
    disconnectedEdgesCount,
    edgesCount: finalEdgesCount,
    serviceNodes: finalServiceNodes,
    topicNodes: finalTopicNodes,
  } = await getDiagramState(page);

  const finalItems = type === 'service' ? finalServiceItems : finalTopicItems;
  const finalNodes = type === 'service' ? finalServiceNodes : finalTopicNodes;

  // Проверяем, что количество узлов сервисов уменьшилось на 1
  await expect(finalItems).toHaveCount(itemsCount - 1);
  await expect(finalNodes).toHaveCount(nodeCount - 1);

  if (isDeletingOnlyNode && type === 'topic') {
    // Проверяем, что появилось 1 "разъединенное" ребро
    expect(disconnectedEdgesCount).toEqual(1);
    // Проверяем, что количество "обычных" ребер уменьшилось на 1
    expect(finalEdgesCount).toEqual(edgesCount - 1);

    return;
  }

  if (isDeletingOnlyNode && type === 'service') {
    // Проверяем, что количество ребер не изменилось. Но все они стали "разъединенные"
    expect(disconnectedEdgesCount).toEqual(edgesCount);
    // Проверяем, что "обычных" ребер не осталось
    expect(finalEdgesCount).toEqual(0);
  } else {
    // Проверяем, что нет "разъединенных" ребер
    expect(disconnectedEdgesCount).toEqual(0);
    // Проверяем, что "обычных" ребер не осталось
    expect(finalEdgesCount).toEqual(0);
  }
};

test.describe('scenarios for deleting nodes', () => {
  let page: Page;
  test.beforeEach(async ({page: appPage}) => {
    page = appPage;
    await page.setViewportSize({width: 1920, height: 1080});

    const filePath = path.join(
      __dirname,
      '../mocks/import-files/service_no_common_consume_topics_common_events_common_outgoing_topics_with_tags_1.json'
    );
    await uploadFile(page, [filePath]);
  });

  test.afterEach(async () => {
    if (page) {
      await page.close();
    }
  });

  test('should delete an element via node context menu', async () => {
    // Начальное состояние диаграммы
    const {serviceItems, serviceItemsCount} = await getSidebarState(page);
    const {edgesCount, serviceNodeCount, serviceNodes} = await getDiagramState(page);
    const {deletingNode: deletingService, deletingSidebarItem: deletingServiceSidebar} = await getDeletingElements(
      serviceNodes,
      serviceItems,
      'service'
    );

    await deletingServiceSidebar.scrollIntoViewIfNeeded();

    await deletingService.click({button: 'right', force: true});
    await page.locator('.ant-popover >> .ant-menu-item', {hasText: 'Delete'}).click();

    const modal = page.locator('.ant-modal');

    await expect(modal).toBeVisible();
    await expect(modal).toContainText(`Delete confirmation`);
    await expect(modal).toContainText(
      `Deleting objects is an irreversible action. All relationships with these objects will be lost.`
    );
    // Удаляем только узел, связь оставяем
    await modal.locator('.ant-btn', {hasText: /^Delete object$/}).click();
    await expect(modal).not.toBeVisible();

    await validateStateAfterNodeDelete(page, serviceItemsCount, serviceNodeCount, edgesCount);
  });

  test('should delete an element and relationships', async () => {
    const {serviceItems, serviceItemsCount} = await getSidebarState(page);
    const {edgesCount, serviceNodeCount, serviceNodes} = await getDiagramState(page);
    const {deletingNode: deletingService, deletingSidebarItem: deletingServiceSidebar} = await getDeletingElements(
      serviceNodes,
      serviceItems,
      'service'
    );

    await deletingServiceSidebar.scrollIntoViewIfNeeded();

    await deletingService.click({button: 'right', force: true});
    await page.locator('.ant-popover >> .ant-menu-item', {hasText: 'Delete'}).click();

    const modal = page.locator('.ant-modal');

    await expect(modal).toBeVisible();
    // Удаляем узел и связь
    await modal.locator('.ant-btn', {hasText: /^Delete object and relationships$/}).click();
    await expect(modal).not.toBeVisible();

    await validateStateAfterNodeDelete(page, serviceItemsCount, serviceNodeCount, edgesCount, false);
  });

  test('should not make changes on cancel', async () => {
    const {serviceItems} = await getSidebarState(page);
    const {serviceNodes} = await getDiagramState(page);
    const {deletingNode: deletingService, deletingSidebarItem: deletingServiceSidebar} = await getDeletingElements(
      serviceNodes,
      serviceItems,
      'service'
    );

    await deletingServiceSidebar.scrollIntoViewIfNeeded();

    await deletingService.click({button: 'right', force: true});
    await page.locator('.ant-popover >> .ant-menu-item', {hasText: 'Delete'}).click();

    const modal = page.locator('.ant-modal');

    await expect(modal).toBeVisible();
    await modal.locator('.ant-btn', {hasText: /^Cancel$/}).click();

    await expect(deletingService).toBeVisible();
    await expect(deletingServiceSidebar).toBeVisible();
  });

  test('should delete an element via the context menu in the sidebar', async () => {
    const {topicItems, topicItemsCount} = await getSidebarState(page);
    const {edgesCount, topicNodeCount, topicNodes} = await getDiagramState(page);
    const {deletingSidebarItem: deletingTopicSidebar} = await getDeletingElements(topicNodes, topicItems, 'topic');

    await deletingTopicSidebar.getByText('commonConsumeKafka', {exact: true}).click({button: 'right'});

    const dropdownMenu = page.locator('.ant-dropdown-menu');
    await expect(dropdownMenu).toBeVisible();
    await expect(dropdownMenu).not.toBeHidden();
    await expect(dropdownMenu).toBeAttached();

    const deleteBtn = dropdownMenu.getByRole('menuitem', {name: 'Delete'});
    await deleteBtn.waitFor({state: 'visible', timeout: 5000});
    await deleteBtn.hover();
    await deleteBtn.click({force: true});

    const modal = page.locator('.ant-modal');
    await expect(modal).toBeVisible();
    await modal.getByRole('button', {name: /^Delete object$/}).click();

    await validateStateAfterNodeDelete(page, topicItemsCount, topicNodeCount, edgesCount, true, 'topic');
  });

  test('should be successfully deleted via the "Delete" button after selecting node', async () => {
    const {serviceItems, serviceItemsCount} = await getSidebarState(page);
    const {edgesCount, serviceNodeCount, serviceNodes} = await getDiagramState(page);
    const {deletingNode: deletingService, deletingSidebarItem: deletingServiceSidebar} = await getDeletingElements(
      serviceNodes,
      serviceItems,
      'service'
    );
    await deletingServiceSidebar.scrollIntoViewIfNeeded();

    const deleteBtn = getPanelDeleteButton(page);
    await expect(deleteBtn).toBeDisabled();

    await deletingService.click();
    await expect(deleteBtn).toBeEnabled();
    await deleteBtn.click();

    const modal = page.locator('.ant-modal');

    await expect(modal).toBeVisible();
    await modal.locator('.ant-btn', {hasText: /^Delete object$/}).click();

    await validateStateAfterNodeDelete(page, serviceItemsCount, serviceNodeCount, edgesCount);
  });

  test('should be successfully deleted via the "Delete" button after selecting multiple nodes', async () => {
    const {serviceItems, serviceItemsCount, topicItems, topicItemsCount} = await getSidebarState(page);
    const {edgesCount, serviceNodeCount, serviceNodes, topicNodeCount, topicNodes} = await getDiagramState(page);
    const {deletingNode: deletingService} = await getDeletingElements(serviceNodes, serviceItems, 'service');
    const {deletingNode: deletingTopic} = await getDeletingElements(topicNodes, topicItems, 'topic');

    const deleteBtn = getPanelDeleteButton(page);
    await expect(deleteBtn).toBeDisabled();

    await page.keyboard.down('Shift');
    await deletingService.click();
    await deletingTopic.click();
    await page.keyboard.up('Shift');

    await expect(deleteBtn).toBeEnabled();
    await deleteBtn.click();

    const modal = page.locator('.ant-modal');

    await expect(modal).toBeVisible();
    await modal.locator('.ant-btn', {hasText: /^Delete object$/}).click();

    // Финальное состояние диаграммы
    const {serviceItems: finalServiceItems, topicItems: finalTopicItems} = await getSidebarState(page);
    const {
      disconnectedEdgesCount,
      edgesCount: finalEdgesCount,
      serviceNodes: finalServiceNodes,
      topicNodes: finalTopicNodes,
    } = await getDiagramState(page);

    // Проверяем, что количество узлов сервисов уменьшилось на 1
    await expect(finalServiceItems).toHaveCount(serviceItemsCount - 1);
    await expect(finalServiceNodes).toHaveCount(serviceNodeCount - 1);
    // Проверяем, что количество узлов топиков уменьшилось на 1
    await expect(finalTopicItems).toHaveCount(topicItemsCount - 1);
    await expect(finalTopicNodes).toHaveCount(topicNodeCount - 1);

    // Проверяем, что количество ребер не изменилось. Но все они стали "разъединенные"
    expect(disconnectedEdgesCount).toEqual(edgesCount);
    // Проверяем, что "обычных" ребер не осталось
    expect(finalEdgesCount).toEqual(0);
  });
});
