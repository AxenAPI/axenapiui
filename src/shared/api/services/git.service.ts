import { axiosClient, getApiConfig } from '@shared/api';
import {
  BaseResponse,
  BranchInfo,
  GitApiFactory,
  GitRepoDto,
  GitRepositoryInfo,
  ImportEventGraphFromRepoPostRequest,
  SaveMarkdownPostRequest,
} from '@shared/openapi';

const api = GitApiFactory(getApiConfig(), undefined, axiosClient);

export class GitService {
  /**
   * Получает расширенную информацию о git-репозитории документации.
   * @param filePath Путь к файлу внутри репозитория.
   * @returns {Promise<GitRepositoryInfo>} Информация о репозитории.
   */
  static async getDocumentationGitInfo(filePath: string): Promise<GitRepositoryInfo> {
    const { data } = await api.documentationGitInfoGet({ filePath });
    return data as GitRepositoryInfo;
  }

  /**
   * Получает список всех веток репозитория.
   * @returns {Promise<BranchInfo[]>} Список веток.
   */
  static async getBranches(): Promise<BranchInfo[]> {
    const { data } = await api.gitBranchesGet();
    return data as BranchInfo[];
  }

  /**
   * Переключается на существующую ветку.
   * @param name Имя ветки для переключения.
   * @returns {Promise<GitCheckoutNameGet200Response>} Результат переключения.
   */
  static async checkoutBranch(name: string) {
    const { data } = await api.gitCheckoutNameGet({ name });
    return data;
  }

  /**
   * Создает новую ветку и переключается на нее.
   * @param name Имя создаваемой ветки.
   * @returns {Promise<GitCheckoutNameCreateGet200Response>} Результат создания и переключения.
   */
  static async createAndCheckoutBranch(name: string) {
    const { data } = await api.gitCheckoutNameCreateGet({ name });
    return data;
  }

  /**
   * Клонирует репозиторий документации.
   * @returns {Promise<string>} Путь к клонированному репозиторию.
   */
  static async clone() {
    const { data } = await api.cloneDocumentationPost();
    return data;
  }

  /**
   * Добавляет изменения в индекс Git (git add).
   * @param body Путь к файлу для добавления.
   * @returns {Promise<void>}
   */
  static async addChanges(body: string) {
    const { data } = await api.addDocumentationPost({ body });
    return data;
  }

  /**
   * Делает коммит для документации.
   * @returns {Promise<void>}
   */
  static async commit() {
    const { data } = await api.commitDocumentationPost();
    return data;
  }

  /**
   * Создает Merge Request для документации.
   * @returns {Promise<string>} URL созданного Merge Request.
   */
  static async createMergeRequest() {
    const { data } = await api.createMRDocumentationPost();
    return data;
  }

  /**
   * Сохраняет текст Markdown в файл на сервере.
   * @param authorization Токен для авторизации.
   * @param saveMarkdownPostRequest Объект с markdown и путем к файлу.
   * @returns {Promise<SaveMarkdownPost201Response>} Результат сохранения.
   */
  static async saveMarkdown(authorization: string, saveMarkdownPostRequest: SaveMarkdownPostRequest) {
    const { data } = await api.saveMarkdownPost({ authorization, saveMarkdownPostRequest });
    return data;
  }

  /**
   * Получает статус репозитория документации.
   * @returns {Promise<string>} Статус репозитория.
   */
  static async getDocumentationStatus() {
    const { data } = await api.documentationStatusGet();
    return data;
  }

  /**
   * Создает новую сущность git-репозитория.
   * @param gitRepoDto DTO с данными репозитория.
   * @returns {Promise<GitRepoDto>} Созданная сущность репозитория.
   */
  static async createRepo(gitRepoDto: GitRepoDto) {
    const { data } = await api.gitPost({ gitRepoDto });
    return data;
  }

  /**
   * Получает список всех сущностей git-репозиториев.
   * @returns {Promise<GitRepoDto[]>} Список сущностей репозиториев.
   */
  static async getAllRepos() {
    const { data } = await api.gitGet();
    return data;
  }

  /**
   * Получает сущность git-репозитория по ID.
   * @param id ID репозитория.
   * @returns {Promise<GitRepoDto>} Сущность репозитория.
   */
  static async getRepoById(id: string) {
    const { data } = await api.gitIdGet({ id });
    return data;
  }

  /**
   * Обновляет сущность git-репозитория.
   * @param id ID репозитория.
   * @param gitRepoDto DTO с новыми данными репозитория.
   * @returns {Promise<GitRepoDto>} Обновленная сущность репозитория.
   */
  static async updateRepo(id: string, gitRepoDto: GitRepoDto) {
    const { data } = await api.gitIdPut({ id, gitRepoDto });
    return data;
  }

  /**
   * Удаляет сущность git-репозитория по ID.
   * @param id ID репозитория.
   * @returns {Promise<void>}
   */
  static async deleteRepo(id: string) {
    const { data } = await api.gitIdDelete({ id });
    return data;
  }

  /**
   * Включает или отключает выбранный репозиторий.
   * @param id ID репозитория.
   * @param enabled Статус (включен/отключен).
   * @returns {Promise<void>}
   */
  static async toggleRepoEnabled(id: string, enabled: boolean) {
    const { data } = await api.gitIdEnabledEnabledPatch({ id, enabled });
    return data;
  }

  /**
   * Добавляет массив изменений в индекс Git (git add).
   * @param requestBody Массив путей к файлам для добавления.
   * @returns {Promise<void>}
   */
  static async addDocumentationArray(requestBody: string[]) {
    const { data } = await api.addDocumentationArrayPost({ requestBody });
    return data;
  }

  /**
   * Обновляет Git репозиторий.
   * @returns {Promise<BaseResponse>} Результат обновления.
   */
  static async gitUpdate() {
    const { data } = await api.gitUpdatePost();
    return data as BaseResponse;
  }

  /**
   * Индексирует все файлы в указанной директории (git add <directory_path>).
   * @param body Путь к директории для индексации.
   * @returns {Promise<void>}
   */
  static async indexDirectory(body: string) {
    const { data } = await api.addDocumentationDirectoryPost({ body });
    return data;
  }

  static async mergeBranch(branchName: string) {
    const { data } = await api.gitMergeBranchNamePost({ branchName });
    return data;
  }

  static async pushToOrigin(branchName: string) {
    const { data } = await api.gitPushBranchNamePost({ branchName });
    return data;
  }

  static async rebaseBranch(branchName: string) {
    const { data } = await api.gitRebaseBranchNamePost({ branchName });
    return data;
  }

  static async importEventGraphFromRepo(
    importEventGraphFromRepoPostRequest: ImportEventGraphFromRepoPostRequest,
    authorization: string
  ) {
    const { data } = await api.importEventGraphFromRepoPost({
      importEventGraphFromRepoPostRequest,
      authorization,
    });
    return data;
  }
}
