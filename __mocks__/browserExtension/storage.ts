/* eslint-disable @typescript-eslint/require-await */

import { pick } from './utils/object.js'
import { WebExtEventEmitter } from './utils/WebExtEventEmitter.js'

class Changes {
  readonly #map = new Map<string, browser.storage.StorageChange>()

  public get size(): number {
    return this.#map.size
  }

  public toObject(): Record<string, browser.storage.StorageChange> {
    return Object.fromEntries(this.#map)
  }

  public add(key: string, change: Readonly<browser.storage.StorageChange>) {
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

  public readonly onChanged = new WebExtEventEmitter<
    readonly [Record<string, browser.storage.StorageChange>]
  >()

  #broadcastChanges(changes: Changes) {
    if (changes.size > 0) {
      this.onChanged.dispatchEvent([changes.toObject()])
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

enum AreaName {
  Local = 'local',
  Managed = 'managed',
  Session = 'session',
  Sync = 'sync',
}

type StorageAreaListenerCallback = Parameters<
  browser.storage.StorageArea['onChanged']['addListener']
>[0]

type IStorage = typeof browser.storage
class Storage implements IStorage {
  public readonly [AreaName.Local] = new StorageArea()
  public readonly [AreaName.Managed] = new StorageArea()
  public readonly [AreaName.Session] = new StorageArea()
  public readonly [AreaName.Sync] = new StorageAreaSync()

  readonly #listenerWeakMap = new WeakMap<
    Parameters<(typeof browser.storage.onChanged)['addListener']>[0],
    Record<AreaName, StorageAreaListenerCallback>
  >()

  public readonly onChanged: Readonly<typeof browser.storage.onChanged> = {
    addListener: (cb) => {
      const listenerCallbacks: Record<AreaName, StorageAreaListenerCallback> = {
        [AreaName.Local]: (changes) => cb(changes, AreaName.Local),
        [AreaName.Managed]: (changes) => cb(changes, AreaName.Managed),
        [AreaName.Session]: (changes) => cb(changes, AreaName.Session),
        [AreaName.Sync]: (changes) => cb(changes, AreaName.Sync),
      }

      for (const areaName of Object.values(AreaName)) {
        this[areaName].onChanged.addListener(listenerCallbacks[areaName])
      }

      this.#listenerWeakMap.set(cb, listenerCallbacks)
    },
    removeListener: (cb) => {
      const listenerCallbacks = this.#listenerWeakMap.get(cb)
      if (!listenerCallbacks) return

      for (const areaName of Object.values(AreaName)) {
        this[areaName].onChanged.removeListener(listenerCallbacks[areaName])
      }

      this.#listenerWeakMap.delete(cb)
    },
    hasListener: (cb) => {
      return this.#listenerWeakMap.has(cb)
    },
  }
}

const storage = new Storage()
export default storage
