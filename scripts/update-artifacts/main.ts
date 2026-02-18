import fs from 'fs';
import path from 'path';
import * as readline from 'readline';

import dotenv from 'dotenv';

import { parseArgv } from './argv';
import { ArtifactManager } from './artifact-manager';
import { config } from './config';
import { NexusClient } from './nexus-client';
import * as ui from './ui';

// --- Загрузка переменных окружения ---
dotenv.config();
dotenv.config({ path: '.env.loc' });

// --- Основная логика приложения ---

/**
 * Главная функция-оркестратор.
 */
async function main() {
  const argv = await parseArgv();
  const nexusClient = new NexusClient();
  const artifactManager = new ArtifactManager();

  // 1. Поиск последней доступной версии артефактов в Nexus
  const latestSnapshot = await ui.spinner(
    'Поиск последней SNAPSHOT-версии...',
    nexusClient.findLatestSnapshotVersion()
  );

  ui.info(`Найдена последняя SNAPSHOT-версия: ${latestSnapshot}`);

  const latestBuild = await ui.spinner('Поиск валидной сборки...', nexusClient.findLatestValidBuild(latestSnapshot));

  const latestJarName = path.basename(latestBuild.jarAsset.path);
  const latestSchemaName = path.basename(latestBuild.zipAsset.path);

  ui.group('Последние версии артефактов', () => {
    ui.info(`JAR:    ${latestJarName}`);
    ui.info(`Схема: ${latestSchemaName}`);
  });

  // 2. Сравнение с локальными версиями
  const localVersions = await artifactManager.getLocalVersions();
  let isJarUpToDate = localVersions.jar === latestJarName;
  let isSchemaUpToDate = localVersions.schema === latestSchemaName;

  if (argv.force) {
    ui.warn('Режим --force: локальные версии будут проигнорированы.');
    isJarUpToDate = false;
    isSchemaUpToDate = false;
  }

  // 3. Определение задач для выполнения
  const shouldUpdateJar = argv.type === 'all' || argv.type === 'jar';
  const shouldUpdateSchema = argv.type === 'all' || argv.type === 'schema';

  const willUpdateJar = shouldUpdateJar && !isJarUpToDate;
  const willUpdateSchema = shouldUpdateSchema && !isSchemaUpToDate;

  // 4. Выполнение (или пробный запуск)
  if (argv.dryRun) {
    ui.group('Пробный запуск (--dry-run)', () => {
      if (shouldUpdateJar) ui.info(`Проверка JAR: ${isJarUpToDate ? 'актуален' : 'требуется обновление'}`);
      if (shouldUpdateSchema) ui.info(`Проверка схемы: ${isSchemaUpToDate ? 'актуальна' : 'требуется обновление'}`);

      if (!willUpdateJar && !willUpdateSchema) {
        ui.success('Все запрашиваемые артефакты уже актуальны.');
      } else {
        if (willUpdateJar) ui.warn('Действие: будет скачан и установлен новый JAR.');
        if (willUpdateSchema) ui.warn('Действие: будут скачаны и извлечены новые схемы.');
      }
    });
    return;
  }

  if (!willUpdateJar && !willUpdateSchema) {
    ui.success('\nВсе запрашиваемые артефакты уже актуальны.');
    return;
  }

  // 5. Запуск реального обновления
  ui.group('Обновление артефактов', async () => {
    if (willUpdateJar) {
      await artifactManager.updateJar(latestBuild.jarAsset, nexusClient.auth);
    }
    if (willUpdateSchema) {
      await artifactManager.updateSchemas(latestBuild.zipAsset, nexusClient.auth);
    }
  });

  ui.success('\nАртефакты успешно обновлены!');
}

// --- Обработка ошибок ---

/**
 * Запрашивает у пользователя подтверждение в консоли.
 * @param question Вопрос для пользователя.
 * @returns `true`, если пользователь ввел 'y' или 'Y', иначе `false`.
 */
function askForConfirmation(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    rl.question(`${question} (y/n) `, answer => {
      rl.close();
      resolve(answer.trim().toLowerCase() === 'y');
    });
  });
}

/**
 * Проверяет, существуют ли локальные артефакты, чтобы можно было продолжить работу в случае сбоя.
 */
async function canContinueWithLocal(): Promise<boolean> {
  const artifactManager = new ArtifactManager();
  const versions = await artifactManager.getLocalVersions();
  const jarPath = versions.jar ? path.join(config.jarDir, versions.jar) : '';
  const jarExists = !!versions.jar && fs.existsSync(jarPath);
  const schemaExists = !!versions.schema; // Проверяем только наличие файла-метки
  return jarExists && schemaExists;
}

// --- Точка входа в скрипт ---

main().catch(async err => {
  ui.error(`\nКритическая ошибка в процессе обновления:`);
  ui.error((err as Error).message);

  if (await canContinueWithLocal()) {
    ui.warn('\nОбнаружены локальные версии артефактов.');
    const shouldContinue = await askForConfirmation(
      'Произошла ошибка обновления, но можно продолжить с локальными версиями. Продолжить?'
    );
    if (shouldContinue) {
      ui.success('Продолжаем работу с локальными версиями.');
      process.exit(0);
    } else {
      ui.error('Операция прервана пользователем.');
      process.exit(1);
    }
  } else {
    ui.error('\nЛокальные версии артефактов не найдены. Работа невозможна.');
    process.exit(1);
  }
});
