import {expect, Page} from '@playwright/test';

import path from 'path';

import {EConnectionType} from '../../src/enums/common';
import {test} from '../electron.fixture';
import {addEvent, addLink, addService, addTopic, getDiagramState, uploadFile} from '../helpers/diagramHelpers';

const uploadFileWithExpandableItems = async (page: Page) => {
  const filePath = path.join(__dirname, '../mocks/import-files/consume_two_events_in_one_topic.json');
  await uploadFile(page, [filePath]);
};

test.describe('scenarios for expanding and shrinking topic details', () => {
  test('should expand and shrink topic details through context menu', async ({page}) => {
    // Arrange
    await uploadFileWithExpandableItems(page); // Загружаем файл с "расширяемым" элементом
    const {edges, eventNodes, expandableEdges, simpleEdges, topicNodes} = await getDiagramState(page);
    const topicNode = topicNodes.first();

    // Act: Разворачиваем детали
    await topicNode.click({button: 'right'});
    const showEventsBtn = page.locator('text=Show events');
    await showEventsBtn.click();

    // Assert: Детали отображаются и связи обновлены
    await expect(eventNodes).toHaveCount(2);
    await expect(simpleEdges).toHaveCount(1);
    await expect(edges).toHaveCount(2);

    // Act: Сворачиваем детали
    await topicNode.click({button: 'right'});
    const hideEventsBtn = page.locator('text=Hide events');
    await hideEventsBtn.click();

    // Assert: Детали скрыты
    await expect(eventNodes).toHaveCount(0);
    await expect(simpleEdges).toHaveCount(0);
    await expect(edges).toHaveCount(0);
    await expect(expandableEdges).toHaveCount(1);
  });

  test('should expand and shrink topic details through link double click', async ({page}) => {
    // Arrange
    await uploadFileWithExpandableItems(page); // Загружаем файл с "расширяемым" элементом
    const {edges, eventNodes, expandableEdges, simpleEdges} = await getDiagramState(page);
    await expect(expandableEdges).toHaveCount(1);
    const expandableEdge = expandableEdges.first();
    const simpleEdge = simpleEdges.first();

    // Act: Разворачиваем детали по двойному клику на связь
    await expandableEdge.dblclick({force: true});

    // Assert: Детали отображаются и связи обновлены
    await expect(eventNodes).toHaveCount(2);
    await expect(simpleEdges).toHaveCount(1);
    await expect(edges).toHaveCount(2);

    // Act: Сворачиваем детали по двойному клику на простую связь
    await simpleEdge.dblclick({force: true});

    // Assert: Детали скрыты и связи обновлены
    await expect(eventNodes).toHaveCount(0);
    await expect(simpleEdges).toHaveCount(0);
    await expect(edges).toHaveCount(0);
    await expect(expandableEdges).toHaveCount(1);
  });

  test('should properly visualize message production and consumption for a service', async ({page}) => {
    // Arrange: Создаем сервис, топик и события
    await addService(page);
    await addTopic(page);
    await addEvent(page, 'Event1');
    await addEvent(page, 'Event2');

    // Act: Добавляем связи в обе стороны
    await addLink(page, 'Event1', EConnectionType.CONSUME);
    await addLink(page, 'Event2', EConnectionType.PRODUCE);

    // Assert: Проверяем количество расширяемых связей
    const {edges, expandableEdges, simpleEdges, topicNodes} = await getDiagramState(page);
    await expect(expandableEdges).toHaveCount(1);

    // Act: Открываем детали топика
    const topicNode = topicNodes.first();
    await topicNode.click({button: 'right'});
    const detailOption = page.locator('text=Show events');
    await detailOption.click();

    // Assert: Убеждаемся, что отображаются все связи
    await expect(edges).toHaveCount(2);
    await expect(simpleEdges).toHaveCount(1);
  });

  test('should not show details expansion when only one interaction type exists', async ({page}) => {
    // Arrange: Создаем сервис, топик и событие
    await addService(page);
    await addTopic(page);
    await addEvent(page, 'Event1');

    // Act: Добавляем связи в обе стороны
    await addLink(page, 'Event1', EConnectionType.CONSUME);

    // Assert: Проверяем количество связей
    const {edges, expandableEdges, topicNodes} = await getDiagramState(page);
    await expect(edges).toHaveCount(1);
    await expect(expandableEdges).toHaveCount(0);

    // Act: Открываем детали топика
    const topicNode = topicNodes.first();
    await topicNode.click({button: 'right'});

    // Assert: Убеждаемся, что кнопки для "раскрытия" топика нет
    const detailOption = page.locator('text=Show events');
    await expect(detailOption).toHaveCount(0);
  });
});
