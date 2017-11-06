// @flow

import chromep from '../../common/lib/chromePromise'
import {GOLDEN_GAP} from '../constants'

export * from './bookmarks'
export * from './dom'
export * from './lastPosition'

export const getClickType = (evt: Object): string => {
  if (evt.button === 1) {
    return 'clickByMiddle'
  }

  if (evt.ctrlKey || evt.metaKey) {
    return 'clickByLeftCtrl'
  }

  if (evt.shiftKey) {
    return 'clickByLeftShift'
  }

  return 'clickByLeft'
}

export const getItemIconHeight = (options: Object): number => {
  const {
    fontSize
  }: {
    fontSize: number
  } = options

  return GOLDEN_GAP * 2 + fontSize
}

export const getItemOffsetHeight = (options: Object): number => {
  const itemIconHeight: number = getItemIconHeight(options)

  // +1 for border width, GOLDEN_GAP for padding
  return (1 + GOLDEN_GAP) * 2 + itemIconHeight
}

export const openOptionsPage = async (): Promise<void> => {
  if (chromep.runtime.openOptionsPage) {
    await chromep.runtime.openOptionsPage()
  } else {
    const manifest: Object = window.chrome.runtime.getManifest()

    await chromep.tabs.create({
      url: manifest.options_page
    })
  }
}
