import { afterEach, expect, rs } from '@rstest/core'
import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'

expect.extend(matchers)

afterEach(() => {
  cleanup()
})

// Automatically replace `webextension-polyfill` with the manual mock in
// `__mocks__/webextension-polyfill.ts` for every test file. Unlike Jest,
// Rstest does not auto-apply `__mocks__` for npm packages, so it must be
// registered explicitly here.
rs.mock('webextension-polyfill')
