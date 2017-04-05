/* @flow */

import _debounce from 'lodash/debounce'

import JSONStorage from '../../common/lib/JSONStorage'

export const lastScrollTopListStorage: JSONStorage = new JSONStorage('lastScrollTop', [])
export const lastUsedTreeIdsStorage: JSONStorage = new JSONStorage('lastBoxPID', [])

const defaultScrollTop = 0

export const updateLastScrollTopList: Function = _debounce((
  index: number,
  scrollTop: number = defaultScrollTop
): void => {
  const lastScrollTopList: number[] = lastScrollTopListStorage.get()

  const previousLength = lastScrollTopList.length

  const isLongerThanBefore = index > previousLength - 1

  lastScrollTopList[index] = scrollTop

  if (isLongerThanBefore) {
    lastScrollTopList.fill(defaultScrollTop, previousLength, index)
  }

  lastScrollTopListStorage.set(lastScrollTopList)
}, 200)

export const updateLastUsedTreeIds: Function = (trees: Object[]): void => {
  const value: string[] = trees
    .map((treeInfo: Object): string => treeInfo.id)
  lastUsedTreeIdsStorage.set(value)
}
