/**
 * Нормализует HTML-теги в Markdown для совместимости с MDX:
 * - Заменяет незакрытые теги <br> на самозакрывающиеся <br />
 * - Заменяет незакрытые теги <hr> на самозакрывающиеся <hr />
 * @param markdown Исходный Markdown
 * @returns Нормализованный Markdown
 */
export const normalizeHtmlTags = (markdown: string): string => {
  let normalized = markdown;

  // Заменяем <br> на <br /> (если не уже закрыт)
  // Паттерн: <br> или <br > (с пробелами), но не <br/> и не <br />
  normalized = normalized.replace(/<br\s*(?!\/)>/gi, '<br />');

  // Заменяем <hr> на <hr /> (если не уже закрыт)
  normalized = normalized.replace(/<hr\s*(?!\/)>/gi, '<hr />');

  // Экранируем теги, похожие на типы данных (с большой буквы), например <String>, <BranchInfo>.
  normalized = normalized.replace(/([^\\])<([A-Z][a-zA-Z0-9]*)(>)/g, '$1\\<$2$3');

  // Экранируем закрывающие теги типов данных, например </String>, </BranchInfo>.
  normalized = normalized.replace(/([^\\])(<\/)([A-Z][a-zA-Z0-9]*)(>)/g, '$1\\<$3$4');

  // Заменяем автоссылки <http://...> на [url](url), чтобы MDX не путал их с тегами.
  normalized = normalized.replace(/<(https?:\/\/[^>]+)>/g, '[$1]($1)');

  return normalized;
};
