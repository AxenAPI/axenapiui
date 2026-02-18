import { createWriteStream } from 'fs';
import { readdir, readFile, rename, unlink, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { basename, join } from 'path';

import axios, { AxiosBasicCredentials } from 'axios';
import { Entry, open } from 'yauzl';

import { config, JAR_VERSION_FILE, SCHEMA_VERSION_FILE } from './config';
import { Asset, IArtifactManager, LocalVersions } from './types';
import * as ui from './ui';

/**
 * Инкапсулирует все операции с файловой системой для управления артефактами.
 */
export class ArtifactManager implements IArtifactManager {
  /**
   * Читает установленные версии артефактов из файлов .version.
   */
  public async getLocalVersions(): Promise<LocalVersions> {
    const [jar, schema] = await Promise.all([
      this.readVersionFromFile(JAR_VERSION_FILE),
      this.readVersionFromFile(SCHEMA_VERSION_FILE),
    ]);
    return { jar, schema };
  }

  /**
   * Скачивает и устанавливает JAR-артефакт.
   * Включает скачивание, перемещение файла, очистку старых версий и обновление файла-метки.
   * @param jarAsset Ассет для скачивания.
   * @param auth Учетные данные Nexus.
   */
  public async updateJar(jarAsset: Asset, auth: AxiosBasicCredentials): Promise<void> {
    const finalJarName = basename(jarAsset.path);
    const finalJarPath = join(config.jarDir, finalJarName);
    const tempJarPath = `${finalJarPath}.tmp`;

    await this.downloadFile(jarAsset.downloadUrl, tempJarPath, auth, `Скачивание JAR: ${finalJarName}`);

    await ui.spinnerVoid(
      'Установка JAR...',
      (async () => {
        await rename(tempJarPath, finalJarPath);
        await this.cleanupOldJars(finalJarName);
        await this.writeVersionToFile(JAR_VERSION_FILE, finalJarName);
      })()
    );
  }

  /**
   * Скачивает и извлекает все YAML-файлы схем из ZIP-артефакта.
   * Включает скачивание, очистку директории, извлечение файлов и обновление файла-метки.
   * @param zipAsset Ассет для скачивания.
   * @param auth Учетные данные Nexus.
   */
  public async updateSchemas(zipAsset: Asset, auth: AxiosBasicCredentials): Promise<void> {
    const zipName = basename(zipAsset.path);
    const tempZipPath = join(tmpdir(), zipName);

    await this.downloadFile(zipAsset.downloadUrl, tempZipPath, auth, `Скачивание схем: ${zipName}`);

    await ui.spinnerVoid(
      'Установка схем...',
      (async () => {
        await this.cleanupOldSchemas();
        await this.extractAllYamlFromZip(tempZipPath);
        await unlink(tempZipPath);
        await this.writeVersionToFile(SCHEMA_VERSION_FILE, zipName);
      })()
    );
  }

  public async readVersionFromFile(filePath: string): Promise<string | null> {
    try {
      return await readFile(filePath, 'utf-8');
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  public async writeVersionToFile(filePath: string, version: string): Promise<void> {
    await writeFile(filePath, version, 'utf-8');
  }

  public async downloadFile(
    url: string,
    outputPath: string,
    auth: AxiosBasicCredentials,
    spinnerText: string
  ): Promise<void> {
    const promise = new Promise<void>((resolve, reject) => {
      const writer = createWriteStream(outputPath);
      axios({ url, method: 'GET', responseType: 'stream', auth })
        .then(response => {
          response.data.pipe(writer);
          writer.on('finish', resolve);
          writer.on('error', reject);
        })
        .catch(reject);
    });
    await ui.spinnerVoid(spinnerText, promise);
  }

  public async cleanupOldJars(currentJarName: string): Promise<void> {
    const files = await readdir(config.jarDir);
    const oldJars = files.filter(
      file => file.startsWith(config.artifactId) && file.endsWith('.jar') && file !== currentJarName
    );
    for (const file of oldJars) {
      await unlink(join(config.jarDir, file));
    }
  }

  public async cleanupOldSchemas(): Promise<void> {
    const files = await readdir(config.schemaDir);
    const oldSchemas = files.filter(file => file.endsWith('.yaml') || file.endsWith('.yml'));
    for (const file of oldSchemas) {
      await unlink(join(config.schemaDir, file));
    }
  }

  public async extractAllYamlFromZip(zipPath: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const pendingWrites: Promise<void>[] = [];

      open(zipPath, { lazyEntries: true }, (err, zipfile) => {
        if (err) return reject(err);

        zipfile.on('entry', (entry: Entry) => {
          const fileName = basename(entry.fileName);
          if (fileName.endsWith('.yml') || fileName.endsWith('.yaml')) {
            const writePromise = new Promise<void>((resolveStream, rejectStream) => {
              zipfile.openReadStream(entry, (readStreamErr, readStream) => {
                if (readStreamErr) return rejectStream(readStreamErr);

                const outputPath = join(config.schemaDir, fileName);
                const writeStream = createWriteStream(outputPath);

                readStream.pipe(writeStream);
                writeStream.on('finish', resolveStream);
                writeStream.on('error', rejectStream);
              });
            });
            pendingWrites.push(writePromise);
          }
          zipfile.readEntry();
        });

        zipfile.on('end', async () => {
          if (pendingWrites.length === 0) {
            return reject(new Error(`В архиве не найдено файлов *.yaml или *.yml.`));
          }
          try {
            await Promise.all(pendingWrites);
            resolve();
          } catch (writeErr) {
            reject(writeErr);
          }
        });

        zipfile.readEntry();
      });
    });
  }
}
