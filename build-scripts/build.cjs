const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = query => new Promise(resolve => rl.question(query, resolve));

async function start() {
  try {
    console.log('=== Мастер сборки проекта ===');

    // 1. Путь к проекту
    let projectPath = await question(`Введите путь к проекту (Enter для текущей [${process.cwd()}]): `);
    projectPath = path.resolve(projectPath || process.cwd());

    if (!fs.existsSync(projectPath)) {
      console.error(`Ошибка: Путь не найден: ${projectPath}`);
      process.exit(1);
    }

    process.chdir(projectPath);
    console.log(`Работаем в: ${process.cwd()}`);

    // 2. Работа с Git
    if (fs.existsSync('.git')) {
      console.log('Обновление списка веток...');
      execSync('git fetch --all --prune', { stdio: 'inherit' });

      const currentBranch = execSync('git branch --show-current').toString().trim();
      let targetBranch = await question(`Какую ветку собрать? (Enter для текущей [${currentBranch}]): `);
      targetBranch = targetBranch || currentBranch;

      console.log(`Переключение на ${targetBranch} и принудительное обновление...`);
      execSync(`git checkout ${targetBranch}`, { stdio: 'inherit' });
      execSync(`git reset --hard origin/${targetBranch}`, { stdio: 'inherit' });
    } else {
      console.log('Это не git-репозиторий, пропускаем обновление кода.');
    }

    // 3. Команды сборки
    console.log('--- 1. Установка зависимостей ---');
    execSync('yarn install', { stdio: 'inherit' });

    console.log('--- 2. Принудительное обновление ---');
    execSync('yarn update:force', { stdio: 'inherit' });

    console.log('--- 3. Сборка для Windows ---');
    execSync('yarn build:win', { stdio: 'inherit' });

    console.log('\n=======================================');
    console.log('Успех! Сборка завершена.');
  } catch (error) {
    console.error('\nПроизошла ошибка при выполнении:');
    console.error(error.message);
  } finally {
    await question('Нажмите Enter, чтобы выйти...');
    rl.close();
  }
}

start();
