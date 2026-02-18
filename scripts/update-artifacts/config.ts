import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @file Основной конфигурационный файл скрипта обновления артефактов.
 * Содержит константы и параметры для подключения к Nexus и путей в проекте.
 */

/**
 * Ключевые параметры для работы с артефактами в Nexus и в локальной файловой системе.
 */
export const config = {
  /**
   * URL-адрес сервера Nexus.
   */
  nexusUrl: 'http://nexus-common.ru-central1.internal:8081',
  /**
   * Имя репозитория в Nexus, где хранятся SNAPSHOT-сборки.
   */
  repository: 'maven-snapshots',
  /**
   * Group ID целевого Maven-артефакта.
   */
  groupId: 'pro.axenix-innovation.axenapi.web',
  /**
   * Artifact ID целевого Maven-артефакта.
   */
  artifactId: 'axenapi-web',
  /**
   * Абсолютный путь к директории для хранения JAR-файлов.
   */
  jarDir: join(__dirname, '..', '..', 'jar-files'),
  /**
   * Абсолютный путь к директории для сохранения файлов схем.
   */
  schemaDir: join(__dirname, '..', '..', 'openapi'),
};

/**
 * Абсолютный путь к файлу-метке, хранящему версию текущего JAR-файла.
 */
export const JAR_VERSION_FILE = join(config.jarDir, '.version-jar');

/**
 * Абсолютный путь к файлу-метке, хранящему версию ZIP-архива, из которого была взята схема.
 */
export const SCHEMA_VERSION_FILE = join(config.schemaDir, '.version-schema');
