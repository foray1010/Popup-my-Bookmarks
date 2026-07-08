import { withRspackConfig } from '@rstest/adapter-rspack'
import { defineConfig } from '@rstest/core'

const rstestConfig = defineConfig({
  extends: withRspackConfig({
    modifyRspackConfig: (config) => {
      // The build's CSS chain (`CssExtractRspackPlugin` + `css-loader`) extracts
      // CSS into separate files during a real build, which does not fit Rstest's
      // per-test bundle. Drop the CSS rule so Rstest's native CSS Modules
      // handling resolves `*.module.css` imports to their class-name map instead.
      const rules = (config.module?.rules ?? []).filter(
        (rule) =>
          !(
            rule &&
            typeof rule === 'object' &&
            rule.test instanceof RegExp &&
            rule.test.source === /\.css$/u.source
          ),
      )

      return {
        ...config,
        module: { ...config.module, rules },
        // None of the build plugins (CSS extraction, manifest/HTML/zip emit,
        // circular-import and duplicate-package checks) apply to the test
        // bundle. The duplicate-package check in particular fails on test-only
        // dependency duplicates (e.g. aria-query via @testing-library).
        plugins: [],
      }
    },
  }),
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
  setupFiles: ['./rstest.setup.ts'],
  testEnvironment: 'jsdom',
})

export default rstestConfig
