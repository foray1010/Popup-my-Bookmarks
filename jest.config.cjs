'use strict'

const config = {
  bail: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.{cjs,cts,js,mjs,mts,ts,tsx}'],
  coveragePathIgnorePatterns: ['/__fixtures__/'],
  coverageReporters: ['lcov', 'text-summary'],
  moduleNameMapper: {
    '\\.png$': '<rootDir>/__mocks__/fileMock.ts',
    '\\.svg$': '<rootDir>/__mocks__/fileMock.ts',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/*.{spec,test}.{cjs,cts,js,mjs,mts,ts,tsx}'],
  transform: {
    '\\.css$': 'jest-css-modules-transform',
    '\\.tsx?$': '@swc/jest',
  },
}
module.exports = config
