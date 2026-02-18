import { writeFileSync } from 'fs';

import { ApiDefinition } from './types';

export function generateJson(apiDefinitions: ApiDefinition[], outputJsonPath: string) {
  writeFileSync(outputJsonPath, JSON.stringify(apiDefinitions, null, 2), 'utf8');
}
