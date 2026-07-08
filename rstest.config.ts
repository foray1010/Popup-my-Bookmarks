import { pluginReact } from '@rsbuild/plugin-react'
import { defineConfig } from '@rstest/core'

const rstestConfig = defineConfig({
  bail: 1,
  coverage: {
    enabled: true,
    exclude: [
      /\/\./u.source, // ignore all hidden files
      /\/__fixtures__\//u.source,
      /\/__mocks__\//u.source,
      /\/__tests__\//u.source,
      /\/node_modules\//u.source,
      /\.d\.(?:cts|mts|ts|tsx)$/u.source, // ignore type definition files
    ],
    include: ['src/**/*.{cjs,cts,js,mjs,mts,ts,tsx}'],
    provider: 'v8',
    reporters: ['lcov', 'text-summary'],
  },
  globals: true,
  include: ['**/*.{spec,test}.{cjs,cts,js,mjs,mts,ts,tsx}'],
  plugins: [pluginReact()],
  setupFiles: ['./rstest.setup.ts'],
  testEnvironment: 'jsdom',
})

export default rstestConfig
