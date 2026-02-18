const fs = require('fs');
const path = require('path');

// Расширения файлов исходного кода
const SOURCE_EXTENSIONS = [
  '.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.scss', '.sass',
  '.html', '.yml', '.yaml', '.md', '.txt', '.xml', '.config'
];

// Папки и файлы для игнорирования
const IGNORE_PATTERNS = [
  'node_modules',
  '.yarn',
  '.vite',
  'dist',
  'build',
  'coverage',
  'reports',
  'jar-files',
  '.git',
  'installers',
  'local-packages',
  '.husky',
  'data',
  '.tgz',
  '.jar',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.ico',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.gz',
  'package-lock.json',
  'yarn.lock',
  '.yarnrc.yml'
];

// Паттерны для поиска конфиденциальных данных
const SENSITIVE_PATTERNS = [
  /password\s*[:=]\s*['"][^'"]+['"]/gi,
  /token\s*[:=]\s*['"][^'"]+['"]/gi,
  /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/gi,
  /secret\s*[:=]\s*['"][^'"]+['"]/gi,
  /auth\s*[:=]\s*['"][^'"]+['"]/gi,
  /bearer\s+[a-zA-Z0-9\-._~+/]+=*/gi,
  /login\s*[:=]\s*['"][^'"]+['"]/gi,
  /username\s*[:=]\s*['"][^'"]+['"]/gi,
  /email\s*[:=]\s*['"][^'"]+['"]/gi,
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
];

function shouldIgnore(filePath) {
  const normalizedPath = filePath.replace(/\\/g, '/');
  return IGNORE_PATTERNS.some(pattern => normalizedPath.includes(pattern));
}

function isSourceFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return SOURCE_EXTENSIONS.includes(ext);
}

function sanitizeContent(content) {
  let sanitized = content;
  
  SENSITIVE_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, (match) => {
      if (match.includes(':') || match.includes('=')) {
        const parts = match.split(/[:=]/);
        return `${parts[0]}:***REDACTED***`;
      }
      return '***REDACTED***';
    });
  });
  
  return sanitized;
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    
    if (shouldIgnore(fullPath)) {
      return;
    }

    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else if (isSourceFile(fullPath)) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

function combineSourceCode() {
  const rootDir = process.cwd();
  const outputFile = path.join(rootDir, 'combined-source-code.txt');
  
  console.log('Сканирование файлов...');
  const allFiles = getAllFiles(rootDir);
  
  console.log(`Найдено файлов: ${allFiles.length}`);
  
  let combinedContent = `Total files combined: ${allFiles.length}\n\n`;
  combinedContent += '='.repeat(80) + '\n\n';
  
  allFiles.forEach((filePath, index) => {
    try {
      const fileName = path.basename(filePath);
      const content = fs.readFileSync(filePath, 'utf8');
      const sanitizedContent = sanitizeContent(content);
      
      combinedContent += `File: ${fileName}\n`;
      combinedContent += '-'.repeat(80) + '\n';
      combinedContent += sanitizedContent + '\n';
      combinedContent += '='.repeat(80) + '\n\n';
      
      if ((index + 1) % 50 === 0) {
        console.log(`Обработано файлов: ${index + 1}/${allFiles.length}`);
      }
    } catch (error) {
      console.error(`Ошибка при чтении файла ${filePath}:`, error.message);
    }
  });
  
  fs.writeFileSync(outputFile, combinedContent, 'utf8');
  console.log(`\nГотово! Файлы объединены в: ${outputFile}`);
  console.log(`Всего объединено файлов: ${allFiles.length}`);
}

// Запуск скрипта
combineSourceCode();
