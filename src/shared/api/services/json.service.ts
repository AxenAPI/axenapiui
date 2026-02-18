import { axiosClient, getApiConfig } from '@shared/api';
import { GenerateJsonExamplePostRequest, GenerateJsonSchemaPostRequest, JSONApiFactory } from '@shared/openapi';

const api = JSONApiFactory(getApiConfig(), undefined, axiosClient);

export class JsonService {
  /**
   * Генерирует пример JSON на основе JSON-схемы.
   * @param request DTO с JSON-схемой.
   * @returns {Promise<GenerateJsonExamplePost200Response>} Сгенерированный пример JSON.
   */
  static async generateExample(request: GenerateJsonExamplePostRequest) {
    const { data } = await api.generateJsonExamplePost({ generateJsonExamplePostRequest: request });
    return data;
  }

  /**
   * Генерирует JSON-схему на основе JSON.
   * @param request DTO с JSON.
   * @returns {Promise<GenerateJsonSchemaPost200Response>} Сгенерированная JSON-схема.
   */
  static async generateSchema(request: GenerateJsonSchemaPostRequest) {
    const { data } = await api.generateJsonSchemaPost({ generateJsonSchemaPostRequest: request });
    return data;
  }
}
