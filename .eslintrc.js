// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:import/electron'
  ],
  rules: {
    // import
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never'
      }
    ],
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'import/order': [
      'warn',
      {
        'groups': ['external', 'builtin', ['internal', 'unknown'], 'parent', 'sibling'],
        'alphabetize': {
          order: 'asc',
          caseInsensitive: true
        },
        'newlines-between': 'always'
      }
    ],
    'import/prefer-default-export': 'off',

    // react
    'react/button-has-type': 'off',
    'react/destructuring-assignment': 'off',
    'react/function-component-definition': 'off',
    'react/jsx-closing-bracket-location': 'off',
    'react/jsx-filename-extension': [1, {extensions: ['.tsx', '.jsx']}],
    'react/jsx-first-prop-new-line': 'off',
    'react/jsx-fragments': [2, 'element'],
    'react/jsx-max-props-per-line': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-tag-spacing': 'off',
    'react/no-unknown-property': [2, {ignore: ['css', 'tw']}],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/require-default-props': 'off',

    // react-refresh
    'react-refresh/only-export-components': 'warn',

    // ts
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-shadow': 'warn',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',

    // sort-destructive-keys
    'sort-destructure-keys/sort-destructure-keys': ['warn', {caseSensitive: false}],

    // jax-a11y
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',

    // common
    'arrow-parens': 'off',
    'camelcase': 'off',
    'consistent-return': 'off',
    'function-paren-newline': 'off',
    'max-len': [
      'error',
      {
        'code': 120,
        'comments': 120,
        'tabWidth': 2,
        'ignoreStrings': true,
        'ignoreTemplateLiterals': true,
        'ignoreRegExpLiterals': true,
      },
    ],
    'no-plusplus': 'off',
    'no-shadow': 'off',
    'no-trailing-spaces': ['error', {skipBlankLines: true}],
    'no-underscore-dangle': ['error', {allowAfterThis: true}],
    'no-void': 'off',
    'object-curly-spacing': ['error', 'never'],
    'no-console': 0,
    'no-use-before-define': ['error', {"functions": true, "classes": true, "variables": false}]
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {tsconfigRootDir: '.'},
  plugins: ['@typescript-eslint', 'sort-destructure-keys', 'react-refresh', "jest"],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      typescript: {alwaysTryTypes: true, project: './'},
      node: {
        paths: [path.resolve(__dirname, './')],
        extensions: ['.js', '.jsx', '.mdx', '.tsx', '.ts']
      }
    }
  }
};
