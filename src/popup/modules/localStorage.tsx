import webExtension from 'webextension-polyfill'

import type { LastPosition } from '../types/index.js'

export type LocalStorage = {
  readonly lastPositions: readonly LastPosition[]
}

export async function getLocalStorage(): Promise<LocalStorage> {
  return {
    lastPositions: [],
    ...((await webExtension.storage.local.get()) as Partial<LocalStorage>),
  }
}
