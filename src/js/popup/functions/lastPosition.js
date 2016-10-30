import _debounce from 'lodash/debounce'

import {
  getBookmarkListEls
} from './dom'
import JSONStorage from '../../common/lib/JSONStorage'

export const lastScrollTopListStorage = new JSONStorage('lastScrollTop', [])
export const lastUsedTreeIdsStorage = new JSONStorage('lastBoxPID', [])

const getLastScrollTopList = () => {
  return getBookmarkListEls()
    .map((el) => el.scrollTop)
}

export const updateLastScrollTopList = _debounce(() => {
  const value = getLastScrollTopList()
  lastScrollTopListStorage.set(value)
}, 200)

export const updateLastUsedTreeIds = (trees) => {
  lastUsedTreeIdsStorage.set(
    trees.asMutable().map((treeInfo) => treeInfo.id)
  )
}
