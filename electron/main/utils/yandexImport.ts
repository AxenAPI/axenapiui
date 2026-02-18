import { resolve } from 'path';

import { BrowserWindow } from 'electron';
import log from 'electron-log/main.js';
import { importFromYandexWiki } from 'yandex-wiki-importer';

import { YANDEX_IMPORT_STATUS } from '@common/constants';
import type { YandexHeaders } from '@common/types';

// Function to handle Yandex Wiki import logic
export async function handleYandexImport(
  mainWindow: BrowserWindow,
  destination: string,
  yandexWikiUrl: string,
  yandexHeaders: YandexHeaders
) {
  try {
    if (!yandexHeaders) {
      mainWindow.webContents.send(YANDEX_IMPORT_STATUS.ERROR, 'Yandex Wiki authorization headers are missing.');
      return;
    }

    mainWindow.webContents.send(YANDEX_IMPORT_STATUS.STARTED);

    const url = new URL(yandexWikiUrl);
    const slug = url.pathname.replace(/^\/|\/$/g, '');

    const fullPath = resolve(destination, 'ya.wiki');

    await importFromYandexWiki({
      source: slug,
      destination: fullPath,
      cookie: yandexHeaders.cookie,
      csrfToken: yandexHeaders['x-csrf-token'],
      collabOrgId: yandexHeaders['x-collab-org-id'],
      orgId: yandexHeaders['x-org-id'],
      //metadataTarget?: 'sidecar' (_index.json, default) | 'frontmatter' (meta in md file);
    });

    mainWindow.webContents.send(YANDEX_IMPORT_STATUS.SUCCESS);
  } catch (error) {
    log.error('[YandexImportHelper] Yandex Wiki import failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    mainWindow.webContents.send(YANDEX_IMPORT_STATUS.ERROR, errorMessage);
  }
}
