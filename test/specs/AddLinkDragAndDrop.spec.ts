import {expect} from '@playwright/test';

import {test} from '../electron.fixture';
import {addService, addTopic, dragNDropLink, getDiagramState} from '../helpers/diagramHelpers';

test.describe('add links scenarios by drag and drop between nodes', () => {
  test('should add link by drag and drop between nodes', async ({page}) => {
    await addService(page);
    await addTopic(page);

    await page.waitForSelector('[data-testid="serviceNode"]', {state: 'visible'});
    await page.waitForSelector('[data-testid="topicNode"]', {state: 'visible'});

    const serviceNode = page.locator('[data-testid="serviceNode"]').first();
    const topicNode = page.locator('[data-testid="topicNode"]').first();

    const {edgesCount: initialEdgesCount} = await getDiagramState(page);
    await expect(serviceNode).toBeVisible();
    await expect(topicNode).toBeVisible();
    expect(initialEdgesCount).toBe(0);

    await dragNDropLink(serviceNode, topicNode, page);
    const {edgesCount: finalEdgesCount} = await getDiagramState(page);
    expect(finalEdgesCount).toBe(initialEdgesCount + 1);


    // Часть для тестирования линков в сайдбаре
    const linkContainer = page.locator('.ant-menu-title-content', {hasText: 'Links'});
    await linkContainer.click();
    const linkMenuItem = page.locator('.ant-space-item', {hasText: 'Service🠖Topic'});
    await expect(linkMenuItem).toBeInViewport();
    await linkMenuItem.click();
    const linkDrawer = page.locator('.ant-drawer-content-wrapper');
    expect(linkDrawer).toBeInViewport();
  });

  test('should not add link by drag and drop between topics', async ({page}) => {
    await addTopic(page);
    await addTopic(page);

    const sourceTopicNode = page.locator('[data-testid="topicNode"]').first();
    const targetTopicNode = page.locator('[data-testid="topicNode"]').nth(1);

    const {edgesCount: initialEdgesCount} = await getDiagramState(page);
    await expect(sourceTopicNode).toBeVisible();
    await expect(targetTopicNode).toBeVisible();
    expect(initialEdgesCount).toBe(0);

    await dragNDropLink(sourceTopicNode, targetTopicNode, page);

    const {edgesCount: finalEdgesCount} = await getDiagramState(page);
    expect(finalEdgesCount).toBe(initialEdgesCount);
  });
});
