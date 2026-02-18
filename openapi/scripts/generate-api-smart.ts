import { exec } from 'child_process';
import { readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const execAsync = promisify(exec);

// --- Пути к файлам-меткам ---
const SCHEMA_VERSION_FILE = join(__dirname, '..', '.version-schema');
const GENERATED_VERSION_FILE = join(__dirname, '..', '.version-generated');
const OUTPUT_DIR = join(__dirname, '..', '..', 'src', 'shared', 'openapi');

/**
 * Читает версию из файла. Возвращает null, если файл не найден.
 */
async function readVersion(filePath: string): Promise<string | null> {
  try {
    return await readFile(filePath, 'utf-8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

/**
 * Выполняет команду в дочернем процессе и выводит ее stdout/stderr.
 */
async function runCommand(command: string) {
  console.log(`\n> ${command}`);
  const { stderr, stdout } = await execAsync(command);
  if (stdout) console.log(stdout);
  if (stderr) console.error(stderr);
}

/**
 * Основная логика скрипта
 */
async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option('force', {
      alias: 'f',
      description: 'Принудительно запустить генерацию, игнорируя проверку версий',
      type: 'boolean',
      default: false,
    })
    .help()
    .alias('help', 'h').argv;

  const schemaVersion = await readVersion(SCHEMA_VERSION_FILE);
  const generatedVersion = await readVersion(GENERATED_VERSION_FILE);

  console.log(`Версия схемы на диске: ${schemaVersion || 'не найдена'}`);
  console.log(`Версия сгенерированного клиента: ${generatedVersion || 'не найдена'}`);

  if (!schemaVersion) {
    console.log('Файл версии схемы не найден. Запустите "yarn update-artifacts", чтобы скачать схему.');
  }

  if (schemaVersion && schemaVersion === generatedVersion && !argv.force) {
    console.log('\nAPI клиент уже актуален. Пропускаем генерацию.');
    return;
  }

  if (argv.force) {
    console.log('\nОбнаружен флаг --force. Принудительно запускаем генерацию API клиента...');
  } else {
    console.log('\nВерсии отличаются. Запускаем генерацию API клиента...');
  }

  try {
    // Шаг 1: Очистка предыдущей генерации
    await runCommand(`yarn rimraf ${OUTPUT_DIR}`);
    console.log('Предыдущая версия клиента очищена.');

    // Шаг 2: Генерация кода
    await runCommand('yarn openapi-generator-cli generate');

    // Шаг 3: При успехе обновляем файл-метку
    if (schemaVersion) {
      await writeFile(GENERATED_VERSION_FILE, schemaVersion, 'utf-8');
      console.log(`\nГенерация завершена. Версия клиента обновлена до: ${schemaVersion}`);
    } else {
      console.warn(
        '\nВнимание: генерация завершена, но не удалось обновить версию клиента, так как версия схемы неизвестна.'
      );
    }
  } catch (error) {
    console.error('\nОшибка во время генерации API клиента:', error);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Произошла непредвиденная ошибка:', err);
  process.exit(1);
});
