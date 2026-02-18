export default {
  // Для кода: линтим и форматируем только измененные файлы
  '*.{js,ts,jsx,tsx}': ['eslint --fix', 'prettier --write'],
  // Для статики: только форматируем измененные файлы
  '*.{json,html,css,scss,yaml,yml,md,mdx}': ['prettier --write'],
  // Для типов: запускаем проверку ВСЕГО проекта (без передачи списка файлов)
  '*.{ts,tsx}': () => ['yarn check-types:node', 'yarn check-types:web'],
};
