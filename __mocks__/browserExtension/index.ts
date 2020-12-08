import storage from './storage'

const browserMock: Partial<typeof browser> = {
  storage,
}

export default browserMock
