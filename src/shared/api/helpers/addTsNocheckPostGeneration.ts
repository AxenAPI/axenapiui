/**
 * Workaround для issue https://github.com/OpenAPITools/openapi-generator/issues/8961
 * Помогает избавиться от ошибок "error TS6133: ... is declared but its value is never read."
 * на прекоммите в сгенерированных файлах
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Добавляет строку `// @ts-nocheck` в начало указанного файла.
 * @param filePath - Путь к файлу.
 */
function addTsNocheckToFile(filePath: string): void {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return;
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');

    if (!fileContent.startsWith('// @ts-nocheck')) {
      const newContent = `// @ts-nocheck\n${fileContent}`;

      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Added "// @ts-nocheck" to ${filePath}`);
    } else {
      console.log(`File ${filePath} already contains "// @ts-nocheck". Skipping...`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, (error as Error).message);
  }
}

const apiFilePath = path.resolve('./src/shared/api/event-graph-api/api.ts');

addTsNocheckToFile(apiFilePath);
