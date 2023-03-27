/* eslint-disable @typescript-eslint/require-await */

function omit<T extends Record<string, unknown>, U extends keyof T>(
  object: T,
  keys: readonly U[],
): Omit<T, U> {
  let acc = object as Omit<T, U>
  for (const key of keys) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [key]: _, ...rest } = acc
    acc = rest as Omit<T, U>
  }
  return acc
}

function pick<T extends Record<string, unknown>, U extends keyof T>(
  object: T,
  keys: readonly U[],
): Pick<T, U> {
  const acc = {} as Pick<T, U>
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      acc[key] = object[key]
    }
  }
  return acc
}

class StorageArea implements browser.storage.StorageArea {
  protected storage: Record<string, unknown> = {}

  public async get(
    keys?: string | readonly string[] | Record<string, unknown>,
  ) {
    if (keys === undefined) return this.storage

    if (typeof keys === 'string' || Array.isArray(keys)) {
      return pick(this.storage, [keys].flat())
    }

    return {
      ...keys,
      ...pick(this.storage, Object.keys(keys)),
    }
  }

  public async set(items: Record<string, unknown>) {
    this.storage = {
      ...this.storage,
      ...items,
    }
  }

  public async remove(keys: string | readonly string[]) {
    this.storage = omit(this.storage, [keys].flat())
  }

  public async clear() {
    this.storage = {}
  }

  public onChanged = {
    addListener() {
      throw new Error('Not implemented')
    },
    removeListener() {
      throw new Error('Not implemented')
    },
    hasListener() {
      throw new Error('Not implemented')
    },
  }
}

class StorageAreaSync
  extends StorageArea
  implements browser.storage.StorageAreaSync
{
  public async getBytesInUse(keys?: string | readonly string[]) {
    const storage =
      keys === undefined ? this.storage : pick(this.storage, [keys].flat())

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
  onChanged: {
    addListener() {
      throw new Error('Not implemented')
    },
    removeListener() {
      throw new Error('Not implemented')
    },
    hasListener() {
      throw new Error('Not implemented')
    },
  },
}

export default storage
