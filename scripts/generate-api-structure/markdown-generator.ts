import { writeFileSync } from 'fs';

import { ApiDefinition } from './types';

export function generateMarkdown(apiDefinitions: ApiDefinition[], outputMdPath: string) {
  let markdown = '# API Structure\n\n';

  for (const apiDef of apiDefinitions) {
    markdown += `## ${apiDef.name}\n\n`;
    markdown += '| Method | Request DTO | Parameters | Response DTO |\n';
    markdown += '|---|---|---|---|\n';
    for (const method of apiDef.methods) {
      const methodName = `\`${method.name}\``;
      const requestDto = `\`${method.requestType || 'N/A'}\``;

      let paramsString = 'None';
      if (method.parameters.length > 0) {
        paramsString = method.parameters.map(p => `\`${p.name}: ${p.type.replace(/\|/g, '\\|')}\``).join(',<br>');
      }

      const responseDto = `\`${method.responseType || 'N/A'}\``;

      markdown += `| ${methodName} | ${requestDto} | ${paramsString} | ${responseDto} |\n`;
    }
    markdown += '\n';
  }

  writeFileSync(outputMdPath, markdown, 'utf8');
}
