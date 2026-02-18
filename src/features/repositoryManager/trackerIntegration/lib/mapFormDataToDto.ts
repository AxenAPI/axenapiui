import { TrackerSettingsDto, TrackerType } from '@shared/openapi';

import { TrackerFormData } from '../model/trackerIntegrationModel';

const Tracker = {
  YANDEX_TRACKER: TrackerType.YandexTracker,
  KANBOARD: TrackerType.Kanboard,
};

const getYandexTrackerSettings = (data: TrackerFormData): TrackerSettingsDto => {
  const authData = {
    federationId: data.federationId,
    orgId: data.orgId,
    projectKey: data.projectKey,
  };

  return {
    trackerType: TrackerType.YandexTracker,
    baseUrl: data.baseUrl,
    authData,
    projectId: data.projectId,
    projectName: data.projectName,
  };
};

const getKanboardSettings = (data: TrackerFormData): TrackerSettingsDto => {
  const authData = {
    apiToken: data.apiToken,
    username: data.username,
  };

  return {
    trackerType: TrackerType.Kanboard,
    baseUrl: data.baseUrl,
    authData,
    projectId: data.projectId,
    projectName: data.projectName,
  };
};

const settingsBuilderMap: Record<keyof typeof Tracker, (data: TrackerFormData) => TrackerSettingsDto> = {
  [Tracker.YANDEX_TRACKER]: getYandexTrackerSettings,
  [Tracker.KANBOARD]: getKanboardSettings,
};

export const mapFormDataToDto = (data: TrackerFormData): TrackerSettingsDto | null => {
  if (!data.trackerType) {
    return null;
  }

  const settings = settingsBuilderMap[data.trackerType](data);

  return { ...settings };
};
