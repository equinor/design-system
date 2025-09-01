module.exports = {
  root: true,
  extends: ['next/core-web-vitals', 'next/typescript'],
  rules: {
    // Disable the pages directory check for Next.js 13+ app directory
    '@next/next/no-html-link-for-pages': 'off',
    // Allow default exports for Next.js components and pages
    'import/no-default-export': 'off',
    // Enable TypeScript strict rules
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/ban-ts-comment': 'error',
  },
}
