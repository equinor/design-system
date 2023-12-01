import type { Config } from 'jest'

const config: Config = {
  displayName: 'eds-data-grid',
  transform: {
    '.(js|ts|tsx)':
      '<rootDir>/node_modules/@equinor/eds-utils/src/test/transformers/babelJest.cjs',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  verbose: true,
  setupFilesAfterEnv: ['./jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css)$':
      '<rootDir>/node_modules/@equinor/eds-utils/src/test/__mocks__/styleMock.js',
    '^react$': '<rootDir>/node_modules/react',
    '^styled-components$': '<rootDir>/node_modules/styled-components',
    '^@equinor/eds-core-react$':
      '<rootDir>/node_modules/@equinor/eds-core-react/dist/esm/index.js',
  },
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  testEnvironment: 'jest-environment-jsdom',
  transformIgnorePatterns: ['node_modules/(?!.pnpm|ramda)'],
}

// eslint-disable-next-line import/no-default-export
export default config

/* eslint-disable */
