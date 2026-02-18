import { createEffect, createEvent, createStore } from 'effector';

import { JsonService } from '@shared/api/services';
import { GenerateJsonSchemaPostRequest } from '@shared/openapi';

export const openDrawerGenerateFromJson = createEvent();
export const closeDrawerGenerateFromJson = createEvent();

export const $drawerGenerateFromJson = createStore<{ isOpen: boolean }>({
  isOpen: false,
})
  .on(openDrawerGenerateFromJson, () => ({
    isOpen: true,
  }))
  .reset(closeDrawerGenerateFromJson);

export const fetchJsonSchemaFx = createEffect(async (generateJsonSchemaPostRequest: GenerateJsonSchemaPostRequest) => {
  try {
    return await JsonService.generateSchema(generateJsonSchemaPostRequest);
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Failed to generate JSON schema');
  }
});
