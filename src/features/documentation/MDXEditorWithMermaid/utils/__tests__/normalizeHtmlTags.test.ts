import { normalizeHtmlTags } from '../normalizeHtmlTags';

describe('normalizeHtmlTags', () => {
  it('должен заменять <br> на <br />', () => {
    const input = 'Строка 1<br>Строка 2';
    const expected = 'Строка 1<br />Строка 2';
    expect(normalizeHtmlTags(input)).toBe(expected);
  });

  it('должен заменять <br > (с пробелом) на <br />', () => {
    const input = 'Строка 1<br >Строка 2';
    const expected = 'Строка 1<br />Строка 2';
    expect(normalizeHtmlTags(input)).toBe(expected);
  });

  it('не должен изменять уже закрытые теги <br />', () => {
    const input = 'Строка 1<br />Строка 2';
    expect(normalizeHtmlTags(input)).toBe(input);
  });

  it('не должен изменять уже закрытые теги <br/>', () => {
    const input = 'Строка 1<br/>Строка 2';
    expect(normalizeHtmlTags(input)).toBe(input);
  });

  it('должен обрабатывать множественные теги <br>', () => {
    const input = 'Строка 1<br>Строка 2<br>Строка 3';
    const expected = 'Строка 1<br />Строка 2<br />Строка 3';
    expect(normalizeHtmlTags(input)).toBe(expected);
  });

  it('должен заменять <hr> на <hr />', () => {
    const input = 'Текст<hr>Еще текст';
    const expected = 'Текст<hr />Еще текст';
    expect(normalizeHtmlTags(input)).toBe(expected);
  });

  it('должен обрабатывать теги в разных регистрах', () => {
    const input = 'Строка 1<BR>Строка 2<Br>Строка 3';
    const expected = 'Строка 1<br />Строка 2<br />Строка 3';
    expect(normalizeHtmlTags(input)).toBe(expected);
  });

  it('должен обрабатывать теги в таблицах Markdown', () => {
    const input = `| колонка |
| ------- |
| Строка 1<br>Строка 2<br>Строка 3 |`;
    const expected = `| колонка |
| ------- |
| Строка 1<br />Строка 2<br />Строка 3 |`;
    expect(normalizeHtmlTags(input)).toBe(expected);
  });

  it('должен обрабатывать комбинацию <br> и <hr>', () => {
    const input = 'Текст<br>Еще текст<hr>Последний текст';
    const expected = 'Текст<br />Еще текст<hr />Последний текст';
    expect(normalizeHtmlTags(input)).toBe(expected);
  });
});
