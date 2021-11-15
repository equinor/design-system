module.exports = {
  verbose: true,
  setupFilesAfterEnv: ['./rtl.setup.ts'],
  transform: {
    '.(js|ts|tsx)': 'babel-jest',
    // '.(ts|tsx)': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testEnvironment: 'jsdom',
}
