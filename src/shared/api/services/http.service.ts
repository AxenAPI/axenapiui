import { axiosClient, getApiConfig } from '@shared/api';
import { HttpApiFactory } from '@shared/openapi';

const api = HttpApiFactory(getApiConfig(), undefined, axiosClient);

export class HttpService {
  /**
   * Получает список поддерживаемых media types для тела HTTP-запроса.
   * @returns {Promise<HttpContentTypeItem[]>} Список поддерживаемых media types.
   */
  static async getAvailableContentTypes() {
    const { data } = await api.availableHttpContentTypesGet();
    return data;
  }
}
