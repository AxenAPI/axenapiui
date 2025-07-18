import {expect} from '@playwright/test';

import {test} from '../electron.fixture';

test.describe('scenario for open json editor layout', () => {
  test('go to json-editor layout and add new event', async ({page}) => {
    // Поиск переключателя layout для json-editor и нажатие на него
    const jsonEditorButton = page.locator('.ant-menu-item', {hasText: 'JSON Editor'});
    await jsonEditorButton.locator('a').click();

    // Проверка, что мы действительно перешили на нужный layout
    const jsonEditorPage = page.locator('div[data-testid="json-editor-page"]');
    await jsonEditorPage.waitFor();
    await expect(jsonEditorPage).toBeInViewport();

    // Поиск кнопки добавления event и нажатие на нее, после проверка, что модалка открылась
    await page.locator('button', {hasText: 'New Event'}).click();
    const addEventModal = page.locator('.ant-drawer-content-wrapper');
    await expect(addEventModal).toBeInViewport();

    // Поиск модалки и заполнение в ней поля name, после чего нажимается кнопка создания event
    await page.fill('input[data-testid="event-drawer-name-input"]', '123');
    await page.locator('button', {hasText: 'Create'}).click();
    const eventMenuItem = page.locator('.ant-menu-item', {hasText: '123'});
    await expect(eventMenuItem).toBeInViewport();

    // Нажатие на созданный event и проверка, что в компоненте content есть текст нашего event
    await eventMenuItem.click();
    const jsonEditorContent = page.locator('div[data-testid="json-editor-content"]', {hasText: '123'});
    await expect(jsonEditorContent).toBeInViewport();

    // После создания эвента без заполнения json, проверить корректность отображения схемы во вкладке формы
    const formButton = page.locator('.ant-menu-item', {hasText: 'Form'});
    await formButton.click();
    const schemaButton = page.locator('.ant-menu-item', {hasText: 'Schema'});
    await schemaButton.click();
    const schemaObjectLine = page.locator('.ant-typography', {hasText: 'object'});
    await expect(schemaObjectLine).toBeInViewport();

    // Поиск и нажатие на кнопку добавления тега
    const addTagButton = page.locator('.ant-tag', {hasText: 'Add tag'});
    await addTagButton.click();
    const addTagSelect = page.locator('div[data-testid="add-tag-select"]');
    await expect(addTagSelect).toBeInViewport();

    // Добавление нового тега и просмотр, что он отобразился на элементе
    await addTagSelect.click();
    const addTagSelector = page.locator('.ant-select-selection-search-input');
    await addTagSelector.fill('123');
    const dropdown = page.locator('.ant-select-dropdown');
    await dropdown.locator('text=123').click();
    const selectItem = page.locator('.ant-select-item', {hasText: '123'});
    await selectItem.click();
    const addedTag = page.locator('.ant-tag', {hasText: '123'});
    await expect(addedTag).toBeInViewport();

    // Удаление добавленного тега
    const deleteIcon = addedTag.locator('svg');
    await deleteIcon.click();
    await expect(addedTag).not.toBeInViewport();

    // Проверка удаления event и отчистка компонента content
    const eventMenuItemName = page.locator('.ant-space-item', {hasText: '123'});
    await eventMenuItemName.click({button: 'right'});
    const deleteDropdownButton = page.locator('.ant-dropdown-menu', {hasText: 'Delete'});
    await deleteDropdownButton.click();
    await expect(eventMenuItem).not.toBeInViewport();
    await expect(jsonEditorContent).not.toBeInViewport();
  });
});
