import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.{cjs,js,mjs,ts,tsx}'],
  coveragePathIgnorePatterns: ['/__fixtures__/'],
  coverageReporters: ['lcov', 'text-summary'],
  moduleNameMapper: {
    '\\.css$': '<rootDir>/__mocks__/styleMock.ts',
    '\\.png$': '<rootDir>/__mocks__/fileMock.ts',
    '\\.svg$': '<rootDir>/__mocks__/fileMock.ts',
  },
  testEnvironment: 'jsdom',
  testMatch: ['**/*.{spec,test}.{cjs,js,mjs,ts,tsx}'],
}

export default config
