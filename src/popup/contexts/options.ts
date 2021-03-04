import webExtension from 'webextension-polyfill'

import type { Options } from '../../core/types/options'

export async function getOptions() {
  return ((await webExtension.storage.sync.get()) as unknown) as Options
}
