import { axiosClient, getApiConfig } from '@shared/api';
import {
  GitLabApiFactory,
  GitLabApiGetFileContentRequest,
  GitLabApiGetFileContentRawRequest,
  GitLabApiGetRepositoryTreeRequest,
} from '@shared/openapi';

const api = GitLabApiFactory(getApiConfig(), undefined, axiosClient);

export class GitLabService {
  /**
   * Получить дерево репозитория.
   * @param requestParameters Параметры запроса.
   * @returns {Promise<GitLabTreeEntry[]>} Дерево репозитория.
   */
  static async getRepositoryTree(requestParameters: GitLabApiGetRepositoryTreeRequest) {
    const { data } = await api.getRepositoryTree(requestParameters);
    return data;
  }

  /**
   * Получить метаданные и содержимое файла в base64.
   * @param requestParameters Параметры запроса.
   * @returns {Promise<GitLabFileContent>} Содержимое файла.
   */
  static async getFileContent(requestParameters: GitLabApiGetFileContentRequest) {
    const { data } = await api.getFileContent(requestParameters);
    return data;
  }

  /**
   * Получить сырое содержимое файла как текст.
   * @param requestParameters Параметры запроса.
   * @returns {Promise<string>} Содержимое файла.
   */
  static async getFileContentRaw(requestParameters: GitLabApiGetFileContentRawRequest) {
    const { data } = await api.getFileContentRaw(requestParameters);
    return data;
  }
}
