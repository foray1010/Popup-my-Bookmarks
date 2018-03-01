// @flow

import * as R from 'ramda'
import store from 'store'

const _updateLastScrollTopList = (index: number, scrollTop: number) =>
  R.compose(R.update(index, scrollTop), (list: $ReadOnlyArray<number>) =>
    R.concat(list, R.times(R.always(0), R.max(index - list.length + 1, 0))))

export const updateLastScrollTopList = (index: number, scrollTop: number) => {
  const updateList = _updateLastScrollTopList(index, scrollTop)

  const lastScrollTopList: $ReadOnlyArray<number> = store.get('lastScrollTop') || []
  store.set('lastScrollTop', updateList(lastScrollTopList))
}

export const updateLastUsedTreeIds = (trees: $ReadOnlyArray<Object>) => {
  const value: $ReadOnlyArray<string> = trees.map((treeInfo: Object): string => treeInfo.id)
  store.set('lastBoxPID', value)
}
