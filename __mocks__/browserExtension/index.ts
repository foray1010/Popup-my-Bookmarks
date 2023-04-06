import bookmarks from './bookmarks.js'
import i18n from './i18n.js'
import runtime from './runtime.js'
import storage from './storage.js'

const browserMock = {
  bookmarks,
  i18n,
  runtime,
  storage,
} as const satisfies Partial<typeof browser>

export default browserMock
