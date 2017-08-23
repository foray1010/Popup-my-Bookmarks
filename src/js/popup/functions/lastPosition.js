/* @flow */

import _debounce from 'lodash.debounce'
import store from 'store'

const defaultScrollTop = 0

export const updateLastScrollTopList: Function = _debounce((
  index: number,
  scrollTop: number = defaultScrollTop
): void => {
  const lastScrollTopList: number[] = store.get('lastScrollTop') || []

  const previousLength = lastScrollTopList.length

  const isLongerThanBefore = index > previousLength - 1

  lastScrollTopList[index] = scrollTop

  if (isLongerThanBefore) {
    lastScrollTopList.fill(defaultScrollTop, previousLength, index)
  }

  store.set('lastScrollTop', lastScrollTopList)
}, 200)

export const updateLastUsedTreeIds: Function = (trees: Object[]): void => {
  const value: string[] = trees
    .map((treeInfo: Object): string => treeInfo.id)
  store.set('lastBoxPID', value)
}
