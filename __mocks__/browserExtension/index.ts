import i18n from './i18n.js'
import storage from './storage.js'

const browserMock: Partial<typeof browser> = {
  i18n,
  storage,
}

export default browserMock
