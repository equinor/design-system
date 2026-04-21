import js from '@eslint/js'
import babelParser from '@babel/eslint-parser'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import importPlugin from 'eslint-plugin-import'
import prettierPlugin from 'eslint-plugin-prettier/recommended'
import testingLibrary from 'eslint-plugin-testing-library'
import storybook from 'eslint-plugin-storybook'
import globals from 'globals'

export default tseslint.config(
  // Global ignores (replaces .eslintignore)
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      'packages/eds-tokens/build/**',
      'packages/eds-tokens/build-generate-variables/**',
      'apps/eds-color-palette-generator/**',
      'storybook-build/**',
      '**/next-env.d.ts',
      '.eslintcache',
      'node_modules/.cache/**',
      '**/build/**',
      '**/coverage/**',
      '**/.next/**',
      '**/playwright-report/**',
      '**/test-results/**',
      '**/.turbo/**',
    ],
  },

  // Base config for all JS/TS files
  js.configs.recommended,

  // Base JS config (non-TS files)
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      'no-underscore-dangle': 'off',
      'no-use-before-define': 'off',
      'import/no-unresolved': 'warn',
    },
  },

  // TypeScript files
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ['**/*.{ts,tsx}'],
  })),
  {
    files: ['**/*.{ts,tsx}'],
    ...react.configs.flat.recommended,
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 2019,
        project: [
          './tsconfig.eslint.json',
          './scripts/*/tsconfig.json',
          './packages/*/tsconfig.json',
          './packages/*/*/tsconfig.json',
        ],
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        test: true,
        expect: true,
      },
    },
    plugins: {
      ...react.configs.flat.recommended.plugins,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
    },
    settings: {
      react: {
        version: 'detect',
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
      // React recommended rules (display-name, jsx-key, no-deprecated, etc.)
      ...react.configs.flat.recommended.rules,

      // Prettier
      'prettier/prettier': 'error',

      // General
      'no-underscore-dangle': 'off',
      'no-use-before-define': 'off',

      // React
      'react/prop-types': 'off',
      'react/require-default-props': [
        'off',
        { forbidDefaultForRequired: true, functions: 'defaultArguments' },
      ],
      'react/react-in-jsx-scope': 'off',
      'react/jsx-pascal-case': 'error',
      'react/prefer-stateless-function': 'error',
      'react/no-unused-prop-types': 'error',
      'react/no-array-index-key': 'error',
      'react/no-typos': 'error',
      'react/destructuring-assignment': ['error', 'always'],

      // React Hooks (v7 — disable React 19-specific rules for React 18 compat)
      ...reactHooks.configs.recommended.rules,
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/incompatible-library': 'off',

      // Import
      'import/default': 'off',
      'import/no-default-export': 'error',
      'import/newline-after-import': 'error',
      'import/prefer-default-export': 'off',
      'import/no-named-as-default': 'off',
      'import/namespace': ['error', { allowComputed: true }],

      // TypeScript
      'no-unused-vars': 'off',
      '@typescript-eslint/no-empty-object-type': [
        'error',
        { allowInterfaces: 'with-single-extends' },
      ],
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      // TODO: re-enable and clean up existing violations — see issue #TBD
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: false },
      ],
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          enforceForJSX: true,
          allowTernary: true,
        },
      ],

      // jsx-a11y
      ...jsxA11y.flatConfigs.recommended.rules,
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
  },

  // Test files
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    ...testingLibrary.configs['flat/react'],
    rules: {
      ...testingLibrary.configs['flat/react'].rules,
      'testing-library/no-await-sync-events': [
        'error',
        { eventModules: ['fire-event'] },
      ],
    },
  },

  // Storybook stories
  ...storybook.configs['flat/recommended'],
  {
    files: ['**/*.stories.ts', '**/*.stories.tsx'],
    rules: {
      'import/no-default-export': 'off',
    },
  },

  // Config files that require default exports (Playwright, Vite, etc.)
  {
    files: [
      '**/playwright.config.ts',
      '**/vite.config.ts',
      '**/vite.*.config.ts',
      '**/vitest.config.ts',
    ],
    rules: {
      'import/no-default-export': 'off',
    },
  },

  // Next.js pages/layouts
  {
    files: [
      '**/app/**/page.tsx',
      '**/app/**/layout.tsx',
      '**/tailwind.config.ts',
    ],
    rules: {
      'import/no-default-export': 'off',
    },
  },

  // Docusaurus docs app
  {
    files: ['apps/design-system-docs/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'import/no-unresolved': [
        2,
        { ignore: ['^@theme', '^@docusaurus', '^@site'] },
      ],
      'import/no-default-export': 'off',
    },
  },

  // Storybook config files (not in any tsconfig — disable type-checked rules)
  {
    files: ['**/.storybook/**/*.{ts,tsx}'],
    ...tseslint.configs.disableTypeChecked,
  },

  // Prettier must be last to override conflicting rules
  prettierPlugin,
)
