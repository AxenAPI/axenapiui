import { RawAxiosRequestConfig } from 'axios';

import { axiosClient, getApiConfig } from '@shared/api';
import { HealthApiFactory } from '@shared/openapi';

const api = HealthApiFactory(getApiConfig(), undefined, axiosClient);

export class HealthService {
  /**
   * Проверяет, что сервис запущен и работает.
   * @param options Опции запроса для axios, например, timeout.
   * @returns {Promise<void>}
   */
  static async check(options?: RawAxiosRequestConfig) {
    const { data } = await api.healthGet(options);
    return data;
  }
}
