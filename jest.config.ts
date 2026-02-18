import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.web.json',
      },
    ],
    '^.+\\.(css|scss|sass)$': 'jest-transform-css',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/?(*.)+(test).[tj]s?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@entities/(.*)$': '<rootDir>/src/entities/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@widgets/(.*)$': '<rootDir>/src/widgets/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@common/(.*)$': '<rootDir>/common/$1',
    '^@packageJson$': '<rootDir>/package.json',
    '^@defs/': '<rootDir>/types/$1',
    '^.+\\.module\\.(css|scss|sass)$': 'identity-obj-proxy',
    '^.+\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: ['/node_modules/(?!swagger-ui-react)/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  bail: true,
};

export default config;
