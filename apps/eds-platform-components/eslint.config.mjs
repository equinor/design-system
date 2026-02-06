import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import eslintNextPlugin from '@next/eslint-plugin-next'

const eslintConfig = defineConfig([
  {
    plugins: {
      next: eslintNextPlugin,
    },
    settings: {
      next: {
        rootDir: '.',
      },
    },
    files: ['**/*.{js,jsx,ts,tsx}'],
  },
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Disable the pages directory check for Next.js 13+ app directory
      '@next/next/no-html-link-for-pages': 'off',
      // Allow default exports for Next.js components and pages
      'import/no-default-export': 'off',
      // Enable TypeScript strict rules
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'node_modules/**',
    'dist/**',
  ]),
])

export default eslintConfig
