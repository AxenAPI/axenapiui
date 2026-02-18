/**
 * @file Определения TypeScript-типов
 */
import { AxiosBasicCredentials } from 'axios';

export type ArtifactType = 'jar' | 'schema' | 'all';

export interface ParsedArgs {
  type: ArtifactType;
  force: boolean;
  dryRun: boolean;
}

export type LocalVersions = {
  jar: string | null;
  schema: string | null;
};

export interface IArtifactManager {
  getLocalVersions(): Promise<LocalVersions>;

  updateJar(jarAsset: Asset, auth: AxiosBasicCredentials): Promise<void>;

  updateSchemas(zipAsset: Asset, auth: AxiosBasicCredentials): Promise<void>;

  readVersionFromFile(filePath: string): Promise<string | null>;

  writeVersionToFile(filePath: string, version: string): Promise<void>;

  downloadFile(url: string, outputPath: string, auth: AxiosBasicCredentials, spinnerText: string): Promise<void>;

  cleanupOldJars(currentJarName: string): Promise<void>;

  cleanupOldSchemas(): Promise<void>;

  extractAllYamlFromZip(zipPath: string): Promise<void>;
}

export type ValidBuild = {
  jarAsset: Asset;
  zipAsset: Asset;
  version: string;
};

export interface INexusClient {
  auth: AxiosBasicCredentials;

  findLatestSnapshotVersion(): Promise<string>;

  findLatestValidBuild(version: string): Promise<ValidBuild>;

  findAllBuildsForVersion(version: string): Promise<Item[]>;

  getAssetsFromBuild(build: Item): { jarAsset: Asset; zipAsset: Asset } | null;
}

/**
 * Представляет собой один ассет (файл) в Nexus.
 */
export interface Asset {
  /**
   * Прямая ссылка для скачивания файла.
   * @example "http://nexus-common.../axenapi-web-2.4.0-....jar"
   */
  downloadUrl: string;
  /**
   * Путь к файлу внутри репозитория Nexus.
   * @example "pro/axenix-innovation/axenapi/web/axenapi-web/2.4.0-SNAPSHOT/axenapi-web-2.4.0-....jar"
   */
  path: string;
  /**
   * Уникальный идентификатор ассета.
   */
  id: string;
  /**
   * Имя репозитория, в котором находится ассет.
   * @example "maven-snapshots"
   */
  repository: string;
  /**
   * Формат ассета.
   * @example "maven2"
   */
  format: string;
  /**
   * Объект с контрольными суммами файла.
   */
  checksum: {
    sha1: string;
    md5: string;
  };
}

/**
 * Представляет собой один элемент (компонент), найденный через поиск Nexus API.
 */
export interface Item {
  /**
   * Уникальный идентификатор элемента.
   */
  id: string;
  /**
   * Имя репозитория.
   */
  repository: string;
  /**
   * Формат элемента.
   */
  format: string;
  /**
   * Group ID артефакта.
   * @example "pro.axenix-innovation.axenapi.web"
   */
  group: string;
  /**
   * Имя (artifactId) артефакта.
   * @example "axenapi-web"
   */
  name: string;
  /**
   * Полная, конкретная версия артефакта, включая timestamp и номер сборки.
   * @example "2.4.0-20251119.092546-3"
   */
  version: string;
  /**
   * Массив ассетов (файлов), принадлежащих этому элементу.
   */
  assets: Asset[];
}
