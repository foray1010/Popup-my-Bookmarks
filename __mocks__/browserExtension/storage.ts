/* eslint-disable @typescript-eslint/require-await */

import { pick } from './utils.js'

type StorageAreaListenerCallback = Parameters<
  browser.storage.StorageArea['onChanged']['addListener']
>[0]

class Changes {
  #map = new Map<string, browser.storage.StorageChange>()

  public get size(): number {
    return this.#map.size
  }

  public toObject(): Record<string, browser.storage.StorageChange> {
    return Object.fromEntries(this.#map)
  }

  public add(key: string, change: browser.storage.StorageChange) {
    // item with same value is ignored by onChange API
    if (change.newValue === change.oldValue) return

    const changeEntries = Object.entries(change).filter(
      ([, v]) => v !== undefined,
    )
    if (changeEntries.length > 0) {
      this.#map.set(key, Object.fromEntries(changeEntries))
    }
  }
}

class StorageArea implements browser.storage.StorageArea {
  protected readonly storage = new Map<string, unknown>()
  protected get storageObject() {
    return Object.fromEntries(this.storage)
  }

  readonly #listenerCallbacks = new Set<StorageAreaListenerCallback>()

  public async get(
    keys?: string | readonly string[] | Record<string, unknown>,
  ) {
    if (keys === undefined) return this.storageObject

    if (typeof keys === 'string' || Array.isArray(keys)) {
      return pick(this.storageObject, [keys].flat())
    }

    return {
      ...keys,
      ...pick(this.storageObject, Object.keys(keys)),
    }
  }

  public async set(items: Record<string, unknown>) {
    const changes = new Changes()

    for (const [key, newValue] of Object.entries(items)) {
      // undefined item is not valid JSON value
      if (newValue === undefined) continue

      const oldValue = this.storage.get(key)

      this.storage.set(key, newValue)

      changes.add(key, { oldValue, newValue })
    }

    this.#broadcastChanges(changes)
  }

  public async remove(keys: string | readonly string[]) {
    const changes = new Changes()

    for (const key of [keys].flat()) {
      const oldValue = this.storage.get(key)

      this.storage.delete(key)

      changes.add(key, { oldValue })
    }

    this.#broadcastChanges(changes)
  }

  public async clear() {
    const changes = new Changes()
    for (const [key, oldValue] of this.storage.entries()) {
      changes.add(key, { oldValue })
    }

    this.storage.clear()

    this.#broadcastChanges(changes)
  }

  public onChanged: browser.storage.StorageArea['onChanged'] = {
    addListener: (cb) => {
      this.#listenerCallbacks.add(cb)
    },
    removeListener: (cb) => {
      this.#listenerCallbacks.delete(cb)
    },
    hasListener: (cb) => {
      return this.#listenerCallbacks.has(cb)
    },
  }

  #broadcastChanges(changes: Changes) {
    if (changes.size > 0) {
      for (const listenerCallback of this.#listenerCallbacks) {
        listenerCallback(changes.toObject())
      }
    }
  }
}

class StorageAreaSync
  extends StorageArea
  implements browser.storage.StorageAreaSync
{
  public async getBytesInUse(keys?: string | readonly string[]) {
    const storage =
      keys === undefined
        ? this.storageObject
        : pick(this.storageObject, [keys].flat())

    return Object.entries(storage).reduce((acc, [k, v]) => {
      // https://github.com/mozilla/gecko-dev/blob/0db73daa4b03ce7513a7dd5f31109143dc3b149e/third_party/rust/webext-storage/src/api.rs#L184-L188
      return acc + k.length + JSON.stringify(v).length
    }, 0)
  }
}

type ListenerCallbacks = {
  readonly local: StorageAreaListenerCallback
  readonly sync: StorageAreaListenerCallback
  readonly managed: StorageAreaListenerCallback
}

type IStorage = typeof browser.storage
class Storage implements IStorage {
  public readonly local = new StorageArea()
  public readonly sync = new StorageAreaSync()
  public readonly managed = new StorageArea()

  readonly #listenerWeakMap = new WeakMap<
    Parameters<(typeof browser.storage.onChanged)['addListener']>[0],
    ListenerCallbacks
  >()

  public onChanged: typeof browser.storage.onChanged = {
    addListener: (cb) => {
      const listenerCallbacks: ListenerCallbacks = {
        local: (changes) => cb(changes, 'local'),
        sync: (changes) => cb(changes, 'sync'),
        managed: (changes) => cb(changes, 'managed'),
      }

      this.local.onChanged.addListener(listenerCallbacks.local)
      this.sync.onChanged.addListener(listenerCallbacks.sync)
      this.managed.onChanged.addListener(listenerCallbacks.managed)

      this.#listenerWeakMap.set(cb, listenerCallbacks)
    },
    removeListener: (cb) => {
      const listenerCallbacks = this.#listenerWeakMap.get(cb)
      if (!listenerCallbacks) return

      this.local.onChanged.removeListener(listenerCallbacks.local)
      this.sync.onChanged.removeListener(listenerCallbacks.sync)
      this.managed.onChanged.removeListener(listenerCallbacks.managed)

      this.#listenerWeakMap.delete(cb)
    },
    hasListener: (cb) => {
      return this.#listenerWeakMap.has(cb)
    },
  }
}

const storage = new Storage()
export default storage
