import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { ArtifactType, ParsedArgs } from './types';

/**
 * Парсит и валидирует аргументы командной строки.
 * @returns Промис с типизированным объектом аргументов.
 */
export async function parseArgv(): Promise<ParsedArgs> {
  const argv = await yargs(hideBin(process.argv))
    .option('type', {
      alias: 't',
      description: 'Тип артефакта для обновления: "jar", "schema" или "all"',
      type: 'string',
      choices: ['jar', 'schema', 'all'],
      default: 'all',
    })
    .option('force', {
      alias: 'f',
      description: 'Принудительно обновить артефакты, игнорируя проверку версий',
      type: 'boolean',
      default: false,
    })
    .option('dry-run', {
      description: 'Показать, что будет сделано, без реальных изменений',
      type: 'boolean',
      default: false,
    })
    .help()
    .alias('help', 'h')
    .strict().argv; // Включаем строгий режим для выявления неизвестных аргументов

  return {
    type: argv.type as ArtifactType,
    force: argv.force,
    dryRun: argv['dry-run'],
  };
}
