const config = {
  preset: '@foray1010',
  moduleNameMapper: {
    '\\.css$': '<rootDir>/__mocks__/fileMock.ts',
    '\\.png$': '<rootDir>/__mocks__/fileMock.ts',
    '\\.svg$': '<rootDir>/__mocks__/fileMock.ts',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '\\.tsx?$': '@swc/jest',
  },
}
export default config
