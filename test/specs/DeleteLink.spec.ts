import {expect} from '@playwright/test';

import {test} from '../electron.fixture';
import {addService, addTopic, dragNDropLink, getDiagramState, getPanelDeleteButton} from '../helpers/diagramHelpers';

test.describe('scenarios for deleting links', () => {
  test('should be successfully deleted via the "Delete" button after selecting link', async ({page}) => {
    // Arrange: Добавляем элементы на диаграмму
    await addService(page);
    await addTopic(page);

    // Ожидаем появления нод на экране
    await page.waitForSelector('[data-testid="serviceNode"]', {state: 'visible'});
    await page.waitForSelector('[data-testid="topicNode"]', {state: 'visible'});

    const serviceNode = page.locator('[data-testid="serviceNode"]').first();
    const topicNode = page.locator('[data-testid="topicNode"]').first();

    // Act: Создаём связь между нодами
    await dragNDropLink(serviceNode, topicNode, page);

    // Получаем текущее состояние диаграммы (связи)
    const {edges, edgesCount: initialEdgesCount} = await getDiagramState(page);
    expect(initialEdgesCount).toBe(1);

    // Assert: Проверяем, что кнопка удаления отключена до выбора связи
    const deleteBtn = getPanelDeleteButton(page);
    await expect(deleteBtn).toBeDisabled();

    // Act: Выбираем созданную связь
    await edges.first().click({force: true});

    // Assert: Проверяем, что кнопка удаления стала доступной
    await expect(deleteBtn).toBeEnabled();

    // Act: Нажимаем кнопку удаления
    await deleteBtn.click();

    // Ожидаем появления модального окна подтверждения
    const modal = page.locator('.ant-modal');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText(`Delete confirmation`);
    await expect(modal).toContainText(`Deleting is an irreversible action. The link will be lost.`);

    // Act: Подтверждаем удаление
    await modal.locator('.ant-btn', {hasText: /^Delete$/}).click();

    // Assert: Проверяем, что все связи удалены
    const {edgesCount: finalEdgesCount} = await getDiagramState(page);
    expect(finalEdgesCount).toBe(0);
  });

  test('should be successfully deleted via the "Delete" button after selecting multiple links', async ({page}) => {
    // Arrange: Добавляем элементы на диаграмму
    await addService(page);
    await addService(page);
    await addTopic(page);

    // Ожидаем появления нод на экране
    await page.waitForSelector('[data-testid="serviceNode"]', {state: 'visible'});
    await page.waitForSelector('[data-testid="topicNode"]', {state: 'visible'});

    const firstServiceNode = page.locator('[data-testid="serviceNode"]').first();
    const secondServiceNode = page.locator('[data-testid="serviceNode"]').nth(1);
    const topicNode = page.locator('[data-testid="topicNode"]').first();

    // Act: Создаём две связи между сервисами и топиком
    await dragNDropLink(firstServiceNode, topicNode, page);
    await page.waitForTimeout(2000);
    await dragNDropLink(secondServiceNode, topicNode, page);

    // Получаем текущее состояние диаграммы (связи)
    const {edges, edgesCount: initialEdgesCount} = await getDiagramState(page);
    expect(initialEdgesCount).toBe(2);

    // Assert: Проверяем, что кнопка удаления отключена до выбора связей
    const deleteBtn = getPanelDeleteButton(page);
    await expect(deleteBtn).toBeDisabled();

    // Act: Выбираем несколько связей с использованием Shift
    await page.keyboard.down('Shift');
    await edges.first().click({force: true});
    await edges.nth(1).click({force: true});
    await page.keyboard.up('Shift');

    // Assert: Проверяем, что кнопка удаления стала доступной
    await expect(deleteBtn).toBeEnabled();

    // Act: Нажимаем кнопку удаления
    await deleteBtn.click();

    // Ожидаем появления модального окна подтверждения
    const modal = page.locator('.ant-modal');
    await expect(modal).toBeVisible();

    // Act: Подтверждаем удаление
    await modal.locator('.ant-btn', {hasText: /^Delete$/}).click();

    // Ждём исчезновения модалки и обновления графа
    await expect(modal).not.toBeVisible();

    // Assert: Проверяем, что все связи удалены
    const {edgesCount: finalEdgesCount} = await getDiagramState(page);
    expect(finalEdgesCount).toBe(0);
  });

  test('should be successfully deleted link from new link form', async ({page}) => {
    // Определяем кнопку открытия модального окна и нажимаем на нее
    const newLinkButton = page.locator('.ant-btn', {hasText: 'Link'});
    await newLinkButton.click();
    const newLinkModal = page.locator('.ant-drawer-header', {hasText: 'New Link'});
    await expect(newLinkModal).toBeInViewport();

    // Определяем кнопку добавления линка и нажимаем на нее
    const addNewLinkButton = page.locator('.ant-btn', {hasText: 'Add Link'});
    await addNewLinkButton.click();

    // Отслеживаем кол-во линков = 2
    const link = page.locator('.ant-collapse-header', {hasText: 'Link'});
    await expect(await link.count()).toBe(2);

    // Удаляем линк и проверяем что остался один
    const lastLink = link.last();
    const lastLinkDeleteButton = lastLink.locator('.ant-btn').last();
    await lastLinkDeleteButton.click();
    await expect(await link.count()).toBe(1);
  });
});
