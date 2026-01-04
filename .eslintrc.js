module.exports = {
  parser: '@typescript-eslint/parser',

  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },

  extends: ['plugin:@typescript-eslint/recommended', 'prettier'],

  root: true,
  env: {
    node: true,
    jest: true,
  },

  ignorePatterns: ['.eslintrc.js', 'dist', 'node_modules'],

  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',

    '@typescript-eslint/explicit-function-return-type': 'off',

    '@typescript-eslint/explicit-module-boundary-types': 'off',

    '@typescript-eslint/no-explicit-any': 'off',

    '@typescript-eslint/no-floating-promises': 'error',

    'sort-imports': 'off',
    'import/order': 'off',

    'prettier/prettier': ['error', { endOfLine: 'lf' }],
  },
};
