import { axiosClient, getApiConfig } from '@shared/api';
import {
  BaseResponse,
  CalculateAllPathsPost200Response,
  CalculateAllPathsPostRequest,
  EventGraphApiAddServiceToGraphPostRequest,
  EventGraphApiFactory,
  EventGraphApiSaveEventGraphRequest,
  EventGraphApiSaveEventGraphToRepositoryPostRequest,
  EventGraphDTO,
  GetServiceSpecificationPost200Response,
  GetServiceSpecificationPostRequest,
  SaveEventGraphToRepoResponse,
  UpdateServiceSpecificationPostRequest,
} from '@shared/openapi';

const api = EventGraphApiFactory(getApiConfig(), undefined, axiosClient);

export class EventGraphService {
  /**
   * Добавляет сервисы в существующий граф событий из файлов спецификаций.
   * @param request DTO для добавления сервиса.
   * @returns {Promise<EventGraphDTO>} Обновленный граф событий.
   */
  static async addServiceToGraph(request: EventGraphApiAddServiceToGraphPostRequest): Promise<EventGraphDTO> {
    const { data } = await api.addServiceToGraphPost(request);
    return data as EventGraphDTO;
  }

  /**
   * Вычисляет все пути в графе событий между двумя узлами.
   * @param request DTO для вычисления путей.
   * @returns {Promise<CalculateAllPathsPost200Response>} Найденные пути.
   */
  static async calculateAllPaths(request: CalculateAllPathsPostRequest): Promise<CalculateAllPathsPost200Response> {
    const { data } = await api.calculateAllPathsPost({ calculateAllPathsPostRequest: request });
    return data;
  }

  /**
   * Получает спецификацию для узла-сервиса.
   * @param request DTO для получения спецификации.
   * @returns {Promise<GetServiceSpecificationPost200Response>} Спецификация сервиса.
   */
  static async getServiceSpecification(
    request: GetServiceSpecificationPostRequest
  ): Promise<GetServiceSpecificationPost200Response> {
    const { data } = await api.getServiceSpecificationPost({ getServiceSpecificationPostRequest: request });
    return data;
  }

  /**
   * Обновляет узел-сервис новой спецификацией.
   * @param request DTO для обновления спецификации.
   * @returns {Promise<EventGraphDTO>} Обновленный граф событий.
   */
  static async updateServiceSpecification(request: UpdateServiceSpecificationPostRequest): Promise<EventGraphDTO> {
    const { data } = await api.updateServiceSpecificationPost({ updateServiceSpecificationPostRequest: request });
    return data as EventGraphDTO;
  }

  /**
   * Сохраняет EventGraph на сервер.
   * @param request DTO для сохранения графа.
   * @returns {Promise<BaseResponse>} Результат сохранения.
   */
  static async saveEventGraph(request: EventGraphApiSaveEventGraphRequest): Promise<BaseResponse> {
    const { data } = await api.saveEventGraph(request);
    return data as BaseResponse;
  }

  /**
   * Сохраняет граф в формате json в репозиторий документации.
   * @param request DTO для сохранения графа в репозиторий.
   * @returns {Promise<SaveEventGraphToRepoResponse>} Результат сохранения.
   */
  static async saveEventGraphToRepository(
    request: EventGraphApiSaveEventGraphToRepositoryPostRequest
  ): Promise<SaveEventGraphToRepoResponse> {
    const { data } = await api.saveEventGraphToRepositoryPost(request);
    return data as SaveEventGraphToRepoResponse;
  }
}
