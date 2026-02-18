import { formatParseError, isAutoFixableError } from '../formatParseError';

describe('formatParseError', () => {
  describe('Извлечение позиции ошибки', () => {
    it('должен извлекать позицию из формата (line:col-line:col)', () => {
      const error = 'Expected a closing tag for `<br>` (61:141-61:145) before the end of `tableData`';
      const result = formatParseError(error);
      expect(result).toContain('(строка 61:141-61:145)');
      expect(result).toContain('незакрытый тег <br>');
    });

    it('должен извлекать позицию из формата (line:col)', () => {
      const error = 'Expected a closing tag for `<hr>` (10:5) before end';
      const result = formatParseError(error);
      expect(result).toContain('(строка 10:5)');
      expect(result).toContain('незакрытый тег <hr>');
    });

    it('должен извлекать позицию из формата L#:C#', () => {
      const error = 'Unexpected character `@` (L1:C1)';
      const result = formatParseError(error);
      expect(result).toContain('(строка 1:1)');
      expect(result).toContain('неожиданный символ "@"');
    });

    it('должен работать без позиции', () => {
      const error = 'Some error without position';
      const result = formatParseError(error);
      expect(result).not.toContain('(');
      expect(result).toContain('Ошибка парсинга разметки');
    });
  });

  describe('Локализация ошибок', () => {
    it('должен локализовать ошибку для незакрытого тега <br>', () => {
      const error = 'Expected a closing tag for `<br>` (61:141-61:145) before the end of `tableData`';
      const result = formatParseError(error);
      expect(result).toContain('незакрытый тег <br>');
      expect(result).toContain('<br />');
    });

    it('должен локализовать ошибку для незакрытого тега <hr>', () => {
      const error = 'Expected a closing tag for `<hr>` (10:5-10:9)';
      const result = formatParseError(error);
      expect(result).toContain('незакрытый тег <hr>');
      expect(result).toContain('<hr />');
    });

    it('должен локализовать ошибку для произвольного незакрытого тега', () => {
      const error = 'Expected a closing tag for `<div>` (5:1-5:6)';
      const result = formatParseError(error);
      expect(result).toContain('незакрытый тег <div>');
      expect(result).toContain('<div />');
    });

    it('должен локализовать ошибку "Unexpected character" с символом', () => {
      const error = 'Unexpected character `@` (L1:C1)';
      const result = formatParseError(error);
      expect(result).toContain('неожиданный символ "@"');
    });

    it('должен локализовать ошибку "Unexpected character" без символа', () => {
      const error = 'Unexpected character (5:10)';
      const result = formatParseError(error);
      expect(result).toContain('неожиданный символ');
      expect(result).toContain('(строка 5:10)');
    });

    it('должен локализовать ошибку "Expected corresponding closing tag"', () => {
      const error = 'Expected corresponding closing tag for `<div>` (10:5)';
      const result = formatParseError(error);
      expect(result).toContain('Ожидается закрывающий тег </div>');
      expect(result).toContain('(строка 10:5)');
    });

    it('должен локализовать ошибку "Unexpected end of file"', () => {
      const error = 'Unexpected end of file in element, expected closing tag `</div>` (15:1)';
      const result = formatParseError(error);
      expect(result).toContain('Неожиданный конец файла');
      expect(result).toContain('</div>');
    });

    it('должен локализовать ошибку "Expected...before" с токеном', () => {
      const error = 'Expected `>` before end of input (20:5)';
      const result = formatParseError(error);
      expect(result).toContain('Ожидается ">"');
      expect(result).toContain('(строка 20:5)');
    });

    it('должен локализовать ошибку "Expected...before" без токена', () => {
      const error = 'Expected something before end (8:3)';
      const result = formatParseError(error);
      expect(result).toContain('Ошибка синтаксиса');
      expect(result).toContain('(строка 8:3)');
    });

    it('должен локализовать ошибку "Unexpected token"', () => {
      const error = 'Unexpected token found (12:7)';
      const result = formatParseError(error);
      expect(result).toContain('Неожиданный токен');
      expect(result).toContain('(строка 12:7)');
    });

    it('должен локализовать внутреннюю ошибку парсера', () => {
      const error = 'Cannot read properties of undefined (reading "type") (3:1)';
      const result = formatParseError(error);
      expect(result).toContain('Внутренняя ошибка парсера');
      expect(result).toContain('(строка 3:1)');
    });

    it('должен возвращать общее сообщение для неизвестной ошибки', () => {
      const error = 'Some unknown parsing error (7:2)';
      const result = formatParseError(error);
      expect(result).toContain('Ошибка парсинга разметки');
      expect(result).toContain('(строка 7:2)');
      expect(result).toContain(error);
    });
  });

  describe('Граничные случаи', () => {
    it('должен обрабатывать ошибку с диапазоном позиций', () => {
      const error = 'Error at (5:10-5:20)';
      const result = formatParseError(error);
      expect(result).toContain('(строка 5:10-5:20)');
    });

    it('должен обрабатывать ошибку с многострочным диапазоном', () => {
      const error = 'Error at (5:10-8:5)';
      const result = formatParseError(error);
      expect(result).toContain('(строка 5:10-8:5)');
    });

    it('должен обрабатывать пустую строку', () => {
      const error = '';
      const result = formatParseError(error);
      expect(result).toContain('Ошибка парсинга разметки');
    });
  });

  describe('isAutoFixableError', () => {
    it('должен определять автоисправляемую ошибку для <br>', () => {
      const error = 'Expected a closing tag for `<br>` (61:141-61:145)';
      expect(isAutoFixableError(error)).toBe(true);
    });

    it('должен определять автоисправляемую ошибку для <hr>', () => {
      const error = 'Expected a closing tag for `<hr>` (10:5)';
      expect(isAutoFixableError(error)).toBe(true);
    });

    it('должен определять неавтоисправляемую ошибку для других тегов', () => {
      const error = 'Expected a closing tag for `<div>` (5:1)';
      expect(isAutoFixableError(error)).toBe(false);
    });

    it('должен определять неавтоисправляемую ошибку для других типов ошибок', () => {
      const error = 'Unexpected character `@` (L1:C1)';
      expect(isAutoFixableError(error)).toBe(false);
    });
  });
});
