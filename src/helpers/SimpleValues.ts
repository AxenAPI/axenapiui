/**
 * Класс массива простейших объектов-значений, в которых текст и непосредственное значение
 * совпадают. Синтаксический сахар для удобства заведения данных для списков.
 *
 * @example const options = new SimpleValues('0', '2'); // [{ label: '0', value: '0' }, { label: '2', value: '2' }]
 */
export class SimpleValues<T extends string> extends Array {
  constructor(...values: T[]) {
    super(...(values as [])); // хак, чтобы не переусложнять типизацию

    // eslint-disable-next-line no-constructor-return
    return values.map(value => ({
      label: value,
      value,
    }));
  }
}
