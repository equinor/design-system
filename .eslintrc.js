module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:testing-library/react',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['testing-library', 'jsx-a11y', 'react', 'import', 'prettier'],
  globals: {
    test: true,
    expect: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    requireConfigFile: false,
    project: './tsconfig.eslint.json',
  },

  settings: {
    react: {
      version: 'detect', // uses latest when "detect"
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        project: ['libraries/*/tsconfig.json'],
      },
    },
  },
  rules: {
    'react/prop-types': 'off',
    'import/no-unresolved': 'error',
    'prettier/prettier': ['error'],
    'no-unused-vars': [
      'error',
      {
        varsIgnorePattern: '^React$',
      },
    ],
    'import/no-default-export': ['error'],
    'import/newline-after-import': ['error'],
    'import/prefer-default-export': ['off'],
    'no-underscore-dangle': ['off'],
    'no-use-before-define': ['off'],
    'react/require-default-props': [
      'error',
      {
        forbidDefaultForRequired: true,
      },
    ],
    'react/jsx-boolean-value': [
      'error',
      'never',
      {
        always: [],
      },
    ],
    'react/jsx-pascal-case': ['error'],
    'react/no-danger': ['warn'],
    'react/prefer-stateless-function': [
      'error',
      {
        ignorePureComponents: true,
      },
    ],
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.jsx'],
      },
    ],
    'react/no-unused-prop-types': ['error'],
    'react/no-array-index-key': ['error'],
    'react/no-typos': ['error'],
    'react/destructuring-assignment': ['error', 'always'],
    'jsx-a11y/accessible-emoji': ['warn'],
    'jsx-a11y/control-has-associated-label': ['warn'],
    'jsx-a11y/label-has-associated-control': [
      'warn',
      {
        labelComponents: [],
        labelAttributes: [],
        controlComponents: [],
        assert: 'either',
        depth: 25,
      },
    ],
  },
  // overrides: [
  //   {
  //     files: ['**/*.jsx'],
  //   },
  //   {
  //     parser: '@typescript-eslint/parser',
  //     parserOptions: {
  //       tsconfigRootDir: __dirname,
  //       project: ['./tsconfig.eslint.json'],
  //       ecmaVersion: 2020,
  //     },
  //     plugins: ['@typescript-eslint'],
  //     extends: [
  //       'plugin:@typescript-eslint/recommended',
  //       'plugin:@typescript-eslint/recommended-requiring-type-checking',
  //     ],
  //     files: ['**/*.ts', '**/*.tsx'],
  //     rules: {
  //       'react/prop-types': 'off',
  //       'react/jsx-filename-extension': [
  //         'error',
  //         {
  //           extensions: ['.jsx', '.tsx'],
  //         },
  //       ],
  //       /* set rules to warn */
  //       '@typescript-eslint/no-explicit-any': 1,
  //       '@typescript-eslint/no-unsafe-assignment': 1,
  //       '@typescript-eslint/no-unsafe-member-access': 1,
  //       '@typescript-eslint/no-unsafe-call': 1,
  //       '@typescript-eslint/no-unsafe-return': 1,
  //       '@typescript-eslint/restrict-plus-operands': 1,
  //       '@typescript-eslint/ban-ts-comment': 1,
  //       'react/require-default-props': 1,
  //     },
  //   },
  // ],
}
