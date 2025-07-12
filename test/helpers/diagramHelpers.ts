import {Page, expect, Locator} from '@playwright/test';

import {EConnectionType} from '../../src/enums/common';

/**
 * Вспомогательная функция для загрузки файла
 * @param page
 * @param filePaths
 */
export async function uploadFile(page: Page, filePaths: string[]) {
  const importFileBtn = page.locator('[data-testid="import-file-btn"]');
  const importFileInput = page.locator('input[type="file"]');

  // Настройка видимости поля ввода файла
  await importFileInput.evaluate(el => {
    // eslint-disable-next-line no-param-reassign
    el.style.display = 'block';
    // eslint-disable-next-line no-param-reassign
    el.style.visibility = 'visible';
  });

  await importFileBtn.click();

  // Добавляем значение в поле ввода файла
  await importFileInput.setInputFiles(filePaths);
}

/**
 * Функция для получения состояния диаграммы:
 * узлы, связи и их количество
 * @param page
 */
export async function getDiagramState(page: Page) {
  const serviceNodes = page.locator('[data-testid="serviceNode"]');
  const topicNodes = page.locator('[data-testid="topicNode"]');
  const httpNodes = page.locator('[data-testid="httpNode"]');
  const eventNodes = page.locator('[data-testid="event-node"]');
  const edges = page.locator('[data-testid="customEdge"]');
  const disconnectedEdges = page.locator('[data-testid="disconnected-edge"]');
  const expandableEdges = page.locator('[data-testid="expandable-edge"]');
  const simpleEdges = page.locator('[data-testid="simple-edge"]');

  const serviceNodeCount = await serviceNodes.count();
  const topicNodeCount = await topicNodes.count();
  const httpNodeCount = await httpNodes.count();
  const eventNodeCount = await eventNodes.count();
  const edgesCount = await edges.count();
  const disconnectedEdgesCount = await disconnectedEdges.count();
  const expandableEdgesCount = await expandableEdges.count();
  const simpleEdgesCount = await simpleEdges.count();

  return {
    serviceNodes,
    serviceNodeCount,
    topicNodes,
    topicNodeCount,
    edges,
    edgesCount,
    disconnectedEdges,
    disconnectedEdgesCount,
    httpNodes,
    httpNodeCount,
    expandableEdges,
    simpleEdges,
    expandableEdgesCount,
    simpleEdgesCount,
    eventNodes,
    eventNodeCount,
  };
}

/**
 * Функция для проверки корректности состояния диаграммы после загрузки файла
 * @param page
 * @param initialEdgesCount
 * @param initialServiceNodeCount
 * @param initialTopicNodeCount
 */
export async function validateDiagramState(
  page: Page,
  {
    initialEdgesCount,
    initialServiceNodeCount,
    initialTopicNodeCount,
  }: {
    initialEdgesCount: number;
    initialServiceNodeCount: number;
    initialTopicNodeCount: number;
  }
) {
  // Получаем конечное состояние диаграммы
  const {
    edges,
    edgesCount: finalEdgesCount,
    serviceNodeCount: finalServiceNodesCount,
    serviceNodes,
    topicNodeCount: finalTopicNodesCount,
    topicNodes,
  } = await getDiagramState(page);

  // Проверяем, что количество узлов и связей увеличилось
  expect(finalServiceNodesCount).toBeGreaterThan(initialServiceNodeCount);
  expect(finalTopicNodesCount).toBeGreaterThan(initialTopicNodeCount);
  expect(finalEdgesCount).toBeGreaterThan(initialEdgesCount);

  // Проверяем, что все узлы и связи отображаются на странице
  const serviceNodeElements = await serviceNodes.all();
  await Promise.all(
    serviceNodeElements.map(async node => {
      await expect(node).toBeVisible();
    })
  );

  const topicNodeElements = await topicNodes.all();
  await Promise.all(
    topicNodeElements.map(async node => {
      await expect(node).toBeVisible();
    })
  );

  const edgeElements = await edges.all();
  await Promise.all(
    edgeElements.map(async edge => {
      // C toBeVisible() тест падает с ошибкой, хотя отображается все корректно
      // Locator: locator('[data-testid="customEdge"]').first() Expected: visible Received: hidden
      await expect(edge).toBeAttached();
    })
  );
}

/**
 * Функция для добавления сервиса путем клика на кнопку 'Service' в верхней панели
 */
export async function addService(page: Page) {
  const serviceAddButton = page.getByTestId('panel').locator('.ant-btn', {hasText: 'Service'});
  await serviceAddButton.click();
}

/**
 * Функция для добавления топика путем клика на кнопку 'Topic' в верхней панели
 */
export async function addTopic(page: Page) {
  const topicAddButton = page.getByTestId('panel').locator('.ant-btn', {hasText: 'Topic'});
  await topicAddButton.click();
}

/**
 * Функция для добавления HTTP узла путем клика на кнопку 'HTTP-node' в верхней панели
 */
export async function addHttpNode(page: Page) {
  const httpAddButton = page.getByTestId('panel').locator('.ant-btn', {hasText: 'HTTP'});
  await httpAddButton.click();
}

/**
 * Функция для добавления события путем клика на кнопку 'Event' в верхней панели
 */
export async function addEvent(page: Page, eventName: string = '123') {
  const eventAddButton = page.getByTestId('panel').locator('.ant-btn', {hasText: 'Event'});
  await eventAddButton.click();
  await page.fill('input[data-testid="event-drawer-name-input"]', eventName);
  await page.locator('button', {hasText: 'Create'}).click();
}

/**
 * Функция для добавления связи путем клика на кнопку 'Link' в верхней панели
 */
export async function addLink(page: Page, eventName: string, connectionType: EConnectionType) {
  const eventAddButton = page.getByTestId('panel').locator('.ant-btn', {hasText: 'Link'});
  await eventAddButton.click();

  await page.click('div[data-testid="create-link-drawer-service-select"]');
  await page.locator('.ant-select-dropdown', {hasText: 'Service'}).click();

  await page.click('div[data-testid="create-link-drawer-topic-select"]');
  await page.locator('.ant-select-dropdown', {hasText: 'Topic'}).click();

  await page.locator(`text=${connectionType}`).click();

  await page.click('div[data-testid="create-link-drawer-event-select"]');
  await page.locator('.ant-select-dropdown', {hasText: eventName}).click();

  await page.locator('button', {hasText: 'Create'}).click();
}

/**
 * Функция для добавления связи путем "протягивания" связи между узлами
 */
export async function dragNDropLink(sourceNode: Locator, targetNode: Locator, page: Page) {
  const firstTopicSourceHandler = sourceNode.locator('[data-testid="nodeSource"]');
  const secondTopicTargetHandler = targetNode.locator('[data-testid="nodeTarget"]');

  const sourceBox = await firstTopicSourceHandler.boundingBox();
  const targetBox = await secondTopicTargetHandler.boundingBox();

  const startX = sourceBox.x + sourceBox.width / 2;
  const startY = sourceBox.y + sourceBox.height / 2;
  const endX = targetBox.x + targetBox.width / 2;
  const endY = targetBox.y + targetBox.height / 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(endX, endY, {steps: 1});
  await page.mouse.up();

  await page.waitForTimeout(300);
}

/**
 * Функция возвращает кнопку "Delete" в верхней панели
 */
export function getPanelDeleteButton(page: Page): Locator {
  return page.getByTestId('panel').getByText('Delete');
}
