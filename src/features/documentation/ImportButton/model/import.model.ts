import { createEvent, createStore, sample } from 'effector';

import { YANDEX_IMPORT_STATUS } from '@common/constants';

import { repositoryModel } from '@app/models/repository';

import { globalBlockerModel } from '@shared/components/GlobalBlocker';
import { ElectronService } from '@shared/electron/api';
import { notificationModel } from '@shared/notification/notification.model';

const YANDEX_IMPORT_NOTIFICATION_KEY = 'yandex-import_notification_key';

// --- Electron Listeners ---
// This code runs once when the model is imported, setting up listeners for Electron events.
ElectronService.on(YANDEX_IMPORT_STATUS.STARTED, () => {
  yandexImportStarted();
});

ElectronService.on(YANDEX_IMPORT_STATUS.SUCCESS, () => {
  yandexImportSuccess();
});

ElectronService.on<[string]>(YANDEX_IMPORT_STATUS.ERROR, errorMessage => {
  yandexImportError(errorMessage);
});

// --- Events ---
const importButtonClicked = createEvent();
const yandexImportStarted = createEvent();
const yandexImportSuccess = createEvent();
const yandexImportError = createEvent<string>();

// --- Stores ---
const $isLoading = createStore(false);

// Link isLoading store to the lifecycle of the import
$isLoading
  .on([yandexImportStarted, importButtonClicked], () => true)
  .on(yandexImportSuccess, () => false)
  .on(yandexImportError, () => false);

// UI blocking and notification on start
sample({
  clock: yandexImportStarted,
  fn: () => ({
    message: 'Yandex Import',
    description: 'Importing documentation...',
    showProgress: true,
    duration: 0,
    key: YANDEX_IMPORT_NOTIFICATION_KEY,
  }),
  target: [globalBlockerModel.events.blockUI, notificationModel.events.showProcess],
});

// UI unblocking and success notification
sample({
  clock: yandexImportSuccess,
  fn: () => ({
    message: 'Yandex Import',
    description: 'Documentation imported successfully!',
    key: YANDEX_IMPORT_NOTIFICATION_KEY,
  }),
  target: [globalBlockerModel.events.unblockUI, notificationModel.events.showSuccess],
});

// UI unblocking and error notification
sample({
  clock: yandexImportError,
  fn: errorMessage => ({
    message: 'Yandex Import Failed',
    description: errorMessage || 'Could not import documentation. See console for details.',
    key: YANDEX_IMPORT_NOTIFICATION_KEY,
  }),
  target: [globalBlockerModel.events.unblockUI, notificationModel.events.showError],
});

sample({
  clock: yandexImportSuccess,
  fn: () => 'ya.wiki',
  target: repositoryModel.api.indexDirectoryApi,
});

export const importButtonModel = {
  events: {
    importButtonClicked,
    yandexImportStarted,
    yandexImportSuccess,
    yandexImportError,
  },
  stores: {
    $isLoading,
  },
};
