import i18n from './i18n.js'
import storage from './storage.js'

const browserMock = {
  i18n,
  storage,
} as const satisfies Partial<typeof browser>

export default browserMock
