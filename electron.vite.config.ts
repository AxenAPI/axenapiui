import { builtinModules } from 'module';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { AliasOptions } from 'vite';
import compression from 'vite-plugin-compression';

const { default: react } = await import('@vitejs/plugin-react-swc');
const { default: tailwindcss } = await import('@tailwindcss/vite');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '.env') });

const ENVS = {
  NODE_ENV: process.env.NODE_ENV,
  PREVIEW: process.env.PREVIEW,
  LOCAL_SERVER: process.env.LOCAL_SERVER,
  DESKTOP: process.env.DESKTOP,
  LOCAL_SERVER_URL: process.env.LOCAL_SERVER_URL,
  CLOUD_SERVER_URL: process.env.CLOUD_SERVER_URL,
  ANALYZE: process.env.ANALYZE,
  LOCAL_URL: process.env.LOCAL_URL,
  LOCAL_URL_SPLASH: process.env.LOCAL_URL_SPLASH,
  READ_ONLY: process.env.READ_ONLY,
  YANDEX_COOKIE: process.env.YANDEX_COOKIE,
  YANDEX_CSRF_TOKEN: process.env.YANDEX_CSRF_TOKEN,
  YANDEX_COLLAB_ORG_ID: process.env.YANDEX_COLLAB_ORG_ID,
  YANDEX_ORG_ID: process.env.YANDEX_ORG_ID,
  NODE_TLS_REJECT_UNAUTHORIZED: process.env.NODE_TLS_REJECT_UNAUTHORIZED,
  YANDEX_SOURCE_SLUG: process.env.YANDEX_SOURCE_SLUG,
  YANDEX_DESTINATION: process.env.YANDEX_DESTINATION,
};

const ALIAS: AliasOptions = {
  '@common': resolve(__dirname, 'common'),
  '@packageJson': resolve(__dirname, 'package.json'),
  '@app': resolve(__dirname, 'src/app'),
  '@entities': resolve(__dirname, 'src/entities'),
  '@features': resolve(__dirname, 'src/features'),
  '@widgets': resolve(__dirname, 'src/widgets'),
  '@pages': resolve(__dirname, 'src/pages'),
  '@shared': resolve(__dirname, 'src/shared'),
  '@shared/openapi': resolve(__dirname, './src/shared/api/adapters/index.ts'),
  '@': resolve(__dirname, 'src'),
};

export default defineConfig({
  main: {
    ssr: {
      noExternal: ['electron-log'],
    },
    build: {
      minify: false,
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/main/index.ts'),
        },
        external: ['electron', 'path', 'fs', 'url', 'os', 'crypto', ...builtinModules.flatMap(m => [m, `node:${m}`])],
      },
    },
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: ALIAS,
    },
    define: {
      'process.env': ENVS,
    },
  },
  preload: {
    build: {
      minify: false,
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/preload/index.ts'),
        },
        external: ['electron', 'path', 'fs', 'url', 'os', 'crypto', ...builtinModules.flatMap(m => [m, `node:${m}`])],
        output: {
          format: 'cjs',
          entryFileNames: '[name].js',
        },
      },
    },
    plugins: [],
    resolve: {
      alias: ALIAS,
    },
    define: {
      'process.env': ENVS,
    },
  },
  renderer: {
    root: resolve(__dirname, 'src'),
    publicDir: resolve(__dirname, 'public'),
    build: {
      minify: 'esbuild', // или 'terser' для ещё более агрессивной минификации
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/index.html'),
          splashScreen: resolve(__dirname, 'src/splashScreen.html'),
        },
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            effector: ['effector', 'effector-react'],
            query: ['@tanstack/react-query'],
            swagger: ['swagger-ui-react', 'swagger-ui', 'swagger-ui-dist'],
            mermaid: ['mermaid'],
            monaco: ['@monaco-editor/react'],
            antd: ['antd'],
            uiKit: ['@axenix/ui-kit'],
            elkjs: ['elkjs'],
          },
        },
      },
    },
    resolve: {
      alias: ALIAS,
    },
    server: {
      port: 3000,
    },
    plugins: [
      react({}),
      tailwindcss(),
      compression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 1024, // файлы >1KB будут сжаты
      }),
      process.env.ANALYZE === 'true' &&
        visualizer({
          filename: 'stats.html',
          open: true, // автооткрытие после билда
          gzipSize: true,
          brotliSize: true,
        }),
    ].filter(Boolean),
    define: {
      'process.env': ENVS,
    },
  },
});
