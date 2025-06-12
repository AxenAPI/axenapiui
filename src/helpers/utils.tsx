/* eslint-disable react-refresh/only-export-components */

export const Capitalize = (input: string) => {
  const s = input.toLowerCase();
  return String(s[0]).toUpperCase() + String(s).slice(1);
};

/**
 * Checks is desktop build mode.
 */
export const checkIsDesktopMode = () => process.env.DESKTOP === 'true';

/**
 * Сортирует массив объектов по полю `name` в алфавитном или обратном порядке.
 *
 * @param {T[]} items - Входящий массив объектов для сортировки.
 * @param {boolean} asc тип сортировки.
 */
export const sortItems = <T extends {name: string}>(items: T[], asc: boolean): T[] =>
  [...items].sort((a, b) => {
    if (a.name < b.name) return asc ? -1 : 1;
    if (a.name > b.name) return asc ? 1 : -1;
    return 0;
  });

/**
 * Возвращает отображение сортировки
 *
 * @param {boolean} asc тип сортировки.
 */
export const SortOrderLabel = (asc: boolean) => (
  <span
    style={{
      position: 'absolute',
      top: 0,
      right: '15px',
      fontSize: '12px',
      fontWeight: 500,
    }}
  >
    {asc ? 'A-Z' : 'Z-A'}
  </span>
);
