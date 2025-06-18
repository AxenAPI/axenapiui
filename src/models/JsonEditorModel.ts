import {createStore, createEvent, createEffect} from 'effector';

import {apiClient} from '@/shared/api/client';
import {EventDTO, GenerateJsonExamplePostRequest} from '@/shared/api/event-graph-api';

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
      return await apiClient.generateJsonExamplePost({generateJsonExamplePostRequest});
    } catch (e) {
      throw new Error(e);
    }
  }
);
