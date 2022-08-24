'use strict'

const config = {
  preset: '@foray1010',
  moduleNameMapper: {
    '\\.png$': '<rootDir>/__mocks__/fileMock.ts',
    '\\.svg$': '<rootDir>/__mocks__/fileMock.ts',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '\\.css$': 'jest-css-modules-transform',
    '\\.tsx?$': '@swc/jest',
  },
}
module.exports = config
