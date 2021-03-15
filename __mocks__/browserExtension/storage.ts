/* eslint-disable @typescript-eslint/require-await */

import * as R from 'ramda'

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
  async getBytesInUse(keys?: string | string[]) {
    const storage =
      keys === undefined ? this.storage : R.pick([keys].flat(), this.storage)

    return Object.entries(storage).reduce((acc, [k, v]) => {
      // https://github.com/mozilla/gecko-dev/blob/0db73daa4b03ce7513a7dd5f31109143dc3b149e/third_party/rust/webext-storage/src/api.rs#L184-L188
      return acc + k.length + JSON.stringify(v).length
    }, 0)
  }
}

const storage: typeof browser.storage = {
  local: new StorageArea(),
  sync: new StorageAreaSync(),
  managed: new StorageArea(),
  // @todo
  // @ts-expect-error
  onChanged() {},
}

export default storage
