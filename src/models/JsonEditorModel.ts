/** *************************************************************************************************
 * FIXME
 * ВНИМАНИЕ! ЭТА МОДЕЛЬ УСТАРЕЛА И ПОДЛЕЖИТ РЕФАКТОРИНГУ!
 *
 * ВЕСЬ КОД В ЭТОМ ФАЙЛЕ ДОЛЖЕН БЫТЬ ПЕРЕПИСАН В СООТВЕТСТВИИ С ПРАВИЛАМИ,
 * ОПИСАННЫМИ В ДОКУМЕНТАЦИИ.
 *
 ************************************************************************************************** */

import { createEffect, createEvent, createStore } from 'effector';

import { JsonService } from '@shared/api/services';
import { EventDTO, GenerateJsonExamplePostRequest } from '@shared/openapi';

// Создаем событие для выбора элемента
export const selectMenuItem = createEvent<EventDTO>();
// Создаем событие для удаления элемента
export const deleteMenuItem = createEvent<EventDTO>();

// Создаем стор для хранения выбранного элемента
export const $selectedMenuItem = createStore<EventDTO | null>(null)
  .on(selectMenuItem, (_, item) => item)
  .on(deleteMenuItem, (_, item) => item);

export const fetchJsonDataExapmleFx = createEffect(
  async (generateJsonExamplePostRequest: GenerateJsonExamplePostRequest) => {
    try {
      return await JsonService.generateExample(generateJsonExamplePostRequest);
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : 'Failed to generate JSON example');
    }
  }
);
