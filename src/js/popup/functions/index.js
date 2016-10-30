import {
  GOLDEN_GAP
} from '../constants'
import chromep from '../../common/lib/chromePromise'

export * from './bookmarks'
export * from './dom'
export * from './lastPosition'

export function getItemHeight(options) {
  const {fontSize} = options

  return GOLDEN_GAP * 2 + fontSize
}

export function getItemOffsetHeight(options) {
  const itemHeight = getItemHeight(options)

  // +1 for border width, GOLDEN_GAP for padding
  return (1 + GOLDEN_GAP) * 2 + itemHeight
}

export async function openOptionsPage() {
  if (chromep.runtime.openOptionsPage) {
    await chromep.runtime.openOptionsPage()
  } else {
    const manifest = chrome.runtime.getManifest()

    await chromep.tabs.create({
      url: manifest.options_page
    })
  }
}
