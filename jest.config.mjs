const config = {
  preset: '@foray1010',
  moduleNameMapper: {
    '\\.css$': '<rootDir>/__mocks__/fileMock.ts',
    '\\.png$': '<rootDir>/__mocks__/fileMock.ts',
    '\\.svg(\\?svgr)*$': '<rootDir>/__mocks__/fileMock.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '\\.tsx?$': '@swc/jest',
  },
}
export default config
