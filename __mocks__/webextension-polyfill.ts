/* eslint-disable @typescript-eslint/require-await */

import * as R from 'ramda'

const webExtension: Partial<typeof browser> = {}

class StorageArea implements browser.storage.StorageArea {
  protected storage: { [key: string]: any }

  constructor() {
    this.storage = {}
  }

  async get(keys?: string | string[] | { [key: string]: any }) {
    if (keys === undefined) return this.storage

    if (typeof keys === 'string' || Array.isArray(keys)) {
      return R.pick([keys].flat(), this.storage)
    }

    return {
      ...keys,
      ...R.pick(Object.keys(keys), this.storage),
    }
  }

  async set(items: { [key: string]: any }) {
    this.storage = {
      ...this.storage,
      ...items,
    }
  }

  async remove(keys: string | string[]) {
    this.storage = R.omit([keys].flat(), this.storage)
  }

  async clear() {
    this.storage = {}
  }
}
class StorageAreaSync
  extends StorageArea
  implements browser.storage.StorageAreaSync {
  async getBytesInUse() {
    // @todo
    return 0
  }
}
webExtension.storage = {
  local: new StorageArea(),
  sync: new StorageAreaSync(),
  managed: new StorageArea(),
  // @todo
  // @ts-expect-error
  onChanged() {},
}

export default webExtension
