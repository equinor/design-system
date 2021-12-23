module.exports = {
  verbose: true,
  setupFilesAfterEnv: ['./rtl.setup.ts'],
  transform: {
    '.(js|ts|tsx)': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/src/test/__mocks__/styleMock.js',
  },
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testEnvironment: 'jsdom',
}
