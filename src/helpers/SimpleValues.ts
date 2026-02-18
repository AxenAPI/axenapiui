/**
 * Создает массив опций для списков, в которых текст и значение совпадают.
 *
 * @example const options = createSimpleOptions('0', '2'); // [{ label: '0', value: '0' }, { label: '2', value: '2' }]
 */
export const createSimpleOptions = <T extends string>(...values: T[]): { label: T; value: T }[] =>
  values.map(value => ({
    label: value,
    value,
  }));
