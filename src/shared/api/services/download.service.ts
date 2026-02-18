import { axiosClient, getApiConfig } from '@shared/api';
import { DownloadApiFactory } from '@shared/openapi';

const api = DownloadApiFactory(getApiConfig(), undefined, axiosClient);

export class DownloadService {
  /**
   * Скачивает DOCX спецификацию по ID файла.
   * @param fileId ID файла.
   * @returns {Promise<File>} Скачанный файл.
   */
  static async downloadDocx(fileId: string) {
    const { data } = await api.downloadDocxFileIdDocxGet({ fileId });
    return data;
  }

  /**
   * Скачивает Markdown спецификацию по ID файла.
   * @param fileId ID файла.
   * @returns {Promise<File>} Скачанный файл.
   */
  static async downloadMarkdown(fileId: string) {
    const { data } = await api.downloadMarkdownFileIdMdGet({ fileId });
    return data;
  }

  /**
   * Скачивает PDF спецификацию по ID файла.
   * @param fileId ID файла.
   * @returns {Promise<File>} Скачанный файл.
   */
  static async downloadPdf(fileId: string) {
    const { data } = await api.downloadPdfFileIdPdfGet({ fileId });
    return data;
  }

  /**
   * Скачивает JSON спецификацию по ID файла.
   * @param fileId ID файла.
   * @returns {Promise<File>} Скачанный файл.
   */
  static async downloadJsonSpec(fileId: string) {
    const { data } = await api.downloadSpecsFileIdJsonGet({ fileId });
    return data;
  }

  /**
   * Скачивает YAML спецификацию по ID файла.
   * @param fileId ID файла.
   * @returns {Promise<File>} Скачанный файл.
   */
  static async downloadYamlSpec(fileId: string) {
    const { data } = await api.downloadSpecsFileIdYamlGet({ fileId });
    return data;
  }
}
