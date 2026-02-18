import axios, { AxiosBasicCredentials } from 'axios';
import semver from 'semver';
import { parseStringPromise } from 'xml2js';

import packageJson from '../../package.json';

import { config } from './config';
import { Asset, INexusClient, Item, ValidBuild } from './types';
import * as ui from './ui';

/**
 * Инкапсулирует все взаимодействия с API репозитория артефактов Nexus.
 */
export class NexusClient implements INexusClient {
  private readonly _auth: AxiosBasicCredentials;

  public get auth(): AxiosBasicCredentials {
    return this._auth;
  }

  constructor() {
    const { NEXUS_PASSWORD, NEXUS_USERNAME } = process.env;
    if (!NEXUS_USERNAME || !NEXUS_PASSWORD) {
      throw new Error(
        'Учетные данные Nexus не найдены. Пожалуйста, создайте файл .env.loc и укажите в нем NEXUS_USERNAME и NEXUS_PASSWORD.'
      );
    }
    this._auth = { username: NEXUS_USERNAME, password: NEXUS_PASSWORD };
  }

  /**
   * Находит последнюю SNAPSHOT-версию (например, "2.6.0-SNAPSHOT"),
   * соответствующую мажорной/минорной версии из package.json.
   */
  public async findLatestSnapshotVersion(): Promise<string> {
    const projectVersion = packageJson.version;
    const versionPrefix = `${semver.major(projectVersion)}.${semver.minor(projectVersion)}`;
    ui.info(`Версия проекта: ${projectVersion}. Используем префикс версии: ${versionPrefix}`);

    const groupPath = config.groupId.replace(/\./g, '/');
    const rootMetadataUrl = `${config.nexusUrl}/repository/${config.repository}/${groupPath}/${config.artifactId}/maven-metadata.xml`;

    const rootMetadataResponse = await axios.get(rootMetadataUrl, { auth: this._auth });
    const rootMetadata = await parseStringPromise(rootMetadataResponse.data);
    const allVersions: string[] = rootMetadata.metadata.versioning[0].versions[0].version;

    const relevantVersions = allVersions.filter(v => v.startsWith(versionPrefix) && v.endsWith('-SNAPSHOT'));

    if (relevantVersions.length === 0) {
      throw new Error(`Не найдено SNAPSHOT-версий для префикса ${versionPrefix}`);
    }

    // Сортируем, чтобы найти самую свежую версию
    const latestVersion = relevantVersions.sort((a, b) => semver.rcompare(semver.coerce(a)!, semver.coerce(b)!))[0];

    return latestVersion;
  }

  /**
   * Находит самую свежую валидную сборку для указанной SNAPSHOT-версии.
   * Валидная сборка должна содержать и .jar, и .zip ассеты.
   * @param version Строка SNAPSHOT-версии (например, "2.6.0-SNAPSHOT").
   */
  public async findLatestValidBuild(version: string): Promise<ValidBuild> {
    const allBuilds = await this.findAllBuildsForVersion(version);

    for (const build of allBuilds) {
      const assets = this.getAssetsFromBuild(build);
      if (assets) {
        ui.success(`Найдена валидная сборка: ${build.version}`);
        return { ...assets, version: build.version };
      }
      ui.warn(`Сборка ${build.version} пропущена (отсутствуют необходимые ассеты).`);
    }

    throw new Error(`Не найдено валидных сборок для версии ${version}`);
  }

  /**
   * Запрашивает все сборки для указанной базовой версии через Nexus Search API.
   * @param version Базовая SNAPSHOT-версия.
   */
  public async findAllBuildsForVersion(version: string): Promise<Item[]> {
    const searchUrl = new URL(`${config.nexusUrl}/service/rest/v1/search`);
    searchUrl.searchParams.append('repository', config.repository);
    searchUrl.searchParams.append('group', config.groupId);
    searchUrl.searchParams.append('name', config.artifactId);
    searchUrl.searchParams.append('maven.baseVersion', version);
    searchUrl.searchParams.append('sort', 'version');
    searchUrl.searchParams.append('direction', 'desc');

    const response = await axios.get<{ items: Item[] }>(searchUrl.toString(), { auth: this._auth });

    if (response.data.items.length === 0) {
      throw new Error(`Не найдено сборок для версии ${version}`);
    }

    return response.data.items;
  }

  /**
   * Извлекает .jar и .zip ассеты из элемента сборки.
   * @param build Элемент сборки.
   * @returns Ассеты или null, если один из них отсутствует.
   */
  public getAssetsFromBuild(build: Item): { jarAsset: Asset; zipAsset: Asset } | null {
    const jarAsset = build.assets.find(a => a.path.endsWith('.jar'));
    const zipAsset = build.assets.find(a => a.path.endsWith('.zip'));

    if (!jarAsset || !zipAsset) {
      return null;
    }

    return { jarAsset, zipAsset };
  }
}
