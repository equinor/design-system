module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    // 'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  plugins: [
    'testing-library',
    'react',
    '@typescript-eslint',
    'jsx-a11y',
    'import',
    'prettier',
  ],
  globals: {
    test: true,
    expect: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
    project: [
      './tsconfig.eslint.json',
      './libraries/*/tsconfig.json',
      './libraries/*/*/tsconfig.json',
    ],
    tsconfigRootDir: __dirname,
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
        project: [
          './libraries/*/tsconfig.json',
          './libraries/*/*/tsconfig.json',
        ],
      },
    },
  },
  rules: {
    'prettier/prettier': ['error'],
    'no-underscore-dangle': ['off'],
    'no-use-before-define': ['off'],
    // 'no-unused-vars': [
    //   'error',
    //   {
    //     varsIgnorePattern: '^React$',
    //   },
    // ],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'import/no-unresolved': 'error',
    'import/default': 'off',
    'import/no-default-export': ['error'],
    'import/newline-after-import': ['error'],
    'import/prefer-default-export': ['off'],
    'react/prop-types': 'off',
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
    // '@typescript-eslint/no-explicit-any': 1,
    // '@typescript-eslint/no-unsafe-assignment': 1,
    // '@typescript-eslint/no-unsafe-member-access': 1,
    // '@typescript-eslint/no-unsafe-call': 1,
    // '@typescript-eslint/no-unsafe-return': 1,
    // '@typescript-eslint/restrict-plus-operands': 1,
    // '@typescript-eslint/ban-ts-comment': 1,
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
  overrides: [
    {
      files: ['**/*.test.ts*'],
      extends: ['plugin:testing-library/react'],
    },
    {
      files: ['**/*.jsx'],
    },
  ],
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
