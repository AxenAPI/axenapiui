/**
 * Нормализует блоки кода в Markdown:
 * 1. Исправляет неподдерживаемые языки на `json`.
 * 2. Экранирует вложенные блоки кода, которые ломают разметку (имеют >= кавычек, чем родитель).
 *
 * @param markdown Исходный Markdown
 * @param supportedLanguages Объект с поддерживаемыми языками (ключ — имя языка)
 * @returns Нормализованный Markdown
 */
export const normalizeCodeBlocks = (markdown: string, supportedLanguages: Record<string, string>): string => {
  const lines = markdown.split(/\r?\n/);
  let inCodeBlock = false;
  let currentFenceLength = 0;
  let currentFenceChar = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Ищем fence (``` или ~~~) в начале строки (с учетом отступа)
    const match = line.match(/^([ \t]*)([`~]{3,})(.*)$/);

    if (match) {
      const indent = match[1]; // отступ
      const fence = match[2]; // кавычки
      const fenceLength = fence.length;
      const fenceChar = fence[0];
      const content = match[3].trim(); // язык или info string

      if (!inCodeBlock) {
        // --- ОТКРЫТИЕ БЛОКА ---
        inCodeBlock = true;
        currentFenceLength = fenceLength;
        currentFenceChar = fenceChar;

        // Нормализация языка
        const langPart = content.split(' ')[0].toLowerCase();

        // Если язык указан, но не поддерживается -> меняем на json
        if (langPart && !supportedLanguages[langPart]) {
          lines[i] = `${indent}${fence}json`;
        } else if (!langPart && content === '') {
          // Если язык вообще не указан -> меняем на json
          lines[i] = `${indent}${fence}json`;
        }
      } else {
        // --- ВНУТРИ БЛОКА ---
        const isClosing = fenceChar === currentFenceChar && fenceLength >= currentFenceLength && content === '';

        if (isClosing) {
          // Закрываем блок
          inCodeBlock = false;
          currentFenceLength = 0;
          currentFenceChar = '';
        } else {
          if (fenceLength >= currentFenceLength) {
            // Экранируем: ``` -> \`\`\`
            lines[i] = line.replace(fence, '\\' + fence);
          }
        }
      }
    }
  }

  return lines.join('\n');
};
