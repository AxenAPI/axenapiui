import { NNotification } from '@axenix/ui-kit';
import { createEffect, createEvent, sample } from 'effector';
import { createGate } from 'effector-react';
import { Key } from 'react';

export type TNotificationProps = NNotification.TProps & { key: Key };

// Gate to receive notification API from the UI layer
const notificationGate = createGate<NNotification.TNotificationInstance>();

// Events to trigger notifications
const showSuccess = createEvent<TNotificationProps>();
const showError = createEvent<TNotificationProps>();
const showWarning = createEvent<TNotificationProps>();
const showProcess = createEvent<TNotificationProps>();

// Effects to show notifications
const showSuccessFx = createEffect<TNotificationProps, void>();
const showErrorFx = createEffect<TNotificationProps, void>();
const showWarningFx = createEffect<TNotificationProps, void>();
const showProcessFx = createEffect<TNotificationProps, void>();

// Wire events to effects
sample({
  clock: showSuccess,
  target: showSuccessFx,
});

sample({
  clock: showError,
  target: showErrorFx,
});

sample({
  clock: showWarning,
  target: showWarningFx,
});

sample({
  clock: showProcess,
  target: showProcessFx,
});

// Implement the effects using the notification API from the Gate
sample({
  clock: showSuccessFx,
  source: notificationGate.state,
  filter: Boolean,
  fn: (api, params) => api.success({ placement: 'bottomRight', ...params }),
});

sample({
  clock: showErrorFx,
  source: notificationGate.state,
  filter: Boolean,
  fn: (api, params) => api.error({ placement: 'bottomRight', ...params }),
});

sample({
  clock: showWarningFx,
  source: notificationGate.state,
  filter: Boolean,
  fn: (api, params) => api.warning({ placement: 'bottomRight', ...params }),
});

sample({
  clock: showProcessFx,
  source: notificationGate.state,
  filter: Boolean,
  fn: (api, params) => api.info({ placement: 'bottomRight', ...params }),
});

export const notificationModel = {
  gate: notificationGate,
  events: {
    showSuccess,
    showError,
    showWarning,
    showProcess,
  },
};
