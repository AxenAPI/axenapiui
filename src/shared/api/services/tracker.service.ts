import { AxiosError } from 'axios';

import { axiosClient, getApiConfig } from '@shared/api';
import { RepositoryTrackerApiFactory, TrackerSettingsDto, TrackerTypeInfo } from '@shared/openapi';

const api = RepositoryTrackerApiFactory(getApiConfig(), undefined, axiosClient);

export class TrackerService {
  /**
   * Получает список поддерживаемых типов трекеров.
   * @returns {Promise<TrackerTypeInfo[]>} Список типов трекеров.
   */
  static async getTrackerTypes(): Promise<TrackerTypeInfo[]> {
    const { data } = await api.trackerTypesGet();
    return data;
  }

  /**
   * Получает настройки трекера для репозитория.
   * @param repositoryId UUID репозитория.
   * @returns {Promise<TrackerSettingsDto | null>} Настройки трекера или null, если не найдены.
   */
  static async getTrackerSettings(repositoryId: string): Promise<TrackerSettingsDto | null> {
    try {
      const { data } = await api.gitRepositoryIdTrackerSettingsGet({ repositoryId });
      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Сохраняет настройки трекера для репозитория.
   * @param repositoryId UUID репозитория.
   * @param settings Настройки трекера.
   * @returns {Promise<TrackerSettingsDto>} Сохранённые настройки.
   */
  static async saveTrackerSettings(repositoryId: string, settings: TrackerSettingsDto): Promise<TrackerSettingsDto> {
    const { data } = await api.gitRepositoryIdTrackerSettingsPost({
      repositoryId,
      trackerSettingsDto: settings,
    });
    return data;
  }

  /**
   * Удаляет (деактивирует) настройки трекера для репозитория.
   * @param repositoryId UUID репозитория.
   * @returns {Promise<void>}
   */
  static async deleteTrackerSettings(repositoryId: string): Promise<void> {
    await api.gitRepositoryIdTrackerSettingsDelete({ repositoryId });
  }
}
