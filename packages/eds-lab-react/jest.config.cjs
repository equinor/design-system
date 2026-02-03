module.exports = {
  verbose: true,
  setupFilesAfterEnv: ['./jest.setup.ts'],
  transform: {
    '.(js|ts|tsx)':
      '<rootDir>/node_modules/@equinor/eds-utils/src/test/transformers/babelJest.cjs',
  },
  moduleNameMapper: {
    '\\.(css)$':
      '<rootDir>/node_modules/@equinor/eds-utils/src/test/__mocks__/styleMock.js',
    '^react$': '<rootDir>/node_modules/react',
    '^styled-components$': '<rootDir>/node_modules/styled-components',
    '^@equinor/eds-core-react$':
      '<rootDir>/node_modules/@equinor/eds-core-react/dist/esm/index.mjs',
  },
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testEnvironment: 'jest-environment-jsdom',
  transformIgnorePatterns: ['node_modules/(?!.pnpm|ramda)'],
  testPathIgnorePatterns: ['/dist/'],
}
