module.exports = {
  verbose: true,
  setupFilesAfterEnv: ['./jest.setup.ts'],
  transform: {
    '.(js|ts|tsx)': '<rootDir>/src/test/transformers/babelJest.cjs',
  },
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/src/test/__mocks__/styleMock.js',
    '^react$': '<rootDir>/node_modules/react',
    '^styled-components$': '<rootDir>/node_modules/styled-components',
  },
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testEnvironment: 'jest-environment-jsdom',
  transformIgnorePatterns: ['node_modules/(?!.pnpm|ramda)'],
}
