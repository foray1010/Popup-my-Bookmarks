/* @flow */

import _debounce from 'lodash/debounce'

import {
  getBookmarkListEls
} from './dom'
import JSONStorage from '../../common/lib/JSONStorage'

export const lastScrollTopListStorage: JSONStorage = new JSONStorage('lastScrollTop', [])
export const lastUsedTreeIdsStorage: JSONStorage = new JSONStorage('lastBoxPID', [])

export const updateLastScrollTopList: Function = _debounce((): void => {
  const value: number[] = getBookmarkListEls()
    .map((el) => el.scrollTop)
  lastScrollTopListStorage.set(value)
}, 200)

export const updateLastUsedTreeIds: Function = (trees: Object[]): void => {
  const value: string[] = trees
    .map((treeInfo: Object): string => treeInfo.id)
  lastUsedTreeIdsStorage.set(value)
}
