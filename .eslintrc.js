module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module'
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      typescript: true,
      node: true
    }
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import', 'prettier'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  env: {
    node: true,
    jest: true
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'sort-imports': ['error',
      { ignoreCase: true, ignoreDeclarationSort: true }],
    'import/order': [
      'error',
      {
        groups: [['external', 'builtin'], 'internal', ['sibling', 'parent'],
          'index'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }
    ],
    'import/no-default-export': 'error',
    'import/no-self-import': 'error',
    'import/no-duplicates': 'error',
    'newline-per-chained-call': 'error'
  },
  overrides: [
    {
      files: ['prisma/**'],
      rules: {
        'no-console': 'off',
        'import/no-default-export': 'off',
        'import/default': 'error'
      }
    },
    {
      files: ['*.d.ts'],
      rules: {
        '@typescript-eslint/no-empty-interface': 'off'
      }
    }
  ]
};
