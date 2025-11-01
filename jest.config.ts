import type { Config } from 'jest'

const config: Config = {
  preset: '@foray1010',
  moduleNameMapper: {
    '\\.css$': '<rootDir>/__mocks__/fileMock.ts',
    '\\.(png|webp)$': '<rootDir>/__mocks__/fileMock.ts',
    '\\.svg(\\?svgUse)*$': '<rootDir>/__mocks__/fileMock.ts',
    // TypeScript paths
    '^@/(.*)\\.(?:js|json)$': '<rootDir>/src/$1',
    // Support for TypeScript ESM: map .js imports to extensionless for .ts file resolution
    '^(.+)\\.js$': '$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '\\.tsx?$': '@swc/jest',
  },
}
export default config
