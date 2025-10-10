import type { Config } from 'jest'

const config: Config = {
  displayName: 'eds-data-grid',
  verbose: true,
  testEnvironment: 'jest-environment-jsdom',
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  setupFilesAfterEnv: ['./jest.setup.ts'],

  transform: {
    '.(js|ts|tsx)':
      '<rootDir>/node_modules/@equinor/eds-utils/src/test/transformers/babelJest.cjs',
  },

  transformIgnorePatterns: [
    'node_modules/(?!(\\.pnpm|ramda|@equinor/eds-core-react)/)',
  ],

  moduleNameMapper: {
    '\\.(css)$':
      '<rootDir>/node_modules/@equinor/eds-utils/src/test/__mocks__/styleMock.js',

    '^react$': '<rootDir>/node_modules/react',
    '^styled-components$': '<rootDir>/node_modules/styled-components',

    '^@equinor/eds-core-react$':
      '<rootDir>/node_modules/@equinor/eds-core-react/dist/esm/index.js',
  },
}

// eslint-disable-next-line import/no-default-export
export default config
