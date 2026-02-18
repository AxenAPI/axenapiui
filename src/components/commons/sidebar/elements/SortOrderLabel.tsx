/**
 * Возвращает отображение сортировки
 *
 * @param {boolean} asc тип сортировки.
 */
export function SortOrderLabel(asc: boolean) {
  return (
    <span
      style={{
        fontSize: '12px',
        fontWeight: 500,
      }}
    >
      {asc ? 'A-Z' : 'Z-A'}
    </span>
  );
}
