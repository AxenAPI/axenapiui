import { expect } from '@playwright/test';

import { test } from '../electron.fixture';
import { addEvent, addService, addTopic, getDiagramState } from '../helpers/diagramHelpers';

test.describe('add links scenarios by button between nodes', () => {
  test('should add link by button between nodes with all param', async ({ page }) => {
    await addService(page);
    await addTopic(page);
    await addEvent(page, 'Test');

    await page.waitForSelector('[data-testid="serviceNode"]', { state: 'visible' });
    await page.waitForSelector('[data-testid="topicNode"]', { state: 'visible' });

    const serviceNode = page.locator('[data-testid="serviceNode"]').first();
    const topicNode = page.locator('[data-testid="topicNode"]').first();

    const { edgesCount: initialEdgesCount } = await getDiagramState(page);
    await expect(serviceNode).toBeVisible();
    await expect(topicNode).toBeVisible();
    expect(initialEdgesCount).toBe(0);

    const addLinkButton = page.locator('.ant-btn', { hasText: 'Link' });
    await addLinkButton.click();
    const createLinkDrawer = page.locator('[data-testid="drawer-create-link"]');
    await expect(createLinkDrawer).toBeInViewport();

    const serviceSelectChoose = page.locator('[data-testid="create-link-drawer-service-select"]');
    await serviceSelectChoose.click();
    await page.locator('.ant-select-dropdown', { hasText: 'Service_0' }).click();
    await page.locator('.ant-btn', { hasText: 'Create' }).click();
    await expect(page.locator('.ant-notification', { hasText: 'All fields must be filled in' })).toBeInViewport();

    const topicSelectChoose = page.locator('[data-testid="create-link-drawer-topic-select"]');
    await topicSelectChoose.click();
    await page.locator('.ant-select-dropdown', { hasText: 'Topic_0' }).click();
    const eventSelectChoose = page.locator('[data-testid="create-link-drawer-event-select"]');
    await eventSelectChoose.click();
    await page.locator('.ant-select-dropdown', { hasText: 'Test' }).click();
    await page.locator('.ant-btn', { hasText: 'Create' }).click();
    await expect(page.locator('.ant-notification', { hasText: 'Link created' })).toBeInViewport();
  });

  test('should add link by button service -> topic with 2 different events and swap direction', async ({ page }) => {
    // Добавление одного сервиса, топика и двух эвентов
    await addService(page);
    await addTopic(page);
    await addEvent(page, '1');
    await addEvent(page, '2');

    // Ожидает появления
    await page.waitForSelector('[data-testid="serviceNode"]', { state: 'visible' });
    await page.waitForSelector('[data-testid="topicNode"]', { state: 'visible' });

    const serviceNode = page.locator('[data-testid="serviceNode"]').first();
    const topicNode = page.locator('[data-testid="topicNode"]').first();

    const { edgesCount: initialEdgesCount } = await getDiagramState(page);
    await expect(serviceNode).toBeVisible();
    await expect(topicNode).toBeVisible();
    expect(initialEdgesCount).toBe(0);

    // Нажимаем на кнопку создания линка
    const addLinkButton = page.locator('.ant-btn', { hasText: 'Link' });
    await addLinkButton.click();
    const createLinkDrawer = page.locator('[data-testid="drawer-create-link"]');
    await expect(createLinkDrawer).toBeInViewport();

    // Выбираем сервис
    const serviceSelectChoose = page.locator('[data-testid="create-link-drawer-service-select"]');
    await serviceSelectChoose.click();
    await page.locator('.ant-select-dropdown', { hasText: 'Service_0' }).click();
    await page.locator('.ant-btn', { hasText: 'Create' }).click();
    await expect(page.locator('.ant-notification', { hasText: 'All fields must be filled in' })).toBeInViewport();

    // Выбираем топик
    const topicSelectChoose = page.locator('[data-testid="create-link-drawer-topic-select"]');
    await topicSelectChoose.click();
    await page.locator('.ant-select-dropdown', { hasText: 'Topic_0' }).click();

    // Выбираем эвент "1"
    const eventSelectChoose = page.locator('[data-testid="create-link-drawer-event-select"]');
    await eventSelectChoose.click();
    await page.locator('.ant-select-item-option-content', { hasText: '1' }).click();

    // Нажимаем кнопку создания линка
    await page.locator('.ant-btn', { hasText: 'Create' }).click();
    await expect(page.locator('.ant-notification', { hasText: 'Link created' })).toBeInViewport();

    await page.waitForTimeout(300);

    // Повторяем то же самое для второго линка
    await addLinkButton.first().click();
    await expect(createLinkDrawer).toBeInViewport();

    await serviceSelectChoose.click();
    await page.locator('.ant-select-dropdown', { hasText: 'Service_0' }).click();
    await page.locator('.ant-btn', { hasText: 'Create' }).click();
    await expect(page.locator('.ant-notification', { hasText: 'All fields must be filled in' })).toBeInViewport();

    await topicSelectChoose.click();
    await page.locator('.ant-select-dropdown', { hasText: 'Topic_0' }).click();
    await eventSelectChoose.click();
    await page.locator('.ant-select-item-option-content', { hasText: '2' }).click();
    await page.locator('.ant-btn', { hasText: 'Create' }).click();
    await expect(page.locator('.ant-notification', { hasText: 'Link created' })).toBeInViewport();

    // Нажимаем правой кнопкой по сервису и открываем спецификацию
    await serviceNode.click({ button: 'right' });
    const specificationButton = page.locator('.ant-menu-item', { hasText: 'Specification' });
    await specificationButton.click();

    await page.waitForTimeout(300);

    // Дожидаемся того, что спецификация открылась и в окне сваггера есть текст сервиса
    const swaggerBox = page.locator('.title', { hasText: 'Service_0' });
    await expect(swaggerBox).toBeInViewport();

    const cancelSpecButton = page.locator('.ant-btn', { hasText: 'Cancel' });
    await cancelSpecButton.click();

    // Раскрываем линки при нажатии на топик правой кнопкой мышки
    await topicNode.click({ button: 'right' });
    const showEventButton = page.locator('.ant-menu-item', { hasText: 'Show events' });
    await showEventButton.click();

    // Раскрываем в сайдбаре меню с линками
    const sideBarLinkMenu = page.locator('.ant-menu-title-content', { hasText: 'Links' });
    await sideBarLinkMenu.click();

    // Нажимаем на первый линк в списке
    const firstLink = page.locator('.ant-space-item', { hasText: 'Service_0🠖Topic_0' }).first();
    await firstLink.click();

    // Нажимаем на другой вид связи и сохраняем
    const connectTypeConsumeButton = page.locator('.ant-radio-button-label', { hasText: 'Consume' });
    await connectTypeConsumeButton.click();
    const saveButton = page.getByRole('button', { name: 'Save' });
    await saveButton.waitFor({ state: 'visible' });
    await saveButton.click();

    // Проверяем что связь поменялось и связей осталось две
    await expect(page.locator('.ant-space-item', { hasText: 'Service_0🠔Topic_0' })).toBeInViewport();
    await expect(page.locator('.ant-space-item', { hasText: 'Service_0🠖Topic_0' })).toBeInViewport();
  });
});
