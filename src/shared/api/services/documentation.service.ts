import { axiosClient, getApiConfig } from '@shared/api';
import {
  CreateDocumentPageRequest,
  DeleteDocumentPageRequest,
  DocumentationApiDocumentationPagesFileDeleteRequest,
  DocumentationApiDocumentationPagesFilePostRequest,
  DocumentationApiDocumentationPagesLinkPostRequest,
  DocumentationApiFactory,
  DocumentationPageByUuidResponse,
  DocumentationReadOnlyApiFactory,
  DocumentationTreeByPathPostRequest,
  DocumentationTreeLevelPostRequest,
  EventGraphDTO,
  GenerateCodeRequest,
  MoveDocumentPageRequest,
  RenameDocumentPageRequest,
} from '@shared/openapi';

const api = DocumentationApiFactory(getApiConfig(), undefined, axiosClient);
const readOnlyApi = DocumentationReadOnlyApiFactory(getApiConfig(), undefined, axiosClient);

export class DocumentationService {
  /**
   * Удаляет страницу документации.
   * @param deleteDocumentPageRequest DTO для удаления страницы.
   * @returns {Promise<DeleteDocumentPageResponse>} Результат удаления.
   */
  static async deletePage(deleteDocumentPageRequest: DeleteDocumentPageRequest) {
    const { data } = await api.documentationPagesDelete({ deleteDocumentPageRequest });
    return data;
  }

  /**
   * Перемещает страницу документации.
   * @param moveDocumentPageRequest DTO для перемещения страницы.
   * @returns {Promise<MoveDocumentPageResponse>} Результат перемещения.
   */
  static async movePage(moveDocumentPageRequest: MoveDocumentPageRequest) {
    const { data } = await api.documentationPagesMovePost({ moveDocumentPageRequest });
    return data;
  }

  /**
   * Создает новую страницу документации.
   * @param createDocumentPageRequest DTO для создания страницы.
   * @returns {Promise<CreateDocumentPageResponse>} Результат создания.
   */
  static async createPage(createDocumentPageRequest: CreateDocumentPageRequest) {
    const { data } = await api.documentationPagesPost({ createDocumentPageRequest });
    return data;
  }

  /**
   * Переименовывает страницу документации.
   * @param renameDocumentPageRequest DTO для переименования страницы.
   * @returns {Promise<RenameDocumentPageResponse>} Результат переименования.
   */
  static async renamePage(renameDocumentPageRequest: RenameDocumentPageRequest) {
    const { data } = await api.documentationPagesRenamePost({ renameDocumentPageRequest });
    return data;
  }

  /**
   * Генерирует единый PDF документ для всех сервисов в графе.
   * @param eventGraphDTO DTO графа событий.
   * @returns {Promise<File>} Сгенерированный PDF файл.
   */
  static async generateAllServicePdf(eventGraphDTO: EventGraphDTO) {
    const { data } = await api.generateAllServicePdfPost({ eventGraphDTO });
    return data;
  }

  /**
   * Генерирует код сервисов из EventGraphDTO.
   * @param generateCodeRequest DTO для генерации кода.
   * @returns {Promise<File>} Сгенерированный код.
   */
  static async generateCode(generateCodeRequest: GenerateCodeRequest) {
    const { data } = await api.generateCodePost({ generateCodeRequest });
    return data;
  }

  /**
   * Генерирует DOCX документацию из EventGraphDTO.
   * @param eventGraphDTO DTO графа событий.
   * @param serviceIds Опциональный список ID сервисов.
   * @returns {Promise<GenerateDocxPost200Response>} Результат генерации.
   */
  static async generateDocx(eventGraphDTO: EventGraphDTO, serviceIds?: string[]) {
    const { data } = await api.generateDocxPost({ eventGraphDTO, serviceIds });
    return data;
  }

  /**
   * Генерирует Markdown документацию из EventGraphDTO.
   * @param eventGraphDTO DTO графа событий.
   * @param serviceIds Опциональный список ID сервисов.
   * @returns {Promise<GenerateMarkdownPost200Response>} Результат генерации.
   */
  static async generateMarkdown(eventGraphDTO: EventGraphDTO, serviceIds?: string[]) {
    const { data } = await api.generateMarkdownPost({ eventGraphDTO, serviceIds });
    return data;
  }

  /**
   * Генерирует PDF документацию из EventGraphDTO.
   * @param eventGraphDTO DTO графа событий.
   * @param serviceIds Опциональный список ID сервисов.
   * @returns {Promise<GeneratePdfPost200Response>} Результат генерации.
   */
  static async generatePdf(eventGraphDTO: EventGraphDTO, serviceIds?: string[]) {
    const { data } = await api.generatePdfPost({ eventGraphDTO, serviceIds });
    return data;
  }

  /**
   * Валидирует EventGraph и генерирует OpenAPI спецификацию.
   * @param eventGraphDTO DTO графа событий.
   * @param format Формат спецификации.
   * @returns {Promise<GenerateSpecPost200Response>} Результат генерации.
   */
  static async generateSpec(eventGraphDTO: EventGraphDTO, format?: 'json' | 'yaml') {
    const { data } = await api.generateSpecPost({ eventGraphDTO, format });
    return data;
  }

  /**
   * Возвращает уровень дерева документации по указаному пути.
   * @param documentationTreeLevelPostRequest DTO для получения уровня дерева.
   * @returns {Promise<DocumentationTreeLevel>} Уровень дерева документации.
   */
  static async getTreeLevel(documentationTreeLevelPostRequest: DocumentationTreeLevelPostRequest) {
    const { data } = await readOnlyApi.documentationTreeLevelPost({ documentationTreeLevelPostRequest });
    return data;
  }

  /**
   * Возвращает все уровени дерева документации по указаному пути.
   * @param documentationTreeByPathPostRequest DTO для получения дерева.
   * @returns {Promise<DocumentationTreeResponse>} Дерево документации.
   */
  static async getTreeByPath(documentationTreeByPathPostRequest: DocumentationTreeByPathPostRequest) {
    const { data } = await readOnlyApi.documentationTreeByPathPost({
      documentationTreeByPathPostRequest,
    });
    return data;
  }

  /**
   * Добавляет связь страницы с объектом.
   * @param documentationApiDocumentationPagesLinkPostRequest DTO для добавления связи.
   * @returns {Promise<EventGraphDTO>} Обновленный граф событий.
   */
  static async linkDocumentationPage(
    documentationApiDocumentationPagesLinkPostRequest: DocumentationApiDocumentationPagesLinkPostRequest
  ): Promise<EventGraphDTO> {
    const { data } = await api.documentationPagesLinkPost(documentationApiDocumentationPagesLinkPostRequest);
    return data as EventGraphDTO;
  }

  /**
   * Проверяет все связи проекта.
   * @returns {Promise<ValidateLinksResponse>} Результат валидации.
   */
  static async validateLinks() {
    const { data } = await api.documentationPagesLinksValidatePost();
    return data;
  }

  /**
   * Добавляет файл к странице документации.
   * @param request DTO для добавления файла.
   * @returns {Promise<AddFileDocumentPageResponse>} Результат добавления.
   */
  static async addFile(request: DocumentationApiDocumentationPagesFilePostRequest) {
    const { data } = await api.documentationPagesFilePost(request);
    return data;
  }

  /**
   * Удаляет файл со страницы документации.
   * @param request DTO для удаления файла.
   * @returns {Promise<BaseResponse>} Результат удаления.
   */
  static async deleteFile(request: DocumentationApiDocumentationPagesFileDeleteRequest) {
    const { data } = await api.documentationPagesFileDelete(request);
    return data;
  }

  /**
   * Получает информацию о странице документации по UUID.
   * @param uuid UUID страницы документации.
   * @returns {Promise<DocumentationPageByUuidResponse>} Информация о странице.
   */
  static async getPageByUuid(uuid: string): Promise<DocumentationPageByUuidResponse> {
    const { data } = await readOnlyApi.documentationPageUuidGet({ uuid });
    return data;
  }

  /**
   * Поиск страниц документации по запросу.
   * @param query Строка поиска.
   * @param page Номер страницы (начиная с 0).
   * @param size Размер страницы.
   * @returns {Promise<PageDocumentationSearchResult>} Результаты поиска.
   */
  static async searchPages(query: string, page?: number, size?: number) {
    const { data } = await readOnlyApi.searchDocumentationPages({ query, page, size });
    return data;
  }
}
