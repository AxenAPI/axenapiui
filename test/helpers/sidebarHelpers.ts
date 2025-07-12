import {Locator, Page} from '@playwright/test';

/**
 * Функция для получения элементов левой панели:
 * блок сервисов, блок топиков, блок событий, блок HTTP-узлов
 * @param page
 */
export async function getSidebarMenuItems(page: Page) {
  const sidebar = page.locator('[data-testid="sidebar"]');

  const serviceBlock = sidebar.locator('.ant-menu-submenu').first(); // Services
  const topicBlock = sidebar.locator('.ant-menu-submenu').nth(1); // Topics
  const eventsBlock = sidebar.locator('.ant-menu-submenu').nth(2); // Events
  const httpBlock = sidebar.locator('.ant-menu-submenu').nth(3); // HTTP-nodes
  const linksBlock = sidebar.locator('.ant-menu-submenu').nth(4); // HTTP-nodes

  return {
    serviceBlock,
    topicBlock,
    eventsBlock,
    httpBlock,
    linksBlock,
  };
}

/**
 * Функция для открытия необходимого блока в левой панели
 */
export async function openSidebarMenu(menuItem: Locator) {
  await menuItem.click();
}

/**
 * Функция для получения состояния необходимого блока в левой панели
 */
export async function getSidebarBlockState(sidebarBlock: Locator) {
  const isMenuOpen = await sidebarBlock
    .locator('ul')
    .count()
    .then(count => count > 0);

  if (!isMenuOpen) {
    await openSidebarMenu(sidebarBlock);
  }

  const items = sidebarBlock.locator('ul >> li');
  const itemsCount = await items.count();

  return {items, itemsCount};
}

/**
 * Функция для получения состояния левой панели:
 * @param page
 */
export async function getSidebarState(page: Page) {
  const {eventsBlock, httpBlock, serviceBlock, topicBlock, linksBlock} = await getSidebarMenuItems(page);

  const {items: serviceItems, itemsCount: serviceItemsCount} = await getSidebarBlockState(serviceBlock);
  const {items: topicItems, itemsCount: topicItemsCount} = await getSidebarBlockState(topicBlock);
  const {items: eventItems, itemsCount: eventItemsCount} = await getSidebarBlockState(eventsBlock);
  const {items: httpItems, itemsCount: httpItemsCount} = await getSidebarBlockState(httpBlock);
  const {items: linkItems, itemsCount: linkItemsCount} = await getSidebarBlockState(linksBlock);

  return {
    serviceItems,
    serviceItemsCount,
    topicItems,
    topicItemsCount,
    eventItems,
    eventItemsCount,
    httpItems,
    httpItemsCount,
    linkItems,
    linkItemsCount,
  };
}
