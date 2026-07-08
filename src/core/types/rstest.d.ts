import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'

// Register `@testing-library/jest-dom` matcher types against Rstest's `expect`,
// which is exposed globally via `globals: true`. jest-dom only ships module
// augmentations for `jest`/`vitest`, so `@rstest/core` needs its own.
declare module '@rstest/core' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Assertion<T = any> extends TestingLibraryMatchers<unknown, T> {}
  interface AsymmetricMatchersContaining extends TestingLibraryMatchers<
    unknown,
    unknown
  > {}
}
