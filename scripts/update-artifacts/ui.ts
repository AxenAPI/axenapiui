import chalk from 'chalk';
import ora, { Ora } from 'ora';

// --- Базовые цветные логи ---

export function info(message: string): void {
  console.log(chalk.blue(message));
}

export function success(message: string): void {
  console.log(chalk.green(message));
}

export function warn(message: string): void {
  console.log(chalk.yellow(message));
}

export function error(message: string): void {
  console.error(chalk.red(message));
}

// --- Структурированное логирование ---

/**
 * Создает визуальную группу для набора логов в консоли.
 * @param title Заголовок группы.
 * @param contentCallback Функция, содержащая вызовы console.log для группировки.
 */
export function group(title: string, contentCallback: () => void): void {
  console.log(chalk.bold(`\n--- ${title} ---`));
  console.group();
  try {
    contentCallback();
  } finally {
    console.groupEnd();
  }
}

// --- Спиннер для асинхронных операций ---

/**
 * Отображает спиннер во время выполнения асинхронной операции.
 * @param text Текст, отображаемый рядом со спиннером.
 * @param promise Промис, который нужно дождаться.
 * @returns Результат выполнения промиса.
 */
export async function spinner<T>(text: string, promise: Promise<T>): Promise<T> {
  const s: Ora = ora(text).start();
  try {
    const result = await promise;
    s.succeed();
    return result;
  } catch (e) {
    s.fail();
    throw e;
  }
}

/**
 * Упрощенный спиннер для операций, не возвращающих значение.
 * @param text Отображаемый текст.
 * @param promise Промис, который нужно дождаться.
 */
export async function spinnerVoid(text: string, promise: Promise<unknown>): Promise<void> {
  await spinner(text, promise);
}
