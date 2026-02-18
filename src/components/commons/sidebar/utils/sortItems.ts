/**
 * Сортирует массив объектов по полю `name` в алфавитном или обратном порядке.
 *
 * @param {T[]} items - Входящий массив объектов для сортировки.
 * @param {boolean} asc тип сортировки.
 */
export function sortItems<T extends { name: string }>(items: T[], asc: boolean): T[] {
  return [...items].sort((a, b) => {
    if (a.name < b.name) return asc ? -1 : 1;
    if (a.name > b.name) return asc ? 1 : -1;
    return 0;
  });
}
