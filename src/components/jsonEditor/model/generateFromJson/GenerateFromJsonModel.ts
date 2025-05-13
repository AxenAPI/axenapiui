import {createEffect, createEvent, createStore} from 'effector';

import {apiClient} from '@/shared/api/client';
import {GenerateJsonSchemaPostRequest} from '@/shared/api/event-graph-api';

export const openDrawerGenerateFromJson = createEvent();
export const closeDrawerGenerateFromJson = createEvent();

export const $drawerGenerateFromJson = createStore<{isOpen: boolean}>({
  isOpen: false,
})
  .on(openDrawerGenerateFromJson, () => ({
    isOpen: true,
  }))
  .reset(closeDrawerGenerateFromJson);

export const fetchJsonSchemaFx = createEffect(async (generateJsonSchemaPostRequest: GenerateJsonSchemaPostRequest) => {
  try {
    return await apiClient.generateJsonSchemaPost({generateJsonSchemaPostRequest});
  } catch (e) {
    throw new Error(e);
  }
});
