// @flow

import debounce from 'lodash.debounce'
import * as R from 'ramda'
import store from 'store'

const _updateLastScrollTopList: Function = (index: number, scrollTop: number): Function =>
  R.compose(R.update(index, scrollTop), (list) =>
    R.concat(list, R.times(R.always(0), R.max(index - list.length + 1, 0))))

export const updateLastScrollTopList: Function = debounce(
  (index: number, scrollTop: number): void => {
    const updateList = _updateLastScrollTopList(index, scrollTop)

    const lastScrollTopList: number[] = store.get('lastScrollTop') || []
    store.set('lastScrollTop', updateList(lastScrollTopList))
  },
  200
)

export const updateLastUsedTreeIds: Function = (trees: Object[]): void => {
  const value: string[] = trees.map((treeInfo: Object): string => treeInfo.id)
  store.set('lastBoxPID', value)
}
