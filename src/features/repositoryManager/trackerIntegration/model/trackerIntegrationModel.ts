import { createEffect, createEvent, createStore, sample } from 'effector';

import { TrackerService } from '@shared/api/services';
import { TrackerSettingsDto, TrackerType } from '@shared/openapi';

import { mapFormDataToDto } from '../lib/mapFormDataToDto';

// ===== Types =====

export type TrackerTypeOption = TrackerType | null;

export type TrackerFormData = {
  trackerType: TrackerTypeOption;
  baseUrl: string;
  // Yandex Tracker fields
  federationId: string;
  orgId: string;
  projectKey: string;
  // Kanboard fields
  apiToken: string;
  username: string;
  // Project
  projectId: string;
  projectName: string;
};

// ===== Events =====

export const setTrackerType = createEvent<TrackerTypeOption>();
export const setBaseUrl = createEvent<string>();
export const setFederationId = createEvent<string>();
export const setOrgId = createEvent<string>();
export const setApiToken = createEvent<string>();
export const setProjectId = createEvent<string>();
export const setProjectName = createEvent<string>();
export const setUsername = createEvent<string>();
export const setProjectKey = createEvent<string>();
export const resetForm = createEvent();
export const loadTrackerSettings = createEvent<TrackerSettingsDto | null>();

// ===== Stores =====

export const $trackerType = createStore<TrackerTypeOption>(null).reset(resetForm);
export const $baseUrl = createStore<string>('').reset(resetForm);
export const $federationId = createStore<string>('').reset(resetForm);
export const $orgId = createStore<string>('').reset(resetForm);
export const $apiToken = createStore<string>('').reset(resetForm);
export const $projectId = createStore<string>('').reset(resetForm);
export const $projectName = createStore<string>('').reset(resetForm);
export const $username = createStore<string>('').reset(resetForm);
export const $projectKey = createStore<string>('').reset(resetForm);
export const $isSubmitting = createStore<boolean>(false);

// Предыдущие настройки трекера (для определения, нужно ли удалять)
export const $previousTrackerType = createStore<TrackerTypeOption>(null).reset(resetForm);

export const $formData = sample({
  source: {
    trackerType: $trackerType,
    baseUrl: $baseUrl,
    federationId: $federationId,
    orgId: $orgId,
    apiToken: $apiToken,
    projectId: $projectId,
    projectName: $projectName,
    username: $username,
    projectKey: $projectKey,
  },
  fn: (data): TrackerFormData => data,
});

// ===== Effects =====

export const fetchTrackerSettingsApi = createEffect(
  async (repositoryId: string): Promise<TrackerSettingsDto | null> =>
    await TrackerService.getTrackerSettings(repositoryId)
);

export const saveTrackerSettingsApi = createEffect(
  async (params: { repositoryId: string; data: TrackerFormData }): Promise<TrackerSettingsDto | void> => {
    const { data, repositoryId } = params;
    const settings = mapFormDataToDto(data);

    if (!settings) {
      return;
    }

    return await TrackerService.saveTrackerSettings(repositoryId, settings);
  }
);

export const deleteTrackerSettingsApi = createEffect(async (repositoryId: string): Promise<void> => {
  await TrackerService.deleteTrackerSettings(repositoryId);
});

// ===== Logic =====

sample({
  clock: setTrackerType,
  target: $trackerType,
});

sample({
  clock: setBaseUrl,
  target: $baseUrl,
});

sample({
  clock: setFederationId,
  target: $federationId,
});

sample({
  clock: setOrgId,
  target: $orgId,
});

sample({
  clock: setApiToken,
  target: $apiToken,
});

sample({
  clock: setProjectId,
  target: $projectId,
});

sample({
  clock: setProjectName,
  target: $projectName,
});

sample({
  clock: setUsername,
  target: $username,
});

sample({
  clock: setProjectKey,
  target: $projectKey,
});

// Load tracker settings from API response
sample({
  clock: loadTrackerSettings,
  fn: settings => settings?.trackerType ?? null,
  target: [$trackerType, $previousTrackerType],
});

sample({
  clock: loadTrackerSettings,
  fn: settings => settings?.baseUrl ?? '',
  target: $baseUrl,
});

sample({
  clock: loadTrackerSettings,
  fn: settings => settings?.authData?.['federationId'] ?? '',
  target: $federationId,
});

sample({
  clock: loadTrackerSettings,
  fn: settings => settings?.authData?.['orgId'] ?? '',
  target: $orgId,
});

sample({
  clock: loadTrackerSettings,
  fn: settings => settings?.authData?.['apiToken'] ?? '',
  target: $apiToken,
});

sample({
  clock: loadTrackerSettings,
  fn: settings => settings?.projectId ?? '',
  target: $projectId,
});

sample({
  clock: loadTrackerSettings,
  fn: settings => settings?.projectName ?? '',
  target: $projectName,
});

sample({
  clock: loadTrackerSettings,
  fn: settings => settings?.authData?.['username'] ?? '',
  target: $username,
});

sample({
  clock: loadTrackerSettings,
  fn: settings => settings?.authData?.['projectKey'] ?? '',
  target: $projectKey,
});

sample({
  clock: [saveTrackerSettingsApi.pending, deleteTrackerSettingsApi.pending],
  fn: () => true,
  target: $isSubmitting,
});

sample({
  clock: [saveTrackerSettingsApi.finally, deleteTrackerSettingsApi.finally],
  fn: () => false,
  target: $isSubmitting,
});

// ===== Public API =====

export const trackerIntegrationModel = {
  stores: {
    $trackerType,
    $baseUrl,
    $federationId,
    $orgId,
    $apiToken,
    $projectId,
    $projectName,
    $username,
    $projectKey,
    $isSubmitting,
    $formData,
    $previousTrackerType,
  },
  events: {
    setTrackerType,
    setBaseUrl,
    setFederationId,
    setOrgId,
    setApiToken,
    setProjectId,
    setProjectName,
    setUsername,
    setProjectKey,
    resetForm,
    loadTrackerSettings,
  },
  api: {
    fetchTrackerSettingsApi,
    saveTrackerSettingsApi,
    deleteTrackerSettingsApi,
  },
};
