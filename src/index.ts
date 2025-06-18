import electronSquirrelStartup from 'electron-squirrel-startup';

import {spawn} from 'child_process';
import {app, BrowserWindow, dialog, ipcMain} from 'electron';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as path from 'path';

import {EMPTY_CHAR} from '@/constants/common';
import {DocNodes} from '@/types/common';
import {createFile} from '@/utils/createFile';
import {createFolder} from '@/utils/createFolder';
import {deleteFile} from '@/utils/deleteFile';
import {deleteFolder} from '@/utils/deleteFolder';

import {
  appExitLogger,
  coreErrorLogger,
  coreLogger,
  getJarPath,
  getJDKPath,
  handleDownload,
  handleReloadApp,
  killProcess,
} from './helpers/electron';

const isDevMode = process.env.NODE_ENV === 'development';
const isLocalServer = process.env.LOCAL_SERVER === 'true';
let childPid: number;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (electronSquirrelStartup) app.quit();

/**
 * Функция для чтения дерева документации из локального репозитория
 *
 * @param {string} repoPath Путь к репозиторию
 * @param {string} baseUrl Путь до папки
 * @param {boolean} isRoot Флаг корневого репозитория
 */
function readRepoTree(repoPath: string, baseUrl = EMPTY_CHAR, isRoot = true): DocNodes[] {
  const entries = fs.readdirSync(repoPath, {withFileTypes: true});

  const filteredEntries = isRoot
    ? entries.filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
    : entries.filter(entry => !entry.name.startsWith('.'));

  return filteredEntries.map(entry => {
    const fullPath = path.join(repoPath, entry.name);
    if (entry.isDirectory()) {
      return {
        id: entry.name,
        title: entry.name,
        children: readRepoTree(fullPath, path.join(baseUrl, entry.name), false),
      };
    }
    const nameWithoutExt = entry.name.replace(/\.[^/.]+$/, EMPTY_CHAR);
    return {
      id: entry.name,
      title: nameWithoutExt,
      url: path.join(baseUrl, nameWithoutExt).replace(/\\/g, '/'),
    };
  });
}

export function renameFile(oldFileName: string, newFileName: string, directory: string): Promise<void> {
  const oldPath = `${directory}/${oldFileName}.md`;
  const newPath = `${directory}/${newFileName}.md`;

  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, error => {
      if (error) {
        console.error('Ошибка при переименовании:', error);
        reject(error);
      } else {
        console.log('Файл успешно переименован');
        resolve();
      }
    });
  });
}

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 1080,
    width: 1920,
    show: false,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false,
      contextIsolation: true,
      defaultEncoding: 'UTF-8',
    },
    title: 'AxenApi',
    icon: path.resolve(__dirname, '/src/assets/logo.png'),
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.setMenu(null);

  // Create the browser window.
  if (!isDevMode) {
    const splashWindow = new BrowserWindow({
      height: 1080,
      width: 1920,
      webPreferences: {
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        nodeIntegration: false,
        contextIsolation: true,
        defaultEncoding: 'UTF-8',
      },
      title: 'AxenApi',
      icon: path.resolve(__dirname, '/src/assets/logo.png'),
    });

    splashWindow.loadURL(SPLASH_SCREEN_WEBPACK_ENTRY);
    splashWindow.setMenu(null);

    // Обработчик события от splash screen
    ipcMain.once('splash-ready', () => {
      if (!mainWindow.webContents.isLoading()) {
        mainWindow.show();
        splashWindow.close();
      } else {
        mainWindow.webContents.once('did-finish-load', () => {
          mainWindow.show();
          splashWindow.close();
        });
      }
    });
  } else {
    mainWindow.show();
  }

  // Open DevTools only when running in development mode
  if (isDevMode) mainWindow.webContents.openDevTools();

  ipcMain.on('download', async (event, downloads) => {
    try {
      await handleDownload(event, downloads);
    } catch (error) {
      console.error('Download failed:', error);
    }
  });

  ipcMain.on('reload-app', () => {
    if (mainWindow) handleReloadApp(mainWindow);
  });

  ipcMain.handle('get-repo-tree', (_event, repoPath: string) => {
    if (!fs.existsSync(repoPath)) return [];
    return readRepoTree(repoPath);
  });

  ipcMain.handle('read-file', async (_event, filePath: string) => {
    try {
      const content = await fsPromises.readFile(filePath, 'utf-8');
      return {success: true, content};
    } catch (error) {
      return {success: false, error: error.message};
    }
  });

  ipcMain.handle('write-file', async (_event, filePath: string, content: string) => {
    try {
      await fsPromises.writeFile(filePath, content, 'utf-8');
      return {success: true};
    } catch (error) {
      return {success: false, error: error.message || String(error)};
    }
  });

  ipcMain.handle('create-folder', async (_event, folderPath: string) => {
    await createFolder(folderPath);
  });

  ipcMain.handle('delete-folder', async (_, folderPath: string) => {
    await deleteFolder(folderPath);
  });

  ipcMain.handle('create-file', async (_event, filePath: string, content: string) => {
    await createFile(filePath, content);
  });

  ipcMain.handle('delete-file', async (_, filePath: string) => {
    await deleteFile(filePath);
  });

  ipcMain.handle('rename-file', async (_, oldFileName: string, newFileName: string, directory: string) => {
    await renameFile(oldFileName, newFileName, directory);
  });

  if (!isDevMode && isLocalServer) {
    // Обработка ошибок загрузки.
    mainWindow.webContents.on('did-fail-load', (_, __, errorDescription) => {
      dialog
        .showMessageBox(mainWindow, {
          type: 'error',
          title: 'Loading error',
          message: `Error: ${errorDescription}`,
          buttons: ['Restart', 'Exit'],
        })
        .then(({response}) => {
          if (response === 0) {
            app.relaunch();
            app.exit();
          } else {
            app.quit();
          }
        });
    });

    // Обработка ошибок в renderer консоли.
    mainWindow.webContents.on('console-message', (_, level, message) => {
      if (level === 4) {
        dialog.showMessageBox(mainWindow, {
          type: 'error',
          title: 'Application error',
          message: `Error: ${message}`,
          buttons: ['Ok'],
        });
      }
    });

    // Обработка ошибок preload-скрипта.
    mainWindow.webContents.on('preload-error', (_, __, {message}) => {
      dialog
        .showMessageBox(mainWindow, {
          type: 'error',
          title: 'Preload script error',
          message: `Error: ${message}`,
          buttons: ['Restart', 'Exit'],
        })
        .then(({response}) => {
          if (response === 0) {
            app.relaunch();
            app.exit();
          } else {
            app.quit();
          }
        });
    });

    // Обработка ошибок загрузки ресурсов.
    mainWindow.webContents.session.webRequest.onErrorOccurred(({error, url}) => {
      if (!url.includes('index.html')) {
        dialog
          .showMessageBox(mainWindow, {
            type: 'error',
            title: 'Loading error',
            message: `Resource not found:
URL: ${url}
Error: ${error}`,
            buttons: ['Restart', 'Exit'],
          })
          .then(({response}) => {
            if (response === 0) {
              app.relaunch();
              app.exit();
            } else {
              app.quit();
            }
          });
      }
    });
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  if (isLocalServer) {
    // starts local java service with in-app JDK
    const childProcess = spawn(getJDKPath(), ['-jar', getJarPath()]);

    childPid = childProcess.pid;

    childProcess.on('spawn', () => {
      console.log(`Process started with PID: ${childPid}`);
    });

    childProcess.stderr.on('data', data => {
      coreErrorLogger.info(`\n${data}`);
    });

    childProcess.on('exit', code => {
      appExitLogger.info(`Child process exited with code: ${code}`);
    });

    childProcess.stdout.on('data', data => {
      coreLogger.info(`\n${data}`);
    });
  }

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

if (isLocalServer) {
  app.on('will-quit', () => {
    killProcess(childPid);
  });

  app.on('before-quit', () => {
    killProcess(childPid);
  });
}

app.on('window-all-closed', () => {
  if (isLocalServer) killProcess(childPid);
  if (process.platform !== 'darwin') app.quit();
});
