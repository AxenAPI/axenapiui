// Этот файл реализует алгоритм кодирования, похожий на Base64, для PlantUML.
// Использование побитовых операторов (|, <<, >>, &) является намеренным и
// необходимым для логики алгоритма. Отключение правила 'no-bitwise'
// для этого файла — это осознанное решение.

function encode64(data: string): string {
  const r = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';
  let result = '';
  let current = 0;
  let bits = 0;

  for (let i = 0; i < data.length; i++) {
    current = (current << 8) | data.charCodeAt(i);
    bits += 8;
    while (bits >= 6) {
      bits -= 6;
      result += r[(current >> bits) & 0x3f];
    }
  }

  if (bits > 0) {
    result += r[(current << (6 - bits)) & 0x3f];
  }

  return result;
}

function deflate(input: string): Promise<Uint8Array> {
  // Используем встроенный CompressionStream, доступен в современных браузерах
  // fallback может быть нужен для старых браузеров
  if (!('CompressionStream' in window)) {
    return Promise.reject(new Error('CompressionStream API is not supported in this browser'));
  }
  const cs = new CompressionStream('deflate');
  const writer = cs.writable.getWriter();
  const encoder = new TextEncoder();
  writer.write(encoder.encode(input));
  writer.close();

  return new Response(cs.readable).arrayBuffer().then(buffer => new Uint8Array(buffer));
}

export async function encodePlantUML(text: string): Promise<string> {
  const compressed = await deflate(text);

  let binaryString = '';
  compressed.forEach(b => {
    binaryString += String.fromCharCode(b);
  });

  return encode64(binaryString);
}
