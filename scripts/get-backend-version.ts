import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import axios from 'axios';
import dotenv from 'dotenv';
import semver from 'semver';
import { parseStringPromise } from 'xml2js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
dotenv.config({ path: '.env.loc' });

// --- Конфигурация ---
const config = {
  nexusUrl: 'http://nexus-common.ru-central1.internal:8081',
  repository: 'maven-snapshots',
  groupId: 'pro.axenix-innovation.axenapi.web',
  artifactId: 'axenapi-web',
  packageJsonPath: join(__dirname, '..', 'package.json'),
  infoFilePath: join(__dirname, '..', 'src', 'shared', 'openapi', 'backend-info.json'),
  auth: {
    username: process.env.NEXUS_USERNAME || '',
    password: process.env.NEXUS_PASSWORD || '',
  },
};

// Функция для форматирования даты в "Month Day, Year" формат
function formatBuildDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Функция для удаления -SNAPSHOT из версии (в любом регистре)
function cleanVersion(version: string): string {
  return version.replace(/-SNAPSHOT/gi, '');
}

// Функция для обновления
function updateBackendInfoFile(backendVersion: string, buildDate: string): boolean {
  try {
    const data = {
      backendVersion,
      buildDate,
      updatedAt: new Date().toISOString(), // полезно для отладки
    };

    // Создаем папку, если она не существует
    const dir = dirname(config.infoFilePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(config.infoFilePath, JSON.stringify(data, null, 2));
    console.log(`Данные сохранены в ${config.infoFilePath}`);
    return true;
  } catch (error) {
    console.error('Ошибка записи файла:', (error as Error).message);
    return false;
  }
}

// Основная асинхронная функция
async function updateBackendInfo() {
  console.log(`Начинаем процесс получения информации о бэкенде...`);

  // Проверяем наличие учетных данных
  if (!config.auth.username || !config.auth.password) {
    console.error(
      'Ошибка: Учетные данные Nexus не найдены. Пожалуйста, создайте файл .env_loc и добавьте в него NEXUS_USERNAME и NEXUS_PASSWORD.'
    );
    process.exit(1);
  }

  try {
    // Шаг 1: Получаем префикс версии из package.json
    const packageJsonContent = readFileSync(config.packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);
    const projectVersion = packageJson.version;
    const versionPrefix = `${semver.major(projectVersion)}.${semver.minor(projectVersion)}`;
    console.log(`Версия проекта: ${projectVersion}. Используем префикс версии: ${versionPrefix}`);

    // Шаг 2: Получаем корневой maven-metadata.xml
    const groupPath = config.groupId.replace(/\./g, '/');
    const rootMetadataUrl = `${config.nexusUrl}/repository/${config.repository}/${groupPath}/${config.artifactId}/maven-metadata.xml`;

    console.log(`Получаем метаданные из Nexus...`);
    const rootMetadataResponse = await axios.get(rootMetadataUrl, { auth: config.auth });
    const rootMetadata = await parseStringPromise(rootMetadataResponse.data);
    const allVersions = rootMetadata.metadata.versioning[0].versions[0].version;

    // Шаг 3: Находим самую последнюю SNAPSHOT-версию
    const relevantVersions = allVersions.filter(
      (v: string) => v.startsWith(versionPrefix) && v.toLowerCase().includes('-snapshot')
    );
    if (relevantVersions.length === 0) {
      throw new Error(`Не найдено SNAPSHOT-версий для префикса ${versionPrefix}`);
    }

    const latestVersion = relevantVersions.sort((a: string, b: string) =>
      semver.rcompare(semver.coerce(a)!, semver.coerce(b)!)
    )[0];
    console.log(`Найдена последняя версия бэкенда: ${latestVersion}`);

    // Шаг 4: Очищаем версию от -SNAPSHOT и форматируем дату
    const cleanedVersion = cleanVersion(latestVersion);
    const formattedDate = formatBuildDate(new Date());

    console.log(`Очищенная версия: ${cleanedVersion}`);
    console.log(`Форматированная дата: ${formattedDate}`);

    // Шаг 5: Обновляем package.json
    const updateSuccess = updateBackendInfoFile(cleanedVersion, formattedDate);

    if (updateSuccess) {
      console.log('Процесс обновления информации о бэкенде успешно завершен.');
    } else {
      throw new Error('Не удалось обновить package.json');
    }
  } catch (e: unknown) {
    const error = e as { response?: { status: string; data: string }; message: string };
    console.error('Произошла ошибка:');
    if (error.response) {
      console.error(`  Статус: ${error.response.status}`);
      console.error(`  Данные: ${error.response.data}`);
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

// Запускаем основную функцию
updateBackendInfo();
