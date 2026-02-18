import { createEffect, createEvent, createStore, sample } from 'effector';

import type { YandexHeaders } from '@common/types';

import { repositoryModel } from '@app/models/repository';

import { ElectronService } from '@shared/electron/api';
import { logger } from '@shared/lib/logger';

// --- Events ---
const openYandexViewDrawer = createEvent();
const closeYandexViewDrawer = createEvent();
const urlChanged = createEvent<string>();
const importSelected = createEvent<{ yandexWikiUrl: string; yandexHeaders: YandexHeaders }>();
const cancelImport = createEvent();

// --- Stores ---
const $isYandexViewDrawerOpen = createStore(false)
  .on(openYandexViewDrawer, () => true)
  .on(closeYandexViewDrawer, () => false)
  .on(importSelected, () => false) // Close drawer on import
  .on(cancelImport, () => false); // Close drawer on cancel

export const $isReadyForImport = createStore(false)
  .on(urlChanged, (_, url) => url.startsWith('https://wiki.yandex.ru/')) // Simple check for Yandex Wiki URL
  .reset(closeYandexViewDrawer); // Reset when drawer closes

const startYandexImportFx = createEffect(
  async ({
    repoPath,
    yandexHeaders,
    yandexWikiUrl,
  }: {
    repoPath: string;
    yandexWikiUrl: string;
    yandexHeaders: YandexHeaders;
  }) => {
    try {
      await ElectronService.startYandexImport(repoPath, yandexWikiUrl, yandexHeaders);
    } catch (error) {
      logger.error('Yandex import failed:', error);
      throw error;
    }
  }
);

// --- Logic ---
sample({
  clock: importSelected,
  source: repositoryModel.stores.$repoPath,
  filter: Boolean,
  fn: (repoPath, { yandexHeaders, yandexWikiUrl }) => ({ repoPath, yandexWikiUrl, yandexHeaders }),
  target: startYandexImportFx,
});

// --- Model ---
export const yandexViewModel = {
  events: {
    openYandexViewDrawer,
    closeYandexViewDrawer,
    urlChanged,
    importSelected,
    cancelImport,
  },
  stores: {
    $isYandexViewDrawerOpen,
    $isReadyForImport,
  },
  effects: {
    startYandexImportFx,
  },
};
