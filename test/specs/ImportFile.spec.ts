import {expect} from '@playwright/test';

import path from 'path';

import {test} from '../electron.fixture';
import {getDiagramState, uploadFile, validateDiagramState} from '../helpers/diagramHelpers';

test.describe('scenario for loading files and building a diagram from them', () => {
  test('should upload a valid file and render diagram with correct nodes and edges', async ({page}) => {
    const {
      edgesCount: initialEdgesCount,
      serviceNodeCount: initialServiceNodeCount,
      topicNodeCount: initialTopicNodeCount,
    } = await getDiagramState(page);

    // Загружаем корректный файл
    const filePath = path.join(
      __dirname,
      '../mocks/import-files/service_no_common_consume_topics_common_events_common_outgoing_topics_with_tags_1.json'
    );
    await uploadFile(page, [filePath]);

    const successNotification = page.locator('.ant-notification-notice-success');
    await successNotification.waitFor({state: 'visible'});
    await expect(successNotification).toHaveText('Import success');

    // Проверяем состояние диаграммы после загрузки
    await validateDiagramState(page, {initialEdgesCount, initialServiceNodeCount, initialTopicNodeCount});
  });

  test('should show error notification if wrong file is uploaded', async ({page}) => {
    const {
      edgesCount: initialEdgesCount,
      serviceNodeCount: initialServiceNodeCount,
      topicNodeCount: initialTopicNodeCount,
    } = await getDiagramState(page);

    // Загружаем некорректный файл
    const filePath = path.join(__dirname, '../mocks/import-files/file-causing-the-error.json');
    await uploadFile(page, [filePath]);

    // Проверяем, что состояние диаграммы не изменилось
    const {
      edgesCount: finalEdgesCount,
      serviceNodeCount: finalServiceNodesCount,
      topicNodeCount: finalTopicNodesCount,
    } = await getDiagramState(page);
    expect(finalServiceNodesCount).toEqual(initialServiceNodeCount);
    expect(finalTopicNodesCount).toEqual(initialTopicNodeCount);
    expect(finalEdgesCount).toEqual(initialEdgesCount);
  });

  test('should upload multiple files and render diagrams with correct counts', async ({page}) => {
    const {
      edgesCount: initialEdgesCount,
      serviceNodeCount: initialServiceNodeCount,
      topicNodeCount: initialTopicNodeCount,
    } = await getDiagramState(page);

    // Загружаем несколько файлов
    const filePaths = [
      path.join(__dirname, '../mocks/import-files/consume_one_event_service.json'),
      path.join(__dirname, '../mocks/import-files/consume_three_events_from_different_brokers_service.json'),
    ];
    await uploadFile(page, filePaths);

    const successNotification = page.locator('.ant-notification-notice-success');
    await successNotification.waitFor({state: 'visible'});
    await expect(successNotification).toHaveText('Import success');

    // Проверяем состояние диаграммы после загрузки
    await validateDiagramState(page, {
      initialEdgesCount,
      initialServiceNodeCount,
      initialTopicNodeCount,
    });
  });
});
