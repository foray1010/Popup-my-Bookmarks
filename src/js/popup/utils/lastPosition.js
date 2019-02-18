// @flow strict

import * as R from 'ramda'
import store from 'store'

import type {BookmarkTree} from '../types'

const _updateLastScrollTopList = (index: number, scrollTop: number) =>
  R.compose(
    R.update(index, scrollTop),
    (list: Array<number>) => R.concat(list, R.times(R.always(0), R.max(index - list.length + 1, 0)))
  )
export const updateLastScrollTopList = (index: number, scrollTop: number) => {
  const updateList = _updateLastScrollTopList(index, scrollTop)

  const lastScrollTopList: Array<number> = store.get('lastScrollTop') || []
  store.set('lastScrollTop', updateList(lastScrollTopList))
}

export const updateLastUsedTreeIds = (trees: Array<BookmarkTree>) => {
  const value = trees.map((treeInfo: BookmarkTree) => treeInfo.parent.id)
  store.set('lastBoxPID', value)
}
