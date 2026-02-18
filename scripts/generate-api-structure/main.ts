import path, { join } from 'path';
import { fileURLToPath } from 'url';

import { generateJson } from './json-generator';
import { generateMarkdown } from './markdown-generator';
import { parseApi } from './parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_TS_PATH = join(__dirname, '..', '..', 'src', 'shared', 'openapi', 'api.ts');
const OUTPUT_JSON_PATH = join(__dirname, '..', '..', 'docs', 'api_structure.json');
const OUTPUT_MD_PATH = join(__dirname, '..', '..', 'docs', 'api_structure.md');

async function main() {
  console.log('Starting API structure generation...');
  try {
    console.log(`Parsing API from: ${API_TS_PATH}`);
    const apiDefinitions = parseApi(API_TS_PATH);

    if (!apiDefinitions || apiDefinitions.length === 0) {
      console.error('Could not find any API definitions. Check the parser logic and the input file.');
      process.exit(1);
    }

    console.log(`Found ${apiDefinitions.length} API definitions.`);

    console.log(`Generating JSON output to: ${OUTPUT_JSON_PATH}`);
    generateJson(apiDefinitions, OUTPUT_JSON_PATH);

    console.log(`Generating Markdown output to: ${OUTPUT_MD_PATH}`);
    generateMarkdown(apiDefinitions, OUTPUT_MD_PATH);

    console.log('API structure generation completed successfully.');
    process.exit(0);
  } catch (e) {
    console.error('Error during script execution:', e);
    process.exit(1);
  }
}

main();
