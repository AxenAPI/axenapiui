import { spawn } from 'child_process';
import * as fsPromises from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import log from 'electron-log/main.js';
import ELK, { type ElkNode } from 'elkjs/lib/elk.bundled.js';

import { YANDEX_WEBVIEW } from '@common/constants';
import type { YandexHeaders } from '@common/types';

import {
  checkBackendHealth,
  coreErrorLogger,
  coreLogger,
  getJarPath,
  getJDKPath,
  handleCaptureYandexHeaders,
  handleDownload,
  handleOpenUrl,
  handleReloadApp,
  handleYandexImport,
  killProcess,
  logit,
  setupYandexWebviewSession,
} from './utils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const elk = new ELK();

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

log.initialize();

logit.debug('Electron log initialized.');
logit.debug(
  'App starting: process.env.LOCAL_SERVER is ',
  process.env.LOCAL_SERVER,
  ', app.isPackaged is',
  app.isPackaged
);

const isDevMode = process.env.NODE_ENV === 'development';
const isLocalServer = process.env.LOCAL_SERVER === 'true';
let childPid: number;

const preloadPath = path.join(__dirname, '../preload/index.js');

const createSplashWindow = (): BrowserWindow => {
  const splashWindow = new BrowserWindow({
    height: 360,
    width: 640,
    show: false,
    frame: false,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true,
      defaultEncoding: 'UTF-8',
    },
    title: 'AxenApi',
    icon: path.resolve(__dirname, '../../public/images/favicon.png'),
  });

  if (isDevMode) {
    splashWindow.loadURL(process.env.LOCAL_URL_SPLASH!);
  } else {
    splashWindow.loadFile(path.join(__dirname, '../renderer/splashScreen.html'));
  }
  // Скрываем меню
  splashWindow.setMenuBarVisibility(false);

  // Можно оставить, чтобы Alt показывал меню
  splashWindow.autoHideMenuBar = true;

  return splashWindow;
};

const createWindow = (): BrowserWindow => {
  const mainWindow = new BrowserWindow({
    height: 1080,
    width: 1920,
    show: false,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true,
      defaultEncoding: 'UTF-8',
      webviewTag: true, // Enable <webview> tag
    },
    title: 'AxenApi',
    icon: path.resolve(__dirname, '../../public/images/favicon.png'),
  });

  if (isDevMode) {
    mainWindow.loadURL(process.env.LOCAL_URL!);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
  // Скрываем меню
  mainWindow.setMenuBarVisibility(false);

  // Можно оставить, чтобы Alt показывал меню
  mainWindow.autoHideMenuBar = true;

  // Open DevTools only when running in development mode
  if (isDevMode) {
    mainWindow.webContents.openDevTools();
  }

  ipcMain.on('download', async (event, downloads) => {
    try {
      await handleDownload(event, downloads);
    } catch (error) {
      logit.error('Download failed:', error);
    }
  });

  ipcMain.handle('open-url', async (_event, url) => {
    try {
      return await handleOpenUrl(url);
    } catch (error) {
      logit.error('Open URL failed:', error);
    }
  });

  ipcMain.on('reload-app', () => {
    if (mainWindow) handleReloadApp(mainWindow);
  });

  ipcMain.handle('read-file', async (_event, filePath: string) => {
    try {
      const content = await fsPromises.readFile(filePath, 'utf-8');
      return { success: true, content };
    } catch (error) {
      return { success: false, error: (error as unknown as Error).message };
    }
  });

  ipcMain.handle('write-file', async (_event, filePath: string, content: string) => {
    try {
      await fsPromises.writeFile(filePath, content, 'utf-8');
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as unknown as Error).message || String(error) };
    }
  });

  ipcMain.on(
    'start-yandex-import',
    async (
      _,
      {
        destination,
        yandexHeaders,
        yandexWikiUrl,
      }: { destination: string; yandexWikiUrl: string; yandexHeaders: YandexHeaders }
    ) => {
      await handleYandexImport(mainWindow, destination, yandexWikiUrl, yandexHeaders);
    }
  );

  ipcMain.handle(
    YANDEX_WEBVIEW.CAPTURE_HEADERS,
    async (_, webContentsId: number): Promise<YandexHeaders | null> => handleCaptureYandexHeaders(webContentsId)
  );

  ipcMain.handle('elk-layout', async (_, graph: ElkNode): Promise<ElkNode> => elk.layout(graph));

  logit.debug('isLocalServer is ', isLocalServer);

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
        .then(({ response }) => {
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
        // Игнорируем ожидаемые ошибки health-check до старта бэкенда
        if (typeof message === 'string' && (message.includes('Health check error') || message.includes('/health'))) {
          logit.error('Health check error');
          return;
        }
        dialog.showMessageBox(mainWindow, {
          type: 'error',
          title: 'Application error',
          message: `Error: ${message}`,
          buttons: ['Ok'],
        });
      }
    });

    // Обработка ошибок preload-скрипта.
    mainWindow.webContents.on('preload-error', (_, __, { message }) => {
      dialog
        .showMessageBox(mainWindow, {
          type: 'error',
          title: 'Preload script error',
          message: `Error: ${message}`,
          buttons: ['Restart', 'Exit'],
        })
        .then(({ response }) => {
          if (response === 0) {
            app.relaunch();
            app.exit();
          } else {
            app.quit();
          }
        });
    });

    // Обработка ошибок загрузки ресурсов.
    mainWindow.webContents.session.webRequest.onErrorOccurred(({ error, url }) => {
      // Игнорируем ошибки health-check, пока бэкенд не поднялся
      logit.error('Resource not found:', url, error);
      if (url.includes('/health')) return;
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
          .then(({ response }) => {
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
  return mainWindow;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  setupYandexWebviewSession(); // Настраиваем сессию для Яндекс Webview

  if (!isLocalServer) {
    createWindow();
    return;
  }

  const splashWindow = createSplashWindow();

  splashWindow.on('ready-to-show', () => {
    splashWindow.show();
  });

  logit.debug('isLocalServer is true. Checking for existing backend...');

  const healthCheckUrl = `${process.env.LOCAL_SERVER_URL}/health`;
  const isBackendAlreadyRunning = await checkBackendHealth(healthCheckUrl);

  const showMainWindow = () => {
    const mainWindow = createWindow();
    mainWindow.webContents.once('did-finish-load', () => {
      logit.info('Main window loaded. Showing main window and closing splash screen.');
      mainWindow.show();
      splashWindow.close();
    });
  };

  if (isBackendAlreadyRunning) {
    logit.info('External backend is ready. Creating main window...');
    splashWindow.webContents.send('backend-ready');
    showMainWindow();
  } else {
    logit.info('No external backend detected. Spawning local server...');
    const { finalJdkPath: jdkPath, isDev } = getJDKPath();
    const jarPath = getJarPath();
    const workDir = isDev ? process.cwd() : app.getPath('userData');

    const childProcess = spawn(jdkPath, ['-jar', jarPath], { cwd: workDir });
    childPid = childProcess.pid as number;

    childProcess.on('error', err => {
      logit.error('Failed to start child process:', err);
      // Optionally, you could inform the splash screen of the error
      // splashWindow.webContents.send('startup-error', { message: err.message });
    });

    childProcess.on('exit', code => {
      logit.info(`Child process exited with code: ${code}`);
    });

    // --- Final stdout-based readiness check ---
    let isBackendReady = false;
    childProcess.stdout.on('data', data => {
      coreLogger.info(`\n${data}`);
      logit.info(`On stdout data \n${data}`);

      if (!isBackendReady && data.toString().includes('Started Main')) {
        isBackendReady = true;
        logit.info('Backend is ready. Sending "backend-ready" IPC and creating main window...');
        splashWindow.webContents.send('backend-ready');
        showMainWindow();
      }
    });

    childProcess.stderr.on('data', data => {
      coreErrorLogger.info(`\n${data}`);
      logit.info(`On stderr data \n${data}`);
    });
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

if (isLocalServer) {
  app.on('will-quit', () => {
    logit.info('will-quit event received, killing core process with pid:', childPid);
    killProcess(childPid);
  });

  app.on('before-quit', () => {
    logit.info('before-quit event received, killing core process with pid:', childPid);
    killProcess(childPid);
  });
}

app.on('window-all-closed', () => {
  if (isLocalServer) {
    logit.info('window-all-closed event received, killing core process with pid:', childPid);
    killProcess(childPid);
  }
  if (process.platform !== 'darwin') {
    logit.info('window-all-closed event received, quitting app');
    app.quit();
  }
});
