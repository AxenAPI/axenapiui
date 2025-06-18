import {createEffect} from 'effector';

import {apiClient} from '@/shared/api/client';

export const healthGetFx = createEffect(async () => {
  try {
    return await apiClient.healthGet();
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'PDF generation failed');
  }
});
