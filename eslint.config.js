import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier';
import jestPlugin from 'eslint-plugin-jest';
import sortDestructureKeys from 'eslint-plugin-sort-destructure-keys';

export default tseslint.config(
  {
    // 1. Глобальные исключения
    ignores: [
      'node_modules/**',
      'dist/**',
      'out/**',
      'coverage/**',
      'reports/**',
      '.yarn/**',
      '*.tgz',
      '*.lock',
      'local-packages/**',
      'jar-files/**',
      'eslint.config.js',
      '.eslintrc.cjs',
      'postcss.config.cjs',
      'src/shared/openapi/**',
      'build-scripts/**',
    ],
  },

  // Базовая конфигурация
  ...tseslint.configs.recommended,

  // 2. Глобальная конфигурация для всех файлов
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      'sort-destructure-keys': sortDestructureKeys,
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-shadow': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-interface': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-var-requires': 'warn',
      'arrow-body-style': ['warn', 'as-needed'],
      'max-len': [
        'error',
        { code: 120, comments: 120, ignoreStrings: true, ignoreTemplateLiterals: true, ignoreRegExpLiterals: true },
      ],
      'no-trailing-spaces': ['error', { skipBlankLines: true }],
      'no-param-reassign': 'warn',
      'sort-destructure-keys/sort-destructure-keys': ['warn', { caseSensitive: false }],
      'consistent-return': 'off',
      'no-plusplus': 'off',
      'no-shadow': 'off',
      'no-underscore-dangle': 'off',
      'no-void': 'off',
      'camelcase': 'warn',
      'no-use-before-define': ['error', { functions: true, classes: true, variables: false }],
    },
  },

  // 3. Конфигурация для Node.js и служебных файлов
  {
    files: [
      'electron/**/*.ts',
      'scripts/**/*.ts',
      'openapi/scripts/**/*.ts',
      '*.config.ts',
      '*.config.js',
      '*.cjs',
      'jest.*.ts',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        project: 'tsconfig.node.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'import/no-extraneous-dependencies': 'off',
    },
  },

  // 4. Конфигурация для React-кода (src)
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        project: 'tsconfig.web.json',
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'no-console': 'error',
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      'react/jsx-key': 'error',
      'react/jsx-filename-extension': ['warn', { extensions: ['.tsx', '.jsx'] }],
      'react/destructuring-assignment': 'off',
      'react/function-component-definition': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-no-useless-fragment': 'off',
      'react/require-default-props': 'off',

      // Отключаем ненужные или слишком "шумные" правила
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'react/no-unknown-property': ['error', { ignore: ['partition', 'webpreferences'] }],

      'react-hooks/rules-of-hooks': 'error',

      // Отключаем правила React Compiler, так как проект на React 18
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/use-memo': 'off',
      'react-hooks/incompatible-library': 'off',

      // Понижаем до предупреждений, чтобы не блокировать работу
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
    },
  },

  // 5. Конфигурация для eslint-plugin-import (глобально)
  {
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: ['tsconfig.web.json', 'tsconfig.node.json'],
        },
        node: true,
      },
    },
    rules: {
      'import/extensions': ['error', 'ignorePackages', { js: 'never', jsx: 'never', ts: 'never', tsx: 'never' }],
      'import/no-unresolved': 'error',
      'import/prefer-default-export': 'off',
      'import/order': [
        'warn',
        {
          'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'pathGroups': [
            { pattern: '@common/**', group: 'internal', position: 'after' },
            { pattern: '@app/**', group: 'internal', position: 'after' },
            { pattern: '@entities/**', group: 'internal', position: 'after' },
            { pattern: '@features/**', group: 'internal', position: 'after' },
            { pattern: '@widgets/**', group: 'internal', position: 'after' },
            { pattern: '@pages/**', group: 'internal', position: 'after' },
            { pattern: '@shared/**', group: 'internal', position: 'after' },
            { pattern: '@/**', group: 'internal', position: 'after' },
            { pattern: '@packageJson', group: 'internal', position: 'after' },
          ],
          'newlines-between': 'always',
          'alphabetize': { order: 'asc', caseInsensitive: true },
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react',
              importNames: ['default'],
              message:
                "Импортируйте хуки и типы из React по одному (например, `import { useState } from 'react'`). Глобальный импорт `React` не нужен.",
            },
          ],
          patterns: [
            { group: ['@/app', '@/app/*'], message: 'Используйте "@app" вместо "@/app".' },
            { group: ['@/entities', '@/entities/*'], message: 'Используйте "@entities" вместо "@/entities".' },
            { group: ['@/features', '@/features/*'], message: 'Используйте "@features" вместо "@/features".' },
            { group: ['@/widgets', '@/widgets/*'], message: 'Используйте "@widgets" вместо "@/widgets".' },
            { group: ['@/pages', '@/pages/*'], message: 'Используйте "@pages" вместо "@/pages".' },
            { group: ['@/shared', '@/shared/*'], message: 'Используйте "@shared" вместо "@/shared".' },
            { group: ['@/common', '@/common/*'], message: 'Используйте "@common" вместо "@/common".' },
          ],
        },
      ],
    },
  },

  // Отдельное правило для логгера
  {
    files: ['src/shared/lib/logger.ts'],
    rules: {
      'no-console': 'off',
    },
  },

  // 6. Конфигурация для тестов
  {
    files: ['**/*.test.{ts,tsx}', '**/test/**', 'jest.setup.ts', '**/__mocks__/**'],
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
      'import/no-extraneous-dependencies': 'off',
    },
  },

  // 7. Prettier должен быть последним
  prettierConfig
);
