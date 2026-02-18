/**
 * Извлекает информацию о позиции ошибки из сообщения
 * @param error Сообщение об ошибке
 * @returns Объект с номерами строк и колонок или null
 */
const extractPosition = (
  error: string
): { line?: number; column?: number; endLine?: number; endColumn?: number } | null => {
  // Паттерн: (61:141-61:145) или (L61:C141) или (61:141)
  const positionMatch = error.match(/\((\d+):(\d+)(?:-(\d+):(\d+))?\)/);
  if (positionMatch) {
    return {
      line: parseInt(positionMatch[1], 10),
      column: parseInt(positionMatch[2], 10),
      endLine: positionMatch[3] ? parseInt(positionMatch[3], 10) : undefined,
      endColumn: positionMatch[4] ? parseInt(positionMatch[4], 10) : undefined,
    };
  }

  // Альтернативный паттерн: L1:C1
  const altMatch = error.match(/L(\d+):C(\d+)/);
  if (altMatch) {
    return {
      line: parseInt(altMatch[1], 10),
      column: parseInt(altMatch[2], 10),
    };
  }

  return null;
};

/**
 * Форматирует позицию ошибки для отображения
 * @param position Объект с позицией
 * @returns Строка с форматированной позицией
 */
const formatPosition = (position: ReturnType<typeof extractPosition>): string => {
  if (!position) return '';

  const { column, endColumn, endLine, line } = position;

  if (endLine && endColumn) {
    return ` (строка ${line}:${column}-${endLine}:${endColumn})`;
  }

  if (column) {
    return ` (строка ${line}:${column})`;
  }

  return ` (строка ${line})`;
};

/**
 * Определяет, можно ли автоматически исправить ошибку
 * @param error Оригинальное сообщение об ошибке
 * @returns true если ошибка автоисправляемая (теги <br>, <hr>)
 */
export const isAutoFixableError = (error: string): boolean => /Expected a closing tag for `<(br|hr)>`/i.test(error);

/**
 * Форматирует сообщение об ошибке парсинга Markdown на русском языке
 * @param error Оригинальное сообщение об ошибке (на английском)
 * @returns Локализованное сообщение об ошибке
 */
export const formatParseError = (error: string): string => {
  const position = extractPosition(error);
  const positionStr = formatPosition(position);

  // Паттерны для распространенных ошибок MDX
  const patterns: Array<{ regex: RegExp; message: string | ((match: RegExpMatchArray) => string) }> = [
    {
      regex: /Expected a closing tag for `<br>`/i,
      message: `Обнаружен незакрытый тег <br>${positionStr}. Используйте <br /> или экранируйте символы \\<br>`,
    },
    {
      regex: /Expected a closing tag for `<hr>`/i,
      message: `Обнаружен незакрытый тег <hr>${positionStr}. Используйте <hr /> или экранируйте символы \\<hr>`,
    },
    {
      regex: /Expected a closing tag for `<(\w+)>`/i,
      message: (match: RegExpMatchArray) =>
        `Обнаружен незакрытый тег <${match[1]}>${positionStr}. Закройте тег или используйте самозакрывающийся вариант <${match[1]} />`,
    },
    {
      regex: /Unexpected character `([^`]+)`/i,
      message: (match: RegExpMatchArray) => `Обнаружен неожиданный символ "${match[1]}"${positionStr} в разметке`,
    },
    {
      regex: /Unexpected character/i,
      message: `Обнаружен неожиданный символ${positionStr} в разметке`,
    },
    {
      regex: /Expected corresponding closing tag for `<(\w+)>`/i,
      message: (match: RegExpMatchArray) => `Ожидается закрывающий тег </${match[1]}>${positionStr}`,
    },
    {
      regex: /Unexpected end of file.*expected.*`<\/(\w+)>`/i,
      message: (match: RegExpMatchArray) =>
        `Неожиданный конец файла${positionStr}. Ожидается закрывающий тег </${match[1]}>`,
    },
    {
      regex: /Expected.*`([^`]+)`.*before/i,
      message: (match: RegExpMatchArray) => `Ожидается "${match[1]}"${positionStr}. Проверьте правильность разметки`,
    },
    {
      regex: /Expected.*before/i,
      message: `Ошибка синтаксиса${positionStr}: проверьте правильность разметки`,
    },
    {
      regex: /Unexpected.*token/i,
      message: `Неожиданный токен${positionStr} в разметке`,
    },
    {
      regex: /Cannot read properties of undefined/i,
      message: `Внутренняя ошибка парсера${positionStr}. Проверьте корректность разметки`,
    },
  ];

  for (const { message, regex } of patterns) {
    const match = error.match(regex);
    if (match) {
      return typeof message === 'function' ? message(match) : message;
    }
  }

  // Если паттерн не найден, возвращаем общее сообщение с позицией
  return `Ошибка парсинга разметки${positionStr}: ${error}`;
};
