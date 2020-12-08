import i18n from './i18n'
import storage from './storage'

const browserMock: Partial<typeof browser> = {
  i18n,
  storage,
}

export default browserMock
