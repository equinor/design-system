module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:prettier/recommended',
    'prettier',
    'plugin:storybook/recommended',
  ],
  plugins: ['prettier', 'import'],
  rules: {
    'prettier/prettier': ['error'],
    'no-underscore-dangle': ['off'],
    'no-use-before-define': ['off'],
    'import/no-unresolved': 'warn',
  },
  overrides: [
    // Typescript & components linting
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/typescript',
        'plugin:jsx-a11y/recommended',
      ],
      plugins: ['react', '@typescript-eslint', 'jsx-a11y'],
      globals: {
        test: true,
        expect: true,
      },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2019,
        tsconfigRootDir: __dirname,
        project: [
          './tsconfig.eslint.json',
          './scripts/*/tsconfig.json',
          './packages/*/tsconfig.json',
          './packages/*/*/tsconfig.json',
        ],
      },
      settings: {
        react: {
          version: 'detect', // uses latest when "detect"
        },
        'import/parsers': {
          '@typescript-eslint/parser': ['*.ts', '*.tsx'],
        },
        'import/resolver': {
          typescript: {
            project: [
              './packages/*/tsconfig.json',
              './packages/*/*/tsconfig.json',
            ],
          },
        },
      },
      rules: {
        'prettier/prettier': ['error'],
        'no-underscore-dangle': ['off'],
        'no-use-before-define': ['off'],
        // Disabled because of Typescript
        'react/prop-types': ['off'],
        'no-unused-vars': ['off'],
        // '@typescript-eslint/no-unused-vars': ['warn'],
        // Disabled because of react not having default export
        'import/default': ['off'],
        'import/no-default-export': ['error'],
        'import/newline-after-import': ['error'],
        'import/prefer-default-export': ['off'],
        'import/no-named-as-default': ['off'],
        'import/namespace': ['error', { allowComputed: true }],
        // TODO: Enable this rule once "functions" support is released https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/require-default-props.md
        'react/require-default-props': [
          'off',
          { forbidDefaultForRequired: true, functions: 'defaultArguments' },
        ],
        'react/react-in-jsx-scope': 'off',
        // 'react/jsx-boolean-value': ['warn'],
        'react/jsx-pascal-case': ['error'],
        // 'react/no-danger': ['warn'],
        'react/prefer-stateless-function': ['error'],
        'react/no-unused-prop-types': ['error'],
        'react/no-array-index-key': ['error'],
        'react/no-typos': ['error'],
        'react/destructuring-assignment': ['error', 'always'],
        '@typescript-eslint/no-unused-expressions': [
          'error',
          {
            allowShortCircuit: true,
            enforceForJSX: true,
            allowTernary: true,
          },
        ],
        // 'jsx-a11y/accessible-emoji': ['warn'],
        // 'jsx-a11y/control-has-associated-label': ['warn'],
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
        // '@typescript-eslint/restrict-plus-operands': ['warn'],
        // '@typescript-eslint/ban-ts-comment': ['warn'],
        '@typescript-eslint/no-empty-interface': [
          'error',
          {
            allowSingleExtends: true,
          },
        ],
        //'@typescript-eslint/no-unsafe-member-access': ['warn'],
        //'@typescript-eslint/no-unsafe-call': ['warn'],
        '@typescript-eslint/no-unsafe-return': ['warn'],
        '@typescript-eslint/no-unsafe-assignment': ['warn'],
        '@typescript-eslint/no-unsafe-argument': ['warn'],
        //'@typescript-eslint/no-explicit-any': ['warn'],
        '@typescript-eslint/no-misused-promises': [
          'error',
          {
            checksVoidReturn: false,
          },
        ],
        'testing-library/no-await-sync-events': [
          'error',
          {
            eventModules: ['fire-event'],
          },
        ],
      },
    },
    // Testing linting
    {
      files: ['*.test.ts*'],
      extends: ['plugin:testing-library/react', 'plugin:testing-library/dom'],
      plugins: ['testing-library'],
    },
    // Stories
    {
      files: ['*.stories.ts*'],
      rules: {
        'import/no-default-export': ['off'],
      },
    },
    // Config files that require default exports (Playwright, Vite, etc.)
    {
      files: [
        '**/playwright.config.ts',
        '**/vite.config.ts',
        '**/vitest.config.ts',
      ],
      rules: {
        'import/no-default-export': ['off'],
      },
    },
  ],
}
